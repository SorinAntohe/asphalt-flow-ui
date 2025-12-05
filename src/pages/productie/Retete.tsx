import { useState, useMemo, useEffect } from "react";
import {
  FlaskConical,
  Plus,
  Copy,
  Droplets,
  Pencil,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Scale,
  Beaker,
  ListChecks,
  Trash2,
  Download
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
  observatii?: string;
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
    observatii: "Rețetă standard pentru BA 16",
    componente: [
      { id: 1, material: "Criblură 8/16", cantitate: 350 },
      { id: 2, material: "Criblură 4/8", cantitate: 250 },
      { id: 3, material: "Nisip 0/4", cantitate: 300 },
      { id: 4, material: "Filler", cantitate: 50 },
      { id: 5, material: "Bitum 50/70", cantitate: 50 },
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
    observatii: "Rețetă modificată cu PMB",
    componente: [
      { id: 1, material: "Criblură 16/22", cantitate: 300 },
      { id: 2, material: "Criblură 8/16", cantitate: 250 },
      { id: 3, material: "Nisip 0/4", cantitate: 350 },
      { id: 4, material: "Filler", cantitate: 40 },
      { id: 5, material: "Bitum modificat", cantitate: 60 },
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
    observatii: "Emulsie pentru tratamente superficiale",
    componente: [
      { id: 1, material: "Agregat 0/31.5", cantitate: 850 },
      { id: 2, material: "Ciment", cantitate: 50 },
      { id: 3, material: "Apă", cantitate: 100 },
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
      { id: 1, material: "Pietriș 31.5/63", cantitate: 400 },
      { id: 2, material: "Pietriș 8/31.5", cantitate: 350 },
      { id: 3, material: "Nisip 0/8", cantitate: 250 },
    ],
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
  const [retete, setRetete] = useState<Reteta[]>(reteteInitiale);
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

  const handleDelete = (reteta: Reteta) => {
    setRetete(retete.filter(r => r.id !== reteta.id));
    toast.success(`Rețeta ${reteta.cod} a fost ștearsă`);
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
      cantitate: 0
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
            <Download className="h-4 w-4 mr-2" />
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
                  <TableHead>Observații</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRetete.length === 0 ? (
                  <DataTableEmpty colSpan={5} message="Nu există rețete." />
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
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{reteta.observatii || "-"}</TableCell>
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="h-5 w-5" />
              Detalii Rețetă
            </DialogTitle>
            <DialogDescription>{peekDrawer?.denumire}</DialogDescription>
          </DialogHeader>
          
          {peekDrawer && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Cod Rețetă</div>
                  <p className="font-semibold mt-1">{peekDrawer.cod}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Denumire</div>
                  <p className="font-semibold mt-1">{peekDrawer.denumire}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Tip</div>
                  <div className="mt-1">{getTipBadge(peekDrawer.tip)}</div>
                </div>
              </div>

              {/* Observații */}
              {peekDrawer.observatii && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Observații</div>
                  <p className="mt-1">{peekDrawer.observatii}</p>
                </div>
              )}

              <Separator />

              {/* Components */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  Componente
                </h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">
                        <div>Cantitate (kg/tonă)</div>
                        <div className={`text-xs font-medium mt-1 ${getTotalCantitate(peekDrawer.componente) === 1000 ? 'text-green-600' : 'text-destructive'}`}>
                          Total: {getTotalCantitate(peekDrawer.componente)} kg
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peekDrawer.componente.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>{comp.material}</TableCell>
                        <TableCell className="text-right font-medium">{comp.cantitate} kg</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="destructive" onClick={() => { setPeekDrawer(null); handleDelete(peekDrawer!); }}>
              <Trash2 className="h-4 w-4 mr-2" />
              Șterge
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
              Configurați componența rețetei
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4">
            <div className="space-y-4">
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
                  <Button size="sm" variant="outline" onClick={handleAddComponent}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adaugă
                  </Button>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">
                          <div>Cantitate (kg/tonă)</div>
                          {editorComponents.length > 0 && (
                            <div className={`text-xs font-medium mt-1 ${getTotalCantitate(editorComponents) === 1000 ? 'text-green-600' : 'text-destructive'}`}>
                              Total: {getTotalCantitate(editorComponents)} kg
                              {getTotalCantitate(editorComponents) !== 1000 && (
                                <AlertTriangle className="inline h-3 w-3 ml-1" />
                              )}
                            </div>
                          )}
                        </TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {editorComponents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
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
                            <TableCell className="text-right">
                              <Input 
                                type="number" 
                                value={comp.cantitate} 
                                onChange={(e) => handleUpdateComponent(comp.id, "cantitate", parseFloat(e.target.value) || 0)}
                                className="h-8 w-24 text-right ml-auto" 
                                placeholder="kg"
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

              <div>
                <Label>Observații</Label>
                <textarea 
                  defaultValue={editorDialog?.reteta?.observatii || ""} 
                  placeholder="Observații generale pentru această rețetă..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                />
              </div>
            </div>
          </ScrollArea>

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
