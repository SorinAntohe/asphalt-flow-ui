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
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  code: string;
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: React.ReactNode;
  variant?: "default" | "warning" | "success" | "danger";
}

const KPICard = ({ code, title, value, unit, trend, trendLabel, icon, variant = "default" }: KPICardProps) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
      variant === "warning" && "border-yellow-500/30 bg-yellow-500/5",
      variant === "danger" && "border-destructive/30 bg-destructive/5",
      variant === "success" && "border-green-500/30 bg-green-500/5"
    )}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono text-muted-foreground/60">{code}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1">{title}</p>
            <div className="flex items-baseline gap-1.5 mt-1">
              <p className="text-2xl font-bold">{value}</p>
              {unit && <p className="text-sm text-muted-foreground">{unit}</p>}
            </div>
            {trend !== undefined && (
              <div className={cn(
                "flex items-center gap-1 mt-1.5 text-xs font-medium",
                isPositive && "text-green-600",
                isNegative && "text-destructive"
              )}>
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}{trend}% {trendLabel || "vs anterior"}
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

const ManagementGeneralSection = () => {
  return (
    <div className="space-y-4">
      {/* Prima linie de KPI-uri */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KPICard
          code="MG1"
          title="Producție totală"
          value="12,450"
          unit="t"
          trend={8.5}
          trendLabel="vs anterior"
          icon={<Factory className="h-4 w-4" />}
          variant="success"
        />
        <KPICard
          code="MG2"
          title="Livrări totale"
          value="11,280"
          unit="t"
          trend={5.2}
          trendLabel="vs anterior"
          icon={<Truck className="h-4 w-4" />}
          variant="success"
        />
        <KPICard
          code="MG3"
          title="Grad realizare plan producție"
          value="94.5"
          unit="%"
          trend={2.1}
          trendLabel="vs anterior"
          icon={<TrendingUp className="h-4 w-4" />}
          variant="success"
        />
        <KPICard
          code="MG4"
          title="Marjă medie / ton"
          value="48.50"
          unit="lei/t"
          trend={-1.2}
          trendLabel="vs anterior"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* A doua linie de KPI-uri */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <KPICard
          code="MG5"
          title="Comenzi client deschise"
          value="24"
          unit="nr"
          icon={<FileText className="h-4 w-4" />}
        />
        <KPICard
          code="MG6"
          title="Loturi respinse"
          value="2.1"
          unit="%"
          trend={-0.5}
          trendLabel="vs anterior"
          icon={<AlertTriangle className="h-4 w-4" />}
          variant="success"
        />
        <KPICard
          code="MG7"
          title="Materiale în stoc critic"
          value="3"
          unit="nr"
          icon={<Package className="h-4 w-4" />}
          variant="warning"
        />
        <KPICard
          code="MG8"
          title="Revizii întârziate"
          value="2"
          unit="nr"
          icon={<Wrench className="h-4 w-4" />}
          variant="danger"
        />
      </div>
    </div>
  );
};

export default ManagementGeneralSection;
