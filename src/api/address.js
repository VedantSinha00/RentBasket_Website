import { authFetch } from "./client";

const FALLBACK_KEY = "rentbasket_address";

const fallbackGet = () => {
  try { return JSON.parse(localStorage.getItem(FALLBACK_KEY)) || null; } catch { return null; }
};
const fallbackSet = (data) => {
  try { localStorage.setItem(FALLBACK_KEY, JSON.stringify(data)); } catch {}
};

// Maps the API response shape to the form field names used by EditAddress / Checkout.
// API:  flat_no, area, city_name, state_name, full_name, mobile, landmark, pincode, lat, lng
// Form: address_line_1, address_line_2, city, state, contact_name, contact_phone, landmark, pincode, lat, lng
function normalizeAddress(raw) {
  return {
    address_id:    raw.id ?? null,
    contact_name:  raw.full_name ?? "",
    contact_phone: raw.mobile ?? "",
    address_line_1: raw.flat_no ?? "",
    address_line_2: raw.area ?? "",
    landmark:      raw.landmark ?? "",
    pincode:       raw.pincode ?? "",
    city:          raw.city_name ?? "",
    state:         raw.state_name?.trim() ?? "",
    lat:           raw.lat ?? null,
    lng:           raw.lng ?? null,
  };
}

/**
 * Fetch the user's single saved address. Falls back to localStorage if the
 * API is not yet live or returns an error.
 */
export async function getUserAddress(mobile) {
  try {
    const res = await authFetch(`/get-delivery-address?mobile=${encodeURIComponent(mobile)}`);
    const json = await res.json().catch(() => null);
    if (res.ok && json?.responseCode === 200) {
      const raw = json.data?.address ?? json.data ?? null;
      if (raw) {
        const addr = normalizeAddress(raw);
        fallbackSet(addr);
        return addr;
      }
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
