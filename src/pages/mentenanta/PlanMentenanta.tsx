import { useState, useMemo, useEffect } from "react";
import { Wrench, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  observatii?: string;
  descriereServisare?: string;
  costServisare?: number;
}

interface Echipament {
  cod: string;
  denumire: string;
}

const PlanMentenanta = () => {
  const [data, setData] = useState<PlanMentenanta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [echipamente, setEchipamente] = useState<Echipament[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isServisareDialogOpen, setIsServisareDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PlanMentenanta | null>(null);
  const [servisareFormData, setServisareFormData] = useState({ descriere: "", cost: "" });
  
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

  // Fetch planuri mentenanta
  const fetchPlanuri = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/mentenanta/returneaza/planuri_mentenanta`);
      if (response.ok) {
        const result = await response.json();
        const mapped = result.map((item: any) => ({
          id: item.id,
          cod: item.cod || "",
          denumire: item.denumire || "",
          dataUltimaRevizie: item.data_ultima_revizie || "",
          dataRevizieUrmatoare: item.data_revizie_urmatoare || "",
          costAproxRevizie: parseFloat(item.cost_aprox_revizie) || 0,
          observatii: item.observatii || "",
          descriereServisare: item.descriere_servisare || "",
          costServisare: parseFloat(item.cost_servisare) || 0,
        }));
        setData(mapped);
      }
    } catch (error) {
      console.error("Error fetching planuri mentenanta:", error);
      toast.error("Eroare la încărcarea datelor");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch echipamente for dropdown
  useEffect(() => {
    fetchPlanuri();
    
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
    echipamente.map(e => ({ value: e.denumire, label: e.denumire })),
    [echipamente]
  );

  // When denumire changes, auto-populate cod
  const handleDenumireChange = (denumire: string) => {
    setFormData(prev => ({ ...prev, denumire }));
    const found = echipamente.find(e => e.denumire === denumire);
    if (found) {
      setFormData(prev => ({ ...prev, cod: found.cod }));
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

  const handleAddSubmit = async () => {
    if (!formData.denumire) {
      toast.error("Introduceți denumirea");
      return;
    }
    
    try {
      const payload = {
        denumire: formData.denumire,
        data_ultima_revizie: formData.dataUltimaRevizie,
        data_revizie_urmatare: formData.dataRevizieUrmatoare,
        cost_aprox_revizie: parseFloat(formData.costAproxRevizie) || 0,
      };
      
      const response = await fetch(`${API_BASE_URL}/mentenanta/adauga/planur_mentenanta`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        setIsAddDialogOpen(false);
        resetForm();
        toast.success("Plan mentenanță adăugat cu succes");
        fetchPlanuri();
      } else {
        toast.error("Eroare la adăugarea planului");
      }
    } catch (error) {
      console.error("Error adding plan:", error);
      toast.error("Eroare la adăugarea planului");
    }
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

  const handleOpenServisare = () => {
    setServisareFormData({ descriere: "", cost: "" });
    setIsDetailOpen(false);
    setIsServisareDialogOpen(true);
  };

  const handleServisareSubmit = () => {
    if (!selectedItem) return;
    setData(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              descriereServisare: servisareFormData.descriere,
              costServisare: parseFloat(servisareFormData.cost) || 0,
            }
          : item
      )
    );
    setIsServisareDialogOpen(false);
    toast.success("Servisare înregistrată cu succes");
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
                  <TableHead>
                    <DataTableColumnHeader
                      title="Descriere Servisare"
                      sortKey="descriereServisare"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.descriereServisare || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("descriereServisare", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Cost Servisare"
                      sortKey="costServisare"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={columnFilters.costServisare || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("costServisare", value)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <DataTableEmpty colSpan={7} message="Nu există planuri de mentenanță" />
                ) : (
                  paginatedData.map(item => (
                    <TableRow 
                      key={item.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(item)}
                    >
                      <TableCell className="font-medium">{item.denumire}</TableCell>
                      <TableCell>{item.dataUltimaRevizie}</TableCell>
                      <TableCell>{item.dataRevizieUrmatoare}</TableCell>
                      <TableCell>{item.costAproxRevizie.toLocaleString()} RON</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.observatii || "-"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{item.descriereServisare || "-"}</TableCell>
                      <TableCell>{item.costServisare > 0 ? `${item.costServisare.toLocaleString()} RON` : "-"}</TableCell>
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
                  {selectedItem.denumire}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="col-span-2">
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

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="destructive" onClick={handleOpenDelete} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Șterge
                </Button>
                <Button variant="secondary" onClick={handleOpenServisare} className="gap-2">
                  <Wrench className="h-4 w-4" />
                  Servisare
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
                value={formData.denumire}
                onValueChange={handleDenumireChange}
                placeholder="Selectați echipament..."
              />
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
            <div className="space-y-2">
              <Label>Denumire</Label>
              <Input value={formData.denumire} disabled className="bg-muted" />
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
              Ești sigur că vrei să ștergi planul de mentenanță pentru "{selectedItem?.denumire}"? Această acțiune nu poate fi anulată.
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

      {/* Servisare Dialog */}
      <Dialog open={isServisareDialogOpen} onOpenChange={setIsServisareDialogOpen}>
        <DialogContent className="max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Înregistrare Servisare
            </DialogTitle>
            <DialogDescription>
              Înregistrați detaliile servisării pentru {selectedItem?.denumire}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Descriere Servisare</Label>
              <Textarea
                value={servisareFormData.descriere}
                onChange={(e) => setServisareFormData(prev => ({ ...prev, descriere: e.target.value }))}
                placeholder="Introduceți descrierea servisării..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Cost Servisare (RON)</Label>
              <Input
                type="number"
                value={servisareFormData.cost}
                onChange={(e) => setServisareFormData(prev => ({ ...prev, cost: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsServisareDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleServisareSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanMentenanta;
