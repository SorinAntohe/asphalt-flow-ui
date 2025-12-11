import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Play, 
  Sun, 
  CloudRain,
  Thermometer,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const forecastData = [
  { day: "Luni", prognoza: 2200, capacitate: 2500, meteo: "sun" },
  { day: "Marți", prognoza: 2450, capacitate: 2500, meteo: "sun" },
  { day: "Mier", prognoza: 1800, capacitate: 2500, meteo: "rain" },
  { day: "Joi", prognoza: 2100, capacitate: 2500, meteo: "sun" },
  { day: "Vin", prognoza: 2600, capacitate: 2500, meteo: "sun" },
  { day: "Sâm", prognoza: 1500, capacitate: 2000, meteo: "sun" },
  { day: "Dum", prognoza: 0, capacitate: 0, meteo: "sun" },
];

interface AISuggestion {
  id: string;
  message: string;
  priority: "high" | "medium" | "low";
  action?: string;
}

const suggestions: AISuggestion[] = [
  {
    id: "1",
    message: "Mărește stocul de bitum cu 150 t în următoarele 3 zile (creștere cerere + vreme bună).",
    priority: "high",
    action: "Comandă Bitum",
  },
  {
    id: "2",
    message: "Riscul de depășire cost la beton C25 azi: 72%. Verifică umiditatea agregatelor.",
    priority: "high",
    action: "Verifică",
  },
  {
    id: "3",
    message: "Slot suplimentar de producție joi 18:00–20:00 pentru a evita vârfurile de vineri.",
    priority: "medium",
    action: "Planifică",
  },
  {
    id: "4",
    message: "Optimizare rută camioane: -12% timp transport estimat pe ruta DN1.",
    priority: "low",
  },
];

const priorityConfig = {
  high: { color: "text-destructive", bg: "bg-destructive/10 border-destructive/30" },
  medium: { color: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/30" },
  low: { color: "text-primary", bg: "bg-primary/10 border-primary/30" },
};

const AIForecastSection = () => {
  const [simulationOpen, setSimulationOpen] = useState(false);
  const [simParams, setSimParams] = useState({
    pretBitum: "4200",
    volumComandat: "2500",
    pretTransport: "85",
  });

  const pretBitumNum = parseFloat(simParams.pretBitum) || 0;
  const volumComandatNum = parseFloat(simParams.volumComandat) || 0;
  const pretTransportNum = parseFloat(simParams.pretTransport) || 0;
  const simulatedCost = ((pretBitumNum * 0.055 + 180) * volumComandatNum + pretTransportNum * volumComandatNum * 0.4).toFixed(0);
  const simulatedMargin = (volumComandatNum * 320 - parseFloat(simulatedCost)).toFixed(0);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        AI & Prognoze DUOTIP
      </h3>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Forecast Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Prognoză Producție Asfalt (7 zile)</CardTitle>
            <CardDescription className="flex items-center gap-2">
              Tonaj/zi vs capacitate
              <Badge variant="outline" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    unit=" t"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-medium">{data.day}</p>
                            <p className="text-sm text-muted-foreground">
                              Prognoză: {data.prognoza} t
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Capacitate: {data.capacitate} t
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              {data.meteo === "sun" ? (
                                <Sun className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <CloudRain className="h-3 w-3 text-blue-500" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {data.meteo === "sun" ? "Însorit" : "Ploaie"}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="prognoza" name="Prognoză" radius={[4, 4, 0, 0]}>
                    {forecastData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.prognoza > entry.capacitate
                            ? "hsl(var(--destructive))"
                            : "hsl(var(--primary))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Forecast Card */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prognoză Cost Unitar</CardTitle>
              <CardDescription>Estimare următoarele 7 zile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold">292</div>
                <div className="text-sm text-muted-foreground">lei/tonă</div>
                <div className="flex items-center justify-center gap-1 mt-2 text-destructive">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">+2.4% vs săptămâna trecută</span>
                </div>
                <div className="mt-4 pt-4 border-t space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Preț bitum</span>
                    <span className="text-destructive">↑ +180 lei/t</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consum specific</span>
                    <span className="text-green-600">↓ -0.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilizare stație</span>
                    <span className="text-green-600">↑ 85%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={simulationOpen} onOpenChange={setSimulationOpen}>
            <DialogTrigger asChild>
              <Button className="w-full gap-2">
                <Play className="h-4 w-4" />
                Simulare
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Simulare Cost & Marjă</DialogTitle>
                <DialogDescription>
                  Modifică parametrii pentru a estima impactul asupra costurilor
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Preț Bitum (lei/tonă)</Label>
                  <Input
                    type="number"
                    value={simParams.pretBitum}
                    onChange={(e) => setSimParams({ ...simParams, pretBitum: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Volum Comandat (tone)</Label>
                  <Input
                    type="number"
                    value={simParams.volumComandat}
                    onChange={(e) => setSimParams({ ...simParams, volumComandat: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Preț Transport (lei/cursă)</Label>
                  <Input
                    type="number"
                    value={simParams.pretTransport}
                    onChange={(e) => setSimParams({ ...simParams, pretTransport: e.target.value })}
                  />
                </div>
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Cost Total Estimat:</span>
                    <span className="text-xl font-bold">{parseInt(simulatedCost).toLocaleString()} lei</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Marjă Estimată:</span>
                    <span className={cn(
                      "text-xl font-bold",
                      parseFloat(simulatedMargin) > 0 ? "text-green-600" : "text-destructive"
                    )}>
                      {parseInt(simulatedMargin).toLocaleString()} lei
                    </span>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            Sugestii AI
          </CardTitle>
          <CardDescription>Recomandări bazate pe analiza datelor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={cn(
                  "p-4 rounded-lg border",
                  priorityConfig[suggestion.priority].bg
                )}
              >
                <div className="flex items-start gap-3">
                  <Brain className={cn("h-5 w-5 mt-0.5 flex-shrink-0", priorityConfig[suggestion.priority].color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{suggestion.message}</p>
                    {suggestion.action && (
                      <Button variant="link" size="sm" className="px-0 mt-2 h-auto gap-1">
                        {suggestion.action}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIForecastSection;
