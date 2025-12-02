import { DollarSign, ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for venituri/costuri
const financialData = [
  { luna: "Ian", venituri: 850000, costuri: 620000, profit: 230000 },
  { luna: "Feb", venituri: 780000, costuri: 580000, profit: 200000 },
  { luna: "Mar", venituri: 920000, costuri: 650000, profit: 270000 },
  { luna: "Apr", venituri: 1050000, costuri: 720000, profit: 330000 },
  { luna: "Mai", venituri: 1150000, costuri: 780000, profit: 370000 },
  { luna: "Iun", venituri: 1200000, costuri: 820000, profit: 380000 },
];

// Mock data for breakdown costuri
const costuriBreakdown = [
  { categorie: "Materii Prime", valoare: 520000, procent: 63.4 },
  { categorie: "Mentenanță", valoare: 75000, procent: 9.1 },
  { categorie: "Energie", valoare: 95000, procent: 11.6 },
  { categorie: "Personal", valoare: 85000, procent: 10.4 },
  { categorie: "Altele", valoare: 45000, procent: 5.5 },
];

const RapoarteFinanciar = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = financialData.map(d => ({
        luna: d.luna,
        venituri: d.venituri,
        costuri: d.costuri,
        profit: d.profit,
        marja: ((d.profit / d.venituri) * 100).toFixed(1),
      }));

      const columns = [
        { key: "luna" as const, label: "Lună" },
        { key: "venituri" as const, label: "Venituri (RON)" },
        { key: "costuri" as const, label: "Costuri (RON)" },
        { key: "profit" as const, label: "Profit (RON)" },
        { key: "marja" as const, label: "Marjă (%)" },
      ];

      exportToCSV(exportData, "raport_financiar", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
  };

  const currentMonth = financialData[financialData.length - 1];
  const previousMonth = financialData[financialData.length - 2];
  const venituriGrowth = ((currentMonth.venituri - previousMonth.venituri) / previousMonth.venituri) * 100;
  const profitGrowth = ((currentMonth.profit - previousMonth.profit) / previousMonth.profit) * 100;
  const marja = ((currentMonth.profit / currentMonth.venituri) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Financiar</h1>
            <p className="text-muted-foreground">Sumar financiar și indicatori</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Venituri Luna Curentă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMonth.venituri.toLocaleString()} RON</div>
            <div className={`flex items-center gap-1 text-sm mt-1 ${venituriGrowth >= 0 ? "text-[hsl(142_76%_36%)]" : "text-destructive"}`}>
              {venituriGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(venituriGrowth).toFixed(1)}% vs luna trecută
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Costuri Luna Curentă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMonth.costuri.toLocaleString()} RON</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profit Luna Curentă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMonth.profit.toLocaleString()} RON</div>
            <div className={`flex items-center gap-1 text-sm mt-1 ${profitGrowth >= 0 ? "text-[hsl(142_76%_36%)]" : "text-destructive"}`}>
              {profitGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {Math.abs(profitGrowth).toFixed(1)}% vs luna trecută
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Marjă Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{marja}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Venituri vs Costuri vs Profit */}
      <Card>
        <CardHeader>
          <CardTitle>Evoluție Financiară - Semestrial</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="luna" />
              <YAxis label={{ value: 'RON', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="venituri" fill="hsl(var(--primary))" name="Venituri" />
              <Bar dataKey="costuri" fill="hsl(var(--primary) / 0.5)" name="Costuri" />
              <Bar dataKey="profit" fill="hsl(142_76%_36%)" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Trend Profit */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Profit - Semestrial</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="luna" />
              <YAxis label={{ value: 'RON', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="hsl(142_76%_36%)" strokeWidth={2} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Breakdown Costuri */}
      <Card>
        <CardHeader>
          <CardTitle>Breakdown Costuri - Luna Curentă</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {costuriBreakdown.map((item) => (
              <div key={item.categorie} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">{item.categorie}</p>
                  <div className="text-right">
                    <p className="font-bold text-foreground">{item.valoare.toLocaleString()} RON</p>
                    <p className="text-sm text-muted-foreground">{item.procent}%</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${item.procent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteFinanciar;
