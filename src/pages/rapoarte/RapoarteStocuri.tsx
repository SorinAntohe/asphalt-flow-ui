import { Package, ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for intrări/ieșiri
const fluxStocData = [
  { zi: "Luni", intrari: 450, iesiri: 380 },
  { zi: "Marți", intrari: 520, iesiri: 420 },
  { zi: "Miercuri", intrari: 380, iesiri: 450 },
  { zi: "Joi", intrari: 490, iesiri: 410 },
  { zi: "Vineri", intrari: 550, iesiri: 480 },
  { zi: "Sâmbătă", intrari: 250, iesiri: 220 },
];

// Mock data for stoc util cu umiditate
const stocUtilData = [
  { material: "0/4 NAT", stoc_brut: 850, umiditate: 5.2, stoc_util: 806, min: 500, max: 1000, status: "ok" },
  { material: "BITUM 50/70", stoc_brut: 420, umiditate: 0, stoc_util: 420, min: 300, max: 600, status: "ok" },
  { material: "8/16 CONC", stoc_brut: 320, umiditate: 3.8, stoc_util: 308, min: 400, max: 800, status: "low" },
  { material: "FILLER", stoc_brut: 180, umiditate: 1.5, stoc_util: 177, min: 200, max: 500, status: "critical" },
  { material: "CTL", stoc_brut: 550, umiditate: 0, stoc_util: 550, min: 300, max: 700, status: "ok" },
];

const RapoarteStocuri = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = stocUtilData.map(d => ({
        material: d.material,
        stoc_brut: d.stoc_brut,
        umiditate: d.umiditate,
        stoc_util: d.stoc_util,
        min: d.min,
        max: d.max,
      }));

      const columns = [
        { key: "material" as const, label: "Material" },
        { key: "stoc_brut" as const, label: "Stoc Brut (tone)" },
        { key: "umiditate" as const, label: "Umiditate (%)" },
        { key: "stoc_util" as const, label: "Stoc Util (tone)" },
        { key: "min" as const, label: "Stoc Min (tone)" },
        { key: "max" as const, label: "Stoc Max (tone)" },
      ];

      exportToCSV(exportData, "raport_stocuri", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "critical") {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Sub Minim</Badge>;
    }
    if (status === "low") {
      return <Badge variant="warning" className="gap-1"><AlertTriangle className="h-3 w-3" />Apropiat Min</Badge>;
    }
    return <Badge variant="success">OK</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Stocuri</h1>
            <p className="text-muted-foreground">Intrări/ieșiri, stoc util, min/max</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter showMaterialFilter />

      {/* Flux Stoc - Intrări/Ieșiri */}
      <Card>
        <CardHeader>
          <CardTitle>Flux Stoc - Intrări vs Ieșiri (Săptămânal)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={fluxStocData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zi" />
              <YAxis label={{ value: 'Tone', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="intrari" fill="hsl(var(--primary))" name="Intrări" />
              <Bar dataKey="iesiri" fill="hsl(var(--primary) / 0.5)" name="Ieșiri" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Stoc Util cu Umiditate și Alerte */}
      <Card>
        <CardHeader>
          <CardTitle>Stoc Util (Ajustat cu Umiditate) și Limite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stocUtilData.map((item) => (
              <div key={item.material} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{item.material}</p>
                      <p className="text-sm text-muted-foreground">
                        Umiditate: {item.umiditate}% • Stoc Brut: {item.stoc_brut}t → Util: {item.stoc_util}t
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                <div className="relative h-6 bg-muted rounded-full overflow-hidden">
                  {/* Min marker */}
                  <div 
                    className="absolute h-full w-0.5 bg-destructive z-10"
                    style={{ left: `${(item.min / item.max) * 100}%` }}
                  />
                  {/* Stoc util bar */}
                  <div
                    className={`h-full ${
                      item.stoc_util < item.min 
                        ? "bg-destructive" 
                        : item.stoc_util < item.min * 1.2 
                        ? "bg-[hsl(38_92%_50%)]" 
                        : "bg-[hsl(142_76%_36%)]"
                    }`}
                    style={{ width: `${(item.stoc_util / item.max) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {item.min}t</span>
                  <span>Max: {item.max}t</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomandări Comandă */}
      <Card>
        <CardHeader>
          <CardTitle>Recomandări Comandă</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stocUtilData
              .filter(item => item.status !== "ok")
              .map((item) => (
                <div key={item.material} className="flex items-start justify-between p-4 bg-muted/50 rounded-md border-l-4 border-destructive">
                  <div>
                    <p className="font-semibold text-foreground">{item.material}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Stoc curent: {item.stoc_util}t • Stoc minim: {item.min}t
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-destructive">
                      Comandă: {Math.max(0, item.max - item.stoc_util)}t
                    </p>
                  </div>
                </div>
              ))}
            {stocUtilData.filter(item => item.status !== "ok").length === 0 && (
              <p className="text-center text-muted-foreground py-6">
                Nu există recomandări de comandă. Toate stocurile sunt în limite normale.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trend Stoc */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Stoc - Lunar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { luna: "Ian", stoc: 4200 },
              { luna: "Feb", stoc: 3800 },
              { luna: "Mar", stoc: 4500 },
              { luna: "Apr", stoc: 4100 },
              { luna: "Mai", stoc: 4800 },
              { luna: "Iun", stoc: 4400 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="luna" />
              <YAxis label={{ value: 'Tone', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="stoc" stroke="hsl(var(--primary))" strokeWidth={2} name="Stoc Total" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteStocuri;
