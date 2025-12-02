import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for umiditate trend
const umiditateData = [
  { data: "01/12", umiditate: 4.2, limita_max: 5.0 },
  { data: "02/12", umiditate: 4.8, limita_max: 5.0 },
  { data: "03/12", umiditate: 3.9, limita_max: 5.0 },
  { data: "04/12", umiditate: 5.2, limita_max: 5.0 },
  { data: "05/12", umiditate: 4.5, limita_max: 5.0 },
  { data: "06/12", umiditate: 4.1, limita_max: 5.0 },
];

// Mock data for temperatură trend
const temperaturaData = [
  { data: "01/12", temp: 165, tinta: 170 },
  { data: "02/12", temp: 168, tinta: 170 },
  { data: "03/12", temp: 172, tinta: 170 },
  { data: "04/12", temp: 167, tinta: 170 },
  { data: "05/12", temp: 171, tinta: 170 },
  { data: "06/12", temp: 169, tinta: 170 },
];

// Mock data for neconformități - Pareto
const neconformitatiData = [
  { tip: "Umiditate ridicată", frecventa: 15, procent: 37.5 },
  { tip: "Temperatură scăzută", frecventa: 12, procent: 30.0 },
  { tip: "Granulometrie", frecventa: 8, procent: 20.0 },
  { tip: "Stabilitate", frecventa: 3, procent: 7.5 },
  { tip: "Altele", frecventa: 2, procent: 5.0 },
];

const RapoarteCalitate = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = neconformitatiData.map(d => ({
        tip: d.tip,
        frecventa: d.frecventa,
        procent: d.procent,
      }));

      const columns = [
        { key: "tip" as const, label: "Tip Neconformitate" },
        { key: "frecventa" as const, label: "Frecvență" },
        { key: "procent" as const, label: "Procent (%)" },
      ];

      exportToCSV(exportData, "raport_calitate", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
  };

  const totalNeconformitati = neconformitatiData.reduce((sum, item) => sum + item.frecventa, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <CheckCircle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Calitate</h1>
            <p className="text-muted-foreground">Trend umiditate/temperatură, neconformități</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter showMaterialFilter />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Neconformități</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalNeconformitati}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Umiditate Medie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(umiditateData.reduce((sum, d) => sum + d.umiditate, 0) / umiditateData.length).toFixed(1)}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Temp. Medie Asfalt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {Math.round(temperaturaData.reduce((sum, d) => sum + d.temp, 0) / temperaturaData.length)}°C
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trend Umiditate */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Umiditate Materiale</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={umiditateData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis label={{ value: 'Umiditate (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="umiditate" stroke="hsl(var(--primary))" strokeWidth={2} name="Umiditate" />
              <Line type="monotone" dataKey="limita_max" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="Limită Max" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Temperatură */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Temperatură Asfalt</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={temperaturaData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis label={{ value: 'Temperatură (°C)', angle: -90, position: 'insideLeft' }} domain={[150, 180]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} name="Temperatură" />
              <Line type="monotone" dataKey="tinta" stroke="hsl(142_76%_36%)" strokeWidth={2} strokeDasharray="5 5" name="Țintă" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Pareto Neconformități */}
      <Card>
        <CardHeader>
          <CardTitle>Pareto Neconformități</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={neconformitatiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tip" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Frecvență', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="frecventa" fill="hsl(var(--primary))" name="Frecvență" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2">
            {neconformitatiData.map((item, index) => (
              <div key={item.tip} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="font-medium text-foreground">{item.tip}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{item.frecventa} cazuri</p>
                  <p className="text-sm text-muted-foreground">{item.procent}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteCalitate;
