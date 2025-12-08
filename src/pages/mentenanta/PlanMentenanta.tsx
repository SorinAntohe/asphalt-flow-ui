import { useState, useMemo, useEffect } from "react";
import { Wrench, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination, DataTableColumnHeader, DataTableEmpty } from "@/components/ui/data-table";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { exportToCSV } from "@/lib/exportUtils";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/api";

interface PlanMentenanta {
  id: number;
  cod: string;
  denumire: string;
  dataUltimaRevizie: string;
  dataRevizieUrmatoare: string;
  costAproxRevizie: number;
  observatii: string;
}

interface Echipament {
  cod: string;
  denumire: string;
}

// Mock data
const mockPlanMentenanta: PlanMentenanta[] = [
  { 
    id: 1, cod: "ECH-001", denumire: "Stație Asfalt Mobilă 160t/h",
    dataUltimaRevizie: "15/06/2024", dataRevizieUrmatoare: "15/12/2024", costAproxRevizie: 8500, observatii: "Verificare completă sistem"
  },
  { 
    id: 2, cod: "ECH-002", denumire: "Încărcător Frontal Cat 966",
    dataUltimaRevizie: "01/08/2024", dataRevizieUrmatoare: "01/02/2025", costAproxRevizie: 3200, observatii: ""
  },
  { 
    id: 3, cod: "VEH-001", denumire: "Camion Basculant MAN TGS 8x4",
    dataUltimaRevizie: "20/09/2024", dataRevizieUrmatoare: "20/03/2025", costAproxRevizie: 2500, observatii: "Schimb ulei + filtre"
  },
];

const PlanMentenanta = () => {
  const [data, setData] = useState<PlanMentenanta[]>(mockPlanMentenanta);
  const [echipamente, setEchipamente] = useState<Echipament[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlanMentenanta | null>(null);
  
  // Sorting & Filters
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Form state
  const [formData, setFormData] = useState({
    cod: "",
    denumire: "",
    dataUltimaRevizie: "",
    dataRevizieUrmatoare: "",
    costAproxRevizie: "",
    observatii: "",
  });

  // Fetch echipamente for dropdown
  useEffect(() => {
    const fetchEchipamente = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/mentenanta/returneaza/echipamente`);
        if (response.ok) {
          const result = await response.json();
          const mapped = result.map((item: any) => ({
            cod: item.cod || item.cod_echipament || "",
            denumire: item.denumire || ""
          }));
          setEchipamente(mapped);
        }
      } catch (error) {
        console.error("Error fetching echipamente:", error);
      }
    };
    fetchEchipamente();
  }, []);

  const echipamenteOptions = useMemo(() => 
    echipamente.map(e => ({ value: e.cod, label: `${e.cod} - ${e.denumire}` })),
    [echipamente]
  );

  // When cod changes, auto-populate denumire
  const handleCodChange = (cod: string) => {
    setFormData(prev => ({ ...prev, cod }));
    const found = echipamente.find(e => e.cod === cod);
    if (found) {
      setFormData(prev => ({ ...prev, denumire: found.denumire }));
    }
  };

  // Filtering and sorting
  const filteredData = useMemo(() => {
    let result = [...data];
    
    Object.entries(columnFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => 
          String(item[key as keyof PlanMentenanta]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });
    
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof PlanMentenanta];
        const bVal = b[sortKey as keyof PlanMentenanta];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        return sortDirection === "asc" 
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    
    return result;
  }, [data, columnFilters, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilter = (key: string, value: string) => {
    setColumnFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleRowClick = (item: PlanMentenanta) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  const handleExport = () => {
    exportToCSV(filteredData, "plan_mentenanta", [
      { key: "cod", label: "Cod" },
      { key: "denumire", label: "Denumire" },
      { key: "dataUltimaRevizie", label: "Data Ultima Revizie" },
      { key: "dataRevizieUrmatoare", label: "Data Revizie Următoare" },
      { key: "costAproxRevizie", label: "Cost Aprox. Revizie (RON)" },
    ]);
    toast.success("Export realizat cu succes");
  };

  const resetForm = () => {
    setFormData({
      cod: "",
      denumire: "",
      dataUltimaRevizie: "",
      dataRevizieUrmatoare: "",
      costAproxRevizie: "",
      observatii: "",
    });
  };

  const handleAddSubmit = () => {
    if (!formData.cod || !formData.denumire) {
      toast.error("Selectați un echipament");
      return;
    }
    const newItem: PlanMentenanta = {
      id: data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1,
      cod: formData.cod,
      denumire: formData.denumire,
      dataUltimaRevizie: formData.dataUltimaRevizie,
      dataRevizieUrmatoare: formData.dataRevizieUrmatoare,
      costAproxRevizie: parseFloat(formData.costAproxRevizie) || 0,
      observatii: formData.observatii,
    };
    setData(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast.success("Plan mentenanță adăugat cu succes");
  };

  const handleOpenEdit = () => {
    if (selectedItem) {
      setFormData({
        cod: selectedItem.cod,
        denumire: selectedItem.denumire,
        dataUltimaRevizie: selectedItem.dataUltimaRevizie,
        dataRevizieUrmatoare: selectedItem.dataRevizieUrmatoare,
        costAproxRevizie: String(selectedItem.costAproxRevizie),
        observatii: selectedItem.observatii || "",
      });
      setIsDetailOpen(false);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = () => {
    if (!selectedItem) return;
    setData(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              cod: formData.cod,
              denumire: formData.denumire,
              dataUltimaRevizie: formData.dataUltimaRevizie,
              dataRevizieUrmatoare: formData.dataRevizieUrmatoare,
              costAproxRevizie: parseFloat(formData.costAproxRevizie) || 0,
              observatii: formData.observatii,
            }
          : item
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
    toast.success("Plan mentenanță actualizat cu succes");
  };

  const handleOpenDelete = () => {
    setIsDetailOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setData(prev => prev.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast.success("Plan mentenanță șters cu succes");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Plan Mentenanță</h1>
            <p className="text-muted-foreground">Gestionare mentenanță echipamente și flotă</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={data.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă
          </Button>
        </div>
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
                      title="Cod"
                      sortKey="cod"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.cod || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("cod", value)}
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
                      title="Data Ultima Revizie"
                      sortKey="dataUltimaRevizie"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.dataUltimaRevizie || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("dataUltimaRevizie", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Data Revizie Următoare"
                      sortKey="dataRevizieUrmatoare"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.dataRevizieUrmatoare || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("dataRevizieUrmatoare", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Cost Aprox. Revizie"
                      sortKey="costAproxRevizie"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.costAproxRevizie || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("costAproxRevizie", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Observații"
                      sortKey="observatii"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.observatii || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("observatii", value)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <DataTableEmpty colSpan={6} message="Nu există planuri de mentenanță" />
                ) : (
                  paginatedData.map(item => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="font-medium">{item.cod}</TableCell>
                      <TableCell>{item.denumire}</TableCell>
                      <TableCell>{item.dataUltimaRevizie}</TableCell>
                      <TableCell>{item.dataRevizieUrmatoare}</TableCell>
                      <TableCell>{item.costAproxRevizie.toLocaleString()} RON</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.observatii || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4">
            <DataTablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
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
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  {selectedItem.cod}
                </DialogTitle>
                <DialogDescription>{selectedItem.denumire}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cod</p>
                  <p className="font-medium">{selectedItem.cod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Denumire</p>
                  <p className="font-medium">{selectedItem.denumire}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Ultima Revizie</p>
                  <p className="font-medium">{selectedItem.dataUltimaRevizie || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Revizie Următoare</p>
                  <p className="font-medium">{selectedItem.dataRevizieUrmatoare || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Cost Aprox. Revizie</p>
                  <p className="font-medium">{selectedItem.costAproxRevizie.toLocaleString()} RON</p>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="destructive" onClick={handleOpenDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Șterge
                </Button>
                <Button onClick={handleOpenEdit} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Editează
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Plan Mentenanță</DialogTitle>
            <DialogDescription>Selectați echipamentul și completați datele de revizie</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Echipament *</Label>
              <FilterableSelect
                options={echipamenteOptions}
                value={formData.cod}
                onValueChange={handleCodChange}
                placeholder="Selectați echipament..."
              />
            </div>
            {formData.denumire && (
              <div className="space-y-2">
                <Label>Denumire</Label>
                <Input value={formData.denumire} disabled className="bg-muted" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Ultima Revizie</Label>
                <Input 
                  placeholder="dd/mm/yyyy"
                  value={formData.dataUltimaRevizie}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataUltimaRevizie: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Revizie Următoare</Label>
                <Input 
                  placeholder="dd/mm/yyyy"
                  value={formData.dataRevizieUrmatoare}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataRevizieUrmatoare: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cost Aprox. Revizie (RON)</Label>
              <Input 
                type="number"
                placeholder="ex: 5000"
                value={formData.costAproxRevizie}
                onChange={(e) => setFormData(prev => ({ ...prev, costAproxRevizie: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleAddSubmit}>Adaugă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Editează Plan Mentenanță</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cod</Label>
                <Input value={formData.cod} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Denumire</Label>
                <Input value={formData.denumire} disabled className="bg-muted" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data Ultima Revizie</Label>
                <Input 
                  placeholder="dd/mm/yyyy"
                  value={formData.dataUltimaRevizie}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataUltimaRevizie: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Data Revizie Următoare</Label>
                <Input 
                  placeholder="dd/mm/yyyy"
                  value={formData.dataRevizieUrmatoare}
                  onChange={(e) => setFormData(prev => ({ ...prev, dataRevizieUrmatoare: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Cost Aprox. Revizie (RON)</Label>
              <Input 
                type="number"
                placeholder="ex: 5000"
                value={formData.costAproxRevizie}
                onChange={(e) => setFormData(prev => ({ ...prev, costAproxRevizie: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEditSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi planul de mentenanță pentru "{selectedItem?.cod}"? Această acțiune nu poate fi anulată.
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

export default PlanMentenanta;
