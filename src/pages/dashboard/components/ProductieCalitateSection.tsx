import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Factory, Zap, TrendingUp, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import DrillDownDialog from "./DrillDownDialog";

// Mock data pentru grafice
const productiePerProdus = [
  { produs: "BA 16", tonaj: 3200 },
  { produs: "BAD 22.4", tonaj: 2800 },
  { produs: "MASF 16", tonaj: 2100 },
  { produs: "AB 16", tonaj: 1850 },
  { produs: "BAR 16", tonaj: 1500 }
];

// Drill-down data pentru producție per produs
const productieDetails: Record<string, any[]> = {
  "BA 16": [
    { data: "09/12/2024", cantitate: 520, ordin: "OP-2024-150", operator: "Ion Popescu" },
    { data: "10/12/2024", cantitate: 680, ordin: "OP-2024-152", operator: "Vasile Georgescu" },
    { data: "11/12/2024", cantitate: 750, ordin: "OP-2024-155", operator: "Ion Popescu" },
    { data: "12/12/2024", cantitate: 1250, ordin: "OP-2024-156", operator: "Andrei Marin" }
  ],
  "BAD 22.4": [
    { data: "09/12/2024", cantitate: 450, ordin: "OP-2024-151", operator: "Vasile Georgescu" },
    { data: "10/12/2024", cantitate: 620, ordin: "OP-2024-153", operator: "Ion Popescu" },
    { data: "11/12/2024", cantitate: 830, ordin: "OP-2024-154", operator: "Andrei Marin" },
    { data: "12/12/2024", cantitate: 900, ordin: "OP-2024-156", operator: "Ion Popescu" }
  ],
  "MASF 16": [
    { data: "10/12/2024", cantitate: 400, ordin: "OP-2024-153", operator: "Andrei Marin" },
    { data: "11/12/2024", cantitate: 850, ordin: "OP-2024-155", operator: "Vasile Georgescu" },
    { data: "12/12/2024", cantitate: 850, ordin: "OP-2024-157", operator: "Ion Popescu" }
  ],
  "AB 16": [
    { data: "09/12/2024", cantitate: 350, ordin: "OP-2024-150", operator: "Ion Popescu" },
    { data: "11/12/2024", cantitate: 750, ordin: "OP-2024-155", operator: "Andrei Marin" },
    { data: "12/12/2024", cantitate: 750, ordin: "OP-2024-158", operator: "Vasile Georgescu" }
  ],
  "BAR 16": [
    { data: "10/12/2024", cantitate: 500, ordin: "OP-2024-152", operator: "Vasile Georgescu" },
    { data: "12/12/2024", cantitate: 1000, ordin: "OP-2024-159", operator: "Ion Popescu" }
  ]
};

const ordineProductie = [
  { cod: "OP-2024-156", produse: "BA 16, BAD 22.4", planificat: 450, realizat: 485, operator: "Ion Popescu", sef: "Mihai Ionescu" },
  { cod: "OP-2024-157", produse: "MASF 16", planificat: 320, realizat: 298, operator: "Vasile Georgescu", sef: "Mihai Ionescu" },
  { cod: "OP-2024-158", produse: "AB 16", planificat: 280, realizat: 280, operator: "Andrei Marin", sef: "Dan Popa" },
  { cod: "OP-2024-159", produse: "BAR 16", planificat: 200, realizat: 178, operator: "Ion Popescu", sef: "Dan Popa" }
];

const temperaturaPerProdus = [
  { produs: "BA 16", temperatura: 165 },
  { produs: "BAD 22.4", temperatura: 168 },
  { produs: "MASF 16", temperatura: 162 },
  { produs: "AB 16", temperatura: 170 },
  { produs: "BAR 16", temperatura: 167 }
];

// Drill-down data pentru temperatură
const temperaturaDetails: Record<string, any[]> = {
  "BA 16": [
    { lot: "L-2024-1201", temperatura: 163, ora: "08:15", status: "OK" },
    { lot: "L-2024-1205", temperatura: 166, ora: "10:30", status: "OK" },
    { lot: "L-2024-1210", temperatura: 168, ora: "14:00", status: "OK" },
    { lot: "L-2024-1215", temperatura: 162, ora: "16:45", status: "OK" }
  ],
  "BAD 22.4": [
    { lot: "L-2024-1202", temperatura: 170, ora: "09:00", status: "OK" },
    { lot: "L-2024-1206", temperatura: 165, ora: "11:15", status: "OK" },
    { lot: "L-2024-1211", temperatura: 169, ora: "15:00", status: "OK" }
  ],
  "MASF 16": [
    { lot: "L-2024-1203", temperatura: 160, ora: "08:45", status: "OK" },
    { lot: "L-2024-1207", temperatura: 164, ora: "12:00", status: "OK" }
  ],
  "AB 16": [
    { lot: "L-2024-1204", temperatura: 172, ora: "09:30", status: "Atenție" },
    { lot: "L-2024-1208", temperatura: 168, ora: "13:00", status: "OK" }
  ],
  "BAR 16": [
    { lot: "L-2024-1209", temperatura: 165, ora: "10:00", status: "OK" },
    { lot: "L-2024-1212", temperatura: 169, ora: "14:30", status: "OK" }
  ]
};

const marshallPerProdus = [
  { produs: "BA 16", marshall: 12.5 },
  { produs: "BAD 22.4", marshall: 11.8 },
  { produs: "MASF 16", marshall: 13.2 },
  { produs: "AB 16", marshall: 12.1 },
  { produs: "BAR 16", marshall: 11.5 }
];

const consumEnergieZilnic = [
  { zi: "Lun", kwh: 8.2, productie: 420 },
  { zi: "Mar", kwh: 7.9, productie: 380 },
  { zi: "Mie", kwh: 8.5, productie: 450 },
  { zi: "Joi", kwh: 8.1, productie: 410 },
  { zi: "Vin", kwh: 7.8, productie: 390 },
  { zi: "Sam", kwh: 9.2, productie: 520 },
  { zi: "Dum", kwh: 0, productie: 0 }
];

const consumCTLZilnic = [
  { zi: "Lun", litri: 4.2, cost: 28560 },
  { zi: "Mar", litri: 4.0, cost: 27200 },
  { zi: "Mie", litri: 4.5, cost: 30600 },
  { zi: "Joi", litri: 4.1, cost: 27880 },
  { zi: "Vin", litri: 3.9, cost: 26520 },
  { zi: "Sam", litri: 4.8, cost: 32640 },
  { zi: "Dum", litri: 0, cost: 0 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const ChartClickHint = () => (
  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
    <MousePointerClick className="h-3 w-3" />
    <span>Click pe grafic pentru detalii</span>
  </div>
);

const ProductieCalitateSection = () => {
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getRealizePercent = (planificat: number, realizat: number) => {
    return (realizat / planificat * 100).toFixed(1);
  };

  const getRealizeBadgeVariant = (percent: number) => {
    if (percent >= 100) return "default";
    if (percent >= 90) return "secondary";
    return "destructive";
  };

  const handleProductieClick = (data: any) => {
    const produs = data.produs;
    const details = productieDetails[produs] || [];
    setDrillDownData({
      title: `Detalii producție: ${produs}`,
      subtitle: `Total: ${data.tonaj.toLocaleString()} tone`,
      type: "table",
      columns: [
        { key: "data", label: "Data" },
        { key: "ordin", label: "Ordin producție" },
        { key: "cantitate", label: "Cantitate (t)", align: "right" },
        { key: "operator", label: "Operator" }
      ],
      data: details,
      summary: [
        { label: "Total producție", value: `${data.tonaj.toLocaleString()} t` },
        { label: "Nr. loturi", value: details.length },
        { label: "Media/lot", value: `${Math.round(data.tonaj / details.length).toLocaleString()} t` }
      ]
    });
    setDrillDownOpen(true);
  };

  const handleTemperaturaClick = (data: any) => {
    const produs = data.produs;
    const details = temperaturaDetails[produs] || [];
    setDrillDownData({
      title: `Temperaturi: ${produs}`,
      subtitle: `Temperatura medie: ${data.temperatura}°C`,
      type: "table",
      columns: [
        { key: "lot", label: "Lot" },
        { key: "ora", label: "Ora" },
        { key: "temperatura", label: "Temperatură (°C)", align: "right" },
        { key: "status", label: "Status", align: "center" }
      ],
      data: details,
      summary: [
        { label: "Temp. medie", value: `${data.temperatura}°C` },
        { label: "Nr. măsurători", value: details.length },
        { label: "Conformitate", value: "100%" }
      ]
    });
    setDrillDownOpen(true);
  };

  const handleMarshallClick = (data: any) => {
    setDrillDownData({
      title: `Marshall: ${data.produs}`,
      subtitle: `Valoare medie: ${data.marshall}`,
      type: "chart",
      chartConfig: {
        xKey: "lot",
        yKey: "marshall",
        chartType: "bar",
        color: "hsl(var(--chart-2))"
      },
      data: [
        { lot: "L-001", marshall: data.marshall - 0.3 },
        { lot: "L-002", marshall: data.marshall + 0.2 },
        { lot: "L-003", marshall: data.marshall - 0.1 },
        { lot: "L-004", marshall: data.marshall + 0.4 },
        { lot: "L-005", marshall: data.marshall }
      ],
      summary: [
        { label: "Marshall mediu", value: data.marshall },
        { label: "Min", value: (data.marshall - 0.3).toFixed(1) },
        { label: "Max", value: (data.marshall + 0.4).toFixed(1) }
      ]
    });
    setDrillDownOpen(true);
  };

  const handleEnergieClick = (data: any) => {
    if (data.kwh === 0) return;
    setDrillDownData({
      title: `Consum energie: ${data.zi}`,
      subtitle: `${data.kwh} kWh/t`,
      type: "details",
      data: [
        { name: "Consum total", kwh_total: Math.round(data.kwh * data.productie), productie: `${data.productie} t`, consum_specific: `${data.kwh} kWh/t` },
        { name: "Stație asfalt", kwh: Math.round(data.kwh * data.productie * 0.7), procent: "70%" },
        { name: "Uscător", kwh: Math.round(data.kwh * data.productie * 0.2), procent: "20%" },
        { name: "Alte echipamente", kwh: Math.round(data.kwh * data.productie * 0.1), procent: "10%" }
      ],
      summary: [
        { label: "Consum specific", value: `${data.kwh} kWh/t` },
        { label: "Producție", value: `${data.productie} t` },
        { label: "Cost estimat", value: `${Math.round(data.kwh * data.productie * 0.8).toLocaleString()} lei` }
      ]
    });
    setDrillDownOpen(true);
  };

  const handleCTLClick = (data: any) => {
    if (data.litri === 0) return;
    setDrillDownData({
      title: `Consum CTL: ${data.zi}`,
      subtitle: `${data.litri} L/t`,
      type: "pie",
      data: [
        { name: "Arzător principal", value: 65 },
        { name: "Arzător secundar", value: 25 },
        { name: "Încălzire bitum", value: 10 }
      ],
      summary: [
        { label: "Consum specific", value: `${data.litri} L/t` },
        { label: "Cost total", value: `${data.cost.toLocaleString()} lei` },
        { label: "Preț CTL", value: "6.80 lei/L" }
      ]
    });
    setDrillDownOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Secțiune A - Producție */}
      <div>
        <SectionHeader icon={Factory} title="Producție" />
        
        <div className="grid gap-4 lg:grid-cols-2">
          {/* PC1 - Grafic bară producție pe produs */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Producție pe produs (t)</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={productiePerProdus} 
                    margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="produs" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="tonaj" 
                      radius={[6, 6, 0, 0]} 
                      onClick={handleProductieClick}
                      cursor="pointer"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                    >
                      {productiePerProdus.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={activeIndex === index ? "hsl(var(--primary)/0.8)" : "hsl(var(--primary))"}
                          className="transition-all duration-200"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC3 - Card KPI Consum specific */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Consum specific materie primă</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[220px]">
                <div className="text-center space-y-2">
                  <div className="relative">
                    <p className="text-6xl font-bold tracking-tight">1,012</p>
                    <div className="absolute -top-2 -right-8 h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">kg/t</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-600 text-sm font-medium">
                    <TrendingUp className="h-3.5 w-3.5" />
                    -0.8% vs target (1,020 kg/t)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PC2 - Tabel Plan vs Realizat */}
        <Card className="mt-4 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Plan vs realizat pe ordin de producție</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Cod ordin</TableHead>
                    <TableHead className="text-xs font-semibold">Produs(e)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Planificat (t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Realizat (t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Realizare</TableHead>
                    <TableHead className="text-xs font-semibold">Operator</TableHead>
                    <TableHead className="text-xs font-semibold">Șef schimb</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordineProductie.map(ordin => {
                    const percent = parseFloat(getRealizePercent(ordin.planificat, ordin.realizat));
                    return (
                      <TableRow key={ordin.cod} className="hover:bg-muted/20">
                        <TableCell className="text-xs font-mono font-medium">{ordin.cod}</TableCell>
                        <TableCell className="text-xs">{ordin.produse}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{ordin.planificat.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{ordin.realizat.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={getRealizeBadgeVariant(percent)} className="text-xs font-semibold">
                            {percent}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{ordin.operator}</TableCell>
                        <TableCell className="text-xs">{ordin.sef}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Calitate */}
      <div>
        <SectionHeader icon={Zap} title="Calitate" />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* PC4 - Temperatură medie */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Temperatură medie la încărcare pe produs (°C)</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperaturaPerProdus} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="produs" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[150, 180]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="temperatura" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2.5} 
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4, cursor: 'pointer' }}
                      activeDot={{ r: 6, onClick: (_, payload: any) => handleTemperaturaClick(payload.payload) }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC5 - Marshall mediu */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Marshall mediu pe produs</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marshallPerProdus} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="produs" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[10, 15]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="marshall" 
                      fill="hsl(var(--chart-2))" 
                      radius={[6, 6, 0, 0]} 
                      onClick={handleMarshallClick}
                      cursor="pointer"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC6 - Consum energie */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Consum energie electrică per ton (kWh/t)</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumEnergieZilnic} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="zi" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="kwh" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2.5} 
                      dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 0, r: 4, cursor: 'pointer' }}
                      activeDot={{ r: 6, onClick: (_, payload: any) => handleEnergieClick(payload.payload) }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC7 - Consum CTL */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Consum CTL per ton (L/t)</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumCTLZilnic} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" vertical={false} />
                    <XAxis dataKey="zi" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="litri" 
                      stroke="hsl(var(--chart-4))" 
                      strokeWidth={2.5} 
                      dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 0, r: 4, cursor: 'pointer' }}
                      activeDot={{ r: 6, onClick: (_, payload: any) => handleCTLClick(payload.payload) }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DrillDownDialog 
        open={drillDownOpen} 
        onOpenChange={setDrillDownOpen} 
        data={drillDownData} 
      />
    </div>
  );
};

export default ProductieCalitateSection;
