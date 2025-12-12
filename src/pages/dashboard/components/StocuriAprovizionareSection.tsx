import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown, Truck } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const StocuriAprovizionareSection = () => {
  const stockAlerts = [
    { material: "Bitum 50/70", stoc: 12, minim: 20, unitate: "t", status: "critic" },
    { material: "Filler", stoc: 35, minim: 30, unitate: "t", status: "ok" },
    { material: "0/4 CONC", stoc: 180, minim: 150, unitate: "t", status: "ok" },
    { material: "4/8 CRIBLURI", stoc: 45, minim: 80, unitate: "t", status: "scăzut" },
    { material: "Motorină", stoc: 2500, minim: 3000, unitate: "l", status: "scăzut" },
  ];

  const pendingOrders = [
    { furnizor: "Petrom", material: "Bitum 50/70", cantitate: "40 t", eta: "Azi 14:00" },
    { furnizor: "Holcim", material: "Filler", cantitate: "25 t", eta: "Mâine 09:00" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Nivel Stocuri Critice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stockAlerts.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.material}</span>
                <div className="flex items-center gap-2">
                  <span>{item.stoc} / {item.minim} {item.unitate}</span>
                  <Badge 
                    variant={item.status === "critic" ? "destructive" : item.status === "scăzut" ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {item.status === "critic" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status === "scăzut" && <TrendingDown className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(item.stoc / item.minim) * 100} 
                className={`h-2 ${item.status === "critic" ? "[&>div]:bg-destructive" : item.status === "scăzut" ? "[&>div]:bg-yellow-500" : ""}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Comenzi Aprovizionare în Așteptare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingOrders.map((order, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{order.material}</p>
                  <p className="text-xs text-muted-foreground">{order.furnizor}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{order.cantitate}</p>
                  <p className="text-xs text-muted-foreground">ETA: {order.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StocuriAprovizionareSection;
