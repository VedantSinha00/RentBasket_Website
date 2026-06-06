import { createContext, useContext, useState, useEffect } from "react";
import { syncCart, CART_SYNC_ENABLED } from "@/api/cart";
import { getCartId } from "@/lib/cartId";
import { safeSet } from "@/lib/safeStorage";
import { makeId } from "@/lib/utils";

const CartContext = createContext();
const CART_STORAGE_KEY = "rentbasket_cart";
const CART_SYNC_DEBOUNCE_MS = 3000;

/**
 * Unique id for a cart line item. Date.now() alone collides when several items
 * are added in the same millisecond (e.g. the "Add all" combo button), which
 * makes remove/update hit the wrong line. Delegates to the shared makeId helper.
 */
const makeCartItemId = () => makeId("ci");

/**
 * Normalise one stored cart item so the pricing math can never crash on it.
 * A cart saved by an older build may be missing fields the UI now relies on
 * (price/quantity/deposit must be numbers; every line needs an id). Returns
 * null for anything that isn't a usable item, so it gets dropped on load.
 */
const normalizeCartItem = (raw) => {
  if (!raw || typeof raw !== "object" || !raw.productId) return null;
  const toNumber = (v, fallback) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  return {
    ...raw,
    cartItemId: raw.cartItemId || makeCartItemId(),
    price: toNumber(raw.price, 0),
    quantity: Math.max(1, toNumber(raw.quantity, 1)),
    deposit: toNumber(raw.deposit, 0),
    rent: toNumber(raw.rent ?? raw.price, 0),
    percent_discount: toNumber(raw.percent_discount ?? 0, 0),
    security_multiple: raw.isRecommendation
      ? toNumber(raw.security_multiple, 0)
      : toNumber(raw.security_multiple ?? 2, 2),
    depositWaived: raw.isRecommendation ? (raw.depositWaived ?? false) : undefined,
    _realSecurityMultiple: raw._realSecurityMultiple ?? null,
    _realAdvSecurity: raw._realAdvSecurity ?? null,
  };
};

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeCartItem).filter(Boolean);
  } catch {
    return [];
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(loadCart);
  const [coupon, setCoupon] = useState(null);

  // Persist to localStorage on every change (primary store).
  // Uses safeSet so a write failure (private mode, quota exceeded) swallows
  // the error instead of escaping to the global ErrorBoundary.
  useEffect(() => {
    safeSet(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  // Recalculate deposit waiver for recommendation items whenever the cart changes.
  // A recommendation gets 0 deposit only if its price is less than the highest-priced
  // OTHER item in the cart. Runs after every cart mutation; terminates after one pass
  // because the second run finds depositWaived already matches shouldWaive for all items.
  useEffect(() => {
    const hasRecs = cartItems.some((i) => i.isRecommendation);
    if (!hasRecs) return;

    let changed = false;
    const next = cartItems.map((item) => {
      if (!item.isRecommendation) return item;

      const maxOtherPrice = cartItems
        .filter((o) => o.cartItemId !== item.cartItemId)
        .reduce((max, o) => Math.max(max, o.price ?? 0), 0);

      const shouldWaive = (item.price ?? 0) < maxOtherPrice;
      if (shouldWaive === (item.depositWaived ?? false)) return item;

      changed = true;
      return {
        ...item,
        depositWaived: shouldWaive,
        security_multiple: shouldWaive ? 0 : (item._realSecurityMultiple ?? null),
        adv_security: shouldWaive ? 0 : (item._realAdvSecurity ?? null),
      };
    });

    if (changed) setCartItems(next);
  }, [cartItems]);

  // Periodically sync the cart to the backend (debounced — fires once activity
  // settles, not on every click). No-op until VITE_API_BASE_URL is configured.
  useEffect(() => {
    if (!CART_SYNC_ENABLED) return;
    const timer = setTimeout(() => {
      syncCart(getCartId(), cartItems).catch((err) =>
        console.warn("Cart sync failed:", err)
      );
    }, CART_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.duration === item.duration
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, { ...item, cartItemId: makeCartItemId() }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateItem = (cartItemId, changes) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.cartItemId === cartItemId ? { ...i, ...changes } : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const applyCoupon = (_code) => {
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItem,
        clearCart,
        getCartItemCount,
        coupon,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

