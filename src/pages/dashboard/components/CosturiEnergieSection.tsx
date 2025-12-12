import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Fuel, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

const CosturiEnergieSection = () => {
  const consumuri = {
    curentActiv: { valoare: 1250, unitate: "kWh", cost: "875 lei", trend: -5.2 },
    curentPasiv: { valoare: 320, unitate: "kWh", cost: "224 lei", trend: 2.1 },
    ctlLitri: { valoare: 580, unitate: "l", cost: "4,060 lei", trend: -8.5 },
    motorina: { valoare: 420, unitate: "l", cost: "2,940 lei", trend: 1.2 },
  };

  const costuriPeTona = {
    actual: 285,
    buget: 278,
    diferenta: 7,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Consumuri Energie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-yellow-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Curent Activ</span>
                <Badge variant="outline" className="text-xs">
                  {consumuri.curentActiv.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1 text-green-600" /> : <TrendingUp className="h-3 w-3 mr-1 text-destructive" />}
                  {Math.abs(consumuri.curentActiv.trend)}%
                </Badge>
              </div>
              <p className="text-lg font-bold">{consumuri.curentActiv.valoare} {consumuri.curentActiv.unitate}</p>
              <p className="text-xs text-muted-foreground">{consumuri.curentActiv.cost}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Curent Pasiv</span>
                <Badge variant="outline" className="text-xs">
                  {consumuri.curentPasiv.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1 text-green-600" /> : <TrendingUp className="h-3 w-3 mr-1 text-destructive" />}
                  {Math.abs(consumuri.curentPasiv.trend)}%
                </Badge>
              </div>
              <p className="text-lg font-bold">{consumuri.curentPasiv.valoare} {consumuri.curentPasiv.unitate}</p>
              <p className="text-xs text-muted-foreground">{consumuri.curentPasiv.cost}</p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">CTL</span>
                <Badge variant="outline" className="text-xs">
                  {consumuri.ctlLitri.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1 text-green-600" /> : <TrendingUp className="h-3 w-3 mr-1 text-destructive" />}
                  {Math.abs(consumuri.ctlLitri.trend)}%
                </Badge>
              </div>
              <p className="text-lg font-bold">{consumuri.ctlLitri.valoare} {consumuri.ctlLitri.unitate}</p>
              <p className="text-xs text-muted-foreground">{consumuri.ctlLitri.cost}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Motorină</span>
                <Badge variant="outline" className="text-xs">
                  {consumuri.motorina.trend < 0 ? <TrendingDown className="h-3 w-3 mr-1 text-green-600" /> : <TrendingUp className="h-3 w-3 mr-1 text-destructive" />}
                  {Math.abs(consumuri.motorina.trend)}%
                </Badge>
              </div>
              <p className="text-lg font-bold">{consumuri.motorina.valoare} {consumuri.motorina.unitate}</p>
              <p className="text-xs text-muted-foreground">{consumuri.motorina.cost}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Cost pe Tonă
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{costuriPeTona.actual} lei/t</p>
              <p className="text-sm text-muted-foreground mt-1">Cost unitar actual</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-primary/10 text-center">
                <p className="text-lg font-bold">{costuriPeTona.buget} lei/t</p>
                <p className="text-xs text-muted-foreground">Buget</p>
              </div>
              <div className="p-3 rounded-lg bg-destructive/10 text-center">
                <p className="text-lg font-bold text-destructive">+{costuriPeTona.diferenta} lei/t</p>
                <p className="text-xs text-muted-foreground">Depășire</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CosturiEnergieSection;
