import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Liste from "./pages/Liste";
import AutoturismeAdd from "./pages/AutoturismeAdd";
import SoferiAdd from "./pages/SoferiAdd";
import MateriiPrimeAdd from "./pages/MateriiPrimeAdd";
import ProduseFiniteAdd from "./pages/ProduseFiniteAdd";
import ClientiAdd from "./pages/ClientiAdd";
import FurnizoriAdd from "./pages/FurnizoriAdd";
import Receptii from "./pages/Receptii";
import Livrari from "./pages/Livrari";
import Consumuri from "./pages/Consumuri";
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
            path="/liste/autoturisme/add"
            element={
              <Layout>
                <AutoturismeAdd />
              </Layout>
            }
          />
          <Route
            path="/liste/soferi/add"
            element={
              <Layout>
                <SoferiAdd />
              </Layout>
            }
          />
          <Route
            path="/liste/materii-prime/add"
            element={
              <Layout>
                <MateriiPrimeAdd />
              </Layout>
            }
          />
          <Route
            path="/liste/produse-finite/add"
            element={
              <Layout>
                <ProduseFiniteAdd />
              </Layout>
            }
          />
          <Route
            path="/liste/clienti/add"
            element={
              <Layout>
                <ClientiAdd />
              </Layout>
            }
          />
          <Route
            path="/liste/furnizori/add"
            element={
              <Layout>
                <FurnizoriAdd />
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
          <Route path="/" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
