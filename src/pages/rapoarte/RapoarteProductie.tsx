import { Factory, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for Plan vs Real
const planVsRealData = [
  { zi: "Luni", plan: 240, real: 235, linie: "Linie 1" },
  { zi: "Marți", plan: 240, real: 245, linie: "Linie 1" },
  { zi: "Miercuri", plan: 240, real: 238, linie: "Linie 1" },
  { zi: "Joi", plan: 240, real: 242, linie: "Linie 1" },
  { zi: "Vineri", plan: 240, real: 240, linie: "Linie 1" },
  { zi: "Sâmbătă", plan: 120, real: 118, linie: "Linie 1" },
];

// Mock data for randament pe rețetă
const randamentData = [
  { reteta: "BA16", randament: 95.2, tinta: 95, tone: 1250 },
  { reteta: "BA8", randament: 96.5, tinta: 95, tone: 850 },
  { reteta: "BAD31", randament: 94.8, tinta: 95, tone: 560 },
  { reteta: "BAS22", randament: 97.1, tinta: 95, tone: 420 },
];

const RapoarteProductie = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = planVsRealData.map(d => ({
        zi: d.zi,
        plan: d.plan,
        real: d.real,
        diferenta: d.real - d.plan,
      }));

      const columns = [
        { key: "zi" as const, label: "Zi" },
        { key: "plan" as const, label: "Plan (tone)" },
        { key: "real" as const, label: "Real (tone)" },
        { key: "diferenta" as const, label: "Diferență (tone)" },
      ];

      exportToCSV(exportData, "raport_productie", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
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
          <Factory className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Producție</h1>
            <p className="text-muted-foreground">Plan vs Real, randament pe rețetă</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter />

      {/* Plan vs Real Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Plan vs Real - Săptămânal</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={planVsRealData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="zi" />
              <YAxis label={{ value: 'Tone', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="plan" fill="hsl(var(--primary) / 0.3)" name="Plan" />
              <Bar dataKey="real" fill="hsl(var(--primary))" name="Real" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Randament pe Rețetă */}
      <Card>
        <CardHeader>
          <CardTitle>Randament pe Rețetă</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {randamentData.map((item) => (
              <div key={item.reteta} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{item.reteta}</p>
                    <p className="text-sm text-muted-foreground">{item.tone} tone produse</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${item.randament >= item.tinta ? "text-[hsl(142_76%_36%)]" : "text-destructive"}`}>
                      {item.randament}%
                    </p>
                    <p className="text-xs text-muted-foreground">Țintă: {item.tinta}%</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.randament >= item.tinta ? "bg-[hsl(142_76%_36%)]" : "bg-destructive"}`}
                    style={{ width: `${(item.randament / 100) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Production Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Producție Lunară</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={[
              { luna: "Ian", productie: 4500 },
              { luna: "Feb", productie: 4200 },
              { luna: "Mar", productie: 5100 },
              { luna: "Apr", productie: 5800 },
              { luna: "Mai", productie: 6200 },
              { luna: "Iun", productie: 6500 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="luna" />
              <YAxis label={{ value: 'Tone', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="productie" stroke="hsl(var(--primary))" strokeWidth={2} name="Producție" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteProductie;
