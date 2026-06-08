import { safeSet } from "@/lib/safeStorage";

/**
 * STOPGAP order history.
 *
 * The real order-history API is still pending from Shivam (backend). Until it
 * lands, we persist the orders placed on this device to localStorage so that
 * "My Orders" reflects a just-placed order instead of a permanent empty state.
 *
 * TODO(Shivam API): replace getRecentOrders() in MyOrders with a real
 * GET /orders/my-orders call and delete this module.
 */

const KEY = "rentbasket_recent_orders";

export const getRecentOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecentOrders = (orders) => safeSet(KEY, JSON.stringify(orders));

/**
 * Map the order payload built at checkout into the shape MyOrders' OrderCard
 * expects, then prepend it to the stored list (de-duped by orderId so a retry
 * of the same order doesn't create two entries).
 */
export const recordOrder = (orderPayload) => {
  if (!orderPayload?.orderId) return;
  const order = {
    orderId: String(orderPayload.orderId),
    bookingDate: orderPayload.bookingDate,
    status: "upcoming", // just placed → "Arriving Soon"
    items: (orderPayload.items || []).map((ci) => ({
      amenity_type_id: ci.productId,
      name: ci.name,
      image: ci.image,
      durationLabel: ci.durationLabel,
      quantity: ci.quantity,
      rent: Number(ci.price) || 0,
    })),
    address: orderPayload.deliveryAddress,
    deliveryDate: orderPayload.deliveryDate,
    deliverySlot: orderPayload.deliverySlot,
    monthlyRent: Number(orderPayload.netMonthlyRent) || 0,
    deposit: Number(orderPayload.security) || 0,
    startsOn: orderPayload.deliveryDate,
  };
  const list = getRecentOrders().filter((o) => o.orderId !== order.orderId);
  saveRecentOrders([order, ...list]);
};
