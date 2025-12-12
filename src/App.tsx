import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Layout } from "./components/Layout";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load pages for better performance
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Liste = lazy(() => import("./pages/Liste"));
const Receptii = lazy(() => import("./pages/Receptii"));
const Livrari = lazy(() => import("./pages/Livrari"));
const Consumuri = lazy(() => import("./pages/Consumuri"));
const Comenzi = lazy(() => import("./pages/Comenzi"));
const Stocuri = lazy(() => import("./pages/Stocuri"));
const Pontaj = lazy(() => import("./pages/Pontaj"));
const PontareAngajat = lazy(() => import("./pages/PontareAngajat"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ConsolaCantarire = lazy(() => import("./pages/ConsolaCantarire"));

// Comercial module pages
const OferteContracte = lazy(() => import("./pages/comercial/OferteContracte"));
const ComenziClient = lazy(() => import("./pages/comercial/ComenziClient"));
const Documente = lazy(() => import("./pages/comercial/Documente"));
const CalculatorPret = lazy(() => import("./pages/comercial/CalculatorPret"));

// Productie module pages
const Retete = lazy(() => import("./pages/productie/Retete"));
const OrdineProductie = lazy(() => import("./pages/productie/OrdineProductie"));
const Loturi = lazy(() => import("./pages/productie/Loturi"));
const CalendarProductie = lazy(() => import("./pages/productie/CalendarProductie"));
const Trasabilitate = lazy(() => import("./pages/productie/Trasabilitate"));

// Mentenanta module pages
const Echipamente = lazy(() => import("./pages/mentenanta/Echipamente"));
const PlanMentenanta = lazy(() => import("./pages/mentenanta/PlanMentenanta"));

// Rapoarte module pages
const GalerieRapoarte = lazy(() => import("./pages/rapoarte/GalerieRapoarte"));
const RapoarteProductie = lazy(() => import("./pages/rapoarte/RapoarteProductie"));
const RapoarteComercial = lazy(() => import("./pages/rapoarte/RapoarteComercial"));
const RapoarteStocuri = lazy(() => import("./pages/rapoarte/RapoarteStocuri"));
const RapoarteCalitate = lazy(() => import("./pages/rapoarte/RapoarteCalitate"));
const RapoarteMentenanta = lazy(() => import("./pages/rapoarte/RapoarteMentenanta"));
const RapoarteFinanciar = lazy(() => import("./pages/rapoarte/RapoarteFinanciar"));

// Financiar module pages
const ParteneriSolduri = lazy(() => import("./pages/financiar/ParteneriSolduri"));
const DocumenteTrezorerie = lazy(() => import("./pages/financiar/DocumenteTrezorerie"));
const ContabilitateRapoarte = lazy(() => import("./pages/financiar/ContabilitateRapoarte"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// Page loading fallback
const PageLoader = () => (
  <div className="p-4 sm:p-6 space-y-4 animate-pulse">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-4 w-32" />
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mt-6">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-24 rounded-lg" />
      ))}
    </div>
    <Skeleton className="h-64 mt-4 rounded-lg" />
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </Layout>
  );
};

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/liste" element={<ProtectedRoute><Liste /></ProtectedRoute>} />
      <Route path="/receptii" element={<ProtectedRoute><Receptii /></ProtectedRoute>} />
      <Route path="/livrari" element={<ProtectedRoute><Livrari /></ProtectedRoute>} />
      <Route path="/consumuri" element={<ProtectedRoute><Consumuri /></ProtectedRoute>} />
      <Route path="/comenzi" element={<ProtectedRoute><Comenzi /></ProtectedRoute>} />
      <Route path="/stocuri" element={<ProtectedRoute><Stocuri /></ProtectedRoute>} />
      <Route path="/cantar" element={<ProtectedRoute><ConsolaCantarire /></ProtectedRoute>} />
      <Route path="/angajati" element={<Navigate to="/liste" replace />} />
      <Route path="/pontaj" element={<ProtectedRoute><Pontaj /></ProtectedRoute>} />
      <Route path="/pontare" element={<ProtectedRoute><PontareAngajat /></ProtectedRoute>} />
      {/* Comercial module routes */}
      <Route path="/comercial/oferte-contracte" element={<ProtectedRoute><OferteContracte /></ProtectedRoute>} />
      <Route path="/comercial/comenzi" element={<ProtectedRoute><ComenziClient /></ProtectedRoute>} />
      <Route path="/comercial/documente" element={<ProtectedRoute><Documente /></ProtectedRoute>} />
      <Route path="/comercial/calculator" element={<ProtectedRoute><CalculatorPret /></ProtectedRoute>} />
      {/* Financiar module routes */}
      <Route path="/financiar/parteneri-solduri" element={<ProtectedRoute><ParteneriSolduri /></ProtectedRoute>} />
      <Route path="/financiar/documente-trezorerie" element={<ProtectedRoute><DocumenteTrezorerie /></ProtectedRoute>} />
      <Route path="/financiar/rapoarte" element={<ProtectedRoute><ContabilitateRapoarte /></ProtectedRoute>} />
      {/* Productie module routes */}
      <Route path="/productie/retete" element={<ProtectedRoute><Retete /></ProtectedRoute>} />
      <Route path="/productie/ordine" element={<ProtectedRoute><OrdineProductie /></ProtectedRoute>} />
      <Route path="/productie/loturi" element={<ProtectedRoute><Loturi /></ProtectedRoute>} />
      <Route path="/productie/calendar" element={<ProtectedRoute><CalendarProductie /></ProtectedRoute>} />
      <Route path="/productie/trasabilitate" element={<ProtectedRoute><Trasabilitate /></ProtectedRoute>} />
      {/* Mentenanta module routes */}
      <Route path="/mentenanta/echipamente" element={<ProtectedRoute><Echipamente /></ProtectedRoute>} />
      <Route path="/mentenanta/plan" element={<ProtectedRoute><PlanMentenanta /></ProtectedRoute>} />
      {/* Rapoarte module routes */}
      <Route path="/rapoarte" element={<ProtectedRoute><GalerieRapoarte /></ProtectedRoute>} />
      <Route path="/rapoarte/productie" element={<ProtectedRoute><RapoarteProductie /></ProtectedRoute>} />
      <Route path="/rapoarte/comercial" element={<ProtectedRoute><RapoarteComercial /></ProtectedRoute>} />
      <Route path="/rapoarte/stocuri" element={<ProtectedRoute><RapoarteStocuri /></ProtectedRoute>} />
      <Route path="/rapoarte/calitate" element={<ProtectedRoute><RapoarteCalitate /></ProtectedRoute>} />
      <Route path="/rapoarte/mentenanta" element={<ProtectedRoute><RapoarteMentenanta /></ProtectedRoute>} />
      <Route path="/rapoarte/financiar" element={<ProtectedRoute><RapoarteFinanciar /></ProtectedRoute>} />
      <Route path="/" element={<Auth />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={200}>
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
