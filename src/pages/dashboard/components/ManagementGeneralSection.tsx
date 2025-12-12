import { Card, CardContent } from "@/components/ui/card";
import { 
  Factory, 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  FileText,
  AlertTriangle,
  Wrench,
  Package,
  Banknote,
  Tag,
  ClipboardCheck,
  Gauge,
  Zap,
  PieChart
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "success" | "danger";
  subtitle?: string;
}

const KPICard = ({ title, value, unit, trend, trendLabel, icon, variant = "default", subtitle }: KPICardProps) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  const variantStyles = {
    default: "border-border/50 bg-card hover:border-primary/30",
    warning: "border-yellow-500/40 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10",
    danger: "border-destructive/40 bg-gradient-to-br from-destructive/5 to-destructive/10",
    success: "border-green-500/40 bg-gradient-to-br from-green-500/5 to-green-500/10"
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary ring-primary/20",
    warning: "bg-yellow-500/15 text-yellow-600 ring-yellow-500/20",
    danger: "bg-destructive/15 text-destructive ring-destructive/20",
    success: "bg-green-500/15 text-green-600 ring-green-500/20"
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border",
      variantStyles[variant]
    )}>
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {unit && <p className="text-sm font-medium text-muted-foreground">{unit}</p>}
            </div>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground/80 mt-0.5">{subtitle}</p>
            )}
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 pt-1 text-xs font-semibold",
                isPositive && "text-green-600",
                isNegative && "text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {isPositive ? "+" : ""}{trend}% {trendLabel || "vs anterior"}
              </div>
            )}
          </div>
          <div className={cn(
            "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ring-1",
            iconStyles[variant]
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ManagementGeneralSection = () => {
  return (
    <div className="space-y-6">
      {/* Prima linie de KPI-uri */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Producție totală"
          value="12,450"
          unit="t"
          trend={8.5}
          trendLabel="vs anterior"
          icon={<Factory className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Livrări totale"
          value="11,280"
          unit="t"
          trend={5.2}
          trendLabel="vs anterior"
          icon={<Truck className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Grad realizare plan producție"
          value="94.5"
          unit="%"
          trend={2.1}
          trendLabel="vs anterior"
          icon={<TrendingUp className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Marjă medie / ton"
          value="48.50"
          unit="lei/t"
          trend={-1.2}
          trendLabel="vs anterior"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* A doua linie de KPI-uri */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Comenzi client deschise"
          value="24"
          unit="nr"
          icon={<FileText className="h-5 w-5" />}
        />
        <KPICard
          title="Loturi respinse"
          value="2.1"
          unit="%"
          trend={-0.5}
          trendLabel="vs anterior"
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Materiale în stoc critic"
          value="3"
          unit="nr"
          icon={<Package className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Revizii întârziate"
          value="2"
          unit="nr"
          icon={<Wrench className="h-5 w-5" />}
          variant="danger"
        />
      </div>

      {/* A treia linie de KPI-uri */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Cifra de afaceri"
          value="3,214,800"
          unit="lei"
          trend={12.3}
          trendLabel="vs anterior"
          icon={<Banknote className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Preț mediu de vânzare"
          value="285"
          unit="lei/t"
          trend={2.8}
          trendLabel="vs anterior"
          icon={<Tag className="h-5 w-5" />}
        />
        <KPICard
          title="Grad acoperire comenzi client"
          value="87.5"
          unit="%"
          trend={-3.2}
          trendLabel="vs anterior"
          icon={<ClipboardCheck className="h-5 w-5" />}
          variant="warning"
        />
        <KPICard
          title="Grad utilizare flotă"
          value="78.5"
          unit="%"
          trend={4.2}
          trendLabel="vs anterior"
          icon={<Gauge className="h-5 w-5" />}
          variant="success"
        />
      </div>

      {/* A patra linie de KPI-uri */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Consum specific energie"
          value="8.2"
          unit="kWh/t"
          trend={-1.5}
          trendLabel="vs anterior"
          icon={<Zap className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Cost fix / ton"
          value="19.50"
          unit="lei/t"
          trend={-0.8}
          trendLabel="vs anterior"
          icon={<DollarSign className="h-5 w-5" />}
          variant="success"
        />
        <KPICard
          title="Produs dominant în mix"
          value="62"
          unit="%"
          subtitle="BA 16"
          icon={<PieChart className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default ManagementGeneralSection;
