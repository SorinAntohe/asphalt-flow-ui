import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList
} from "recharts";
import { ShoppingCart, Users, Truck, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const funnelData = [
  { name: "Oferte noi", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Contracte noi", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Comenzi client", value: 22, fill: "hsl(var(--chart-3))" },
];

const tonajPerClient = [
  { client: "Strabag", tonaj: 2850 },
  { client: "Colas", tonaj: 2200 },
  { client: "Porr", tonaj: 1850 },
  { client: "Euroconst", tonaj: 1420 },
  { client: "Drumex", tonaj: 980 },
];

const pretMediuVanzare = [
  { produs: "BA 16", pret: 285, tonaj: 3200 },
  { produs: "BAD 22.4", pret: 310, tonaj: 2800 },
  { produs: "MASF 16", pret: 295, tonaj: 2100 },
  { produs: "AB 16", pret: 275, tonaj: 1850 },
  { produs: "BAR 16", pret: 265, tonaj: 1500 },
];

const pretComparativ = [
  { produs: "BA 16", pretPropriu: 285, pretConcurenta: 290, diferenta: -5 },
  { produs: "BAD 22.4", pretPropriu: 310, pretConcurenta: 305, diferenta: 5 },
  { produs: "MASF 16", pretPropriu: 295, pretConcurenta: 298, diferenta: -3 },
  { produs: "AB 16", pretPropriu: 275, pretConcurenta: 280, diferenta: -5 },
  { produs: "BAR 16", pretPropriu: 265, pretConcurenta: 262, diferenta: 3 },
];

const ComercialLivrariSection = () => {
  return (
    <div className="space-y-6">
      {/* Secțiune A - Funnel comercial */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Secțiune A – Funnel comercial
        </h3>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CL1 – Ofertă → Contract → Comandă client
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }} 
                    />
                    <Funnel
                      data={funnelData}
                      dataKey="value"
                      nameKey="name"
                      isAnimationActive
                    >
                      <LabelList position="right" fill="#888" stroke="none" dataKey="name" fontSize={11} />
                      <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">Rată conversie Oferte → Contracte</p>
                  <Badge variant="secondary" className="text-sm">62.2%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">Rată conversie Contracte → Comenzi</p>
                  <Badge variant="secondary" className="text-sm">78.6%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">Rată conversie totală</p>
                  <Badge className="text-sm">48.9%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Clienți & prețuri */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Secțiune B – Clienți & prețuri
        </h3>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* CL2 - Tonaj livrat pe client */}
          <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CL2 – Tonaj livrat pe client (Top 5)
            </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tonajPerClient} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="client" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }} 
                    />
                    <Bar dataKey="tonaj" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CL3 - Preț mediu de vânzare */}
          <Card>
            <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CL3 – Preț mediu de vânzare / produs
            </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Produs</TableHead>
                    <TableHead className="text-xs text-right">Preț mediu (lei/t)</TableHead>
                    <TableHead className="text-xs text-right">Tonaj livrat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pretMediuVanzare.map((item) => (
                    <TableRow key={item.produs}>
                      <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                      <TableCell className="text-xs text-right">{item.pret.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right">{item.tonaj.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* CL4 - Comparativ prețuri */}
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CL4 – Preț mediu vs concurență / produs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Produs</TableHead>
                  <TableHead className="text-xs text-right">Preț mediu propriu (lei/t)</TableHead>
                  <TableHead className="text-xs text-right">Preț mediu concurență (lei/t)</TableHead>
                  <TableHead className="text-xs text-right">Diferență (lei/t)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pretComparativ.map((item) => (
                  <TableRow key={item.produs}>
                    <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                    <TableCell className="text-xs text-right">{item.pretPropriu.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-right">{item.pretConcurenta.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className={cn(
                        "flex items-center justify-end gap-1 text-xs",
                        item.diferenta < 0 ? "text-green-600" : "text-destructive"
                      )}>
                        {item.diferenta < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                        {item.diferenta > 0 ? "+" : ""}{item.diferenta}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune C - Flotă & livrări */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4" />
          Secțiune C – Flotă & livrări
        </h3>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              CL5 – Grad utilizare flotă
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold">78.5%</p>
                <p className="text-sm text-muted-foreground mt-1">Grad utilizare</p>
                <div className="flex items-center justify-center gap-1 mt-2 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  +4.2% vs săptămâna anterioară
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xl font-semibold">12</p>
                  <p className="text-xs text-muted-foreground">Vehicule active</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xl font-semibold">48</p>
                  <p className="text-xs text-muted-foreground">Curse azi</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-xl font-semibold">1,850 t</p>
                  <p className="text-xs text-muted-foreground">Tonaj livrat</p>
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
