import { useState, useMemo, useEffect } from "react";
import { Truck, Plus, Download, Settings, Pencil, Trash2, Wrench } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTablePagination, DataTableColumnHeader } from "@/components/ui/data-table";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";

interface Echipament {
  id: number;
  serie: string;
  denumire: string;
  producator: string;
  anFabricatie: number;
  valoareAchizitie: number;
  durataAmortizare: number;
}

const Echipamente = () => {
  const [echipamente, setEchipamente] = useState<Echipament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEchipament, setSelectedEchipament] = useState<Echipament | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isServisareDialogOpen, setIsServisareDialogOpen] = useState(false);
  
  // Servisare form state
  const [servisareFormData, setServisareFormData] = useState({
    descriere: "",
    cost: ""
  });
  // Add form state
  const [addFormData, setAddFormData] = useState({
    denumire: "",
    serie: "",
    producator: "",
    anFabricatie: "",
    valoareAchizitie: "",
    durataAmortizare: ""
  });

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    denumire: "",
    serie: "",
    producator: "",
    anFabricatie: "",
    valoareAchizitie: "",
    durataAmortizare: ""
  });
  
  // Sorting & Filters
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data from API
  const fetchEchipamente = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/mentenanta/returneaza/echipamente_flota`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      const mapped: Echipament[] = data.map((item: any) => ({
        id: item.id,
        serie: item.serie || "",
        denumire: item.denumire || "",
        producator: item.producator || "",
        anFabricatie: parseInt(item.an_fabricatie) || 0,
        valoareAchizitie: parseFloat(item.valoare_achizitie) || 0,
        durataAmortizare: parseInt(item.durata_amortizare) || 0
      }));
      setEchipamente(mapped);
    } catch (error) {
      console.error("Error fetching echipamente:", error);
      toast.error("Eroare la încărcarea echipamentelor");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEchipamente();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = echipamente.length;
    const valoareTotala = echipamente.reduce((acc, e) => acc + e.valoareAchizitie, 0);
    return { total, valoareTotala };
  }, [echipamente]);

  // Filtering and sorting
  const filteredEchipamente = useMemo(() => {
    let result = [...echipamente];
    
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
  }, [echipamente, columnFilters, sortKey, sortDirection]);

  const paginatedEchipamente = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEchipamente.slice(start, start + itemsPerPage);
  }, [filteredEchipamente, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEchipamente.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilter = (key: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleRowClick = (echipament: Echipament) => {
    setSelectedEchipament(echipament);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    exportToCSV(filteredEchipamente, "echipamente_flota", [
      { key: "id", label: "ID" },
      { key: "serie", label: "Serie" },
      { key: "denumire", label: "Denumire" },
      { key: "producator", label: "Producător" },
      { key: "anFabricatie", label: "An Fabricație" },
      { key: "valoareAchizitie", label: "Valoare Achiziție (RON)" },
      { key: "durataAmortizare", label: "Durata Amortizare (luni)" },
    ]);
    toast.success("Export realizat cu succes");
  };

  const handleAddSubmit = async () => {
    if (!addFormData.denumire) {
      toast.error("Completați câmpurile obligatorii");
      return;
    }
    try {
      const payload = {
        serie: addFormData.serie,
        denumire: addFormData.denumire,
        producator: addFormData.producator,
        an_fabricatie: parseInt(addFormData.anFabricatie) || 0,
        valoare_achizitie: parseFloat(addFormData.valoareAchizitie) || 0,
        durata_amortizare: parseInt(addFormData.durataAmortizare) || 0
      };
      const response = await fetch(`${API_BASE_URL}/mentenanta/adauga/echipamente_flota`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Failed to add");
      toast.success("Echipament adăugat cu succes");
      setIsAddDialogOpen(false);
      setAddFormData({
        denumire: "",
        serie: "",
        producator: "",
        anFabricatie: "",
        valoareAchizitie: "",
        durataAmortizare: ""
      });
      fetchEchipamente();
    } catch (error) {
      console.error("Error adding echipament:", error);
      toast.error("Eroare la adăugarea echipamentului");
    }
  };

  const handleOpenEdit = () => {
    if (selectedEchipament) {
      setEditFormData({
        denumire: selectedEchipament.denumire,
        serie: selectedEchipament.serie,
        producator: selectedEchipament.producator,
        anFabricatie: String(selectedEchipament.anFabricatie),
        valoareAchizitie: String(selectedEchipament.valoareAchizitie),
        durataAmortizare: String(selectedEchipament.durataAmortizare)
      });
      setIsDetailOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = () => {
    if (!editFormData.denumire) {
      toast.error("Completați câmpurile obligatorii");
      return;
    }
    if (selectedEchipament) {
      setEchipamente(prev => prev.map(e => 
        e.id === selectedEchipament.id 
          ? {
              ...e,
              denumire: editFormData.denumire,
              serie: editFormData.serie,
              producator: editFormData.producator,
              anFabricatie: parseInt(editFormData.anFabricatie) || 0,
              valoareAchizitie: parseFloat(editFormData.valoareAchizitie) || 0,
              durataAmortizare: parseInt(editFormData.durataAmortizare) || 0
            }
          : e
      ));
      toast.success("Echipament actualizat cu succes");
      setIsEditDialogOpen(false);
    }
  };

  const handleOpenDelete = () => {
    setIsDetailOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedEchipament) {
      setEchipamente(prev => prev.filter(e => e.id !== selectedEchipament.id));
      toast.success("Echipament șters cu succes");
      setIsDeleteDialogOpen(false);
      setSelectedEchipament(null);
    }
  };

  const handleOpenServisare = () => {
    setServisareFormData({ descriere: "", cost: "" });
    setIsDetailOpen(false);
    setIsServisareDialogOpen(true);
  };

  const handleServisareSubmit = () => {
    if (!servisareFormData.descriere) {
      toast.error("Introduceți descrierea servisării");
      return;
    }
    toast.success("Servisare înregistrată cu succes");
    setIsServisareDialogOpen(false);
    setServisareFormData({ descriere: "", cost: "" });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 sm:pt-6">
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
          <CardContent className="p-4 sm:pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Truck className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.valoareTotala.toLocaleString()} RON</p>
                <p className="text-sm text-muted-foreground">Valoare Totală Achiziții</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <DataTableColumnHeader
                      title="ID"
                      sortKey="id"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.id || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("id", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Denumire"
                      sortKey="denumire"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.denumire || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("denumire", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Serie"
                      sortKey="serie"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.serie || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("serie", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Producător"
                      sortKey="producator"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.producator || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("producator", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="An Fabricație"
                      sortKey="anFabricatie"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.anFabricatie || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("anFabricatie", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Valoare Achiziție"
                      sortKey="valoareAchizitie"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.valoareAchizitie || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("valoareAchizitie", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Durată Amortizare (luni)"
                      sortKey="durataAmortizare"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.durataAmortizare || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("durataAmortizare", value)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedEchipamente.map(echipament => (
                  <TableRow 
                    key={echipament.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(echipament)}
                  >
                    <TableCell className="font-medium">{echipament.id}</TableCell>
                    <TableCell>{echipament.denumire}</TableCell>
                    <TableCell>{echipament.serie}</TableCell>
                    <TableCell>{echipament.producator}</TableCell>
                    <TableCell>{echipament.anFabricatie}</TableCell>
                    <TableCell>{echipament.valoareAchizitie.toLocaleString()} RON</TableCell>
                    <TableCell>{echipament.durataAmortizare} luni</TableCell>
                  </TableRow>
                ))}
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

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          {selectedEchipament && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {selectedEchipament.denumire}
                </DialogTitle>
                <DialogDescription>ID: {selectedEchipament.id}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">{selectedEchipament.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Denumire</p>
                  <p className="font-medium">{selectedEchipament.denumire}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Serie</p>
                  <p className="font-medium">{selectedEchipament.serie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Producător</p>
                  <p className="font-medium">{selectedEchipament.producator}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">An Fabricație</p>
                  <p className="font-medium">{selectedEchipament.anFabricatie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valoare Achiziție</p>
                  <p className="font-medium">{selectedEchipament.valoareAchizitie.toLocaleString()} RON</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Durată Amortizare</p>
                  <p className="font-medium">{selectedEchipament.durataAmortizare} luni</p>
                </div>
              </div>

              <DialogFooter className="gap-2 flex-wrap">
                <Button variant="secondary" onClick={handleOpenServisare} className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Servisare
                </Button>
                <Button variant="outline" onClick={handleOpenEdit}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button variant="destructive" onClick={handleOpenDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Servisare Dialog */}
      <Dialog open={isServisareDialogOpen} onOpenChange={setIsServisareDialogOpen}>
        <DialogContent className="max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Înregistrare Servisare
            </DialogTitle>
            <DialogDescription>
              {selectedEchipament?.denumire}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Descriere servisare *</Label>
              <Textarea 
                placeholder="Descrieți lucrările efectuate..."
                value={servisareFormData.descriere}
                onChange={(e) => setServisareFormData(prev => ({ ...prev, descriere: e.target.value }))}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Cost (RON)</Label>
              <Input 
                type="number"
                placeholder="ex: 2500"
                value={servisareFormData.cost}
                onChange={(e) => setServisareFormData(prev => ({ ...prev, cost: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServisareDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleServisareSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Echipament</DialogTitle>
            <DialogDescription>Completați datele echipamentului nou</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Denumire *</Label>
                <Input 
                  placeholder="Denumire echipament"
                  value={addFormData.denumire}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, denumire: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Serie</Label>
                <Input 
                  placeholder="Serie echipament"
                  value={addFormData.serie}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, serie: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Producător</Label>
                <Input 
                  placeholder="Producător"
                  value={addFormData.producator}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, producator: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>An Fabricație</Label>
                <Input 
                  type="number" 
                  placeholder="2024"
                  value={addFormData.anFabricatie}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, anFabricatie: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valoare Achiziție (RON)</Label>
                <Input 
                  type="number" 
                  placeholder="100000"
                  value={addFormData.valoareAchizitie}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, valoareAchizitie: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Durată Amortizare (luni)</Label>
                <Input 
                  type="number" 
                  placeholder="60"
                  value={addFormData.durataAmortizare}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, durataAmortizare: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleAddSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Editează Echipament</DialogTitle>
            <DialogDescription>Modificați datele echipamentului</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Denumire *</Label>
                <Input 
                  placeholder="Denumire echipament"
                  value={editFormData.denumire}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, denumire: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Serie</Label>
                <Input 
                  placeholder="Serie echipament"
                  value={editFormData.serie}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, serie: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Producător</Label>
                <Input 
                  placeholder="Producător"
                  value={editFormData.producator}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, producator: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>An Fabricație</Label>
                <Input 
                  type="number" 
                  placeholder="2024"
                  value={editFormData.anFabricatie}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, anFabricatie: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valoare Achiziție (RON)</Label>
                <Input 
                  type="number" 
                  placeholder="100000"
                  value={editFormData.valoareAchizitie}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, valoareAchizitie: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Durată Amortizare (luni)</Label>
                <Input 
                  type="number" 
                  placeholder="60"
                  value={editFormData.durataAmortizare}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, durataAmortizare: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEditSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmați ștergerea?</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteți sigur că doriți să ștergeți echipamentul "{selectedEchipament?.denumire}"? 
              Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Echipamente;
