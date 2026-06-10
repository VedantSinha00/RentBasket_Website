/**
 * Delivery date + time-slot helpers for order placement.
 *
 * The backend (founder-confirmed 2026-06-11) accepts two extra keys on order
 * confirmation, both strings saved on the order table:
 *   expected_delivery_date       — "YYYY-MM-DD"
 *   expected_delivery_time_slot  — a 2-hour window code, e.g. "4_6"
 *
 * If the user did not choose a slot/date, send the default slot "4_6" on the
 * 3rd day from today (per the founder's instruction). Note: the checkout form
 * collects the date as YYYY-MM-DD and the slot as a human label
 * (Morning/Afternoon/Evening), so we map the label → a backend slot code here.
 */

/** Founder-specified default when the user makes no choice. */
export const DEFAULT_DELIVERY_SLOT = "4_6";

/**
 * UI time-slot label → backend 2-hour slot code.
 * Codes are 24h hour ranges. The form currently offers three coarse buckets;
 * this is the single place to extend if/when finer 2-hour slots are exposed.
 */
const SLOT_LABEL_TO_CODE = {
  Morning: "10_12",
  Afternoon: "12_2",
  Evening: "4_6",
};

/** Date string (YYYY-MM-DD) for N days from today, in local time. */
function dateNDaysFromToday(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  // Local YYYY-MM-DD (avoid toISOString's UTC shift flipping the day).
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/** The default delivery date: the 3rd day from today. */
export function defaultDeliveryDate() {
  return dateNDaysFromToday(3);
}

/**
 * Resolve a backend slot code from whatever the form holds. Accepts a UI label
 * ("Morning"…), an already-coded value ("4_6"), or nothing — falling back to
 * the founder default in the empty/unknown case.
 */
export function resolveDeliverySlot(timeSlot) {
  if (!timeSlot) return DEFAULT_DELIVERY_SLOT;
  if (SLOT_LABEL_TO_CODE[timeSlot]) return SLOT_LABEL_TO_CODE[timeSlot];
  // Already a code (e.g. "4_6") — pass through. Otherwise default.
  return /^\d{1,2}_\d{1,2}$/.test(timeSlot) ? timeSlot : DEFAULT_DELIVERY_SLOT;
}

/**
 * Build the two outgoing order keys from checkout form data.
 * Defaults to slot "4_6" on the 3rd day from today when the user didn't choose.
 * @param {object} [formData]
 * @returns {{ expected_delivery_date: string, expected_delivery_time_slot: string }}
 */
export function getDeliveryFields(formData = {}) {
  return {
    expected_delivery_date: formData.startDate || defaultDeliveryDate(),
    expected_delivery_time_slot: resolveDeliverySlot(formData.timeSlot),
  };
}
