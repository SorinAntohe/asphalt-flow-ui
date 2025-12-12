import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wrench, Zap, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const reviziiScadente = [
  { echipament: "Stație asfalt - Uscător", dataRevizie: "2024-02-15", costEstimat: 4500 },
  { echipament: "Încărcător frontal CAT 950", dataRevizie: "2024-02-18", costEstimat: 2800 },
  { echipament: "Camion MAN TGS 8x4", dataRevizie: "2024-02-22", costEstimat: 1950 },
  { echipament: "Generator Diesel 250kVA", dataRevizie: "2024-02-28", costEstimat: 1200 }
];

const costUtilitatiZilnic = [
  { zi: "Lun", cost: 12.5 },
  { zi: "Mar", cost: 11.8 },
  { zi: "Mie", cost: 13.2 },
  { zi: "Joi", cost: 12.1 },
  { zi: "Vin", cost: 11.5 },
  { zi: "Sam", cost: 14.8 },
  { zi: "Dum", cost: 0 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const MentenantaUtilitatiSection = () => {
  const totalCostRevizii = reviziiScadente.reduce((sum, item) => sum + item.costEstimat, 0);

  return (
    <div className="space-y-8">
      {/* Secțiune A - Mentenanță planificată */}
      <div>
        <SectionHeader icon={Wrench} title="Mentenanță planificată" />
        
        <div className="grid gap-4 lg:grid-cols-2 mb-4">
          {/* MU1 - Revizii scadente */}
          <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Revizii scadente în 30 zile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold text-yellow-600 tracking-tight">{reviziiScadente.length}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">revizii programate</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-yellow-600 font-semibold bg-yellow-500/10 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  Prima revizie: 15 Feb
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MU2 - Cost estimat revizii */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cost estimat revizii 30 zile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold tracking-tight">{totalCostRevizii.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">lei</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5" />
                  -8% vs luna anterioară
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel revizii */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Detalii revizii scadente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Echipament</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Data următoarei revizii</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Cost estimat (lei)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviziiScadente.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">{item.echipament}</TableCell>
                      <TableCell className="text-xs text-center">
                        <Badge variant="outline" className="text-xs font-medium">
                          {new Date(item.dataRevizie).toLocaleDateString('ro-RO')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-right tabular-nums font-medium">{item.costEstimat.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Utilități */}
      <div>
        <SectionHeader icon={Zap} title="Utilități" />

        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          {/* MU3 - Consum energie electrică */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Consum total energie electrică</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold tracking-tight">48,250</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">kWh</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5" />
                  -2.5% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MU4 - Consum CTL */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Consum CTL & cost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-6">
                  <div>
                    <p className="text-3xl font-bold tracking-tight">12,500</p>
                    <p className="text-xs text-muted-foreground font-medium">L</p>
                  </div>
                  <div className="h-10 w-px bg-border/60" />
                  <div>
                    <p className="text-3xl font-bold tracking-tight">85,000</p>
                    <p className="text-xs text-muted-foreground font-medium">lei</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 mt-4 text-xs text-destructive font-semibold bg-destructive/10 px-3 py-1.5 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +5.2% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost mediu utilități per ton */}
          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-green-500/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cost mediu utilități / ton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold tracking-tight text-green-600">12.8</p>
                <p className="text-sm text-muted-foreground mt-1 font-medium">lei/t</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5" />
                  -1.2% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MU5 - Grafic cost utilități */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Cost utilități per ton produs (lei/t)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costUtilitatiZilnic} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MentenantaUtilitatiSection;
