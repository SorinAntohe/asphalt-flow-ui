import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Factory, Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data pentru grafice
const productiePerProdus = [
  { produs: "BA 16", tonaj: 3200 },
  { produs: "BAD 22.4", tonaj: 2800 },
  { produs: "MASF 16", tonaj: 2100 },
  { produs: "AB 16", tonaj: 1850 },
  { produs: "BAR 16", tonaj: 1500 }
];

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

const marshallPerProdus = [
  { produs: "BA 16", marshall: 12.5 },
  { produs: "BAD 22.4", marshall: 11.8 },
  { produs: "MASF 16", marshall: 13.2 },
  { produs: "AB 16", marshall: 12.1 },
  { produs: "BAR 16", marshall: 11.5 }
];

const consumEnergieZilnic = [
  { zi: "Lun", kwh: 8.2 },
  { zi: "Mar", kwh: 7.9 },
  { zi: "Mie", kwh: 8.5 },
  { zi: "Joi", kwh: 8.1 },
  { zi: "Vin", kwh: 7.8 },
  { zi: "Sam", kwh: 9.2 },
  { zi: "Dum", kwh: 0 }
];

const consumCTLZilnic = [
  { zi: "Lun", litri: 4.2 },
  { zi: "Mar", litri: 4.0 },
  { zi: "Mie", litri: 4.5 },
  { zi: "Joi", litri: 4.1 },
  { zi: "Vin", litri: 3.9 },
  { zi: "Sam", litri: 4.8 },
  { zi: "Dum", litri: 0 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const ProductieCalitateSection = () => {
  const getRealizePercent = (planificat: number, realizat: number) => {
    return (realizat / planificat * 100).toFixed(1);
  };

  const getRealizeBadgeVariant = (percent: number) => {
    if (percent >= 100) return "default";
    if (percent >= 90) return "secondary";
    return "destructive";
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
              <CardTitle className="text-sm font-semibold">Producție pe produs (t)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productiePerProdus} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                    <Bar dataKey="tonaj" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
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
              <CardTitle className="text-sm font-semibold">Temperatură medie la încărcare pe produs (°C)</CardTitle>
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
                    <Line type="monotone" dataKey="temperatura" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC5 - Marshall mediu */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Marshall mediu pe produs</CardTitle>
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
                    <Bar dataKey="marshall" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC6 - Consum energie */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Consum energie electrică per ton (kWh/t)</CardTitle>
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
                    <Line type="monotone" dataKey="kwh" stroke="hsl(var(--chart-3))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 0, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC7 - Consum CTL */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Consum CTL per ton (L/t)</CardTitle>
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
                    <Line type="monotone" dataKey="litri" stroke="hsl(var(--chart-4))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--chart-4))', strokeWidth: 0, r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductieCalitateSection;
