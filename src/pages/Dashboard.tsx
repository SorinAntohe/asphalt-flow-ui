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
    <div className="space-y-4 sm:space-y-6">
      {/* Header cu titlu și filtre */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-0.5 sm:mt-1 text-xs sm:text-sm hidden sm:block">
            Vizualizare generală a operațiunilor
          </p>
        </div>
        <TimeIntervalSelector />
      </div>

      {/* Zone tematice - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="relative overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 pb-1">
          <TabsList className="inline-flex sm:flex sm:flex-wrap h-auto gap-1 sm:gap-1.5 bg-muted/50 backdrop-blur-sm p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-border/50 shadow-sm min-w-max sm:min-w-0">
            <TabsTrigger 
              value="management-general" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <LayoutDashboard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Management General</span>
              <span className="md:hidden">General</span>
            </TabsTrigger>
            <TabsTrigger 
              value="productie-calitate" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <Factory className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Producție & Calitate</span>
              <span className="md:hidden">Producție</span>
            </TabsTrigger>
            <TabsTrigger 
              value="comercial-livrari" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Comercial & Livrări</span>
              <span className="md:hidden">Comercial</span>
            </TabsTrigger>
            <TabsTrigger 
              value="aprovizionare-stocuri" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Aprovizionare & Stocuri</span>
              <span className="md:hidden">Stocuri</span>
            </TabsTrigger>
            <TabsTrigger 
              value="mentenanta-utilitati" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <Wrench className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">Mentenanță & Utilități</span>
              <span className="md:hidden">Mentenanță</span>
            </TabsTrigger>
            <TabsTrigger 
              value="hr-admin" 
              className="gap-1 sm:gap-2 text-[10px] sm:text-xs font-medium px-2 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded-lg transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md whitespace-nowrap"
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden md:inline">HR & Admin</span>
              <span className="md:hidden">HR</span>
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
