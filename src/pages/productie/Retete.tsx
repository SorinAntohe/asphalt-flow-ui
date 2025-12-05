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
  cod_reteta: string;
  denumire: string;
  tip: string;
  materiale: string;
  cantitati: string;
  observatii: string;
}

// Helper to parse API data into components for display
const parseComponents = (materiale: string, cantitati: string): Component[] => {
  if (!materiale || !cantitati) return [];
  const materials = materiale.split(",").map(m => m.trim());
  const quantities = cantitati.split(",").map(q => parseFloat(q.trim()) || 0);
  return materials.map((material, idx) => ({
    id: idx + 1,
    material,
    cantitate: quantities[idx] || 0
  }));
};

const getTipBadge = (tip: string) => {
  switch (tip) {
    case "Asfalt":
      return <Badge variant="outline" className="border-orange-500 text-orange-600">Asfalt</Badge>;
    case "Emulsie":
      return <Badge variant="outline" className="border-blue-500 text-blue-600">Emulsie</Badge>;
    default:
      return <Badge variant="outline">{tip}</Badge>;
  }
};

const Retete = () => {
  const [retete, setRetete] = useState<Reteta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ cod: "", denumire: "", tip: "all" });
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Editor form state
  const [editorForm, setEditorForm] = useState({
    denumire: "",
    tip: "Asfalt",
    observatii: ""
  });
  
  // Materii prime list - can be string[] or object[]
  const [materiiPrimeList, setMateriiPrimeList] = useState<any[]>([]);
  
  // Fetch retete on mount
  useEffect(() => {
    const fetchRetete = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
        if (!response.ok) throw new Error("Eroare la încărcarea rețetelor");
        const data = await response.json();
        setRetete(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching retete:", error);
        toast.error("Nu s-au putut încărca rețetele");
      } finally {
        setLoading(false);
      }
    };
    fetchRetete();
  }, []);
  
  // Fetch materii prime on mount
  useEffect(() => {
    const fetchMateriiPrime = async () => {
      try {
        console.log("Fetching materials from:", `${API_BASE_URL}/returneaza_materiale`);
        const response = await fetch(`${API_BASE_URL}/returneaza_materiale`);
        if (!response.ok) throw new Error("Eroare la încărcarea materialelor");
        const data = await response.json();
        console.log("API response:", data);
        // API returns array of objects: [{materiale_prime: "..."}, ...]
        const materiale = Array.isArray(data) 
          ? data.map((item: any) => item.materiale_prime).filter(Boolean)
          : [];
        console.log("Parsed materiale:", materiale);
        setMateriiPrimeList(materiale);
      } catch (error) {
        console.error("Error fetching materiale:", error);
        // Fallback pentru testare când API-ul nu este accesibil
        setMateriiPrimeList([
          "0/4 NAT", "0/4 CONC", "0/4 CRIBLURI", "4/8 CONC", "4/8 CRIBLURI",
          "BITUM 50/70", "FILLER", "CTL", "MOTORINA", "CURENT ELECTRIC"
        ]);
      }
    };
    fetchMateriiPrime();
  }, []);
  
  // Transform to options for FilterableSelect
  const materiiPrimeOptions = useMemo(() => {
    return materiiPrimeList.map((mp: any) => {
      // Handle both string array and object array
      const value = typeof mp === 'string' ? mp : (mp.denumire || mp.material || mp.nume || String(mp.id));
      return { value, label: value };
    });
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
      if (filters.cod && !r.cod_reteta?.toLowerCase().includes(filters.cod.toLowerCase())) return false;
      if (filters.denumire && !r.denumire?.toLowerCase().includes(filters.denumire.toLowerCase())) return false;
      if (filters.tip !== "all" && r.tip !== filters.tip) return false;
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
    toast.success(`Rețeta ${reteta.cod_reteta} duplicată cu succes`);
  };

  const handlePrint = (reteta: Reteta) => {
    toast.success(`Imprimare fișa rețetei ${reteta.cod_reteta}`);
  };

  const handleDelete = async (reteta: Reteta) => {
    try {
      console.log("=== STERGERE RETETA ===");
      console.log("Cod reteta de sters:", reteta.cod_reteta);
      
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "retete",
          coloana: "cod_reteta",
          valoare: reteta.cod_reteta
        })
      });

      if (!response.ok) throw new Error('Failed to delete reteta');
      
      const result = await response.json();
      console.log("Raspuns stergere:", result);

      toast.success(`Rețeta ${reteta.cod_reteta} a fost ștearsă`);
      
      // Refresh list
      const refreshResponse = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setRetete(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error deleting reteta:", error);
      toast.error("Nu s-a putut șterge rețeta");
    }
  };

  const handleAutocorrect = (reteta: Reteta) => {
    setAutocorrectDialog(reteta);
  };

  // Open editor dialog with initialized state
  const openEditorDialog = (reteta: Reteta | null, isNew: boolean) => {
    if (reteta) {
      setEditorComponents(parseComponents(reteta.materiale, reteta.cantitati));
      setEditorForm({
        denumire: reteta.denumire || "",
        tip: reteta.tip || "Asfalt",
        observatii: reteta.observatii || ""
      });
    } else {
      setEditorComponents([]);
      setEditorForm({
        denumire: "",
        tip: "Asfalt",
        observatii: ""
      });
    }
    setEditorDialog({ reteta, isNew });
  };

  // Save reteta to API
  const handleSaveReteta = async () => {
    if (!editorForm.denumire.trim()) {
      toast.error("Denumirea este obligatorie");
      return;
    }
    if (editorComponents.length === 0) {
      toast.error("Adăugați cel puțin un material");
      return;
    }

    const materiale = editorComponents.map(c => c.material).join(",");
    const cantitati = editorComponents.map(c => c.cantitate).join(",");

    try {
      if (editorDialog?.reteta && !editorDialog.isNew) {
        // Edit existing reteta
        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tabel: "retete",
            id: editorDialog.reteta.id,
            update: {
              denumire: editorForm.denumire,
              tip: editorForm.tip,
              materiale,
              cantitati,
              observatii: editorForm.observatii
            }
          })
        });

        if (!response.ok) throw new Error("Eroare la editarea rețetei");
        toast.success("Rețetă actualizată cu succes");
      } else {
        // Add new reteta - send each material separately
        console.log("=== ADAUGARE RETETA DEBUG ===");
        console.log("Total componente:", editorComponents.length);
        console.log("Componente:", editorComponents);
        
        const basePayload = {
          denumire: editorForm.denumire,
          tip: editorForm.tip,
          observatii: editorForm.observatii
        };
        
        // First call without cod_reteta to get the generated code
        const firstComponent = editorComponents[0];
        const firstPayload = {
          ...basePayload,
          materiale: firstComponent.material,
          cantitati: String(firstComponent.cantitate),
        };
        
        console.log("=== PRIMA CERERE (fara cod_reteta) ===");
        console.log("Payload:", JSON.stringify(firstPayload, null, 2));
        
        const firstResponse = await fetch(`${API_BASE_URL}/productie/adauga/reteta`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(firstPayload)
        });

        if (!firstResponse.ok) throw new Error("Eroare la salvarea rețetei");
        
        const firstResult = await firstResponse.json();
        console.log("Raspuns prima cerere:", firstResult);
        // Backend returns cod_contract instead of cod_reteta
        const codReteta = firstResult.cod_reteta || firstResult.cod_contract;
        console.log("Cod reteta generat:", codReteta);
        
        // For remaining components, use the same cod_reteta
        console.log("=== CERERI URMATOARE (cu cod_reteta) ===");
        console.log("Numar cereri ramase:", editorComponents.length - 1);
        
        for (let i = 1; i < editorComponents.length; i++) {
          const component = editorComponents[i];
          const payload = {
            ...basePayload,
            cod_reteta: codReteta,
            materiale: component.material,
            cantitati: String(component.cantitate),
          };
          
          console.log(`Cerere ${i}/${editorComponents.length - 1}:`, JSON.stringify(payload, null, 2));
          
          const response = await fetch(`${API_BASE_URL}/productie/adauga/reteta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          
          const result = await response.json();
          console.log(`Raspuns cerere ${i}:`, result);
        }
        
        console.log("=== FINALIZAT ADAUGARE ===");
        toast.success(`Rețetă ${codReteta || ''} adăugată cu succes`);
      }
      
      setEditorDialog(null);
      
      // Refresh list
      const refreshResponse = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        setRetete(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error saving reteta:", error);
      toast.error("Eroare la salvarea rețetei");
    }
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
                      sortKey="cod_reteta"
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
                  <TableHead>Materiale</TableHead>
                  <TableHead>Observații</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        Se încarcă...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedRetete.length === 0 ? (
                  <DataTableEmpty colSpan={6} message="Nu există rețete." />
                ) : (
                  paginatedRetete.map((reteta) => (
                    <TableRow
                      key={reteta.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setPeekDrawer(reteta)}
                    >
                      <TableCell className="font-medium font-mono">{reteta.cod_reteta}</TableCell>
                      <TableCell>{reteta.denumire}</TableCell>
                      <TableCell>{getTipBadge(reteta.tip)}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[300px] truncate">{reteta.materiale || "-"}</TableCell>
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
                  <p className="font-semibold mt-1">{peekDrawer.cod_reteta}</p>
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
                        <div className={`text-xs font-medium mt-1 ${getTotalCantitate(parseComponents(peekDrawer.materiale, peekDrawer.cantitati)) === 1000 ? 'text-green-600' : 'text-destructive'}`}>
                          Total: {getTotalCantitate(parseComponents(peekDrawer.materiale, peekDrawer.cantitati))} kg
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parseComponents(peekDrawer.materiale, peekDrawer.cantitati).map((comp) => (
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
              {editorDialog?.isNew ? "Adaugă Rețetă Nouă" : `Editează ${editorDialog?.reteta?.cod_reteta}`}
            </DialogTitle>
            <DialogDescription>
              Configurați componența rețetei
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Denumire *</Label>
                  <Input 
                    value={editorForm.denumire} 
                    onChange={(e) => setEditorForm(prev => ({ ...prev, denumire: e.target.value }))}
                    placeholder="Denumire completă" 
                  />
                </div>
                <div>
                  <Label>Tip</Label>
                  <Select 
                    value={editorForm.tip} 
                    onValueChange={(v) => setEditorForm(prev => ({ ...prev, tip: v }))}
                  >
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
                  value={editorForm.observatii} 
                  onChange={(e) => setEditorForm(prev => ({ ...prev, observatii: e.target.value }))}
                  placeholder="Observații generale pentru această rețetă..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditorDialog(null)}>Anulează</Button>
            <Button onClick={handleSaveReteta}>
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
              Ajustări propuse pentru rețeta {autocorrectDialog?.cod_reteta} bazate pe umiditatea curentă a agregatelor:
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
