import { Briefcase, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportFilterBar } from "./components/ReportFilterBar";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { exportToCSV } from "@/lib/exportUtils";

// Mock data for volum pe client
const volumClientData = [
  { client: "SC Construct SRL", volum: 1850, valoare: 425000 },
  { client: "Romanian Roads SA", volum: 1620, valoare: 380000 },
  { client: "Urban Build SRL", volum: 1240, valoare: 295000 },
  { client: "Infrastructure Pro", volum: 890, valoare: 210000 },
  { client: "Alții", volum: 1200, valoare: 280000 },
];

// Mock data for volum pe șantier
const volumSantierData = [
  { santier: "A1 km 45", volum: 2200 },
  { santier: "DN1 Reabilitare", volum: 1850 },
  { santier: "Parcare Centru", volum: 1450 },
  { santier: "Strada Victoriei", volum: 980 },
  { santier: "Altele", volum: 1320 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.8)", "hsl(var(--primary) / 0.6)", "hsl(var(--primary) / 0.4)", "hsl(var(--primary) / 0.2)"];

const RapoarteComercial = () => {
  const handleExport = (format: "csv" | "xlsx" | "pdf") => {
    if (format === "csv") {
      const exportData = volumClientData.map(d => ({
        client: d.client,
        volum: d.volum,
        valoare: d.valoare,
      }));

      const columns = [
        { key: "client" as const, label: "Client" },
        { key: "volum" as const, label: "Volum (tone)" },
        { key: "valoare" as const, label: "Valoare (RON)" },
      ];

      exportToCSV(exportData, "raport_comercial", columns);
    } else {
      console.log(`Export ${format} - feature to be implemented`);
    }
  };

  const totalVolum = volumClientData.reduce((sum, item) => sum + item.volum, 0);
  const termenMediu = 45; // minutes

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Comercial</h1>
            <p className="text-muted-foreground">Volum livrat, termen mediu în plantă</p>
          </div>
        </div>
      </div>

      <ReportFilterBar onExport={handleExport} showPlantFilter showClientFilter showSiteFilter />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Volum Livrat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalVolum.toLocaleString()} tone</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Termen Mediu în Plantă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{termenMediu} min</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nr. Clienți Activi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{volumClientData.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Volum pe Client */}
      <Card>
        <CardHeader>
          <CardTitle>Volum Livrat pe Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumClientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="client" angle={-45} textAnchor="end" height={100} />
              <YAxis label={{ value: 'Tone', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="volum" fill="hsl(var(--primary))" name="Volum (tone)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volum pe Șantier - Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuție Volum pe Șantier</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={volumSantierData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ santier, volum }) => `${santier}: ${volum}t`}
                outerRadius={100}
                fill="hsl(var(--primary))"
                dataKey="volum"
              >
                {volumSantierData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabel Top Clienți */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clienți - Valoare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {volumClientData
              .sort((a, b) => b.valoare - a.valoare)
              .map((client, index) => (
                <div key={client.client} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{client.client}</p>
                      <p className="text-sm text-muted-foreground">{client.volum.toLocaleString()} tone</p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-foreground">{client.valoare.toLocaleString()} RON</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RapoarteComercial;
