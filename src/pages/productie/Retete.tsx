import { useState, useMemo, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Copy,
  Printer,
  Droplets,
  Pencil,
  CheckCircle2,
  Archive,
  AlertTriangle,
  ThermometerSun,
  Scale,
  Beaker,
  ListChecks
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { API_BASE_URL } from "@/lib/api";

// Types
interface Component {
  id: number;
  material: string;
  cantitate: number;
  observatii: string;
}

interface ParametruProces {
  id: number;
  parametru: string;
  valoare: string;
  unitate: string;
}

interface Reteta {
  id: number;
  cod: string;
  denumire: string;
  tip: "Asfalt" | "Emulsie";
  densitateTinta: number;
  status: "Activ" | "Arhivat";
  ultimaModificare: string;
  componente: Component[];
  parametriProces: ParametruProces[];
  umiditate?: number;
  temperatura?: number;
  marshall?: number;
  slump?: number;
}

// Mock data
const reteteInitiale: Reteta[] = [
  {
    id: 1,
    cod: "BA16-STD",
    denumire: "Beton Asfaltic BA 16 Standard",
    tip: "Asfalt",
    densitateTinta: 2.45,
    status: "Activ",
    ultimaModificare: "28/11/2024",
    umiditate: 4.5,
    temperatura: 165,
    marshall: 12,
    componente: [
      { id: 1, material: "Criblură 8/16", cantitate: 350, observatii: "" },
      { id: 2, material: "Criblură 4/8", cantitate: 250, observatii: "" },
      { id: 3, material: "Nisip 0/4", cantitate: 300, observatii: "" },
      { id: 4, material: "Filler", cantitate: 50, observatii: "Calcar" },
      { id: 5, material: "Bitum 50/70", cantitate: 50, observatii: "" },
    ],
    parametriProces: [
      { id: 1, parametru: "Temperatura agregat", valoare: "180-200", unitate: "°C" },
      { id: 2, parametru: "Temperatura bitum", valoare: "160-170", unitate: "°C" },
      { id: 3, parametru: "Timp malaxare uscată", valoare: "15", unitate: "sec" },
      { id: 4, parametru: "Timp malaxare umedă", valoare: "35", unitate: "sec" },
      { id: 5, parametru: "Temperatura mixtura", valoare: "165±5", unitate: "°C" },
    ],
  },
  {
    id: 2,
    cod: "BADPC22-MOD",
    denumire: "BADPC 22.4 Modificat",
    tip: "Asfalt",
    densitateTinta: 2.48,
    status: "Activ",
    ultimaModificare: "25/11/2024",
    umiditate: 4.0,
    temperatura: 170,
    marshall: 14,
    componente: [
      { id: 1, material: "Criblură 16/22", cantitate: 300, observatii: "" },
      { id: 2, material: "Criblură 8/16", cantitate: 250, observatii: "" },
      { id: 3, material: "Nisip 0/4", cantitate: 350, observatii: "" },
      { id: 4, material: "Filler", cantitate: 40, observatii: "" },
      { id: 5, material: "Bitum modificat", cantitate: 60, observatii: "PMB 45/80" },
    ],
    parametriProces: [
      { id: 1, parametru: "Temperatura agregat", valoare: "185-205", unitate: "°C" },
      { id: 2, parametru: "Temperatura bitum", valoare: "170-180", unitate: "°C" },
      { id: 3, parametru: "Timp malaxare uscată", valoare: "20", unitate: "sec" },
      { id: 4, parametru: "Timp malaxare umedă", valoare: "40", unitate: "sec" },
    ],
  },
  {
    id: 3,
    cod: "EMU-CSS",
    denumire: "Emulsie Cationică CSS-1",
    tip: "Emulsie",
    densitateTinta: 2.20,
    status: "Activ",
    ultimaModificare: "20/11/2024",
    umiditate: 8.0,
    slump: 5,
    componente: [
      { id: 1, material: "Agregat 0/31.5", cantitate: 850, observatii: "" },
      { id: 2, material: "Ciment", cantitate: 50, observatii: "CEM II" },
      { id: 3, material: "Apă", cantitate: 100, observatii: "" },
    ],
    parametriProces: [
      { id: 1, parametru: "Timp malaxare", valoare: "45", unitate: "sec" },
      { id: 2, parametru: "Umiditate optimă", valoare: "8±2", unitate: "%" },
    ],
  },
  {
    id: 4,
    cod: "EMU-RS2",
    denumire: "Emulsie Rapid Set RS-2",
    tip: "Emulsie",
    densitateTinta: 1.85,
    status: "Arhivat",
    ultimaModificare: "01/10/2024",
    componente: [
      { id: 1, material: "Pietriș 31.5/63", cantitate: 400, observatii: "" },
      { id: 2, material: "Pietriș 8/31.5", cantitate: 350, observatii: "" },
      { id: 3, material: "Nisip 0/8", cantitate: 250, observatii: "" },
    ],
    parametriProces: [],
  },
];

const getStatusBadge = (status: Reteta["status"]) => {
  switch (status) {
    case "Activ":
      return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3" />Activ</Badge>;
    case "Arhivat":
      return <Badge variant="secondary" className="gap-1"><Archive className="h-3 w-3" />Arhivat</Badge>;
  }
};

const getTipBadge = (tip: Reteta["tip"]) => {
  switch (tip) {
    case "Asfalt":
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Asfalt</Badge>;
    case "Emulsie":
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Emulsie</Badge>;
  }
};

const Retete = () => {
  const [retete] = useState<Reteta[]>(reteteInitiale);
  const [filters, setFilters] = useState({ cod: "", denumire: "", tip: "all", status: "all" });
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Materii prime list
  const [materiiPrimeList, setMateriiPrimeList] = useState<{ id: number; denumire: string }[]>([]);
  
  // Fetch materii prime on mount
  useEffect(() => {
    const fetchMateriiPrime = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/returneaza_materii_prime`);
        if (!response.ok) throw new Error("Eroare la încărcarea materiilor prime");
        const data = await response.json();
        setMateriiPrimeList(data || []);
      } catch (error) {
        console.error("Error fetching materii prime:", error);
      }
    };
    fetchMateriiPrime();
  }, []);
  
  // Transform to options for FilterableSelect
  const materiiPrimeOptions = useMemo(() => {
    return materiiPrimeList.map((mp: any) => ({
      value: mp.denumire || mp.material || mp.nume || String(mp.id),
      label: mp.denumire || mp.material || mp.nume || String(mp.id)
    }));
  }, [materiiPrimeList]);
  
  // Dialogs & Drawers
  const [peekDrawer, setPeekDrawer] = useState<Reteta | null>(null);
  const [editorDialog, setEditorDialog] = useState<{ reteta: Reteta | null; isNew: boolean } | null>(null);
  const [editorTab, setEditorTab] = useState("componenta");
  const [autocorrectDialog, setAutocorrectDialog] = useState<Reteta | null>(null);
  
  // Editor form state
  const [editorComponents, setEditorComponents] = useState<Component[]>([]);

  // Filtered and sorted
  const filteredRetete = useMemo(() => {
    let result = retete.filter(r => {
      if (filters.cod && !r.cod.toLowerCase().includes(filters.cod.toLowerCase())) return false;
      if (filters.denumire && !r.denumire.toLowerCase().includes(filters.denumire.toLowerCase())) return false;
      if (filters.tip !== "all" && r.tip !== filters.tip) return false;
      if (filters.status !== "all" && r.status !== filters.status) return false;
      return true;
    });

    if (sort.key && sort.direction) {
      result.sort((a, b) => {
        const aVal = a[sort.key as keyof Reteta];
        const bVal = b[sort.key as keyof Reteta];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return sort.direction === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [retete, filters, sort]);

  const paginatedRetete = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRetete.slice(start, start + itemsPerPage);
  }, [filteredRetete, page, itemsPerPage]);

  // Stats
  const stats = useMemo(() => ({
    total: retete.length,
    asfalt: retete.filter(r => r.tip === "Asfalt").length,
    emulsie: retete.filter(r => r.tip === "Emulsie").length,
  }), [retete]);

  const handleDuplicate = (reteta: Reteta) => {
    toast.success(`Rețeta ${reteta.cod} duplicată cu succes`);
  };

  const handlePrint = (reteta: Reteta) => {
    toast.success(`Imprimare fișa rețetei ${reteta.cod}`);
  };

  const handleAutocorrect = (reteta: Reteta) => {
    setAutocorrectDialog(reteta);
  };

  // Open editor dialog with initialized state
  const openEditorDialog = (reteta: Reteta | null, isNew: boolean) => {
    setEditorComponents(reteta?.componente || []);
    setEditorDialog({ reteta, isNew });
  };

  // Add new component
  const handleAddComponent = () => {
    const newComponent: Component = {
      id: Date.now(),
      material: "",
      cantitate: 0,
      observatii: ""
    };
    setEditorComponents([...editorComponents, newComponent]);
  };

  // Update component field
  const handleUpdateComponent = (id: number, field: keyof Component, value: string | number) => {
    setEditorComponents(editorComponents.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Remove component
  const handleRemoveComponent = (id: number) => {
    setEditorComponents(editorComponents.filter(c => c.id !== id));
  };

  // Calculate total cantitate for validation
  const getTotalCantitate = (componente: Component[]) => {
    return componente.reduce((sum, c) => sum + c.cantitate, 0);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FlaskConical className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rețete (Mix Design)</h1>
            <p className="text-muted-foreground">Gestionare rețete de producție și mix design</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Export în dezvoltare")}>
            <Printer className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => openEditorDialog(null, true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Rețetă
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Rețete</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FlaskConical className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Asfalt</p>
                <p className="text-2xl font-bold">{stats.asfalt}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">A</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Emulsie</p>
                <p className="text-2xl font-bold">{stats.emulsie}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">E</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Rețete</CardTitle>
          <CardDescription>Click pe rând pentru previzualizare rapidă</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Cod"
                      sortKey="cod"
                      currentSort={sort}
                      onSort={(key, dir) => setSort({ key, direction: dir })}
                      filterValue={filters.cod}
                      onFilterChange={(val) => { setFilters(f => ({ ...f, cod: val })); setPage(1); }}
                      filterPlaceholder="Caută cod..."
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Denumire"
                      sortKey="denumire"
                      currentSort={sort}
                      onSort={(key, dir) => setSort({ key, direction: dir })}
                      filterValue={filters.denumire}
                      onFilterChange={(val) => { setFilters(f => ({ ...f, denumire: val })); setPage(1); }}
                      filterPlaceholder="Caută denumire..."
                    />
                  </TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead className="text-right">Densitate</TableHead>
                  <TableHead>Modificat</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRetete.length === 0 ? (
                  <DataTableEmpty colSpan={6} message="Nu există rețete." />
                ) : (
                  paginatedRetete.map((reteta) => (
                    <TableRow
                      key={reteta.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setPeekDrawer(reteta)}
                    >
                      <TableCell className="font-medium font-mono">{reteta.cod}</TableCell>
                      <TableCell>{reteta.denumire}</TableCell>
                      <TableCell>{getTipBadge(reteta.tip)}</TableCell>
                      <TableCell className="text-right">{reteta.densitateTinta} g/cm³</TableCell>
                      <TableCell className="text-muted-foreground">{reteta.ultimaModificare}</TableCell>
                      <TableCell className="text-right">
                        <TooltipProvider>
                          <div className="flex justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openEditorDialog(reteta, false); }}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editează</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDuplicate(reteta); }}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Duplică</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleAutocorrect(reteta); }}>
                                  <Droplets className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Autocorecție umiditate</TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination
            currentPage={page}
            totalPages={Math.ceil(filteredRetete.length / itemsPerPage)}
            totalItems={filteredRetete.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setPage}
            onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!peekDrawer} onOpenChange={() => setPeekDrawer(null)}>
        <DialogContent className="max-w-2xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              {peekDrawer?.cod}
            </DialogTitle>
            <DialogDescription>{peekDrawer?.denumire}</DialogDescription>
          </DialogHeader>
          
          {peekDrawer && (
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="flex flex-wrap gap-2">
                {getTipBadge(peekDrawer.tip)}
                {getStatusBadge(peekDrawer.status)}
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scale className="h-4 w-4" />
                    Densitate țintă
                  </div>
                  <p className="text-lg font-semibold mt-1">{peekDrawer.densitateTinta} g/cm³</p>
                </div>
                {peekDrawer.umiditate && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Droplets className="h-4 w-4" />
                      Umiditate
                    </div>
                    <p className="text-lg font-semibold mt-1">{peekDrawer.umiditate}%</p>
                  </div>
                )}
                {peekDrawer.temperatura && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ThermometerSun className="h-4 w-4" />
                      Temperatură
                    </div>
                    <p className="text-lg font-semibold mt-1">{peekDrawer.temperatura}°C</p>
                  </div>
                )}
                {peekDrawer.marshall && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Beaker className="h-4 w-4" />
                      Marshall
                    </div>
                    <p className="text-lg font-semibold mt-1">{peekDrawer.marshall} kN</p>
                  </div>
                )}
                {peekDrawer.slump && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Beaker className="h-4 w-4" />
                      Slump
                    </div>
                    <p className="text-lg font-semibold mt-1">{peekDrawer.slump} cm</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Components */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Componente ({getTotalCantitate(peekDrawer.componente)} kg/tonă)
                </h4>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {peekDrawer.componente.map((comp) => (
                    <div key={comp.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                      <span className="text-sm">{comp.material}</span>
                      <span className="font-medium">{comp.cantitate} kg</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => handleDuplicate(peekDrawer!)}>
              <Copy className="h-4 w-4 mr-2" />
              Duplică
            </Button>
            <Button variant="outline" onClick={() => handlePrint(peekDrawer!)}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimă
            </Button>
            <Button onClick={() => { setPeekDrawer(null); openEditorDialog(peekDrawer!, false); }}>
              <Pencil className="h-4 w-4 mr-2" />
              Editează
            </Button>
            <Button variant="outline" onClick={() => setPeekDrawer(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Editor Dialog */}
      <Dialog open={!!editorDialog} onOpenChange={() => setEditorDialog(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" hideCloseButton>
          <DialogHeader>
            <DialogTitle>
              {editorDialog?.isNew ? "Adaugă Rețetă Nouă" : `Editează ${editorDialog?.reteta?.cod}`}
            </DialogTitle>
            <DialogDescription>
              Configurați componența și parametrii de proces
            </DialogDescription>
          </DialogHeader>

          <Tabs value={editorTab} onValueChange={setEditorTab} className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="componenta" className="gap-1">
                <ListChecks className="h-4 w-4" />
                <span className="hidden sm:inline">Componență</span>
              </TabsTrigger>
              <TabsTrigger value="parametri" className="gap-1">
                <ThermometerSun className="h-4 w-4" />
                <span className="hidden sm:inline">Parametri</span>
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1 mt-4">
              {/* Componență Tab */}
              <TabsContent value="componenta" className="mt-0 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label>Cod Rețetă</Label>
                    <Input defaultValue={editorDialog?.reteta?.cod || ""} placeholder="ex: BA16-STD" />
                  </div>
                  <div>
                    <Label>Denumire</Label>
                    <Input defaultValue={editorDialog?.reteta?.denumire || ""} placeholder="Denumire completă" />
                  </div>
                  <div>
                    <Label>Tip</Label>
                    <Select defaultValue={editorDialog?.reteta?.tip || "Asfalt"}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asfalt">Asfalt</SelectItem>
                        <SelectItem value="Emulsie">Emulsie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Componente</Label>
                    <div className="flex items-center gap-2">
                      {editorComponents.length > 0 && (
                        <span className={`text-sm font-medium ${getTotalCantitate(editorComponents) === 1000 ? 'text-green-600' : 'text-destructive'}`}>
                          Total: {getTotalCantitate(editorComponents)} kg
                          {getTotalCantitate(editorComponents) !== 1000 && (
                            <AlertTriangle className="inline h-4 w-4 ml-1" />
                          )}
                        </span>
                      )}
                      <Button size="sm" variant="outline" onClick={handleAddComponent}>
                        <Plus className="h-4 w-4 mr-1" />
                        Adaugă
                      </Button>
                    </div>
                  </div>
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead className="text-right">Cantitate (kg/tonă)</TableHead>
                          <TableHead>Observații</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editorComponents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nu există componente. Apasă "Adaugă" pentru a adăuga materiale.
                            </TableCell>
                          </TableRow>
                        ) : (
                          editorComponents.map((comp) => (
                            <TableRow key={comp.id}>
                              <TableCell>
                                <FilterableSelect
                                  value={comp.material}
                                  onValueChange={(value) => handleUpdateComponent(comp.id, "material", value)}
                                  options={materiiPrimeOptions}
                                  placeholder="Selectează material..."
                                  searchPlaceholder="Caută material..."
                                  className="h-8 min-w-[180px]"
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  type="number" 
                                  value={comp.cantitate} 
                                  onChange={(e) => handleUpdateComponent(comp.id, "cantitate", parseFloat(e.target.value) || 0)}
                                  className="h-8 w-24 text-right" 
                                  placeholder="kg"
                                />
                              </TableCell>
                              <TableCell>
                                <Input 
                                  value={comp.observatii} 
                                  onChange={(e) => handleUpdateComponent(comp.id, "observatii", e.target.value)}
                                  className="h-8" 
                                />
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleRemoveComponent(comp.id)}
                                >
                                  ×
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </TabsContent>

              {/* Parametri Tab */}
              <TabsContent value="parametri" className="mt-0 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Parametri Proces</Label>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă
                  </Button>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Parametru</TableHead>
                        <TableHead>Valoare</TableHead>
                        <TableHead>Unitate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(editorDialog?.reteta?.parametriProces || []).map((param) => (
                        <TableRow key={param.id}>
                          <TableCell>
                            <Input defaultValue={param.parametru} className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={param.valoare} className="h-8" />
                          </TableCell>
                          <TableCell>
                            <Input defaultValue={param.unitate} className="h-8 w-20" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <Separator />

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <Label>Umiditate (%)</Label>
                    <Input type="number" defaultValue={editorDialog?.reteta?.umiditate || ""} />
                  </div>
                  <div>
                    <Label>Temperatură (°C)</Label>
                    <Input type="number" defaultValue={editorDialog?.reteta?.temperatura || ""} />
                  </div>
                  <div>
                    <Label>Marshall (kN)</Label>
                    <Input type="number" defaultValue={editorDialog?.reteta?.marshall || ""} />
                  </div>
                  <div>
                    <Label>Slump (cm)</Label>
                    <Input type="number" defaultValue={editorDialog?.reteta?.slump || ""} />
                  </div>
                </div>
              </TabsContent>

            </ScrollArea>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditorDialog(null)}>Anulează</Button>
            <Button onClick={() => { toast.success("Rețetă salvată"); setEditorDialog(null); }}>
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Autocorrect Dialog */}
      <AlertDialog open={!!autocorrectDialog} onOpenChange={() => setAutocorrectDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              Autocorecție Umiditate
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ajustări propuse pentru rețeta {autocorrectDialog?.cod} bazate pe umiditatea curentă a agregatelor:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-3 py-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm">Criblură 8/16</span>
                <span className="font-medium text-primary">+0.8%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Umiditate detectată: 2.3%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm">Nisip 0/4</span>
                <span className="font-medium text-primary">+1.2%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Umiditate detectată: 4.1%</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex justify-between items-center">
                <span className="text-sm">Bitum 50/70</span>
                <span className="font-medium text-destructive">-0.2%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Compensare pentru umiditate</p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => { toast.success("Corecții aplicate"); setAutocorrectDialog(null); }}>
              Aplică Corecții
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default Retete;
