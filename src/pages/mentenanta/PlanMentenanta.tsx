import { useState, useMemo } from "react";
import { Wrench, Plus, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { toast } from "@/hooks/use-toast";

interface Mentenanta {
  id: number;
  cod: string;
  denumire: string;
  serie: string;
  producator: string;
  oreFunctionare: number;
  oreUltimaRevizie: number;
  dataUrmatoareRevizie: string;
  servisare: boolean;
  cost: number | null;
}

const mockMentenanta: Mentenanta[] = [
  {
    id: 1,
    cod: "EXC-001",
    denumire: "Excavator Komatsu PC210",
    serie: "KOM2024-1234",
    producator: "Komatsu",
    oreFunctionare: 2450,
    oreUltimaRevizie: 2200,
    dataUrmatoareRevizie: "15/01/2026",
    servisare: true,
    cost: 2500,
  },
  {
    id: 2,
    cod: "MIX-001",
    denumire: "Centrală asfalt Ammann 240t/h",
    serie: "AMM2023-5678",
    producator: "Ammann",
    oreFunctionare: 5200,
    oreUltimaRevizie: 5000,
    dataUrmatoareRevizie: "01/02/2026",
    servisare: false,
    cost: null,
  },
  {
    id: 3,
    cod: "CAM-003",
    denumire: "Camion MAN TGS 8x4",
    serie: "MAN2022-9012",
    producator: "MAN",
    oreFunctionare: 12500,
    oreUltimaRevizie: 12000,
    dataUrmatoareRevizie: "20/12/2025",
    servisare: true,
    cost: 3800,
  },
  {
    id: 4,
    cod: "FIN-001",
    denumire: "Finișer Vogele Super 1800",
    serie: "VOG2024-3456",
    producator: "Vogele",
    oreFunctionare: 890,
    oreUltimaRevizie: 750,
    dataUrmatoareRevizie: "10/03/2026",
    servisare: false,
    cost: null,
  },
  {
    id: 5,
    cod: "COM-001",
    denumire: "Compactor Bomag BW219",
    serie: "BOM2023-7890",
    producator: "Bomag",
    oreFunctionare: 1650,
    oreUltimaRevizie: 1500,
    dataUrmatoareRevizie: "05/01/2026",
    servisare: true,
    cost: 1200,
  },
];

const PlanMentenanta = () => {
  const [data, setData] = useState<Mentenanta[]>(mockMentenanta);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Mentenanta | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cod: "",
    denumire: "",
    serie: "",
    producator: "",
    oreFunctionare: "",
    oreUltimaRevizie: "",
    dataUrmatoareRevizie: "",
    servisare: false,
    cost: "",
  });

  // Sorting & Filtering
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setCurrentSort({ key, direction });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = item[key as keyof Mentenanta];
          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        });
      }
    });

    // Apply sorting
    if (currentSort) {
      result.sort((a, b) => {
        const aVal = a[currentSort.key as keyof Mentenanta];
        const bVal = b[currentSort.key as keyof Mentenanta];
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, filters, currentSort]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleRowClick = (item: Mentenanta) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleExport = () => {
    const exportData = data.map(item => ({
      cod: item.cod,
      denumire: item.denumire,
      serie: item.serie,
      producator: item.producator,
      ore_functionare: item.oreFunctionare,
      ore_ultima_revizie: item.oreUltimaRevizie,
      data_urmatoare_revizie: item.dataUrmatoareRevizie,
      servisare: item.servisare ? "Da" : "Nu",
      cost: item.cost ?? "",
    }));

    const columns = [
      { key: "cod" as const, label: "Cod" },
      { key: "denumire" as const, label: "Denumire" },
      { key: "serie" as const, label: "Serie" },
      { key: "producator" as const, label: "Producător" },
      { key: "ore_functionare" as const, label: "Ore Funcționare" },
      { key: "ore_ultima_revizie" as const, label: "Ore Ultimă Revizie" },
      { key: "data_urmatoare_revizie" as const, label: "Data Următoare Revizie" },
      { key: "servisare" as const, label: "Servisare" },
      { key: "cost" as const, label: "Cost" },
    ];

    exportToCSV(exportData, "plan_mentenanta", columns);
  };

  const resetForm = () => {
    setFormData({
      cod: "",
      denumire: "",
      serie: "",
      producator: "",
      oreFunctionare: "",
      oreUltimaRevizie: "",
      dataUrmatoareRevizie: "",
      servisare: false,
      cost: "",
    });
  };

  const handleAddSubmit = () => {
    const newItem: Mentenanta = {
      id: Math.max(...data.map(d => d.id)) + 1,
      cod: formData.cod,
      denumire: formData.denumire,
      serie: formData.serie,
      producator: formData.producator,
      oreFunctionare: Number(formData.oreFunctionare),
      oreUltimaRevizie: Number(formData.oreUltimaRevizie),
      dataUrmatoareRevizie: formData.dataUrmatoareRevizie,
      servisare: formData.servisare,
      cost: formData.servisare ? Number(formData.cost) : null,
    };
    setData(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({ title: "Succes", description: "Înregistrare adăugată cu succes." });
  };

  const handleOpenEdit = () => {
    if (!selectedItem) return;
    setFormData({
      cod: selectedItem.cod,
      denumire: selectedItem.denumire,
      serie: selectedItem.serie,
      producator: selectedItem.producator,
      oreFunctionare: String(selectedItem.oreFunctionare),
      oreUltimaRevizie: String(selectedItem.oreUltimaRevizie),
      dataUrmatoareRevizie: selectedItem.dataUrmatoareRevizie,
      servisare: selectedItem.servisare,
      cost: selectedItem.cost !== null ? String(selectedItem.cost) : "",
    });
    setIsDetailDialogOpen(false);
    setIsEditDialogOpen(true);
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
              serie: formData.serie,
              producator: formData.producator,
              oreFunctionare: Number(formData.oreFunctionare),
              oreUltimaRevizie: Number(formData.oreUltimaRevizie),
              dataUrmatoareRevizie: formData.dataUrmatoareRevizie,
              servisare: formData.servisare,
              cost: formData.servisare ? Number(formData.cost) : null,
            }
          : item
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
    toast({ title: "Succes", description: "Înregistrare actualizată cu succes." });
  };

  const handleOpenDelete = () => {
    setIsDetailDialogOpen(false);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setData(prev => prev.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast({ title: "Succes", description: "Înregistrare ștearsă cu succes." });
  };

  const renderForm = () => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cod">Cod</Label>
          <Input
            id="cod"
            value={formData.cod}
            onChange={e => setFormData(prev => ({ ...prev, cod: e.target.value }))}
            placeholder="ex: EXC-001"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="denumire">Denumire</Label>
          <Input
            id="denumire"
            value={formData.denumire}
            onChange={e => setFormData(prev => ({ ...prev, denumire: e.target.value }))}
            placeholder="ex: Excavator Komatsu PC210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="serie">Serie</Label>
          <Input
            id="serie"
            value={formData.serie}
            onChange={e => setFormData(prev => ({ ...prev, serie: e.target.value }))}
            placeholder="ex: KOM2024-1234"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="producator">Producător</Label>
          <Input
            id="producator"
            value={formData.producator}
            onChange={e => setFormData(prev => ({ ...prev, producator: e.target.value }))}
            placeholder="ex: Komatsu"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="oreFunctionare">Ore Funcționare</Label>
          <Input
            id="oreFunctionare"
            type="number"
            value={formData.oreFunctionare}
            onChange={e => setFormData(prev => ({ ...prev, oreFunctionare: e.target.value }))}
            placeholder="ex: 2450"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oreUltimaRevizie">Ore Ultimă Revizie</Label>
          <Input
            id="oreUltimaRevizie"
            type="number"
            value={formData.oreUltimaRevizie}
            onChange={e => setFormData(prev => ({ ...prev, oreUltimaRevizie: e.target.value }))}
            placeholder="ex: 2200"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dataUrmatoareRevizie">Data Următoare Revizie</Label>
        <Input
          id="dataUrmatoareRevizie"
          value={formData.dataUrmatoareRevizie}
          onChange={e => setFormData(prev => ({ ...prev, dataUrmatoareRevizie: e.target.value }))}
          placeholder="ex: 15/01/2026"
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
        <div className="grid gap-1">
          <Label htmlFor="servisare">Servisare</Label>
          <p className="text-sm text-muted-foreground">Activează dacă echipamentul necesită servisare</p>
        </div>
        <Switch
          id="servisare"
          checked={formData.servisare}
          onCheckedChange={checked => setFormData(prev => ({ ...prev, servisare: checked }))}
        />
      </div>

      {formData.servisare && (
        <div className="grid gap-2">
          <Label htmlFor="cost">Cost Servisare (RON)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={e => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            placeholder="ex: 2500"
          />
        </div>
      )}
    </div>
  );

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
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={data.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <DataTableColumnHeader
                title="Cod"
                sortKey="cod"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.cod || ""}
                onFilterChange={(value) => handleFilter("cod", value)}
              />
            </TableHead>
            <TableHead>
              <DataTableColumnHeader
                title="Denumire"
                sortKey="denumire"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.denumire || ""}
                onFilterChange={(value) => handleFilter("denumire", value)}
              />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <DataTableColumnHeader
                title="Serie"
                sortKey="serie"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.serie || ""}
                onFilterChange={(value) => handleFilter("serie", value)}
              />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <DataTableColumnHeader
                title="Producător"
                sortKey="producator"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.producator || ""}
                onFilterChange={(value) => handleFilter("producator", value)}
              />
            </TableHead>
            <TableHead className="hidden lg:table-cell">
              <DataTableColumnHeader
                title="Ore Funcț."
                sortKey="oreFunctionare"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.oreFunctionare || ""}
                onFilterChange={(value) => handleFilter("oreFunctionare", value)}
              />
            </TableHead>
            <TableHead className="hidden xl:table-cell">
              <DataTableColumnHeader
                title="Ore Ult. Rev."
                sortKey="oreUltimaRevizie"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.oreUltimaRevizie || ""}
                onFilterChange={(value) => handleFilter("oreUltimaRevizie", value)}
              />
            </TableHead>
            <TableHead className="hidden md:table-cell">
              <DataTableColumnHeader
                title="Data Urm. Rev."
                sortKey="dataUrmatoareRevizie"
                currentSort={currentSort}
                onSort={handleSort}
                filterValue={filters.dataUrmatoareRevizie || ""}
                onFilterChange={(value) => handleFilter("dataUrmatoareRevizie", value)}
              />
            </TableHead>
            <TableHead>Servisare</TableHead>
            <TableHead className="text-right">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                Nu există înregistrări
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map(item => (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="font-medium">{item.cod}</TableCell>
                <TableCell>{item.denumire}</TableCell>
                <TableCell className="hidden md:table-cell">{item.serie}</TableCell>
                <TableCell className="hidden lg:table-cell">{item.producator}</TableCell>
                <TableCell className="hidden lg:table-cell">{item.oreFunctionare.toLocaleString()}</TableCell>
                <TableCell className="hidden xl:table-cell">{item.oreUltimaRevizie.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell">{item.dataUrmatoareRevizie}</TableCell>
                <TableCell>
                  <Badge variant={item.servisare ? "default" : "outline"}>
                    {item.servisare ? "Da" : "Nu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {item.cost !== null ? `${item.cost.toLocaleString()} RON` : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredAndSortedData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Înregistrare</DialogTitle>
          </DialogHeader>
          {renderForm()}
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
            <DialogTitle>Editează Înregistrare</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEditSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Detalii Mentenanță</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cod</p>
                  <p className="font-medium">{selectedItem.cod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Denumire</p>
                  <p className="font-medium">{selectedItem.denumire}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Serie</p>
                  <p className="font-medium">{selectedItem.serie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Producător</p>
                  <p className="font-medium">{selectedItem.producator}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ore Funcționare</p>
                  <p className="font-medium">{selectedItem.oreFunctionare.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ore Ultimă Revizie</p>
                  <p className="font-medium">{selectedItem.oreUltimaRevizie.toLocaleString()}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data Următoare Revizie</p>
                  <p className="font-medium">{selectedItem.dataUrmatoareRevizie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Servisare</p>
                  <Badge variant={selectedItem.servisare ? "default" : "outline"}>
                    {selectedItem.servisare ? "Da" : "Nu"}
                  </Badge>
                </div>
              </div>
              {selectedItem.servisare && selectedItem.cost !== null && (
                <div>
                  <p className="text-sm text-muted-foreground">Cost Servisare</p>
                  <p className="font-medium">{selectedItem.cost.toLocaleString()} RON</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleOpenDelete} className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Șterge
            </Button>
            <Button onClick={handleOpenEdit} className="gap-2">
              <Edit className="h-4 w-4" />
              Editează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi înregistrarea "{selectedItem?.cod}"? Această acțiune nu poate fi anulată.
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
