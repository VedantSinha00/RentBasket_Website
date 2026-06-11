import { authFetch } from "./client";

async function proposalFetch(path, body) {
  const res = await authFetch(path, { method: "POST", body });
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

/**
 * Confirm the proposal into an order.
 *
 * `delivery` carries the two extra order keys the backend accepts (founder
 * 2026-06-11): `expected_delivery_date` and `expected_delivery_time_slot`.
 * Build it with getDeliveryFields() from src/lib/delivery.js so the "no choice →
 * slot 4_6 on the 3rd day" default is applied consistently. Any keys present are
 * spread onto the request body; omit `delivery` to send neither.
 */
export async function confirmProposal(userId, leadId, cartItemIds, couponId, delivery = {}) {
  return proposalFetch("/confirm-proposal-for-tenant", {
    user_id: String(userId),
    lead_id: String(leadId),
    cart_items: cartItemIds.map((id) => ({
      cart_item_id: id,
      coupon_list: couponId != null ? [couponId] : [],
    })),
    ...delivery,
  });
}

/**
 * Fetch the backend proposal cart for a lead — used to read any pre-attached
 * coupons. Returns the `data` payload or null on error.
 */
export async function fetchProposalCart(userId, leadId) {
  const res = await authFetch(
    `/get-proposal-cart-items-for-lead?user_id=${encodeURIComponent(userId)}&lead_id=${encodeURIComponent(leadId)}`
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json || json.responseCode !== 200) return null;
  return json.data ?? null;
}

/**
 * Apply a coupon to the proposal server-side before confirmation.
 * Call this after addItemsToProposal if a coupon is available.
 */
export async function applyGlobalCoupon(userId, leadId, couponId) {
  return proposalFetch("/apply-global-coupon", {
    user_id: String(userId),
    lead_id: String(leadId),
    coupon_id: couponId,
  });
}

/**
 * Set the delivery slot and date on the proposal.
 * Params are sent as query strings (backend ignores JSON body).
 * Non-fatal — a failure here should not block order confirmation.
 *
 * @param {string|number} proposalId  — same as leadId in our flow
 * @param {string|number} slotId      — slot id from /get-delivery-slots
 * @param {string}        deliveryDate — YYYY-MM-DD
 */
export async function setDeliverySlot(proposalId, slotId, deliveryDate) {
  const res = await authFetch(
    `/set-delivery-slot?slot_id=${encodeURIComponent(slotId)}&delivery_date=${encodeURIComponent(deliveryDate)}&proposal_id=${encodeURIComponent(proposalId)}`,
    { method: "POST" },
  );
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.status) {
    throw new Error(json?.message || `set-delivery-slot failed (${res.status})`);
  }
  return json;
}
