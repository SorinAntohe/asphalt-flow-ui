import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, Home, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const angajati = [{
  nume: "Ion Popescu",
  functie: "Operator stație",
  salariu: 5200,
  zileConcediu: 12
}, {
  nume: "Vasile Georgescu",
  functie: "Operator stație",
  salariu: 5200,
  zileConcediu: 8
}, {
  nume: "Andrei Marin",
  functie: "Șofer",
  salariu: 4800,
  zileConcediu: 15
}, {
  nume: "Mihai Ionescu",
  functie: "Șef schimb",
  salariu: 6500,
  zileConcediu: 10
}, {
  nume: "Dan Popa",
  functie: "Șef schimb",
  salariu: 6500,
  zileConcediu: 5
}, {
  nume: "George Radu",
  functie: "Mecanic",
  salariu: 5500,
  zileConcediu: 18
}];
const HRAdminSection = () => {
  const totalAngajati = angajati.length;
  const totalSalariu = angajati.reduce((sum, a) => sum + a.salariu, 0);
  const totalZileConcediu = angajati.reduce((sum, a) => sum + a.zileConcediu, 0);

  // Mock cheltuieli fixe
  const cheltuieliChirii = 15000;
  const productieEstimata = 2450; // tone
  const costFixPerTon = ((totalSalariu + cheltuieliChirii) / productieEstimata).toFixed(2);
  return <div className="space-y-6">
      {/* Secțiune A - HR */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          

HR
        </h3>
        
        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          {/* HR1 - Număr angajați */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Număr angajați
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{totalAngajati}</p>
                <p className="text-sm text-muted-foreground mt-1">persoane</p>
                <p className="mt-2 text-xs text-muted-foreground">Fără modificări vs anterior</p>
              </div>
            </CardContent>
          </Card>

          {/* HR2 - Cost salarial lunar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Cost salarial lunar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{totalSalariu.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">lei</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  Stabil vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR3 - Zile concediu rămase */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Zile concediu rămase
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{totalZileConcediu}</p>
                <p className="text-sm text-muted-foreground mt-1">zile total</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  ~{Math.round(totalZileConcediu / totalAngajati)} zile/angajat
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel angajați */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Lista angajați</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Nume</TableHead>
                  <TableHead className="text-xs">Funcție</TableHead>
                  <TableHead className="text-xs text-right">Salariu (lei)</TableHead>
                  <TableHead className="text-xs text-right">Zile concediu rămase</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {angajati.map((angajat, index) => <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{angajat.nume}</TableCell>
                    <TableCell className="text-xs">{angajat.functie}</TableCell>
                    <TableCell className="text-xs text-right">{angajat.salariu.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">
                      <Badge variant={angajat.zileConcediu > 10 ? "secondary" : "outline"} className="text-xs">
                        {angajat.zileConcediu}
                      </Badge>
                    </TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Cheltuieli fixe */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Home className="h-4 w-4" />
          Cheltuieli fixe
        </h3>

        <div className="grid gap-4 lg:grid-cols-3">
          {/* HR4 - Cheltuieli chirii lunare */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Cheltuieli chirii lunare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{cheltuieliChirii.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">lei</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Home className="h-3 w-3" />
                  Cost fix lunar
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HR5 - Cost fix per ton */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                HR5 – Cost fix (salarii + chirii) / ton
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-around py-4">
                <div className="text-center">
                  <p className="text-4xl font-bold">{costFixPerTon}</p>
                  <p className="text-sm text-muted-foreground mt-1">lei/t</p>
                </div>
                <div className="h-16 w-px bg-border" />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-muted-foreground">Salarii:</span>
                    <span className="font-medium">{totalSalariu.toLocaleString()} lei</span>
                  </div>
                  <div className="flex items-center justify-between gap-8">
                    <span className="text-muted-foreground">Chirii:</span>
                    <span className="font-medium">{cheltuieliChirii.toLocaleString()} lei</span>
                  </div>
                  <div className="flex items-center justify-between gap-8 pt-2 border-t">
                    <span className="text-muted-foreground">Total fix:</span>
                    <span className="font-bold">{(totalSalariu + cheltuieliChirii).toLocaleString()} lei</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default HRAdminSection;