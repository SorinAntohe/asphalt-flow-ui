import { useState, useMemo } from "react";
import { Truck, Plus, Download, Settings } from "lucide-react";
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
import { DataTablePagination, DataTableColumnHeader } from "@/components/ui/data-table";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";

interface Echipament {
  id: number;
  cod: string;
  denumire: string;
  serie: string;
  producator: string;
  anFabricatie: number;
  valoareAchizitie: number;
  durataAmortizare: number; // în luni
}

// Mock data
const mockEchipamente: Echipament[] = [
  { 
    id: 1, cod: "ECH-001", denumire: "Stație Asfalt Mobilă 160t/h", serie: "SA-2020-001",
    producator: "Ammann", anFabricatie: 2020, valoareAchizitie: 850000, durataAmortizare: 120
  },
  { 
    id: 2, cod: "ECH-002", denumire: "Încărcător Frontal Cat 966", serie: "IF-2019-003",
    producator: "Caterpillar", anFabricatie: 2019, valoareAchizitie: 320000, durataAmortizare: 96
  },
  { 
    id: 3, cod: "VEH-001", denumire: "Camion Basculant MAN TGS 8x4", serie: "CB-2021-005",
    producator: "MAN", anFabricatie: 2021, valoareAchizitie: 180000, durataAmortizare: 84
  },
  { 
    id: 4, cod: "ECH-003", denumire: "Finisor Asfalt Vögele Super 1900-3", serie: "FA-2018-002",
    producator: "Vögele", anFabricatie: 2018, valoareAchizitie: 420000, durataAmortizare: 120
  },
  { 
    id: 5, cod: "VEH-002", denumire: "Autobasculantă Volvo FH 6x4", serie: "AB-2022-001",
    producator: "Volvo", anFabricatie: 2022, valoareAchizitie: 195000, durataAmortizare: 84
  },
  { 
    id: 6, cod: "ECH-004", denumire: "Cilindru Compactor Hamm HD+ 110", serie: "CC-2020-004",
    producator: "Hamm", anFabricatie: 2020, valoareAchizitie: 145000, durataAmortizare: 96
  },
];

const Echipamente = () => {
  const [echipamente] = useState<Echipament[]>(mockEchipamente);
  const [selectedEchipament, setSelectedEchipament] = useState<Echipament | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Add form state
  const [addFormData, setAddFormData] = useState({
    cod: "",
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
      { key: "cod", label: "Cod" },
      { key: "denumire", label: "Denumire" },
      { key: "serie", label: "Serie" },
      { key: "producator", label: "Producător" },
      { key: "anFabricatie", label: "An Fabricație" },
      { key: "valoareAchizitie", label: "Valoare Achiziție (RON)" },
      { key: "durataAmortizare", label: "Durata Amortizare (luni)" },
    ]);
    toast.success("Export realizat cu succes");
  };

  const handleAddSubmit = () => {
    if (!addFormData.cod || !addFormData.denumire) {
      toast.error("Completați câmpurile obligatorii");
      return;
    }
    toast.success("Echipament adăugat cu succes");
    setIsAddDialogOpen(false);
    setAddFormData({
      cod: "",
      denumire: "",
      serie: "",
      producator: "",
      anFabricatie: "",
      valoareAchizitie: "",
      durataAmortizare: ""
    });
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
                    <TableCell className="font-medium">{echipament.cod}</TableCell>
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
                  {selectedEchipament.cod}
                </DialogTitle>
                <DialogDescription>{selectedEchipament.denumire}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cod</p>
                  <p className="font-medium">{selectedEchipament.cod}</p>
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

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                  Închide
                </Button>
              </DialogFooter>
            </>
          )}
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
                <Label>Cod *</Label>
                <Input 
                  placeholder="ECH-XXX"
                  value={addFormData.cod}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, cod: e.target.value }))}
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
            <div className="space-y-2">
              <Label>Denumire *</Label>
              <Input 
                placeholder="Denumire echipament"
                value={addFormData.denumire}
                onChange={(e) => setAddFormData(prev => ({ ...prev, denumire: e.target.value }))}
              />
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
    </div>
  );
};

export default Echipamente;
