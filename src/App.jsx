import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "@/context/CartContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** GitHub Pages serves route folders as /path/ — match both forms. */
const routePair = (path, element) => [
  <Route key={path} path={path} element={element} />,
  <Route key={`${path}/`} path={`${path}/`} element={element} />,
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.1, ease: "easeIn" } },
};

/** useLocation must live inside BrowserRouter — extracted here. */
const RouterApp = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          {routePair("/catalog", <Catalog />)}
          <Route path="/catalogue" element={<Navigate to="/catalog/" replace />} />
          <Route path="/catalogue/" element={<Navigate to="/catalog/" replace />} />
          {routePair("/product/:id", <ProductDetails />)}
          {routePair("/cart", <Cart />)}
          {routePair("/checkout", <Checkout />)}
          {routePair("/order-success", <OrderSuccess />)}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter
            basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
          >
            <RouterApp />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
