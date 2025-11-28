import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { UserCheck, Plus, ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, ChevronRight, Download, Pencil, Trash2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { exportToCSV } from "@/lib/exportUtils";

interface Angajat {
  id: number;
  nume: string;
  functie: string;
  departament: string;
  data_angajarii: string;
  salariu: number;
}

type SortDirection = "asc" | "desc" | null;

interface ColumnFilter {
  value: string;
  sortDirection: SortDirection;
}

interface Filters {
  id: ColumnFilter;
  nume: ColumnFilter;
  functie: ColumnFilter;
  departament: ColumnFilter;
  data_angajarii: ColumnFilter;
  salariu: ColumnFilter;
}

const initialFilters: Filters = {
  id: { value: "", sortDirection: null },
  nume: { value: "", sortDirection: null },
  functie: { value: "", sortDirection: null },
  departament: { value: "", sortDirection: null },
  data_angajarii: { value: "", sortDirection: null },
  salariu: { value: "", sortDirection: null },
};

export default function Angajati() {
  const [angajati, setAngajati] = useState<Angajat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedAngajat, setSelectedAngajat] = useState<Angajat | null>(null);
  const [formData, setFormData] = useState({
    nume: "",
    functie: "",
    departament: "",
    data_angajarii: "",
    salariu: "",
  });
  const { toast } = useToast();

  const fetchAngajati = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/liste/returneaza/angajati`);
      if (response.ok) {
        const data = await response.json();
        setAngajati(data);
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca angajații.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la conectarea cu serverul.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAngajati();
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let result = [...angajati];

    // Apply filters
    Object.keys(filters).forEach((key) => {
      const filterKey = key as keyof Filters;
      const filterValue = filters[filterKey].value.toLowerCase();
      if (filterValue) {
        result = result.filter((item) =>
          String(item[filterKey]).toLowerCase().includes(filterValue)
        );
      }
    });

    // Apply sorting
    const sortColumn = Object.keys(filters).find(
      (key) => filters[key as keyof Filters].sortDirection !== null
    ) as keyof Filters | undefined;

    if (sortColumn) {
      const direction = filters[sortColumn].sortDirection;
      result.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        return direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [angajati, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleFilterChange = (column: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [column]: { ...prev[column], value },
    }));
    setCurrentPage(1);
  };

  const handleSortChange = (column: keyof Filters, direction: SortDirection) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      Object.keys(newFilters).forEach((key) => {
        newFilters[key as keyof Filters].sortDirection = null;
      });
      newFilters[column].sortDirection = direction;
      return newFilters;
    });
  };

  const handleAdd = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/liste/adauga/angajat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nume: formData.nume,
          functie: formData.functie,
          departament: formData.departament,
          data_angajarii: formData.data_angajarii,
          salariu: parseFloat(formData.salariu),
        }),
      });

      if (response.ok) {
        toast({ title: "Succes", description: "Angajat adăugat cu succes." });
        setIsAddDialogOpen(false);
        resetForm();
        fetchAngajati();
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut adăuga angajatul.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la conectarea cu serverul.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!selectedAngajat) return;

    try {
      const response = await fetch(`${API_BASE_URL}/editeaza`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabel: "lista_angajati",
          id: selectedAngajat.id,
          update: {
            nume: formData.nume,
            functie: formData.functie,
            departament: formData.departament,
            data_angajarii: formData.data_angajarii,
            salariu: parseFloat(formData.salariu),
          },
        }),
      });

      if (response.ok) {
        toast({ title: "Succes", description: "Angajat actualizat cu succes." });
        setIsEditDialogOpen(false);
        resetForm();
        fetchAngajati();
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut actualiza angajatul.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la conectarea cu serverul.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedAngajat) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tabel: "lista_angajati",
          id: selectedAngajat.id,
        }),
      });

      if (response.ok) {
        toast({ title: "Succes", description: "Angajat șters cu succes." });
        setIsDeleteDialogOpen(false);
        setIsDetailDialogOpen(false);
        setSelectedAngajat(null);
        fetchAngajati();
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-a putut șterge angajatul.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la conectarea cu serverul.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nume: "",
      functie: "",
      departament: "",
      data_angajarii: "",
      salariu: "",
    });
    setSelectedAngajat(null);
  };

  const openEditDialog = (angajat: Angajat) => {
    setSelectedAngajat(angajat);
    setFormData({
      nume: angajat.nume,
      functie: angajat.functie,
      departament: angajat.departament,
      data_angajarii: angajat.data_angajarii,
      salariu: String(angajat.salariu),
    });
    setIsDetailDialogOpen(false);
    setIsEditDialogOpen(true);
  };

  const openDetailDialog = (angajat: Angajat) => {
    setSelectedAngajat(angajat);
    setIsDetailDialogOpen(true);
  };

  const handleExport = () => {
    exportToCSV(filteredAndSortedData, "angajati", [
      { key: "id", label: "ID" },
      { key: "nume", label: "Nume" },
      { key: "functie", label: "Funcție" },
      { key: "departament", label: "Departament" },
      { key: "data_angajarii", label: "Data Angajării" },
      { key: "salariu", label: "Salariu" },
    ]);
  };

  const FilterHeader = ({
    column,
    label,
  }: {
    column: keyof Filters;
    label: string;
  }) => {
    const sortDirection = filters[column].sortDirection;
    return (
      <TableHead>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 hover:bg-muted/50 font-medium text-muted-foreground gap-1"
            >
              {label}
              {sortDirection === "asc" ? (
                <ArrowUp className="h-3 w-3 text-primary" />
              ) : sortDirection === "desc" ? (
                <ArrowDown className="h-3 w-3 text-primary" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start">
            <div className="space-y-3">
              <Input
                placeholder={`Filtrează ${label.toLowerCase()}...`}
                value={filters[column].value}
                onChange={(e) => handleFilterChange(column, e.target.value)}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant={sortDirection === "asc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleSortChange(column, "asc")}
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Cresc.
                </Button>
                <Button
                  variant={sortDirection === "desc" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => handleSortChange(column, "desc")}
                >
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Descresc.
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </TableHead>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <UserCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Lista Angajați</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={filteredAndSortedData.length === 0}
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Adaugă</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Angajați</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="[&_tr]:border-b bg-muted/30">
                    <TableRow className="border-b hover:bg-transparent">
                      <FilterHeader column="id" label="ID" />
                      <FilterHeader column="nume" label="Nume" />
                      <FilterHeader column="functie" label="Funcție" />
                      <FilterHeader column="departament" label="Departament" />
                      <FilterHeader column="data_angajarii" label="Data Angajării" />
                      <FilterHeader column="salariu" label="Salariu" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow className="border-0 hover:bg-transparent">
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nu există angajați.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((angajat) => (
                        <TableRow
                          key={angajat.id}
                          onClick={() => openDetailDialog(angajat)}
                          className="cursor-pointer border-0"
                        >
                          <TableCell className="font-medium">{angajat.id}</TableCell>
                          <TableCell>{angajat.nume}</TableCell>
                          <TableCell>{angajat.functie}</TableCell>
                          <TableCell>{angajat.departament}</TableCell>
                          <TableCell>{angajat.data_angajarii}</TableCell>
                          <TableCell>{angajat.salariu?.toLocaleString("ro-RO")} RON</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Afișează</span>
                  <Select
                    value={String(itemsPerPage)}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50].map((num) => (
                        <SelectItem key={num} value={String(num)}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">pe pagină</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Pagina {currentPage} din {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adaugă Angajat</DialogTitle>
            <DialogDescription>Completează datele noului angajat.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nume">Nume</Label>
              <Input
                id="nume"
                value={formData.nume}
                onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="functie">Funcție</Label>
              <Input
                id="functie"
                value={formData.functie}
                onChange={(e) => setFormData({ ...formData, functie: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="departament">Departament</Label>
              <Input
                id="departament"
                value={formData.departament}
                onChange={(e) => setFormData({ ...formData, departament: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data_angajarii">Data Angajării</Label>
              <Input
                id="data_angajarii"
                type="date"
                value={formData.data_angajarii}
                onChange={(e) => setFormData({ ...formData, data_angajarii: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="salariu">Salariu (RON)</Label>
              <Input
                id="salariu"
                type="number"
                value={formData.salariu}
                onChange={(e) => setFormData({ ...formData, salariu: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleAdd}>Adaugă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editează Angajat</DialogTitle>
            <DialogDescription>Modifică datele angajatului.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nume">Nume</Label>
              <Input
                id="edit-nume"
                value={formData.nume}
                onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-functie">Funcție</Label>
              <Input
                id="edit-functie"
                value={formData.functie}
                onChange={(e) => setFormData({ ...formData, functie: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-departament">Departament</Label>
              <Input
                id="edit-departament"
                value={formData.departament}
                onChange={(e) => setFormData({ ...formData, departament: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-data_angajarii">Data Angajării</Label>
              <Input
                id="edit-data_angajarii"
                type="date"
                value={formData.data_angajarii}
                onChange={(e) => setFormData({ ...formData, data_angajarii: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-salariu">Salariu (RON)</Label>
              <Input
                id="edit-salariu"
                type="number"
                value={formData.salariu}
                onChange={(e) => setFormData({ ...formData, salariu: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleEdit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalii Angajat</DialogTitle>
          </DialogHeader>
          {selectedAngajat && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground text-xs">ID</Label>
                <p className="font-medium">{selectedAngajat.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Nume</Label>
                <p className="font-medium">{selectedAngajat.nume}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Funcție</Label>
                <p className="font-medium">{selectedAngajat.functie}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Departament</Label>
                <p className="font-medium">{selectedAngajat.departament}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Data Angajării</Label>
                <p className="font-medium">{selectedAngajat.data_angajarii}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Salariu</Label>
                <p className="font-medium">{selectedAngajat.salariu?.toLocaleString("ro-RO")} RON</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedAngajat && openEditDialog(selectedAngajat)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi angajatul "{selectedAngajat?.nume}"? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
