import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Package, AlertTriangle, TrendingUp, TrendingDown, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const topFurnizori = [{
  furnizor: "Holcim Romania",
  valoare: 285000,
  receptii: 42
}, {
  furnizor: "Lafarge",
  valoare: 198000,
  receptii: 35
}, {
  furnizor: "CRH Ciment",
  valoare: 156000,
  receptii: 28
}, {
  furnizor: "Carpatcement",
  valoare: 124000,
  receptii: 22
}, {
  furnizor: "OMV Petrom",
  valoare: 98000,
  receptii: 18
}];
const pretMediuAchizitie = [{
  material: "Bitum 50/70",
  pret: 3250,
  volum: 180
}, {
  material: "0/4 NAT",
  pret: 45,
  volum: 2500
}, {
  material: "4/8 CONC",
  pret: 52,
  volum: 1800
}, {
  material: "Filler",
  pret: 280,
  volum: 420
}, {
  material: "CTL",
  pret: 6.80,
  volum: 12000
}];
const stocCurent = [{
  material: "Bitum 50/70",
  stoc: 45,
  acoperire: 12,
  status: "OK"
}, {
  material: "0/4 NAT",
  stoc: 850,
  acoperire: 8,
  status: "OK"
}, {
  material: "4/8 CONC",
  stoc: 120,
  acoperire: 3,
  status: "Critic"
}, {
  material: "Filler",
  stoc: 85,
  acoperire: 15,
  status: "OK"
}, {
  material: "CTL",
  stoc: 2500,
  acoperire: 5,
  status: "Critic"
}, {
  material: "8/16 CRIBLURI",
  stoc: 320,
  acoperire: 7,
  status: "OK"
}];
const AprovizionareStocuriSection = () => {
  return <div className="space-y-6">
      {/* Secțiune A - Financiar aprovizionare */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financiar aprovizionare
        </h3>
        
        <div className="grid gap-4 lg:grid-cols-3">
          {/* AS1 - Valoare totală achiziții */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                AS1 – Valoare totală achiziții
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold">861,000</p>
                <p className="text-sm text-muted-foreground mt-1">lei</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  -3.2% vs luna anterioară
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AS5 - Recepții cu diferențe */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                AS5 – Recepții cu diferențe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-yellow-600">8</p>
                <p className="text-sm text-muted-foreground mt-1">nr recepții</p>
                <p className="mt-2 text-xs text-muted-foreground">din 145 total (5.5%)</p>
              </div>
            </CardContent>
          </Card>

          {/* AS6 - Valoare comenzi materiale */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                AS6 – Valoare comenzi materiale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold">128,500</p>
                <p className="text-sm text-muted-foreground mt-1">lei (perioadă selectată)</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AS2 - Top furnizori */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              AS2 – Top furnizori după valoare achiziții
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Furnizor</TableHead>
                  <TableHead className="text-xs text-right">Valoare totală (lei)</TableHead>
                  <TableHead className="text-xs text-right">Nr recepții</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topFurnizori.map(item => <TableRow key={item.furnizor}>
                    <TableCell className="text-xs font-medium">{item.furnizor}</TableCell>
                    <TableCell className="text-xs text-right">{item.valoare.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">{item.receptii}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Prețuri & stocuri */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Secțiune B – Prețuri & stocuri
        </h3>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* AS3 - Preț mediu achiziție */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                AS3 – Preț mediu achiziție / material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Material</TableHead>
                    <TableHead className="text-xs text-right">Preț mediu (lei/u)</TableHead>
                    <TableHead className="text-xs text-right">Volum cumpărat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pretMediuAchizitie.map(item => <TableRow key={item.material}>
                      <TableCell className="text-xs font-medium">{item.material}</TableCell>
                      <TableCell className="text-xs text-right">{item.pret.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right">{item.volum.toLocaleString()}</TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* AS4 - Stoc curent & zile acoperire */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                AS4 – Stoc curent & zile de acoperire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Material</TableHead>
                    <TableHead className="text-xs text-right">Stoc (t)</TableHead>
                    <TableHead className="text-xs text-right">Zile acoperire</TableHead>
                    <TableHead className="text-xs text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocCurent.map(item => <TableRow key={item.material}>
                      <TableCell className="text-xs font-medium">{item.material}</TableCell>
                      <TableCell className="text-xs text-right">{item.stoc.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right">{item.acoperire}</TableCell>
                      <TableCell className="text-center">
                        {item.status === "OK" ? <Badge variant="outline" className="text-xs gap-1 text-green-600 border-green-600/30">
                            <CheckCircle className="h-3 w-3" />
                            OK
                          </Badge> : <Badge variant="destructive" className="text-xs gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Critic
                          </Badge>}
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default AprovizionareStocuriSection;