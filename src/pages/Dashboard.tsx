import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Factory, 
  ShoppingCart, 
  Package, 
  Beaker, 
  Zap, 
  Wrench, 
  BarChart3, 
  Users,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Truck,
  FileText,
  DollarSign
} from "lucide-react";
import TimeIntervalSelector from "./dashboard/components/TimeIntervalSelector";
import ProductieLivrariSection from "./dashboard/components/ProductieLivrariSection";
import ComenziComercialSection from "./dashboard/components/ComenziComercialSection";
import StocuriAprovizionareSection from "./dashboard/components/StocuriAprovizionareSection";
import CalitateReteteSection from "./dashboard/components/CalitateReteteSection";
import CosturiEnergieSection from "./dashboard/components/CosturiEnergieSection";
import MentenantaFlotaSection from "./dashboard/components/MentenantaFlotaSection";
import ConcurentaPreturiSection from "./dashboard/components/ConcurentaPreturiSection";
import HRCheltuieliSection from "./dashboard/components/HRCheltuieliSection";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "success" | "danger";
}

const KPICard = ({ title, value, subtitle, trend, trendLabel, icon, variant = "default" }: KPICardProps) => {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      variant === "warning" && "border-yellow-500/30 bg-yellow-500/5",
      variant === "danger" && "border-destructive/30 bg-destructive/5",
      variant === "success" && "border-green-500/30 bg-green-500/5"
    )}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 mt-1.5 text-xs font-medium",
                isPositive && "text-green-600",
                isNegative && "text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                <span>{Math.abs(trend)}% {trendLabel || "vs plan"}</span>
              </div>
            )}
          </div>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
            variant === "default" && "bg-primary/10 text-primary",
            variant === "warning" && "bg-yellow-500/10 text-yellow-600",
            variant === "danger" && "bg-destructive/10 text-destructive",
            variant === "success" && "bg-green-500/10 text-green-600"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("productie-livrari");

  const detailRoutes: Record<string, string> = {
    "productie-livrari": "/productie/ordine",
    "comenzi-comercial": "/comercial/comenzi",
    "stocuri-aprovizionare": "/stocuri",
    "calitate-retete": "/productie/retete",
    "costuri-energie": "/consumuri",
    "mentenanta-flota": "/mentenanta/echipamente",
    "concurenta-preturi": "/comercial/calculator",
    "hr-cheltuieli": "/angajati",
  };

  const handleGoToDetail = () => {
    const route = detailRoutes[activeTab];
    if (route) {
      navigate(route);
    }
  };

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

      {/* KPI Cards - rând principal */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Producție Azi"
          value="2,450 t"
          trend={12.5}
          trendLabel="vs plan"
          icon={<Factory className="h-4 w-4" />}
          variant="success"
        />
        <KPICard
          title="Livrări Azi"
          value="1,850 t"
          subtitle="18 curse finalizate"
          icon={<Truck className="h-4 w-4" />}
        />
        <KPICard
          title="Comenzi Active"
          value="24"
          subtitle="15 în lucru, 9 programate"
          icon={<FileText className="h-4 w-4" />}
        />
        <KPICard
          title="Marjă Estimată"
          value="45,280 lei"
          subtitle="18.5%"
          trend={5.2}
          icon={<DollarSign className="h-4 w-4" />}
          variant="success"
        />
      </div>

      {/* Action Center - alertă rapidă */}
      <Card className="bg-muted/30">
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <Clock className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">3 comenzi cu întârzieri</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <FileText className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">12 avize nefacturate</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-600">2 stocuri critice</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zone tematice - Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/70 p-1 border border-border">
          <TabsTrigger value="productie-livrari" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Factory className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Producție & Livrări</span>
            <span className="sm:hidden">Producție</span>
          </TabsTrigger>
          <TabsTrigger value="comenzi-comercial" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Comenzi & Comercial</span>
            <span className="sm:hidden">Comenzi</span>
          </TabsTrigger>
          <TabsTrigger value="stocuri-aprovizionare" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Package className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Stocuri & Aprovizionare</span>
            <span className="sm:hidden">Stocuri</span>
          </TabsTrigger>
          <TabsTrigger value="calitate-retete" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Beaker className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Calitate & Rețete</span>
            <span className="sm:hidden">Calitate</span>
          </TabsTrigger>
          <TabsTrigger value="costuri-energie" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Costuri & Energie</span>
            <span className="sm:hidden">Costuri</span>
          </TabsTrigger>
          <TabsTrigger value="mentenanta-flota" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Wrench className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mentenanță & Flotă</span>
            <span className="sm:hidden">Mentenanță</span>
          </TabsTrigger>
          <TabsTrigger value="concurenta-preturi" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChart3 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Concurență & Prețuri</span>
            <span className="sm:hidden">Prețuri</span>
          </TabsTrigger>
          <TabsTrigger value="hr-cheltuieli" className="gap-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">HR & Cheltuieli</span>
            <span className="sm:hidden">HR</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="productie-livrari" className="mt-4">
          <ProductieLivrariSection />
        </TabsContent>

        <TabsContent value="comenzi-comercial" className="mt-4">
          <ComenziComercialSection />
        </TabsContent>

        <TabsContent value="stocuri-aprovizionare" className="mt-4">
          <StocuriAprovizionareSection />
        </TabsContent>

        <TabsContent value="calitate-retete" className="mt-4">
          <CalitateReteteSection />
        </TabsContent>

        <TabsContent value="costuri-energie" className="mt-4">
          <CosturiEnergieSection />
        </TabsContent>

        <TabsContent value="mentenanta-flota" className="mt-4">
          <MentenantaFlotaSection />
        </TabsContent>

        <TabsContent value="concurenta-preturi" className="mt-4">
          <ConcurentaPreturiSection />
        </TabsContent>

        <TabsContent value="hr-cheltuieli" className="mt-4">
          <HRCheltuieliSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
