import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";
import { ShoppingCart, Users, Truck, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const funnelData = [
  { name: "Oferte noi", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Contracte noi", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Comenzi client", value: 22, fill: "hsl(var(--chart-3))" }
];

const tonajPerClient = [
  { client: "Strabag", tonaj: 2850 },
  { client: "Colas", tonaj: 2200 },
  { client: "Porr", tonaj: 1850 },
  { client: "Euroconst", tonaj: 1420 },
  { client: "Drumex", tonaj: 980 }
];

const pretMediuVanzare = [
  { produs: "BA 16", pret: 285, tonaj: 3200 },
  { produs: "BAD 22.4", pret: 310, tonaj: 2800 },
  { produs: "MASF 16", pret: 295, tonaj: 2100 },
  { produs: "AB 16", pret: 275, tonaj: 1850 },
  { produs: "BAR 16", pret: 265, tonaj: 1500 }
];

const pretComparativ = [
  { produs: "BA 16", pretPropriu: 285, pretConcurenta: 290, diferenta: -5 },
  { produs: "BAD 22.4", pretPropriu: 310, pretConcurenta: 305, diferenta: 5 },
  { produs: "MASF 16", pretPropriu: 295, pretConcurenta: 298, diferenta: -3 },
  { produs: "AB 16", pretPropriu: 275, pretConcurenta: 280, diferenta: -5 },
  { produs: "BAR 16", pretPropriu: 265, pretConcurenta: 262, diferenta: 3 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const ComercialLivrariSection = () => {
  return (
    <div className="space-y-8">
      {/* Secțiune A - Funnel comercial */}
      <div>
        <SectionHeader icon={ShoppingCart} title="Funnel comercial" />
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Ofertă → Contract → Comandă client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Funnel data={funnelData} dataKey="value" nameKey="name" isAnimationActive>
                      <LabelList position="right" fill="hsl(var(--muted-foreground))" stroke="none" dataKey="name" fontSize={11} />
                      <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-sm font-medium">Rată conversie Oferte → Contracte</p>
                  <Badge variant="secondary" className="text-sm font-semibold px-3">62.2%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-sm font-medium">Rată conversie Contracte → Comenzi</p>
                  <Badge variant="secondary" className="text-sm font-semibold px-3">78.6%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-sm font-medium">Rată conversie totală</p>
                  <Badge className="text-sm font-semibold px-3">48.9%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Clienți & prețuri */}
      <div>
        <SectionHeader icon={Users} title="Clienți & prețuri" />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* CL2 - Tonaj livrat pe client */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Tonaj livrat pe client (Top 5)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tonajPerClient} layout="vertical" margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="client" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={75} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar dataKey="tonaj" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CL3 - Preț mediu de vânzare */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Preț mediu de vânzare / produs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold">Produs</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Preț mediu (lei/t)</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Tonaj livrat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pretMediuVanzare.map(item => (
                      <TableRow key={item.produs} className="hover:bg-muted/20">
                        <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.pret.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.tonaj.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CL4 - Comparativ prețuri */}
        <Card className="mt-4 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Preț mediu vs concurență / produs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Produs</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Preț mediu propriu (lei/t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Preț mediu concurență (lei/t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Diferență (lei/t)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pretComparativ.map(item => (
                    <TableRow key={item.produs} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{item.pretPropriu.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{item.pretConcurenta.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                          item.diferenta < 0 ? "text-green-600 bg-green-500/10" : "text-destructive bg-destructive/10"
                        )}>
                          {item.diferenta < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {item.diferenta > 0 ? "+" : ""}{item.diferenta}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune C - Flotă & livrări */}
      <div>
        <SectionHeader icon={Truck} title="Flotă & livrări" />

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Grad utilizare flotă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <p className="text-5xl font-bold tracking-tight">78.5%</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Grad utilizare</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +4.2% vs săptămâna anterioară
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Vehicule active</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Curse azi</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">1,850 t</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Tonaj livrat</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComercialLivrariSection;
