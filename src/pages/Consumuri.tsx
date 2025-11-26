import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Consumuri = () => {
  const consumuri = [
    {
      data: "20.11.2024",
      produs: "Bitum rutier",
      cantitate: "12t",
      sectie: "Producție A",
      operator: "Mihai Georgescu",
    },
    {
      data: "20.11.2024",
      produs: "Agregate minerale",
      cantitate: "85t",
      sectie: "Producție B",
      operator: "Ana Popescu",
    },
    {
      data: "19.11.2024",
      produs: "Aditivi",
      cantitate: "150kg",
      sectie: "Producție A",
      operator: "Ion Marinescu",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consumuri</h1>
          <p className="text-muted-foreground mt-2">
            Monitorizare consum materii prime în producție
          </p>
        </div>
        <Button className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Raport Consum
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consum Lunar</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">850t</div>
            <p className="text-xs text-muted-foreground">
              Materii prime
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consum Astăzi</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97t</div>
            <p className="text-xs text-green-600">
              -5% față de medie
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiență</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-green-600">
              +2.1% față de luna trecută
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Consum pe Produse</CardTitle>
          <CardDescription>
            Distribuție consum materii prime ultimele 7 zile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Bitum rutier</span>
                <span className="font-medium">156t (40%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "40%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Agregate minerale</span>
                <span className="font-medium">234t (35%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-2" style={{ width: "35%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Aditivi speciali</span>
                <span className="font-medium">89t (15%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-3" style={{ width: "15%" }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Alte materiale</span>
                <span className="font-medium">67t (10%)</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-chart-4" style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Istoric Consumuri</CardTitle>
          <CardDescription>
            Înregistrări recente de consum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produs</TableHead>
                <TableHead>Cantitate</TableHead>
                <TableHead>Secție</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumuri.map((consum, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{consum.data}</TableCell>
                  <TableCell>{consum.produs}</TableCell>
                  <TableCell>{consum.cantitate}</TableCell>
                  <TableCell>{consum.sectie}</TableCell>
                  <TableCell>{consum.operator}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Detalii
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consumuri;
