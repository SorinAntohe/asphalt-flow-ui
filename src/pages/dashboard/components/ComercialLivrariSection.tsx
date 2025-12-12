import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, LabelList, Cell } from "recharts";
import { ShoppingCart, Users, Truck, TrendingUp, TrendingDown, MousePointerClick } from "lucide-react";
import { cn } from "@/lib/utils";
import DrillDownDialog from "./DrillDownDialog";

// Mock data
const funnelData = [
  { name: "Oferte noi", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Contracte noi", value: 28, fill: "hsl(var(--chart-2))" },
  { name: "Comenzi client", value: 22, fill: "hsl(var(--chart-3))" }
];

// Drill-down data pentru funnel
const funnelDetails: Record<string, any[]> = {
  "Oferte noi": [
    { client: "Strabag", valoare: 285000, produs: "BA 16", status: "În așteptare" },
    { client: "Colas", valoare: 198000, produs: "BAD 22.4", status: "În negociere" },
    { client: "Porr", valoare: 156000, produs: "MASF 16", status: "În așteptare" },
    { client: "Euroconst", valoare: 124000, produs: "AB 16", status: "În negociere" },
    { client: "Drumex", valoare: 98000, produs: "BAR 16", status: "În așteptare" }
  ],
  "Contracte noi": [
    { client: "Strabag", valoare: 285000, produs: "BA 16", data_semnare: "05/12/2024" },
    { client: "Colas", valoare: 198000, produs: "BAD 22.4", data_semnare: "08/12/2024" },
    { client: "Porr", valoare: 156000, produs: "MASF 16", data_semnare: "10/12/2024" }
  ],
  "Comenzi client": [
    { client: "Strabag", cantitate: 850, produs: "BA 16", data_livrare: "15/12/2024" },
    { client: "Colas", cantitate: 620, produs: "BAD 22.4", data_livrare: "16/12/2024" }
  ]
};

const tonajPerClient = [
  { client: "Strabag", tonaj: 2850 },
  { client: "Colas", tonaj: 2200 },
  { client: "Porr", tonaj: 1850 },
  { client: "Euroconst", tonaj: 1420 },
  { client: "Drumex", tonaj: 980 }
];

// Drill-down data pentru clienți
const clientDetails: Record<string, any[]> = {
  "Strabag": [
    { data: "05/12/2024", produs: "BA 16", cantitate: 450, destinatie: "Șantier A1" },
    { data: "08/12/2024", produs: "BAD 22.4", cantitate: 620, destinatie: "Șantier A3" },
    { data: "10/12/2024", produs: "BA 16", cantitate: 780, destinatie: "Șantier A1" },
    { data: "12/12/2024", produs: "MASF 16", cantitate: 1000, destinatie: "Șantier DN7" }
  ],
  "Colas": [
    { data: "06/12/2024", produs: "BAD 22.4", cantitate: 520, destinatie: "Proiect Metro" },
    { data: "09/12/2024", produs: "BA 16", cantitate: 680, destinatie: "Proiect Metro" },
    { data: "11/12/2024", produs: "MASF 16", cantitate: 1000, destinatie: "Proiect DN1" }
  ],
  "Porr": [
    { data: "07/12/2024", produs: "AB 16", cantitate: 450, destinatie: "Centură București" },
    { data: "10/12/2024", produs: "BA 16", cantitate: 650, destinatie: "Centură București" },
    { data: "12/12/2024", produs: "BAR 16", cantitate: 750, destinatie: "Pasaj Pipera" }
  ],
  "Euroconst": [
    { data: "08/12/2024", produs: "BA 16", cantitate: 420, destinatie: "Parcare Mall" },
    { data: "11/12/2024", produs: "BAD 22.4", cantitate: 500, destinatie: "Parcare Mall" },
    { data: "12/12/2024", produs: "MASF 16", cantitate: 500, destinatie: "Drum acces" }
  ],
  "Drumex": [
    { data: "09/12/2024", produs: "BAR 16", cantitate: 380, destinatie: "Drum comunal" },
    { data: "12/12/2024", produs: "AB 16", cantitate: 600, destinatie: "Drum județean" }
  ]
};

const pretMediuVanzare = [
  { produs: "BA 16", pret: 285, tonaj: 3200 },
  { produs: "BAD 22.4", pret: 310, tonaj: 2800 },
  { produs: "MASF 16", pret: 295, tonaj: 2100 },
  { produs: "AB 16", pret: 275, tonaj: 1850 },
  { produs: "BAR 16", pret: 265, tonaj: 1500 }
];

const pretComparativ = [
  { produs: "BA 16", pretPropriu: 285, pretConcurenta: 290, diferenta: -5 },
  { produs: "BAD 22.4", pretPropriu: 310, pretConcurenta: 305, diferenta: 5 },
  { produs: "MASF 16", pretPropriu: 295, pretConcurenta: 298, diferenta: -3 },
  { produs: "AB 16", pretPropriu: 275, pretConcurenta: 280, diferenta: -5 },
  { produs: "BAR 16", pretPropriu: 265, pretConcurenta: 262, diferenta: 3 }
];

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-2 mb-4">
    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

const ChartClickHint = () => (
  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
    <MousePointerClick className="h-3 w-3" />
    <span>Click pentru detalii</span>
  </div>
);

const ComercialLivrariSection = () => {
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [activeClientIndex, setActiveClientIndex] = useState<number | null>(null);

  const handleFunnelClick = (data: any) => {
    const name = data.name;
    const details = funnelDetails[name] || [];
    
    const columns = name === "Comenzi client" 
      ? [
          { key: "client", label: "Client" },
          { key: "produs", label: "Produs" },
          { key: "cantitate", label: "Cantitate (t)", align: "right" as const },
          { key: "data_livrare", label: "Data livrare" }
        ]
      : name === "Contracte noi"
      ? [
          { key: "client", label: "Client" },
          { key: "produs", label: "Produs" },
          { key: "valoare", label: "Valoare (lei)", align: "right" as const },
          { key: "data_semnare", label: "Data semnare" }
        ]
      : [
          { key: "client", label: "Client" },
          { key: "produs", label: "Produs" },
          { key: "valoare", label: "Valoare (lei)", align: "right" as const },
          { key: "status", label: "Status" }
        ];

    setDrillDownData({
      title: name,
      subtitle: `Total: ${data.value} înregistrări`,
      type: "table",
      columns,
      data: details,
      summary: [
        { label: "Total", value: data.value },
        { label: "Valoare", value: `${details.reduce((sum: number, d: any) => sum + (d.valoare || d.cantitate || 0), 0).toLocaleString()} ${name === "Comenzi client" ? "t" : "lei"}` }
      ]
    });
    setDrillDownOpen(true);
  };

  const handleClientClick = (data: any) => {
    const client = data.client;
    const details = clientDetails[client] || [];
    
    setDrillDownData({
      title: `Livrări: ${client}`,
      subtitle: `Total: ${data.tonaj.toLocaleString()} tone`,
      type: "table",
      columns: [
        { key: "data", label: "Data" },
        { key: "produs", label: "Produs" },
        { key: "cantitate", label: "Cantitate (t)", align: "right" as const },
        { key: "destinatie", label: "Destinație" }
      ],
      data: details,
      summary: [
        { label: "Total livrat", value: `${data.tonaj.toLocaleString()} t` },
        { label: "Nr. livrări", value: details.length },
        { label: "Media/livrare", value: `${Math.round(data.tonaj / details.length).toLocaleString()} t` }
      ]
    });
    setDrillDownOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Secțiune A - Funnel comercial */}
      <div>
        <SectionHeader icon={ShoppingCart} title="Funnel comercial" />
        
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Ofertă → Contract → Comandă client</CardTitle>
              <ChartClickHint />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <FunnelChart>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Funnel 
                      data={funnelData} 
                      dataKey="value" 
                      nameKey="name" 
                      isAnimationActive
                      onClick={handleFunnelClick}
                    >
                      <LabelList position="right" fill="hsl(var(--muted-foreground))" stroke="none" dataKey="name" fontSize={11} />
                      <LabelList position="center" fill="#fff" stroke="none" dataKey="value" fontSize={14} fontWeight="bold" />
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center space-y-3">
                <div 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => handleFunnelClick({ name: "Oferte noi", value: 45 })}
                >
                  <p className="text-sm font-medium">Rată conversie Oferte → Contracte</p>
                  <Badge variant="secondary" className="text-sm font-semibold px-3">62.2%</Badge>
                </div>
                <div 
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/50 cursor-pointer hover:bg-muted/60 transition-colors"
                  onClick={() => handleFunnelClick({ name: "Contracte noi", value: 28 })}
                >
                  <p className="text-sm font-medium">Rată conversie Contracte → Comenzi</p>
                  <Badge variant="secondary" className="text-sm font-semibold px-3">78.6%</Badge>
                </div>
                <div 
                  className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors"
                  onClick={() => handleFunnelClick({ name: "Comenzi client", value: 22 })}
                >
                  <p className="text-sm font-medium">Rată conversie totală</p>
                  <Badge className="text-sm font-semibold px-3">48.9%</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune B - Clienți & prețuri */}
      <div>
        <SectionHeader icon={Users} title="Clienți & prețuri" />

        <div className="grid gap-4 lg:grid-cols-2">
          {/* CL2 - Tonaj livrat pe client */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Tonaj livrat pe client (Top 5)</CardTitle>
                <ChartClickHint />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={tonajPerClient} 
                    layout="vertical" 
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    onMouseLeave={() => setActiveClientIndex(null)}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="client" type="category" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={75} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Bar 
                      dataKey="tonaj" 
                      radius={[0, 6, 6, 0]} 
                      onClick={handleClientClick}
                      cursor="pointer"
                      onMouseEnter={(_, index) => setActiveClientIndex(index)}
                    >
                      {tonajPerClient.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={activeClientIndex === index ? "hsl(var(--primary)/0.8)" : "hsl(var(--primary))"}
                          className="transition-all duration-200"
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* CL3 - Preț mediu de vânzare */}
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Preț mediu de vânzare / produs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold">Produs</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Preț mediu (lei/t)</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Tonaj livrat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pretMediuVanzare.map(item => (
                      <TableRow key={item.produs} className="hover:bg-muted/20">
                        <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.pret.toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right tabular-nums">{item.tonaj.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CL4 - Comparativ prețuri */}
        <Card className="mt-4 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Preț mediu vs concurență / produs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold">Produs</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Preț mediu propriu (lei/t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Preț mediu concurență (lei/t)</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Diferență (lei/t)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pretComparativ.map(item => (
                    <TableRow key={item.produs} className="hover:bg-muted/20">
                      <TableCell className="text-xs font-medium">{item.produs}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{item.pretPropriu.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-right tabular-nums">{item.pretConcurenta.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className={cn(
                          "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                          item.diferenta < 0 ? "text-green-600 bg-green-500/10" : "text-destructive bg-destructive/10"
                        )}>
                          {item.diferenta < 0 ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                          {item.diferenta > 0 ? "+" : ""}{item.diferenta}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secțiune C - Flotă & livrări */}
      <div>
        <SectionHeader icon={Truck} title="Flotă & livrări" />

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Grad utilizare flotă</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                <p className="text-5xl font-bold tracking-tight">78.5%</p>
                <p className="text-sm text-muted-foreground mt-2 font-medium">Grad utilizare</p>
                <div className="inline-flex items-center gap-1.5 mt-3 text-xs text-green-600 font-semibold bg-green-500/10 px-3 py-1.5 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  +4.2% vs săptămâna anterioară
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Vehicule active</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">48</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Curse azi</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-muted/40 border border-border/50">
                  <p className="text-2xl font-bold">1,850 t</p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">Tonaj livrat</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DrillDownDialog 
        open={drillDownOpen} 
        onOpenChange={setDrillDownOpen} 
        data={drillDownData} 
      />
    </div>
  );
};

export default ComercialLivrariSection;
