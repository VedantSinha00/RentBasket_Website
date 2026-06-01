import { createContext, useContext, useState, useEffect } from "react";
import { syncCart, CART_SYNC_ENABLED } from "@/api/cart";
import { getCartId } from "@/lib/cartId";

const CartContext = createContext();
const CART_STORAGE_KEY = "rentbasket_cart";
const CART_SYNC_DEBOUNCE_MS = 3000;

const loadCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
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

  // Persist to localStorage on every change (primary store)
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
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
      return [...prev, { ...item, cartItemId: Date.now().toString() }];
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

  const isGlobalBrandNew = cartItems.length > 0 && cartItems.every(i => i.isBrandNew);

  const toggleGlobalBrandNew = (enabled) => {
    setCartItems(prev => prev.map(item => {
      // Avoid modifying items that are already in the requested state
      if (item.isBrandNew === enabled) return item;
      const newPrice = enabled ? item.price + 65 : item.price - 65;
      return { ...item, isBrandNew: enabled, price: newPrice };
    }));
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity + item.deposit;
    }, 0);
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
        getCartTotal,
        getCartItemCount,
        isGlobalBrandNew,
        toggleGlobalBrandNew,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

