import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/liste"
            element={
              <Layout>
                <Liste />
              </Layout>
            }
          />
          <Route
            path="/receptii"
            element={
              <Layout>
                <Receptii />
              </Layout>
            }
          />
          <Route
            path="/livrari"
            element={
              <Layout>
                <Livrari />
              </Layout>
            }
          />
          <Route
            path="/consumuri"
            element={
              <Layout>
                <Consumuri />
              </Layout>
            }
          />
          <Route
            path="/comenzi"
            element={
              <Layout>
                <Comenzi />
              </Layout>
            }
          />
          <Route
            path="/stocuri"
            element={
              <Layout>
                <Stocuri />
              </Layout>
            }
          />
          <Route
            path="/angajati"
            element={
              <Layout>
                <Angajati />
              </Layout>
            }
          />
          <Route
            path="/pontaj"
            element={
              <Layout>
                <Pontaj />
              </Layout>
            }
          />
          <Route path="/" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
