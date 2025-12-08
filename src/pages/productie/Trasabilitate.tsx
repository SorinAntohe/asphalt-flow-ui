import { useState, useMemo } from "react";
import { 
  GitBranch, Search, Download, Package, FileText, Truck, Users,
  ChevronRight, ArrowRight, AlertTriangle, CheckCircle, Clock, ClipboardList
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";

interface ReceptieLot {
  id: string;
  codLot: string;
  material: string;
  furnizor: string;
  data: string;
  cantitate: number;
}

interface Reteta {
  id: string;
  nume: string;
  produs: string;
}

interface LotProducție {
  id: string;
  codLot: string;
  ordin: string;
  cantitate: number;
  data: string;
  status: "Conform" | "Neconform" | "În așteptare";
}

interface Livrare {
  id: string;
  nrAviz: string;
  client: string;
  cantitate: number;
  data: string;
}

interface OrdinProductie {
  id: string;
  cod: string;
  produs: string;
  cantitate: number;
  data: string;
}

interface TrasabilitateData {
  receptiiLoturi: ReceptieLot[];
  reteta: Reteta;
  ordinProductie: OrdinProductie;
  loturiProductie: LotProducție[];
  livrari: Livrare[];
}

// Mock data for traceability
const mockTrasabilitateData: Record<string, TrasabilitateData> = {
  "LOT-2024-001": {
    receptiiLoturi: [
      { id: "R1", codLot: "RM-001", material: "Bitum 50/70", furnizor: "Petrobit SRL", data: "28/11/2024", cantitate: 25 },
      { id: "R2", codLot: "RM-002", material: "0/4 NAT", furnizor: "Cariera Nord", data: "28/11/2024", cantitate: 150 },
      { id: "R3", codLot: "RM-003", material: "4/8 CONC", furnizor: "Cariera Nord", data: "28/11/2024", cantitate: 100 },
    ],
    reteta: { id: "RET-1", nume: "BA 16 Standard", produs: "Beton Asfaltic BA 16" },
    ordinProductie: { id: "OP1", cod: "OP-2024-156", produs: "BA 16", cantitate: 250, data: "29/11/2024" },
    loturiProductie: [
      { id: "P1", codLot: "LOT-2024-001", ordin: "OP-2024-156", cantitate: 250, data: "29/11/2024", status: "Conform" },
    ],
    livrari: [
      { id: "L1", nrAviz: "AVZ-001234", client: "Primăria Sector 3", cantitate: 100, data: "29/11/2024" },
      { id: "L2", nrAviz: "AVZ-001235", client: "CNAIR SA", cantitate: 150, data: "29/11/2024" },
    ]
  },
  "LOT-2024-002": {
    receptiiLoturi: [
      { id: "R4", codLot: "RM-004", material: "Bitum 50/70", furnizor: "Petrobit SRL", data: "27/11/2024", cantitate: 30 },
      { id: "R5", codLot: "RM-005", material: "8/16 CRIBLURI", furnizor: "Agregate Plus", data: "27/11/2024", cantitate: 200 },
    ],
    reteta: { id: "RET-2", nume: "MASF 16 Premium", produs: "Mixtură Asfaltică MASF 16" },
    ordinProductie: { id: "OP2", cod: "OP-2024-157", produs: "MASF 16", cantitate: 180, data: "28/11/2024" },
    loturiProductie: [
      { id: "P2", codLot: "LOT-2024-002", ordin: "OP-2024-157", cantitate: 180, data: "28/11/2024", status: "Neconform" },
    ],
    livrari: [
      { id: "L3", nrAviz: "AVZ-001230", client: "Drumuri Locale SRL", cantitate: 180, data: "28/11/2024" },
    ]
  },
  "LOT-2024-003": {
    receptiiLoturi: [
      { id: "R6", codLot: "RM-006", material: "Filler", furnizor: "Ciment SA", data: "26/11/2024", cantitate: 15 },
      { id: "R7", codLot: "RM-007", material: "0/4 CONC", furnizor: "Cariera Sud", data: "26/11/2024", cantitate: 120 },
    ],
    reteta: { id: "RET-3", nume: "BAD 25 Greu", produs: "Beton Asfaltic Deschis BAD 25" },
    ordinProductie: { id: "OP3", cod: "OP-2024-158", produs: "BAD 25", cantitate: 300, data: "27/11/2024" },
    loturiProductie: [
      { id: "P3", codLot: "LOT-2024-003", ordin: "OP-2024-158", cantitate: 300, data: "27/11/2024", status: "În așteptare" },
    ],
    livrari: []
  }
};


const statusConfig = {
  "Conform": { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  "Neconform": { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: AlertTriangle },
  "În așteptare": { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Clock },
};

const Trasabilitate = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLot, setSelectedLot] = useState<string | null>(null);
  

  const trasabilitateResult = useMemo(() => {
    if (!selectedLot) return null;
    return mockTrasabilitateData[selectedLot] || null;
  }, [selectedLot]);

  const availableLots = Object.keys(mockTrasabilitateData);

  const filteredLots = useMemo(() => {
    if (!searchQuery) return availableLots;
    return availableLots.filter(lot => 
      lot.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, availableLots]);

  const handleSearch = () => {
    if (filteredLots.length === 1) {
      setSelectedLot(filteredLots[0]);
    } else if (filteredLots.length === 0) {
      toast.error("Nu s-a găsit niciun lot cu acest cod");
    }
  };

  const handleExportImpactClienti = () => {
    if (!trasabilitateResult) return;
    
    const impactData = trasabilitateResult.livrari.map(l => ({
      lot: selectedLot,
      nrAviz: l.nrAviz,
      client: l.client,
      cantitate: l.cantitate,
      dataLivrare: l.data,
      status: trasabilitateResult.loturiProductie[0]?.status || "N/A"
    }));

    exportToCSV(impactData, `impact_clienti_${selectedLot}`, [
      { key: "lot", label: "Lot Produs" },
      { key: "nrAviz", label: "Nr. Aviz" },
      { key: "client", label: "Client" },
      { key: "cantitate", label: "Cantitate (to)" },
      { key: "dataLivrare", label: "Data Livrare" },
      { key: "status", label: "Status QC" },
    ]);
    toast.success("Export impact clienți realizat cu succes");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <GitBranch className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Trasabilitate</h1>
            <p className="text-muted-foreground">Urmărire genealogică: Materie primă → Rețetă → Ordin producție → Lot → Produs finit</p>
          </div>
        </div>
        {selectedLot && trasabilitateResult && (
          <Button onClick={handleExportImpactClienti} className="gap-2">
            <Download className="h-4 w-4" />
            Export Impact Clienți
          </Button>
        )}
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Căutare Lot</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Introduceți codul lotului (ex: LOT-2024-001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Caută
            </Button>
          </div>
          
          {/* Quick select from filtered lots */}
          {searchQuery && filteredLots.length > 0 && !selectedLot && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Rezultate:</span>
              {filteredLots.map(lot => (
                <Badge 
                  key={lot} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent"
                  onClick={() => setSelectedLot(lot)}
                >
                  {lot}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Show selected lot */}
          {selectedLot && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lot selectat:</span>
              <Badge className="bg-primary/20 text-primary border-primary/30">
                {selectedLot}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => { setSelectedLot(null); setSearchQuery(""); }}
              >
                Schimbă
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Section */}
      {selectedLot && trasabilitateResult && (
        <div className="space-y-4">
            {/* Visual Flow */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Fluxul Trasabilității</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-stretch gap-4">
                  {/* Materii Prime */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="h-5 w-5 text-blue-400" />
                      <span className="font-medium text-foreground">Materii Prime</span>
                    </div>
                    <div className="space-y-2">
                      {trasabilitateResult.receptiiLoturi.map(r => (
                        <div key={r.id} className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="font-medium text-sm">{r.codLot}</div>
                          <div className="text-xs text-muted-foreground">{r.material}</div>
                          <div className="text-xs text-muted-foreground">{r.furnizor} • {r.cantitate} to</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center lg:py-8">
                    <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                    <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90 lg:hidden" />
                  </div>

                  {/* Rețetă */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <span className="font-medium text-foreground">Rețetă</span>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="font-medium">{trasabilitateResult.reteta.nume}</div>
                      <div className="text-sm text-muted-foreground">{trasabilitateResult.reteta.produs}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center lg:py-8">
                    <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                    <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90 lg:hidden" />
                  </div>

                  {/* Ordin de Producție */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <ClipboardList className="h-5 w-5 text-orange-400" />
                      <span className="font-medium text-foreground">Ordin Producție</span>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                      <div className="font-medium">{trasabilitateResult.ordinProductie.cod}</div>
                      <div className="text-sm text-muted-foreground">{trasabilitateResult.ordinProductie.produs}</div>
                      <div className="text-xs text-muted-foreground">{trasabilitateResult.ordinProductie.cantitate} to • {trasabilitateResult.ordinProductie.data}</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center lg:py-8">
                    <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                    <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90 lg:hidden" />
                  </div>

                  {/* Lot */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <GitBranch className="h-5 w-5 text-emerald-400" />
                      <span className="font-medium text-foreground">Lot</span>
                    </div>
                    <div className="space-y-2">
                      {trasabilitateResult.loturiProductie.map(lp => {
                        const config = statusConfig[lp.status];
                        const StatusIcon = config.icon;
                        return (
                          <div key={lp.id} className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">{lp.codLot}</div>
                              <Badge variant="outline" className={config.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {lp.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">Ordin: {lp.ordin}</div>
                            <div className="text-xs text-muted-foreground">{lp.cantitate} to • {lp.data}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center lg:py-8">
                    <ArrowRight className="h-6 w-6 text-muted-foreground hidden lg:block" />
                    <ChevronRight className="h-6 w-6 text-muted-foreground rotate-90 lg:hidden" />
                  </div>

                  {/* Produs Finit */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <Truck className="h-5 w-5 text-amber-400" />
                      <span className="font-medium text-foreground">Produs Finit</span>
                    </div>
                    {trasabilitateResult.livrari.length > 0 ? (
                      <div className="space-y-2">
                        {trasabilitateResult.livrari.map(l => (
                          <div key={l.id} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <div className="font-medium text-sm">{l.nrAviz}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {l.client}
                            </div>
                            <div className="text-xs text-muted-foreground">{l.cantitate} to • {l.data}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                        <span className="text-sm text-muted-foreground">Nicio livrare înregistrată</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Materii Prime Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Materii Prime</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cod Lot</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead>Furnizor</TableHead>
                          <TableHead className="text-right">Cantitate</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Livrări Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Livrări efectuate</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {trasabilitateResult.livrari.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nr. Aviz</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">Cantitate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Nicio livrare înregistrată pentru acest lot
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedLot && (
        <Card className="p-12 text-center">
          <GitBranch className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Căutați un lot</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-4">
            Introduceți codul lotului pentru a vizualiza trasabilitatea completă
            de la comandă materii prime până la livrarea către client.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-muted-foreground">Exemple:</span>
            {availableLots.map(lot => (
              <Badge 
                key={lot} 
                variant="outline" 
                className="cursor-pointer hover:bg-accent"
                onClick={() => setSelectedLot(lot)}
              >
                {lot}
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Trasabilitate;
