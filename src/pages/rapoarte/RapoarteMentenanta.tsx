import { Wrench, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for MTBF/MTTR per utilaj
const maintenanceMetrics = [
  { utilaj: "EXC-001", mtbf: 450, mttr: 4.2, cost: 12500, downtime: 85 },
  { utilaj: "MIX-001", mtbf: 380, mttr: 6.8, cost: 28400, downtime: 142 },
  { utilaj: "FIN-001", mtbf: 520, mttr: 3.5, cost: 8200, downtime: 68 },
  { utilaj: "COM-001", mtbf: 410, mttr: 5.1, cost: 10800, downtime: 95 },
  { utilaj: "CAM-003", mtbf: 350, mttr: 4.8, cost: 15600, downtime: 112 },
];

// Mock data for downtime trend
const downtimeData = [
  { luna: "Ian", downtime: 95 },
  { luna: "Feb", downtime: 112 },
  { luna: "Mar", downtime: 88 },
  { luna: "Apr", downtime: 105 },
  { luna: "Mai", downtime: 92 },
  { luna: "Iun", downtime: 78 },
];

const RapoarteMentenanta = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = maintenanceMetrics.map(d => ({
        utilaj: d.utilaj,
        mtbf: d.mtbf,
        mttr: d.mttr,
        cost: d.cost,
        downtime: d.downtime,
      }));

      const columns = [
        { key: "utilaj" as const, label: "Utilaj" },
        { key: "mtbf" as const, label: "MTBF (ore)" },
        { key: "mttr" as const, label: "MTTR (ore)" },
        { key: "cost" as const, label: "Cost (RON)" },
        { key: "downtime" as const, label: "Downtime (ore)" },
      ];

      exportToCSV(exportData, "raport_mentenanta", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
  };

  const totalCost = maintenanceMetrics.reduce((sum, item) => sum + item.cost, 0);
  const avgMTBF = Math.round(maintenanceMetrics.reduce((sum, item) => sum + item.mtbf, 0) / maintenanceMetrics.length);
  const avgMTTR = (maintenanceMetrics.reduce((sum, item) => sum + item.mttr, 0) / maintenanceMetrics.length).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Mentenanță</h1>
            <p className="text-muted-foreground">MTBF/MTTR, cost per utilaj</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost Total Mentenanță</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCost.toLocaleString()} RON</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MTBF Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgMTBF} ore</div>
            <p className="text-xs text-muted-foreground mt-1">Mean Time Between Failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MTTR Mediu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgMTTR} ore</div>
            <p className="text-xs text-muted-foreground mt-1">Mean Time To Repair</p>
          </CardContent>
        </Card>
      </div>

      {/* Cost per Utilaj */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Mentenanță per Utilaj</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={maintenanceMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="utilaj" />
              <YAxis label={{ value: 'Cost (RON)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="cost" fill="hsl(var(--primary))" name="Cost" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* MTBF și MTTR Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Indicatori MTBF și MTTR per Utilaj</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceMetrics.map((item) => (
              <div key={item.utilaj} className="p-4 bg-muted/50 rounded-md">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground">{item.utilaj}</p>
                  <p className="text-sm text-muted-foreground">{item.cost.toLocaleString()} RON</p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">MTBF</p>
                    <p className="font-bold text-foreground">{item.mtbf} ore</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">MTTR</p>
                    <p className="font-bold text-foreground">{item.mttr} ore</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Downtime</p>
                    <p className="font-bold text-destructive">{item.downtime} ore</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ore Indisponibilitate - Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Ore Indisponibilitate (Downtime)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={downtimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="luna" />
              <YAxis label={{ value: 'Ore', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="downtime" stroke="hsl(var(--destructive))" strokeWidth={2} name="Downtime" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteMentenanta;
