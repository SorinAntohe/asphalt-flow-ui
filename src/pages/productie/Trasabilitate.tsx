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

interface ComandaMateriePrima {
  id: string;
  codComanda: string;
  material: string;
  furnizor: string;
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

interface ComandaProdusFinit {
  id: string;
  codComanda: string;
  client: string;
  produs: string;
  cantitate: number;
}

interface OrdinProductie {
  id: string;
  cod: string;
  produs: string;
  cantitate: number;
  data: string;
}

interface TrasabilitateData {
  comenziMateriePrima: ComandaMateriePrima[];
  reteta: Reteta;
  ordinProductie: OrdinProductie;
  loturiProductie: LotProducție[];
  comenziProdusFinit: ComandaProdusFinit[];
}

// Mock data for traceability
const mockTrasabilitateData: Record<string, TrasabilitateData> = {
  "LOT-2024-001": {
    comenziMateriePrima: [
      { id: "C1", codComanda: "CMP-2024-101", material: "Bitum 50/70", furnizor: "Petrobit SRL", cantitate: 25 },
      { id: "C2", codComanda: "CMP-2024-102", material: "0/4 NAT", furnizor: "Cariera Nord", cantitate: 150 },
      { id: "C3", codComanda: "CMP-2024-103", material: "4/8 CONC", furnizor: "Cariera Nord", cantitate: 100 },
    ],
    reteta: { id: "RET-1", nume: "BA 16 Standard", produs: "Beton Asfaltic BA 16" },
    ordinProductie: { id: "OP1", cod: "OP-2024-156", produs: "BA 16", cantitate: 250, data: "29/11/2024" },
    loturiProductie: [
      { id: "P1", codLot: "LOT-2024-001", ordin: "OP-2024-156", cantitate: 250, data: "29/11/2024", status: "Conform" },
    ],
    comenziProdusFinit: [
      { id: "CPF1", codComanda: "CPF-2024-201", client: "Primăria Sector 3", produs: "BA 16", cantitate: 100 },
      { id: "CPF2", codComanda: "CPF-2024-202", client: "CNAIR SA", produs: "BA 16", cantitate: 150 },
    ]
  },
  "LOT-2024-002": {
    comenziMateriePrima: [
      { id: "C4", codComanda: "CMP-2024-104", material: "Bitum 50/70", furnizor: "Petrobit SRL", cantitate: 30 },
      { id: "C5", codComanda: "CMP-2024-105", material: "8/16 CRIBLURI", furnizor: "Agregate Plus", cantitate: 200 },
    ],
    reteta: { id: "RET-2", nume: "MASF 16 Premium", produs: "Mixtură Asfaltică MASF 16" },
    ordinProductie: { id: "OP2", cod: "OP-2024-157", produs: "MASF 16", cantitate: 180, data: "28/11/2024" },
    loturiProductie: [
      { id: "P2", codLot: "LOT-2024-002", ordin: "OP-2024-157", cantitate: 180, data: "28/11/2024", status: "Neconform" },
    ],
    comenziProdusFinit: [
      { id: "CPF3", codComanda: "CPF-2024-203", client: "Drumuri Locale SRL", produs: "MASF 16", cantitate: 180 },
    ]
  },
  "LOT-2024-003": {
    comenziMateriePrima: [
      { id: "C6", codComanda: "CMP-2024-106", material: "Filler", furnizor: "Ciment SA", cantitate: 15 },
      { id: "C7", codComanda: "CMP-2024-107", material: "0/4 CONC", furnizor: "Cariera Sud", cantitate: 120 },
    ],
    reteta: { id: "RET-3", nume: "BAD 25 Greu", produs: "Beton Asfaltic Deschis BAD 25" },
    ordinProductie: { id: "OP3", cod: "OP-2024-158", produs: "BAD 25", cantitate: 300, data: "27/11/2024" },
    loturiProductie: [
      { id: "P3", codLot: "LOT-2024-003", ordin: "OP-2024-158", cantitate: 300, data: "27/11/2024", status: "În așteptare" },
    ],
    comenziProdusFinit: []
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
    
    const impactData = trasabilitateResult.comenziProdusFinit.map(c => ({
      lot: selectedLot,
      codComanda: c.codComanda,
      client: c.client,
      produs: c.produs,
      cantitate: c.cantitate,
      status: trasabilitateResult.loturiProductie[0]?.status || "N/A"
    }));

    exportToCSV(impactData, `impact_clienti_${selectedLot}`, [
      { key: "lot", label: "Lot Produs" },
      { key: "codComanda", label: "Cod Comandă" },
      { key: "client", label: "Client" },
      { key: "produs", label: "Produs" },
      { key: "cantitate", label: "Cantitate (to)" },
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
              <CardContent className="overflow-x-auto">
                {/* Flow Diagram */}
                <div className="flex items-center justify-between min-w-[800px] py-6 px-4">
                  {/* Step 1: Materii Prime */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
                      <Package className="h-8 w-8 text-blue-400" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Comenzi MP</span>
                    <div className="mt-2 text-center">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {trasabilitateResult.comenziMateriePrima.length} comenzi
                      </Badge>
                    </div>
                  </div>

                  {/* Connector 1 */}
                  <div className="flex-1 flex items-center px-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                    <ChevronRight className="h-6 w-6 text-purple-500 -ml-1" />
                  </div>

                  {/* Step 2: Rețetă */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
                      <FileText className="h-8 w-8 text-purple-400" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Rețetă</span>
                    <div className="mt-2 text-center max-w-[120px]">
                      <p className="text-xs text-muted-foreground truncate">{trasabilitateResult.reteta.nume}</p>
                    </div>
                  </div>

                  {/* Connector 2 */}
                  <div className="flex-1 flex items-center px-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full" />
                    <ChevronRight className="h-6 w-6 text-orange-500 -ml-1" />
                  </div>

                  {/* Step 3: Ordin Producție */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center mb-3 shadow-lg shadow-orange-500/20">
                      <ClipboardList className="h-8 w-8 text-orange-400" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Ordin Producție</span>
                    <div className="mt-2 text-center max-w-[120px]">
                      <p className="text-xs text-muted-foreground truncate">{trasabilitateResult.ordinProductie.cod}</p>
                    </div>
                  </div>

                  {/* Connector 3 */}
                  <div className="flex-1 flex items-center px-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-orange-500 to-emerald-500 rounded-full" />
                    <ChevronRight className="h-6 w-6 text-emerald-500 -ml-1" />
                  </div>

                  {/* Step 4: Lot */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
                      <GitBranch className="h-8 w-8 text-emerald-400" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Lot</span>
                    <div className="mt-2 text-center">
                      {trasabilitateResult.loturiProductie.map(lp => {
                        const config = statusConfig[lp.status];
                        return (
                          <Badge key={lp.id} variant="outline" className={config.color}>
                            {lp.status}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  {/* Connector 4 */}
                  <div className="flex-1 flex items-center px-2">
                    <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" />
                    <ChevronRight className="h-6 w-6 text-amber-500 -ml-1" />
                  </div>

                  {/* Step 5: Produs Finit */}
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-500 flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
                      <Truck className="h-8 w-8 text-amber-400" />
                    </div>
                    <span className="font-semibold text-foreground text-sm">Comenzi PF</span>
                    <div className="mt-2 text-center">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                        {trasabilitateResult.comenziProdusFinit.length} comenzi
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Details Cards Below */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-border">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-blue-400 uppercase tracking-wide">Comenzi Materie Primă</h4>
                    {trasabilitateResult.comenziMateriePrima.map(c => (
                      <div key={c.id} className="p-2 rounded-md bg-blue-500/5 border border-blue-500/20 text-xs">
                        <div className="font-medium text-foreground">{c.codComanda}</div>
                        <div className="text-muted-foreground">{c.material}</div>
                        <div className="text-muted-foreground">{c.furnizor} • {c.cantitate} to</div>
                      </div>
                    ))}
                  </div>
                  {/* Rețetă Details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wide">Rețetă</h4>
                    <div className="p-2 rounded-md bg-purple-500/5 border border-purple-500/20 text-xs">
                      <div className="font-medium text-foreground">{trasabilitateResult.reteta.nume}</div>
                      <div className="text-muted-foreground">{trasabilitateResult.reteta.produs}</div>
                    </div>
                  </div>

                  {/* Ordin Producție Details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-orange-400 uppercase tracking-wide">Ordin Producție</h4>
                    <div className="p-2 rounded-md bg-orange-500/5 border border-orange-500/20 text-xs">
                      <div className="font-medium text-foreground">{trasabilitateResult.ordinProductie.cod}</div>
                      <div className="text-muted-foreground">{trasabilitateResult.ordinProductie.produs}</div>
                      <div className="text-muted-foreground">{trasabilitateResult.ordinProductie.cantitate} to</div>
                    </div>
                  </div>

                  {/* Lot Details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Lot</h4>
                    {trasabilitateResult.loturiProductie.map(lp => (
                      <div key={lp.id} className="p-2 rounded-md bg-emerald-500/5 border border-emerald-500/20 text-xs">
                        <div className="font-medium text-foreground">{lp.codLot}</div>
                        <div className="text-muted-foreground">{lp.ordin}</div>
                        <div className="text-muted-foreground">{lp.cantitate} to</div>
                      </div>
                    ))}
                  </div>

                  {/* Comenzi Produs Finit Details */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wide">Comenzi Produs Finit</h4>
                    {trasabilitateResult.comenziProdusFinit.length > 0 ? (
                      trasabilitateResult.comenziProdusFinit.map(c => (
                        <div key={c.id} className="p-2 rounded-md bg-amber-500/5 border border-amber-500/20 text-xs">
                          <div className="font-medium text-foreground">{c.codComanda}</div>
                          <div className="text-muted-foreground">{c.client}</div>
                          <div className="text-muted-foreground">{c.produs} • {c.cantitate} to</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 rounded-md bg-muted/30 border border-border text-xs text-muted-foreground text-center">
                        Nicio comandă
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Comenzi Materie Prima Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comenzi Materie Primă</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cod Comandă</TableHead>
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

              {/* Comenzi Produs Finit Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Comenzi Produs Finit</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px]">
                    {trasabilitateResult.comenziProdusFinit.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cod Comandă</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Produs</TableHead>
                            <TableHead className="text-right">Cantitate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Nicio comandă produs finit înregistrată pentru acest lot
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
