import { useState, useMemo } from "react";
import { 
  Truck, Plus, Download, Calendar, AlertTriangle, Filter,
  Wrench, FileText, Clock, CheckCircle, XCircle, Settings,
  ChevronRight, Paperclip, History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DataTablePagination } from "@/components/ui/data-table";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";

type StatusEchipament = "Disponibil" | "În revizie" | "Defect";

interface Echipament {
  id: number;
  cod: string;
  tip: string;
  serie: string;
  planta: string;
  oreFunctionare: number;
  ultimaRevizie: string;
  urmatoareaRevizie: string;
  status: StatusEchipament;
  descriere?: string;
  producator?: string;
  anFabricatie?: number;
  documenteVehicul?: {
    rcaExpira?: string;
    itpExpira?: string;
  };
}

interface Interventie {
  id: number;
  data: string;
  tip: string;
  descriere: string;
  piese: string[];
  cost: number;
  tehnician: string;
}

interface PiesaCritica {
  id: number;
  denumire: string;
  codPiesa: string;
  stocActual: number;
  stocMinim: number;
}

// Mock data
const mockEchipamente: Echipament[] = [
  { 
    id: 1, cod: "ECH-001", tip: "Stație Asfalt", serie: "SA-2020-001", planta: "Planta Nord",
    oreFunctionare: 12500, ultimaRevizie: "15/10/2024", urmatoareaRevizie: "15/01/2025", status: "Disponibil",
    descriere: "Stație asfalt mobilă 160t/h", producator: "Ammann", anFabricatie: 2020
  },
  { 
    id: 2, cod: "ECH-002", tip: "Încărcător Frontal", serie: "IF-2019-003", planta: "Planta Nord",
    oreFunctionare: 8200, ultimaRevizie: "01/11/2024", urmatoareaRevizie: "01/02/2025", status: "Disponibil",
    descriere: "Încărcător frontal Cat 966", producator: "Caterpillar", anFabricatie: 2019
  },
  { 
    id: 3, cod: "VEH-001", tip: "Camion Basculant", serie: "CB-2021-005", planta: "Planta Nord",
    oreFunctionare: 45000, ultimaRevizie: "20/09/2024", urmatoareaRevizie: "20/12/2024", status: "În revizie",
    descriere: "MAN TGS 8x4", producator: "MAN", anFabricatie: 2021,
    documenteVehicul: { rcaExpira: "15/03/2025", itpExpira: "20/06/2025" }
  },
  { 
    id: 4, cod: "ECH-003", tip: "Finisor Asfalt", serie: "FA-2018-002", planta: "Planta Sud",
    oreFunctionare: 6800, ultimaRevizie: "05/08/2024", urmatoareaRevizie: "05/11/2024", status: "Defect",
    descriere: "Finisor Vögele Super 1900-3", producator: "Vögele", anFabricatie: 2018
  },
  { 
    id: 5, cod: "VEH-002", tip: "Autobasculantă", serie: "AB-2022-001", planta: "Planta Sud",
    oreFunctionare: 32000, ultimaRevizie: "10/11/2024", urmatoareaRevizie: "10/02/2025", status: "Disponibil",
    descriere: "Volvo FH 6x4", producator: "Volvo", anFabricatie: 2022,
    documenteVehicul: { rcaExpira: "01/05/2025", itpExpira: "15/08/2025" }
  },
  { 
    id: 6, cod: "ECH-004", tip: "Cilindru Compactor", serie: "CC-2020-004", planta: "Planta Nord",
    oreFunctionare: 4500, ultimaRevizie: "25/10/2024", urmatoareaRevizie: "25/01/2025", status: "Disponibil",
    descriere: "Hamm HD+ 110", producator: "Hamm", anFabricatie: 2020
  },
];

const mockInterventii: Record<number, Interventie[]> = {
  1: [
    { id: 1, data: "15/10/2024", tip: "Revizie planificată", descriere: "Schimb ulei, filtre, verificare sistem hidraulic", piese: ["Filtru ulei", "Filtru aer"], cost: 2500, tehnician: "Ion Popescu" },
    { id: 2, data: "01/08/2024", tip: "Reparație", descriere: "Înlocuire pompă hidraulică", piese: ["Pompă hidraulică"], cost: 8500, tehnician: "Vasile Ionescu" },
  ],
  3: [
    { id: 3, data: "20/09/2024", tip: "Revizie planificată", descriere: "Revizie completă motor și transmisie", piese: ["Ulei motor", "Filtre", "Plăcuțe frână"], cost: 4200, tehnician: "Gheorghe Marin" },
  ],
  4: [
    { id: 4, data: "28/11/2024", tip: "Defecțiune", descriere: "Defect sistem electronic de nivelare", piese: [], cost: 0, tehnician: "În așteptare" },
  ],
};

const mockPieseCritice: Record<number, PiesaCritica[]> = {
  1: [
    { id: 1, denumire: "Pompă hidraulică", codPiesa: "PH-001", stocActual: 1, stocMinim: 1 },
    { id: 2, denumire: "Filtru ulei", codPiesa: "FO-010", stocActual: 5, stocMinim: 3 },
    { id: 3, denumire: "Curea transmisie", codPiesa: "CT-005", stocActual: 2, stocMinim: 2 },
  ],
  4: [
    { id: 4, denumire: "Modul electronic nivelare", codPiesa: "MEN-001", stocActual: 0, stocMinim: 1 },
    { id: 5, denumire: "Senzor temperatură", codPiesa: "ST-012", stocActual: 3, stocMinim: 2 },
  ],
};

const statusConfig = {
  "Disponibil": { color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle },
  "În revizie": { color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Wrench },
  "Defect": { color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

const tipuriUtilaj = ["Toate", "Stație Asfalt", "Încărcător Frontal", "Camion Basculant", "Finisor Asfalt", "Autobasculantă", "Cilindru Compactor"];
const plante = ["Toate", "Planta Nord", "Planta Sud"];
const statusuri: ("Toate" | StatusEchipament)[] = ["Toate", "Disponibil", "În revizie", "Defect"];

const Echipamente = () => {
  const [echipamente] = useState<Echipament[]>(mockEchipamente);
  const [selectedEchipament, setSelectedEchipament] = useState<Echipament | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPlanRevizieOpen, setIsPlanRevizieOpen] = useState(false);
  const [isDefectDialogOpen, setIsDefectDialogOpen] = useState(false);
  
  // Filters
  const [filterTip, setFilterTip] = useState("Toate");
  const [filterPlanta, setFilterPlanta] = useState("Toate");
  const [filterStatus, setFilterStatus] = useState<"Toate" | StatusEchipament>("Toate");
  
  // Sorting
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Stats
  const stats = useMemo(() => {
    const total = echipamente.length;
    const disponibile = echipamente.filter(e => e.status === "Disponibil").length;
    const inRevizie = echipamente.filter(e => e.status === "În revizie").length;
    const defecte = echipamente.filter(e => e.status === "Defect").length;
    return { total, disponibile, inRevizie, defecte };
  }, [echipamente]);

  // Filtering and sorting
  const filteredEchipamente = useMemo(() => {
    let result = [...echipamente];
    
    if (filterTip !== "Toate") {
      result = result.filter(e => e.tip === filterTip);
    }
    if (filterPlanta !== "Toate") {
      result = result.filter(e => e.planta === filterPlanta);
    }
    if (filterStatus !== "Toate") {
      result = result.filter(e => e.status === filterStatus);
    }
    
    // Column filters
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(e => 
          String(e[key as keyof Echipament]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    // Sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof Echipament];
        const bVal = b[sortKey as keyof Echipament];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === "asc" 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    
    return result;
  }, [echipamente, filterTip, filterPlanta, filterStatus, columnFilters, sortKey, sortDirection]);

  const paginatedEchipamente = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEchipamente.slice(start, start + itemsPerPage);
  }, [filteredEchipamente, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEchipamente.length / itemsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const handleFilter = (key: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleRowClick = (echipament: Echipament) => {
    setSelectedEchipament(echipament);
    setIsDrawerOpen(true);
  };

  const handleExport = () => {
    exportToCSV(filteredEchipamente, "echipamente_flota", [
      { key: "cod", label: "Cod" },
      { key: "tip", label: "Tip" },
      { key: "serie", label: "Serie" },
      { key: "planta", label: "Plantă" },
      { key: "oreFunctionare", label: "Ore Funcționare" },
      { key: "ultimaRevizie", label: "Ultima Revizie" },
      { key: "urmatoareaRevizie", label: "Următoarea Revizie" },
      { key: "status", label: "Status" },
    ]);
    toast.success("Export realizat cu succes");
  };

  const handlePlanRevizie = () => {
    setIsPlanRevizieOpen(true);
  };

  const handleRaportareDefect = () => {
    setIsDefectDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Truck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Echipamente & Flotă</h1>
            <p className="text-muted-foreground">Gestiune utilaje și vehicule</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă Echipament
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Echipamente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.disponibile}</p>
                <p className="text-sm text-muted-foreground">Disponibile</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Wrench className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.inRevizie}</p>
                <p className="text-sm text-muted-foreground">În Revizie</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.defecte}</p>
                <p className="text-sm text-muted-foreground">Defecte</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtre:</span>
            </div>
            <Select value={filterTip} onValueChange={setFilterTip}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tip utilaj" />
              </SelectTrigger>
              <SelectContent>
                {tipuriUtilaj.map(tip => (
                  <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPlanta} onValueChange={setFilterPlanta}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Plantă" />
              </SelectTrigger>
              <SelectContent>
                {plante.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as typeof filterStatus)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusuri.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cod</TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Serie</TableHead>
                  <TableHead>Plantă</TableHead>
                  <TableHead className="text-right">Ore Funcț.</TableHead>
                  <TableHead>Ultima Revizie</TableHead>
                  <TableHead>Următoarea Revizie</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEchipamente.map(echipament => {
                  const config = statusConfig[echipament.status];
                  const StatusIcon = config.icon;
                  return (
                    <TableRow 
                      key={echipament.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(echipament)}
                    >
                      <TableCell className="font-medium">{echipament.cod}</TableCell>
                      <TableCell>{echipament.tip}</TableCell>
                      <TableCell>{echipament.serie}</TableCell>
                      <TableCell>{echipament.planta}</TableCell>
                      <TableCell className="text-right">{echipament.oreFunctionare.toLocaleString()}</TableCell>
                      <TableCell>{echipament.ultimaRevizie}</TableCell>
                      <TableCell>{echipament.urmatoareaRevizie}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={config.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {echipament.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredEchipamente.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(value) => { setItemsPerPage(value); setCurrentPage(1); }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Peek Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          {selectedEchipament && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {selectedEchipament.cod} - {selectedEchipament.tip}
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handlePlanRevizie} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Plan Revizie
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRaportareDefect} className="gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Raportează Defecțiune
                  </Button>
                </div>

                <Tabs defaultValue="fisa">
                  <TabsList className="w-full">
                    <TabsTrigger value="fisa" className="flex-1">Fișă Tehnică</TabsTrigger>
                    <TabsTrigger value="istoric" className="flex-1">Istoric</TabsTrigger>
                    <TabsTrigger value="piese" className="flex-1">Piese Critice</TabsTrigger>
                    <TabsTrigger value="documente" className="flex-1">Documente</TabsTrigger>
                  </TabsList>

                  {/* Fișă Tehnică */}
                  <TabsContent value="fisa" className="space-y-4">
                    <Card>
                      <CardContent className="pt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Cod</p>
                            <p className="font-medium">{selectedEchipament.cod}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tip</p>
                            <p className="font-medium">{selectedEchipament.tip}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Serie</p>
                            <p className="font-medium">{selectedEchipament.serie}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Plantă</p>
                            <p className="font-medium">{selectedEchipament.planta}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Producător</p>
                            <p className="font-medium">{selectedEchipament.producator || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">An Fabricație</p>
                            <p className="font-medium">{selectedEchipament.anFabricatie || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Ore Funcționare</p>
                            <p className="font-medium">{selectedEchipament.oreFunctionare.toLocaleString()} h</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant="outline" className={statusConfig[selectedEchipament.status].color}>
                              {selectedEchipament.status}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <p className="text-sm text-muted-foreground">Descriere</p>
                          <p className="font-medium">{selectedEchipament.descriere || "N/A"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Istoric Intervenții */}
                  <TabsContent value="istoric" className="space-y-4">
                    <ScrollArea className="h-[400px]">
                      {(mockInterventii[selectedEchipament.id] || []).length > 0 ? (
                        <div className="space-y-3">
                          {mockInterventii[selectedEchipament.id]?.map(interventie => (
                            <Card key={interventie.id}>
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center gap-2">
                                    <History className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{interventie.data}</span>
                                  </div>
                                  <Badge variant="outline">{interventie.tip}</Badge>
                                </div>
                                <p className="mt-2 text-sm">{interventie.descriere}</p>
                                {interventie.piese.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-1">
                                    {interventie.piese.map((p, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                                    ))}
                                  </div>
                                )}
                                <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                                  <span>Tehnician: {interventie.tehnician}</span>
                                  <span>Cost: {interventie.cost.toLocaleString()} RON</span>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Nicio intervenție înregistrată
                        </div>
                      )}
                    </ScrollArea>
                  </TabsContent>

                  {/* Piese Critice */}
                  <TabsContent value="piese" className="space-y-4">
                    {(mockPieseCritice[selectedEchipament.id] || []).length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Denumire</TableHead>
                            <TableHead>Cod</TableHead>
                            <TableHead className="text-right">Stoc</TableHead>
                            <TableHead className="text-right">Minim</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPieseCritice[selectedEchipament.id]?.map(piesa => (
                            <TableRow key={piesa.id}>
                              <TableCell className="font-medium">{piesa.denumire}</TableCell>
                              <TableCell>{piesa.codPiesa}</TableCell>
                              <TableCell className="text-right">
                                <span className={piesa.stocActual < piesa.stocMinim ? "text-red-400" : ""}>
                                  {piesa.stocActual}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">{piesa.stocMinim}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nicio piesă critică definită
                      </div>
                    )}
                  </TabsContent>

                  {/* Documente Vehicul */}
                  <TabsContent value="documente" className="space-y-4">
                    {selectedEchipament.documenteVehicul ? (
                      <Card>
                        <CardContent className="pt-4 space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">RCA</p>
                                <p className="text-sm text-muted-foreground">
                                  Expiră: {selectedEchipament.documenteVehicul.rcaExpira}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-primary" />
                              <div>
                                <p className="font-medium">ITP</p>
                                <p className="text-sm text-muted-foreground">
                                  Expiră: {selectedEchipament.documenteVehicul.itpExpira}
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Paperclip className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nu sunt documente vehicul (nu este vehicul)</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Add Equipment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Adaugă Echipament</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cod</Label>
                <Input placeholder="ECH-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Tip</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tip" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipuriUtilaj.filter(t => t !== "Toate").map(tip => (
                      <SelectItem key={tip} value={tip}>{tip}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Serie</Label>
                <Input placeholder="Serie echipament" />
              </div>
              <div className="space-y-2">
                <Label>Plantă</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează plantă" />
                  </SelectTrigger>
                  <SelectContent>
                    {plante.filter(p => p !== "Toate").map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Producător</Label>
                <Input placeholder="Producător" />
              </div>
              <div className="space-y-2">
                <Label>An Fabricație</Label>
                <Input type="number" placeholder="2024" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descriere</Label>
              <Textarea placeholder="Descriere echipament..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={() => { toast.success("Echipament adăugat"); setIsAddDialogOpen(false); }}>
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Revizie Dialog */}
      <Dialog open={isPlanRevizieOpen} onOpenChange={setIsPlanRevizieOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Planificare Revizie</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Data Revizie</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Tip Revizie</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planificata">Revizie Planificată</SelectItem>
                  <SelectItem value="preventiva">Mentenanță Preventivă</SelectItem>
                  <SelectItem value="anuala">Revizie Anuală</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observații</Label>
              <Textarea placeholder="Detalii revizie..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPlanRevizieOpen(false)}>Anulează</Button>
            <Button onClick={() => { toast.success("Revizie planificată"); setIsPlanRevizieOpen(false); }}>
              Planifică
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Raportare Defect Dialog */}
      <Dialog open={isDefectDialogOpen} onOpenChange={setIsDefectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raportare Defecțiune</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Tip Defecțiune</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tip" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mecanic">Mecanic</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                  <SelectItem value="hidraulic">Hidraulic</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="altele">Altele</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descriere Defecțiune</Label>
              <Textarea placeholder="Descrieți problema întâmpinată..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Urgență</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel urgență" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scazuta">Scăzută</SelectItem>
                  <SelectItem value="medie">Medie</SelectItem>
                  <SelectItem value="ridicata">Ridicată</SelectItem>
                  <SelectItem value="critica">Critică</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDefectDialogOpen(false)}>Anulează</Button>
            <Button variant="destructive" onClick={() => { toast.success("Defecțiune raportată"); setIsDefectDialogOpen(false); }}>
              Raportează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Echipamente;
