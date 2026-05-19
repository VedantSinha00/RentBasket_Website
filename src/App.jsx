import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          basename={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
        >
          <Routes>
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
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
