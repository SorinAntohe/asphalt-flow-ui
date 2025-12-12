import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Factory, Zap, Fuel, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data pentru grafice
const productiePerProdus = [{
  produs: "BA 16",
  tonaj: 3200
}, {
  produs: "BAD 22.4",
  tonaj: 2800
}, {
  produs: "MASF 16",
  tonaj: 2100
}, {
  produs: "AB 16",
  tonaj: 1850
}, {
  produs: "BAR 16",
  tonaj: 1500
}];
const ordineProductie = [{
  cod: "OP-2024-156",
  produse: "BA 16, BAD 22.4",
  planificat: 450,
  realizat: 485,
  operator: "Ion Popescu",
  sef: "Mihai Ionescu"
}, {
  cod: "OP-2024-157",
  produse: "MASF 16",
  planificat: 320,
  realizat: 298,
  operator: "Vasile Georgescu",
  sef: "Mihai Ionescu"
}, {
  cod: "OP-2024-158",
  produse: "AB 16",
  planificat: 280,
  realizat: 280,
  operator: "Andrei Marin",
  sef: "Dan Popa"
}, {
  cod: "OP-2024-159",
  produse: "BAR 16",
  planificat: 200,
  realizat: 178,
  operator: "Ion Popescu",
  sef: "Dan Popa"
}];
const temperaturaPerProdus = [{
  produs: "BA 16",
  temperatura: 165
}, {
  produs: "BAD 22.4",
  temperatura: 168
}, {
  produs: "MASF 16",
  temperatura: 162
}, {
  produs: "AB 16",
  temperatura: 170
}, {
  produs: "BAR 16",
  temperatura: 167
}];
const marshallPerProdus = [{
  produs: "BA 16",
  marshall: 12.5
}, {
  produs: "BAD 22.4",
  marshall: 11.8
}, {
  produs: "MASF 16",
  marshall: 13.2
}, {
  produs: "AB 16",
  marshall: 12.1
}, {
  produs: "BAR 16",
  marshall: 11.5
}];
const consumEnergieZilnic = [{
  zi: "Lun",
  kwh: 8.2
}, {
  zi: "Mar",
  kwh: 7.9
}, {
  zi: "Mie",
  kwh: 8.5
}, {
  zi: "Joi",
  kwh: 8.1
}, {
  zi: "Vin",
  kwh: 7.8
}, {
  zi: "Sam",
  kwh: 9.2
}, {
  zi: "Dum",
  kwh: 0
}];
const consumCTLZilnic = [{
  zi: "Lun",
  litri: 4.2
}, {
  zi: "Mar",
  litri: 4.0
}, {
  zi: "Mie",
  litri: 4.5
}, {
  zi: "Joi",
  litri: 4.1
}, {
  zi: "Vin",
  litri: 3.9
}, {
  zi: "Sam",
  litri: 4.8
}, {
  zi: "Dum",
  litri: 0
}];
const ProductieCalitateSection = () => {
  const getRealizePercent = (planificat: number, realizat: number) => {
    return (realizat / planificat * 100).toFixed(1);
  };
  const getRealizeBadgeVariant = (percent: number) => {
    if (percent >= 100) return "default";
    if (percent >= 90) return "secondary";
    return "destructive";
  };
  return <div className="space-y-6">
      {/* Secțiune A - Producție */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Factory className="h-4 w-4" />
            Producție
        </h3>
        
        <div className="grid gap-4 lg:grid-cols-2">
          {/* PC1 - Grafic bară producție pe produs */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Producție pe produs (t)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productiePerProdus}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="produs" tick={{
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
                    <Bar dataKey="tonaj" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC3 - Card KPI Consum specific */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Consum specific materie primă
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-[200px]">
                <div className="text-center">
                  <p className="text-5xl font-bold">1,012</p>
                  <p className="text-lg text-muted-foreground mt-1">kg/t</p>
                  <div className="flex items-center justify-center gap-1 mt-2 text-sm text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    -0.8% vs target (1,020 kg/t)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PC2 - Tabel Plan vs Realizat */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                 Plan vs realizat pe ordin de producție
              </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Cod ordin</TableHead>
                  <TableHead className="text-xs">Produs(e)</TableHead>
                  <TableHead className="text-xs text-right">Planificat (t)</TableHead>
                  <TableHead className="text-xs text-right">Realizat (t)</TableHead>
                  <TableHead className="text-xs text-right">Realizare</TableHead>
                  <TableHead className="text-xs">Operator</TableHead>
                  <TableHead className="text-xs">Șef schimb</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ordineProductie.map(ordin => {
                const percent = parseFloat(getRealizePercent(ordin.planificat, ordin.realizat));
                return <TableRow key={ordin.cod}>
                      <TableCell className="text-xs font-mono">{ordin.cod}</TableCell>
                      <TableCell className="text-xs">{ordin.produse}</TableCell>
                      <TableCell className="text-xs text-right">{ordin.planificat.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right">{ordin.realizat.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getRealizeBadgeVariant(percent)} className="text-xs">
                          {percent}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{ordin.operator}</TableCell>
                      <TableCell className="text-xs">{ordin.sef}</TableCell>
                    </TableRow>;
              })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Calitate */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Secțiune B – Calitate
        </h3>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* PC4 - Temperatură medie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                 Temperatură medie la încărcare pe produs (°C)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={temperaturaPerProdus}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="produs" tick={{
                    fontSize: 11
                  }} />
                    <YAxis domain={[150, 180]} tick={{
                    fontSize: 11
                  }} />
                    <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} />
                    <Line type="monotone" dataKey="temperatura" stroke="hsl(var(--primary))" strokeWidth={2} dot={{
                    fill: 'hsl(var(--primary))'
                  }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC5 - Marshall mediu */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                
Marshall mediu pe produs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marshallPerProdus}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="produs" tick={{
                    fontSize: 11
                  }} />
                    <YAxis domain={[10, 15]} tick={{
                    fontSize: 11
                  }} />
                    <Tooltip contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} />
                    <Bar dataKey="marshall" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC6 - Consum energie */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Consum energie electrică per ton (kWh/t)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumEnergieZilnic}>
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
                    <Line type="monotone" dataKey="kwh" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{
                    fill: 'hsl(var(--chart-3))'
                  }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* PC7 - Consum CTL */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Consum CTL per ton (L/t)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumCTLZilnic}>
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
                    <Line type="monotone" dataKey="litri" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={{
                    fill: 'hsl(var(--chart-4))'
                  }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default ProductieCalitateSection;