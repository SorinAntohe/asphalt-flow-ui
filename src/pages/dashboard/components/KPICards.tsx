import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  DollarSign, 
  AlertTriangle,
  Clock,
  Truck,
  FileText
} from "lucide-react";
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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn(
          "p-2 rounded-lg",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "warning" && "bg-yellow-500/10 text-yellow-600",
          variant === "danger" && "bg-destructive/10 text-destructive",
          variant === "success" && "bg-green-500/10 text-green-600"
        )}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-xs font-medium",
            isPositive && "text-green-600",
            isNegative && "text-destructive"
          )}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(trend)}% {trendLabel || "vs plan"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const KPICards = () => {
  return (
    <div className="space-y-6">
      {/* Cantități Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Factory className="h-5 w-5 text-primary" />
          Cantități (Producție & Livrări)
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Producție Totală Azi"
            value="2,450 t"
            trend={12.5}
            trendLabel="vs plan"
            icon={<Factory className="h-4 w-4" />}
            variant="success"
          />
          <KPICard
            title="Asfalt + Emulsie"
            value="1,280 t"
            trend={8.2}
            icon={<Package className="h-4 w-4" />}
          />
          <KPICard
            title="Beton Stabilizat (BSC)"
            value="680 t"
            trend={-3.5}
            icon={<Package className="h-4 w-4" />}
          />
          <KPICard
            title="Comenzi Active Azi"
            value="24"
            subtitle="15 în lucru, 9 programate"
            icon={<FileText className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Costuri Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Costuri
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <KPICard
            title="Cost Unitar Actual"
            value="285 lei/t"
            subtitle="vs buget: 278 lei/t"
            trend={-2.5}
            trendLabel="vs buget"
            icon={<DollarSign className="h-4 w-4" />}
            variant="warning"
          />
          <KPICard
            title="Marjă / Profit Estimat"
            value="45,280 lei"
            subtitle="Marjă: 18.5%"
            trend={5.2}
            icon={<TrendingUp className="h-4 w-4" />}
            variant="success"
          />
          <KPICard
            title="Consum Specific"
            value="0.95"
            subtitle="MP/tonă vs rețetă teoretică: 0.92"
            trend={-3.2}
            trendLabel="vs rețetă"
            icon={<Package className="h-4 w-4" />}
            variant="warning"
          />
        </div>
      </div>

      {/* Action Center */}
      <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Centru Acțiuni
        </h3>
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="p-2 rounded-full bg-destructive/20">
                  <Clock className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">3</div>
                  <div className="text-sm text-muted-foreground">Comenzi cu întârzieri</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="p-2 rounded-full bg-yellow-500/20">
                  <FileText className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">12</div>
                  <div className="text-sm text-muted-foreground">Avize nefacturate</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="p-2 rounded-full bg-primary/20">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">5</div>
                  <div className="text-sm text-muted-foreground">Camioane în așteptare</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KPICards;
