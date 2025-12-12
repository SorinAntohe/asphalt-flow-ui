import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Wrench, Zap, Fuel, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const reviziiScadente = [{
  echipament: "Stație asfalt - Uscător",
  dataRevizie: "2024-02-15",
  costEstimat: 4500
}, {
  echipament: "Încărcător frontal CAT 950",
  dataRevizie: "2024-02-18",
  costEstimat: 2800
}, {
  echipament: "Camion MAN TGS 8x4",
  dataRevizie: "2024-02-22",
  costEstimat: 1950
}, {
  echipament: "Generator Diesel 250kVA",
  dataRevizie: "2024-02-28",
  costEstimat: 1200
}];
const costUtilitatiZilnic = [{
  zi: "Lun",
  cost: 12.5
}, {
  zi: "Mar",
  cost: 11.8
}, {
  zi: "Mie",
  cost: 13.2
}, {
  zi: "Joi",
  cost: 12.1
}, {
  zi: "Vin",
  cost: 11.5
}, {
  zi: "Sam",
  cost: 14.8
}, {
  zi: "Dum",
  cost: 0
}];
const MentenantaUtilitatiSection = () => {
  const totalCostRevizii = reviziiScadente.reduce((sum, item) => sum + item.costEstimat, 0);
  return <div className="space-y-6">
      {/* Secțiune A - Mentenanță planificată */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Wrench className="h-4 w-4" />
          Mentenanță planificată
        </h3>
        
        <div className="grid gap-4 lg:grid-cols-2 mb-4">
          {/* MU1 - Revizii scadente */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Revizii scadente în 30 zile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-yellow-600">{reviziiScadente.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Cost estimat revizii 30 zile</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  Prima revizie: 15 Feb
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MU2 - Cost estimat revizii */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Cost estimat revizii 30 zile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-4xl font-bold">{totalCostRevizii.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">lei</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  -8% vs luna anterioară
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabel revizii */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Detalii revizii scadente</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Echipament</TableHead>
                  <TableHead className="text-xs text-center">Data următoarei revizii</TableHead>
                  <TableHead className="text-xs text-right">Cost estimat (lei)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reviziiScadente.map((item, index) => <TableRow key={index}>
                    <TableCell className="text-xs font-medium">{item.echipament}</TableCell>
                    <TableCell className="text-xs text-center">
                      <Badge variant="outline" className="text-xs">
                        {new Date(item.dataRevizie).toLocaleDateString('ro-RO')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-right">{item.costEstimat.toLocaleString()}</TableCell>
                  </TableRow>)}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Utilități */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Utilități
        </h3>

        <div className="grid gap-4 lg:grid-cols-3 mb-4">
          {/* MU3 - Consum energie electrică */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Consum total energie electrică
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold">48,250</p>
                <p className="text-sm text-muted-foreground mt-1">kWh</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  -2.5% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* MU4 - Consum CTL */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Consum CTL & cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="flex items-center justify-center gap-4">
                  <div>
                    <p className="text-2xl font-bold">12,500</p>
                    <p className="text-xs text-muted-foreground">L</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-2xl font-bold">85,000</p>
                    <p className="text-xs text-muted-foreground">lei</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-1 mt-3 text-xs text-destructive">
                  <TrendingUp className="h-3 w-3" />
                  +5.2% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost mediu utilități per ton */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Cost mediu utilități / ton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold">12.8</p>
                <p className="text-sm text-muted-foreground mt-1">lei/t</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingDown className="h-3 w-3" />
                  -1.2% vs anterior
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MU5 - Grafic cost utilități */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Cost utilități per ton produs (lei/t)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costUtilitatiZilnic}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="zi" tick={{
                  fontSize: 11
                }} />
                  <YAxis tick={{
                  fontSize: 11
                }} />
                  <Tooltip contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }} />
                  <Line type="monotone" dataKey="cost" stroke="hsl(var(--primary))" strokeWidth={2} dot={{
                  fill: 'hsl(var(--primary))'
                }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default MentenantaUtilitatiSection;