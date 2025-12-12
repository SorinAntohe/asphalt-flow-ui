import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, AlertTriangle, TrendingUp, TrendingDown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const topFurnizori = [
  { furnizor: "Holcim Romania", valoare: 285000, receptii: 42 },
  { furnizor: "Lafarge", valoare: 198000, receptii: 35 },
  { furnizor: "CRH Ciment", valoare: 156000, receptii: 28 },
  { furnizor: "Carpatcement", valoare: 124000, receptii: 22 },
  { furnizor: "OMV Petrom", valoare: 98000, receptii: 18 }
];

const pretMediuAchizitie = [
  { material: "Bitum 50/70", pret: 3250, volum: 180 },
  { material: "0/4 NAT", pret: 45, volum: 2500 },
  { material: "4/8 CONC", pret: 52, volum: 1800 },
  { material: "Filler", pret: 280, volum: 420 },
  { material: "CTL", pret: 6.80, volum: 12000 }
];

const stocCurent = [
  { material: "Bitum 50/70", stoc: 45, acoperire: 12, status: "OK" },
  { material: "0/4 NAT", stoc: 850, acoperire: 8, status: "OK" },
  { material: "4/8 CONC", stoc: 120, acoperire: 3, status: "Critic" },
  { material: "Filler", stoc: 85, acoperire: 15, status: "OK" },
  { material: "CTL", stoc: 2500, acoperire: 5, status: "Critic" },
  { material: "8/16 CRIBLURI", stoc: 320, acoperire: 7, status: "OK" }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const StatCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendLabel,
  variant = "default" 
}: { 
  title: string; 
  value: string | number; 
  unit: string; 
  trend?: { value: number; isPositive: boolean };
  trendLabel?: string;
  variant?: "default" | "warning" | "success";
}) => (
  <Card className={cn(
    "border-border/50 shadow-sm hover:shadow-md transition-all",
    variant === "warning" && "border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10"
  )}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-center py-3">
        <p className={cn(
          "text-4xl font-bold tracking-tight",
          variant === "warning" && "text-yellow-600"
        )}>{value}</p>
        <p className="text-sm text-muted-foreground mt-1 font-medium">{unit}</p>
        {trend && (
          <div className={cn(
            "inline-flex items-center gap-1.5 mt-3 text-xs font-semibold px-3 py-1.5 rounded-full",
            trend.isPositive ? "text-green-600 bg-green-500/10" : "text-destructive bg-destructive/10"
          )}>
            {trend.isPositive ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {trendLabel}
          </div>
        )}
        {!trend && trendLabel && (
          <p className="mt-2 text-xs text-muted-foreground">{trendLabel}</p>
        )}
      </div>
    </CardContent>
  </Card>
);

const AprovizionareStocuriSection = () => {
  return (
    <div className="space-y-8">
      {/* Secțiune A - Financiar aprovizionare */}
      <div>
        <SectionHeader icon={DollarSign} title="Financiar aprovizionare" />
        
        <div className="grid gap-4 lg:grid-cols-3">
          <StatCard
            title="Valoare totală achiziții"
            value="861,000"
            unit="lei"
            trend={{ value: 3.2, isPositive: true }}
            trendLabel="-3.2% vs luna anterioară"
          />
          <StatCard
            title="Recepții cu diferențe"
            value="8"
            unit="nr recepții"
            trendLabel="din 145 total (5.5%)"
            variant="warning"
          />
          <StatCard
            title="Valoare comenzi materiale"
            value="128,500"
            unit="lei (perioadă selectată)"
            trend={{ value: 12, isPositive: false }}
            trendLabel="+12% vs anterior"
          />
        </div>

        {/* AS2 - Top furnizori */}
        <Card className="mt-4 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Top furnizori după valoare achiziții</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Furnizor</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Valoare totală (lei)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Nr recepții</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topFurnizori.map((item, index) => (
                    <TableRow key={item.furnizor} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">
                        <div className="flex items-center gap-2">
                          <span className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          {item.furnizor}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-right tabular-nums font-medium">{item.valoare.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{item.receptii}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Prețuri & stocuri */}
      <div>
        <SectionHeader icon={Package} title="Prețuri & stocuri" />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* AS3 - Preț mediu achiziție */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Preț mediu achiziție / material</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold">Material</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Preț mediu (lei/u)</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Volum cumpărat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pretMediuAchizitie.map(item => (
                      <TableRow key={item.material} className="hover:bg-muted/20">
                        <TableCell className="text-xs font-medium">{item.material}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.pret.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.volum.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* AS4 - Stoc curent & zile acoperire */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Stoc curent & zile de acoperire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold">Material</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Stoc (t)</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Zile acoperire</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stocCurent.map(item => (
                      <TableRow key={item.material} className="hover:bg-muted/20">
                        <TableCell className="text-xs font-medium">{item.material}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.stoc.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.acoperire}</TableCell>
                        <TableCell className="text-center">
                          {item.status === "OK" ? (
                            <Badge variant="outline" className="text-[10px] gap-1 text-green-600 border-green-500/30 bg-green-500/5">
                              <CheckCircle className="h-3 w-3" />
                              OK
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px] gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Critic
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AprovizionareStocuriSection;
