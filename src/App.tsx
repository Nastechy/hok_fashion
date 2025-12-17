import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Lookbook from "./pages/Lookbook";
import Payment from "./pages/Payment";
import Billing from "./pages/Billing";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Collections from "./pages/Collections";
import FAQ from "./pages/FAQ";
import OrderDetails from "./pages/OrderDetails";
import Newsletter from "./pages/Newsletter";
import ProductDetails from "./pages/ProductDetails";
import SupportContactFab from "./components/SupportContactFab";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/lookbook" element={<Lookbook />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/collections/:category" element={<Collections />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/newsletter" element={<Newsletter />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/orders/:orderId" element={<OrderDetails />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <SupportContactFab />
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
