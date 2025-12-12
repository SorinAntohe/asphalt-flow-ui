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
    <div className="space-y-5">
      {/* Header cu titlu și filtre */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Vizualizare generală a operațiunilor
          </p>
        </div>
        <TimeIntervalSelector />
      </div>

      {/* Zone tematice - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/70 p-1 border border-border">
          <TabsTrigger value="management-general" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Management General
          </TabsTrigger>
          <TabsTrigger value="productie-calitate" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Factory className="h-3.5 w-3.5" />
            Producție & Calitate
          </TabsTrigger>
          <TabsTrigger value="comercial-livrari" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="h-3.5 w-3.5" />
            Comercial & Livrări
          </TabsTrigger>
          <TabsTrigger value="aprovizionare-stocuri" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-3.5 w-3.5" />
            Aprovizionare & Stocuri
          </TabsTrigger>
          <TabsTrigger value="mentenanta-utilitati" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wrench className="h-3.5 w-3.5" />
            Mentenanță & Utilități
          </TabsTrigger>
          <TabsTrigger value="hr-admin" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-3.5 w-3.5" />
            HR & Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management-general" className="mt-4">
          <ManagementGeneralSection />
        </TabsContent>

        <TabsContent value="productie-calitate" className="mt-4">
          <ProductieCalitateSection />
        </TabsContent>

        <TabsContent value="comercial-livrari" className="mt-4">
          <ComercialLivrariSection />
        </TabsContent>

        <TabsContent value="aprovizionare-stocuri" className="mt-4">
          <AprovizionareStocuriSection />
        </TabsContent>

        <TabsContent value="mentenanta-utilitati" className="mt-4">
          <MentenantaUtilitatiSection />
        </TabsContent>

        <TabsContent value="hr-admin" className="mt-4">
          <HRAdminSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
