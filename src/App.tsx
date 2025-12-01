import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Liste from "./pages/Liste";
import Receptii from "./pages/Receptii";
import Livrari from "./pages/Livrari";
import Consumuri from "./pages/Consumuri";
import Comenzi from "./pages/Comenzi";
import Stocuri from "./pages/Stocuri";
import Angajati from "./pages/Angajati";
import Pontaj from "./pages/Pontaj";
import NotFound from "./pages/NotFound";

// Comercial module pages
import OferteContracte from "./pages/comercial/OferteContracte";
import ComenziClient from "./pages/comercial/ComenziClient";
import PlanificareLivrari from "./pages/comercial/PlanificareLivrari";
import Documente from "./pages/comercial/Documente";

// Productie module pages
import Retete from "./pages/productie/Retete";
import OrdineProductie from "./pages/productie/OrdineProductie";
import Loturi from "./pages/productie/Loturi";
import CalendarProductie from "./pages/productie/CalendarProductie";
import Trasabilitate from "./pages/productie/Trasabilitate";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/liste" element={<ProtectedRoute><Liste /></ProtectedRoute>} />
    <Route path="/receptii" element={<ProtectedRoute><Receptii /></ProtectedRoute>} />
    <Route path="/livrari" element={<ProtectedRoute><Livrari /></ProtectedRoute>} />
    <Route path="/consumuri" element={<ProtectedRoute><Consumuri /></ProtectedRoute>} />
    <Route path="/comenzi" element={<ProtectedRoute><Comenzi /></ProtectedRoute>} />
    <Route path="/stocuri" element={<ProtectedRoute><Stocuri /></ProtectedRoute>} />
    <Route path="/angajati" element={<ProtectedRoute><Angajati /></ProtectedRoute>} />
    <Route path="/pontaj" element={<ProtectedRoute><Pontaj /></ProtectedRoute>} />
    {/* Comercial module routes */}
    <Route path="/comercial/oferte-contracte" element={<ProtectedRoute><OferteContracte /></ProtectedRoute>} />
    <Route path="/comercial/comenzi" element={<ProtectedRoute><ComenziClient /></ProtectedRoute>} />
    <Route path="/comercial/planificare" element={<ProtectedRoute><PlanificareLivrari /></ProtectedRoute>} />
    <Route path="/comercial/documente" element={<ProtectedRoute><Documente /></ProtectedRoute>} />
    {/* Productie module routes */}
    <Route path="/productie/retete" element={<ProtectedRoute><Retete /></ProtectedRoute>} />
    <Route path="/productie/ordine" element={<ProtectedRoute><OrdineProductie /></ProtectedRoute>} />
    <Route path="/productie/loturi" element={<ProtectedRoute><Loturi /></ProtectedRoute>} />
    <Route path="/productie/calendar" element={<ProtectedRoute><CalendarProductie /></ProtectedRoute>} />
    <Route path="/productie/trasabilitate" element={<ProtectedRoute><Trasabilitate /></ProtectedRoute>} />
    <Route path="/" element={<Auth />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
