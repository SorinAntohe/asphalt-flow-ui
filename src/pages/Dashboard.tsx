import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutDashboard,
  Factory, 
  ShoppingCart, 
  Package, 
  Wrench, 
  Users
} from "lucide-react";
import TimeIntervalSelector from "./dashboard/components/TimeIntervalSelector";
import ManagementGeneralSection from "./dashboard/components/ManagementGeneralSection";
import ProductieCalitateSection from "./dashboard/components/ProductieCalitateSection";
import ComercialLivrariSection from "./dashboard/components/ComercialLivrariSection";
import AprovizionareStocuriSection from "./dashboard/components/AprovizionareStocuriSection";
import MentenantaUtilitatiSection from "./dashboard/components/MentenantaUtilitatiSection";
import HRAdminSection from "./dashboard/components/HRAdminSection";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("management-general");

  return (
    <div className="space-y-6">
      {/* Header cu titlu și filtre */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Vizualizare generală a operațiunilor
          </p>
        </div>
        <TimeIntervalSelector />
      </div>

      {/* Zone tematice - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          <TabsList className="flex flex-wrap h-auto gap-1.5 bg-muted/50 backdrop-blur-sm p-1.5 rounded-xl border border-border/50 shadow-sm">
            <TabsTrigger 
              value="management-general" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Management General</span>
              <span className="sm:hidden">General</span>
            </TabsTrigger>
            <TabsTrigger 
              value="productie-calitate" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <Factory className="h-4 w-4" />
              <span className="hidden sm:inline">Producție & Calitate</span>
              <span className="sm:hidden">Producție</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comercial-livrari" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Comercial & Livrări</span>
              <span className="sm:hidden">Comercial</span>
            </TabsTrigger>
            <TabsTrigger 
              value="aprovizionare-stocuri" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Aprovizionare & Stocuri</span>
              <span className="sm:hidden">Stocuri</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mentenanta-utilitati" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Mentenanță & Utilități</span>
              <span className="sm:hidden">Mentenanță</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hr-admin" 
              className="gap-2 text-xs font-medium px-4 py-2.5 rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">HR & Admin</span>
              <span className="sm:hidden">HR</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="management-general" className="mt-6 animate-fade-in">
          <ManagementGeneralSection />
        </TabsContent>

        <TabsContent value="productie-calitate" className="mt-6 animate-fade-in">
          <ProductieCalitateSection />
        </TabsContent>

        <TabsContent value="comercial-livrari" className="mt-6 animate-fade-in">
          <ComercialLivrariSection />
        </TabsContent>

        <TabsContent value="aprovizionare-stocuri" className="mt-6 animate-fade-in">
          <AprovizionareStocuriSection />
        </TabsContent>

        <TabsContent value="mentenanta-utilitati" className="mt-6 animate-fade-in">
          <MentenantaUtilitatiSection />
        </TabsContent>

        <TabsContent value="hr-admin" className="mt-6 animate-fade-in">
          <HRAdminSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
