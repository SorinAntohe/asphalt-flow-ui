import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, Home, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const angajati = [
  { nume: "Ion Popescu", functie: "Operator stație", salariu: 5200, zileConcediu: 12 },
  { nume: "Vasile Georgescu", functie: "Operator stație", salariu: 5200, zileConcediu: 8 },
  { nume: "Andrei Marin", functie: "Șofer", salariu: 4800, zileConcediu: 15 },
  { nume: "Mihai Ionescu", functie: "Șef schimb", salariu: 6500, zileConcediu: 10 },
  { nume: "Dan Popa", functie: "Șef schimb", salariu: 6500, zileConcediu: 5 },
  { nume: "George Radu", functie: "Mecanic", salariu: 5500, zileConcediu: 18 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const HRAdminSection = () => {
  const totalAngajati = angajati.length;
  const totalSalariu = angajati.reduce((sum, a) => sum + a.salariu, 0);
  const totalZileConcediu = angajati.reduce((sum, a) => sum + a.zileConcediu, 0);

  // Mock cheltuieli fixe
  const cheltuieliChirii = 15000;
  const productieEstimata = 2450; // tone
  const costFixPerTon = ((totalSalariu + cheltuieliChirii) / productieEstimata).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Secțiune A - HR */}
      <div>
        <SectionHeader icon={Users} title="HR" />
        
        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          {/* HR1 - Număr angajați */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Număr angajați</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="relative inline-block">
                  <p className="text-5xl font-bold tracking-tight">{totalAngajati}</p>
                  <div className="absolute -top-1 -right-6 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">persoane</p>
                <p className="mt-3 text-xs text-muted-foreground">Fără modificări vs anterior</p>
              </div>
            </CardContent>
          </Card>

          {/* HR2 - Cost salarial lunar */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cost salarial lunar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold tracking-tight">{totalSalariu.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">lei</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5" />
                  Stabil vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR3 - Zile concediu rămase */}
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Zile concediu rămase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-5xl font-bold tracking-tight text-primary">{totalZileConcediu}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">zile total</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-primary font-semibold bg-primary/10 px-3 py-1.5 rounded-full">
                  <Calendar className="h-3.5 w-3.5" />
                  ~{Math.round(totalZileConcediu / totalAngajati)} zile/angajat
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel angajați */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Lista angajați</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Nume</TableHead>
                    <TableHead className="text-xs font-semibold">Funcție</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Salariu (lei)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Zile concediu rămase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {angajati.map((angajat, index) => (
                    <TableRow key={index} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center uppercase">
                            {angajat.nume.split(' ').map(n => n[0]).join('')}
                          </div>
                          {angajat.nume}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{angajat.functie}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums font-medium">{angajat.salariu.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant={angajat.zileConcediu > 10 ? "secondary" : "outline"} 
                          className={cn(
                            "text-xs font-semibold",
                            angajat.zileConcediu > 10 && "bg-primary/10 text-primary border-primary/20"
                          )}
                        >
                          {angajat.zileConcediu}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Cheltuieli fixe */}
      <div>
        <SectionHeader icon={Home} title="Cheltuieli fixe" />

        <div className="grid gap-4 lg:grid-cols-3">
          {/* HR4 - Cheltuieli chirii lunare */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cheltuieli chirii lunare</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold tracking-tight">{cheltuieliChirii.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">lei</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground font-medium bg-muted/50 px-3 py-1.5 rounded-full">
                  <Home className="h-3.5 w-3.5" />
                  Cost fix lunar
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR5 - Cost fix per ton */}
          <Card className="lg:col-span-2 border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Cost fix (salarii + chirii) / ton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-6">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                  <p className="text-4xl font-bold tracking-tight text-primary">{costFixPerTon}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">lei/t</p>
                </div>
                <div className="h-px sm:h-20 w-full sm:w-px bg-border/60" />
                <div className="space-y-3 text-sm w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-8 p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground font-medium">Salarii:</span>
                    <span className="font-bold tabular-nums">{totalSalariu.toLocaleString()} lei</span>
                  </div>
                  <div className="flex items-center justify-between gap-8 p-2 rounded-lg bg-muted/30">
                    <span className="text-muted-foreground font-medium">Chirii:</span>
                    <span className="font-bold tabular-nums">{cheltuieliChirii.toLocaleString()} lei</span>
                  </div>
                  <div className="flex items-center justify-between gap-8 pt-2 border-t border-border/50">
                    <span className="text-muted-foreground font-medium">Total fix:</span>
                    <span className="font-bold text-primary tabular-nums">{(totalSalariu + cheltuieliChirii).toLocaleString()} lei</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRAdminSection;
