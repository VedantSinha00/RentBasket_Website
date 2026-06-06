// TODO: confirm auth header with Shivam — currently assuming Bearer JWT
import { getToken, clearToken } from "./auth";

const BASE = import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_BASE_URL?.trim();

async function proposalFetch(path, body) {
  const doFetch = (token) =>
    fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

  let token = await getToken();
  let res = await doFetch(token);

  if (res.status === 401) {
    clearToken();
    token = await getToken();
    res = await doFetch(token);
  }

  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) {
    throw new Error(json?.data?.messageDescription || json?.message || `Proposal API failed (${res.status})`);
  }
  return json;
}

/**
 * addItemsToProposal — POSTs each cart item to the backend one at a time.
 *
 * Resilience / resume-on-retry:
 *   Pass a Map as `added` (keyed by the line's stable `cartItemId`).
 *   - Items whose key is already in `added` are skipped (dedupes retries).
 *   - Newly-added ids are written into `added` before moving to the next item,
 *     so the caller's Map is updated even if a later item throws.
 *   - On failure the thrown error carries `{ cartItemIds, failedAt }` so the
 *     caller can see what was persisted up to that point.
 *   Returns the full flat array of all cart_item_ids (pre-existing + new).
 *
 * @param {string|number} userId
 * @param {string|number} leadId
 * @param {Array}         cartItems
 * @param {Map}           [added]   — optional accumulator; mutated in place
 */
export async function addItemsToProposal(userId, leadId, cartItems, added = new Map()) {
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    // Dedupe key = the line's stable cartItemId (unique per cart line, preserved
    // across retries). NOT productId|duration: two distinct lines can share the
    // same product+duration — e.g. when a user edits one line's duration via
    // updateItem to match another — and keying on content would silently drop one.
    const dedupeKey = item.cartItemId;
    if (added.has(dedupeKey)) continue; // skip — already persisted

    let json;
    try {
      json = await proposalFetch("/add-to-proposal-for-lead", {
        user_id: String(userId),
        lead_id: String(leadId),
        amenity_type_id: item.productId,
        count: item.quantity,
        rent: item.rent,
        duration: item.duration,
        security: item.deposit,
      });
    } catch (apiErr) {
      // Record how far we got so the caller can resume on the next attempt.
      // The error carries the ids already persisted *and* the index that failed.
      const partialIds = [...added.values()];
      const resumeErr = new Error(apiErr.message);
      resumeErr.cartItemIds = partialIds;
      resumeErr.failedAt = i;
      throw resumeErr;
    }

    const id = json.data?.cart_item_id ?? json.data?.cartItemId ?? json.data?.id;
    if (id != null) {
      // Write into the caller's Map *immediately* — before the next iteration —
      // so a failure on item i+1 still has this id recorded.
      added.set(dedupeKey, id);
    }
  }

  // Return flat array of all ids (covers both skipped and newly-added entries)
  return [...added.values()];
}

export async function confirmProposal(userId, leadId, cartItemIds, couponCode) {
  return proposalFetch("/confirm-proposal-for-tenant", {
    user_id: String(userId),
    lead_id: String(leadId),
    cart_items: cartItemIds.map((id) => ({
      cart_item_id: id,
      coupon_list: couponCode ? [couponCode] : [],
    })),
  });
}
