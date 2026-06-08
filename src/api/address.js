import { authFetch } from "./client";

const FALLBACK_KEY = "rentbasket_address";

const fallbackGet = () => {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || null; } catch { return null; }
};
const fallbackSet = (data) => {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(data)); } catch {}
};

/**
 * Fetch the user's single saved address. Falls back to localStorage if the
 * API is not yet live or returns an error.
 */
export async function getUserAddress(mobile) {
  try {
    const res = await authFetch(`/get-user-addresses?mobile=${encodeURIComponent(mobile)}`);
    const json = await res.json().catch(() => null);
    if (res.ok && json?.responseCode === 200) {
      const addr = json.data?.address ?? json.data ?? null;
      if (addr) { fallbackSet(addr); return addr; }
    }
  } catch {}
  return fallbackGet();
}

/**
 * Save (create or update) the user's single address. Uses POST for new
 * addresses and PUT for existing ones, determined by whether a cached
 * address_id is present. Always updates the local cache regardless of
 * API success so the data survives an offline session.
 */
export async function saveUserAddress(mobile, address) {
  const cached = fallbackGet();
  const isNew = !cached?.address_id;
  const body = { mobile, ...address };
  try {
    const res = await authFetch(
      isNew ? "/add-delivery-address" : "/update-delivery-address",
      { method: isNew ? "POST" : "PUT", body }
    );
    const json = await res.json().catch(() => null);
    if (res.ok) {
      const saved = { ...address, address_id: json?.data?.address_id ?? cached?.address_id };
      fallbackSet(saved);
      return saved;
    }
  } catch {}
  fallbackSet({ ...cached, ...address });
  return null;
}
