import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  AlertCircle,
  Building2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TopClient {
  id: string;
  nume: string;
  volum: string;
  marja: number;
  trend: "up" | "down" | "stable";
}

const topClients: TopClient[] = [
  { id: "1", nume: "Construcții SRL", volum: "580 t", marja: 22.5, trend: "up" },
  { id: "2", nume: "Drumuri SA", volum: "420 t", marja: 18.2, trend: "stable" },
  { id: "3", nume: "Asfalt Pro", volum: "350 t", marja: 24.1, trend: "up" },
  { id: "4", nume: "Infrastructură Plus", volum: "280 t", marja: 15.8, trend: "down" },
  { id: "5", nume: "RoadMaster", volum: "220 t", marja: 19.5, trend: "stable" },
];

const FinancialSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Wallet className="h-5 w-5 text-primary" />
        Financiar & Health General
      </h3>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Venituri Azi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">245,800 lei</div>
            <p className="text-xs text-muted-foreground mt-1">
              Săptămâna aceasta: 1,245,600 lei
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +12.5% vs săptămâna trecută
            </div>
          </CardContent>
        </Card>

        {/* Costs Card */}
        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="h-4 w-4 text-yellow-600" />
              Costuri Azi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">198,500 lei</div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Directe</span>
                <span>165,200 lei</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Indirecte</span>
                <span>33,300 lei</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Profit Operațional
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">47,300 lei</div>
            <p className="text-xs text-muted-foreground mt-1">
              Marjă: 19.2%
            </p>
            <Progress value={72} className="h-1.5 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">72% din target zilnic</p>
          </CardContent>
        </Card>

        {/* Cash Flow Card */}
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Facturi Întârziate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">125,400 lei</div>
            <p className="text-xs text-muted-foreground mt-1">
              8 facturi &gt; 30 zile
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs text-destructive">
              <ArrowDownRight className="h-3 w-3" />
              -5.2% vs luna trecută
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Top 5 Clienți după Volum / Marjă
          </CardTitle>
          <CardDescription>Performanța clienților principali</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClients.map((client, index) => (
              <div key={client.id} className="flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{client.nume}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{client.volum}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs gap-1",
                          client.trend === "up" && "text-green-600 border-green-500/30 bg-green-500/10",
                          client.trend === "down" && "text-destructive border-destructive/30 bg-destructive/10",
                          client.trend === "stable" && "text-muted-foreground"
                        )}
                      >
                        {client.trend === "up" && <TrendingUp className="h-3 w-3" />}
                        {client.trend === "down" && <TrendingDown className="h-3 w-3" />}
                        {client.marja}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={client.marja * 4} className="h-1 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSection;
