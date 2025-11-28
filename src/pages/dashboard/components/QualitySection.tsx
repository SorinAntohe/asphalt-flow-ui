import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle, FlaskConical, Thermometer, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface QualityTest {
  id: string;
  data: string;
  produs: string;
  reteta: string;
  santier: string;
  rezultat: string;
  verdict: "OK" | "Atenție" | "Respins";
}

const tests: QualityTest[] = [
  { id: "1", data: "28/11/2024 14:30", produs: "Asfalt BA16", reteta: "R-156", santier: "DN1 km 45", rezultat: "Conform", verdict: "OK" },
  { id: "2", data: "28/11/2024 13:15", produs: "Beton C25/30", reteta: "B-089", santier: "Bloc A5", rezultat: "Slump 22cm (limită: 18-22)", verdict: "Atenție" },
  { id: "3", data: "28/11/2024 11:45", produs: "Asfalt MASF16", reteta: "R-201", santier: "Autostradă A3", rezultat: "Temp. 158°C", verdict: "OK" },
  { id: "4", data: "28/11/2024 10:20", produs: "Beton C30/37", reteta: "B-112", santier: "Pod CF", rezultat: "Neconform - aer antrenat", verdict: "Respins" },
  { id: "5", data: "28/11/2024 09:00", produs: "Asfalt BA8", reteta: "R-078", santier: "Parcare Mall", rezultat: "Conform", verdict: "OK" },
];

interface QualityAlert {
  id: string;
  type: "warning" | "error";
  message: string;
  time: string;
}

const alerts: QualityAlert[] = [
  { id: "1", type: "warning", message: "Umiditate agregate peste limită la recepția #1245", time: "Acum 15 min" },
  { id: "2", type: "error", message: "Lot #B-112 blocat - aer antrenat sub limită", time: "Acum 45 min" },
  { id: "3", type: "warning", message: "Temperatură bitum aproape de limita inferioară (152°C)", time: "Acum 1h" },
];

const QualitySection = () => {
  const verdictConfig = {
    OK: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10 border-green-500/30" },
    "Atenție": { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-500/10 border-yellow-500/30" },
    Respins: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10 border-destructive/30" },
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FlaskConical className="h-5 w-5 text-primary" />
        Calitate & Verificări
      </h3>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* KPI Cards */}
        <div className="lg:col-span-2 grid gap-4 grid-cols-2 sm:grid-cols-4">
          <Card className="bg-green-500/5 border-green-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">92%</div>
                <div className="text-sm text-muted-foreground mt-1">Loturi conforme</div>
                <div className="text-xs text-muted-foreground">Azi</div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/5 border-destructive/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive">2</div>
                <div className="text-sm text-muted-foreground mt-1">Loturi blocate</div>
                <div className="text-xs text-muted-foreground">Azi</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">-0.3%</div>
                <div className="text-sm text-muted-foreground mt-1">Abatere bitum</div>
                <div className="text-xs text-muted-foreground">vs rețetă</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">163°C</div>
                <div className="text-sm text-muted-foreground mt-1">Temp. medie</div>
                <div className="text-xs text-muted-foreground">descărcare</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quality Alerts */}
        <Card className="border-yellow-500/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              Alerte Calitate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-3 rounded-lg border text-sm",
                    alert.type === "warning" && "bg-yellow-500/5 border-yellow-500/20",
                    alert.type === "error" && "bg-destructive/5 border-destructive/20"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "h-4 w-4 mt-0.5 flex-shrink-0",
                        alert.type === "warning" && "text-yellow-600",
                        alert.type === "error" && "text-destructive"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ultimele Teste de Laborator</CardTitle>
          <CardDescription>Rezultatele testărilor recente</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Produs</TableHead>
                <TableHead>Rețetă</TableHead>
                <TableHead>Șantier</TableHead>
                <TableHead>Rezultat</TableHead>
                <TableHead>Verdict</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map((test) => {
                const config = verdictConfig[test.verdict];
                const Icon = config.icon;
                return (
                  <TableRow key={test.id}>
                    <TableCell className="text-sm">{test.data}</TableCell>
                    <TableCell className="font-medium">{test.produs}</TableCell>
                    <TableCell>{test.reteta}</TableCell>
                    <TableCell>{test.santier}</TableCell>
                    <TableCell className="text-sm">{test.rezultat}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs gap-1", config.bg, config.color)}>
                        <Icon className="h-3 w-3" />
                        {test.verdict}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualitySection;
