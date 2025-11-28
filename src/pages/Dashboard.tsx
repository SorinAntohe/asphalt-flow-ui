import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TimeIntervalSelector from "./dashboard/components/TimeIntervalSelector";
import KPICards from "./dashboard/components/KPICards";
import LiveProductionSection from "./dashboard/components/LiveProductionSection";
import LogisticsSection from "./dashboard/components/LogisticsSection";
import QualitySection from "./dashboard/components/QualitySection";
import AIForecastSection from "./dashboard/components/AIForecastSection";
import FinancialSection from "./dashboard/components/FinancialSection";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Vizualizare generală a operațiunilor de producție
          </p>
        </div>
        <TimeIntervalSelector />
      </div>

      <Separator />

      {/* Main Content with Tabs */}
      <Tabs defaultValue="production" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid lg:grid-cols-3">
          <TabsTrigger value="production">Producție</TabsTrigger>
          <TabsTrigger value="quality">Calitate</TabsTrigger>
          <TabsTrigger value="ai">AI & Prognoze</TabsTrigger>
        </TabsList>

        {/* Production Tab */}
        <TabsContent value="production" className="space-y-8">
          <KPICards />
          <Separator />
          <LiveProductionSection />
          <Separator />
          <LogisticsSection />
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-8">
          <QualitySection />
        </TabsContent>

        {/* AI & Forecast Tab */}
        <TabsContent value="ai" className="space-y-8">
          <AIForecastSection />
          <Separator />
          <FinancialSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
