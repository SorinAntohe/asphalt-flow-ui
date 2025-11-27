import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Truck, ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Livrare {
  id: number;
  data: string | null;
  cod: string | null;
  nr_aviz: string | null;
  nr_inmatriculare: string | null;
  tip_masina: string | null;
  nume_sofer: string | null;
  pret_material_total: number | null;
  pret_transport_total: number | null;
  pret_total: number | null;
}

const Livrari = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingDetails, setViewingDetails] = useState<Livrare | null>(null);
  const [deleting, setDeleting] = useState<Livrare | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    id: "",
    data: "",
    cod: "",
    nr_aviz: "",
    nr_inmatriculare: "",
    tip_masina: "",
    nume_sofer: "",
    pret_material_total: "",
    pret_transport_total: "",
    pret_total: ""
  });

  // Sort
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });
  
  const livrari: Livrare[] = [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filtering and sorting logic
  const filteredAndSorted = livrari
    .filter((item) => {
      return (
        item.id.toString().includes(filters.id) &&
        (item.data || "").toLowerCase().includes(filters.data.toLowerCase()) &&
        (item.cod || "").toLowerCase().includes(filters.cod.toLowerCase()) &&
        (item.nr_aviz || "").toLowerCase().includes(filters.nr_aviz.toLowerCase()) &&
        (item.nr_inmatriculare || "").toLowerCase().includes(filters.nr_inmatriculare.toLowerCase()) &&
        (item.tip_masina || "").toLowerCase().includes(filters.tip_masina.toLowerCase()) &&
        (item.nume_sofer || "").toLowerCase().includes(filters.nume_sofer.toLowerCase()) &&
        (item.pret_material_total?.toString() || "").includes(filters.pret_material_total) &&
        (item.pret_transport_total?.toString() || "").includes(filters.pret_transport_total) &&
        (item.pret_total?.toString() || "").includes(filters.pret_total)
      );
    })
    .sort((a, b) => {
      if (!sort.field || !sort.direction) return 0;
      
      let aVal: any = a[sort.field as keyof Livrare];
      let bVal: any = b[sort.field as keyof Livrare];
      
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sort.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sort.direction === 'asc' ? -1 : 1;
      
      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSorted.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDelete = async () => {
    if (!deleting) return;
    // TODO: Implement delete API call
    setDeleting(null);
  };

  const FilterHeader = ({ field, label }: { field: keyof typeof filters; label: string }) => (
    <TableHead className="h-10 text-xs">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer hover:text-primary">
            <span>{label}</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-2">
            <Input
              value={filters[field]}
              onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
              placeholder={`Caută ${label.toLowerCase()}...`}
              className="h-7 text-xs"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1 h-7 text-xs"
              >
                Cresc.
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1 h-7 text-xs"
              >
                Descresc.
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livrări</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare livrări produse finite către clienți
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Livrare Nouă
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrări Astăzi</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoare Totală</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 RON</div>
            <p className="text-xs text-muted-foreground">
              Valoare livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livrări</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livrari.length}</div>
            <p className="text-xs text-muted-foreground">
              Înregistrări totale
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Istoric Livrări Produs Finit</CardTitle>
              <CardDescription>
                Toate livrările de produse finite către clienți
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Înregistrări per pagină:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <FilterHeader field="id" label="ID" />
                  <FilterHeader field="data" label="Data" />
                  <FilterHeader field="cod" label="Cod" />
                  <FilterHeader field="nr_aviz" label="Nr. Aviz" />
                  <FilterHeader field="nr_inmatriculare" label="Nr. Înmatriculare" />
                  <FilterHeader field="tip_masina" label="Tip Mașină" />
                  <FilterHeader field="nume_sofer" label="Nume Șofer" />
                  <FilterHeader field="pret_material_total" label="Preț Material" />
                  <FilterHeader field="pret_transport_total" label="Preț Transport" />
                  <FilterHeader field="pret_total" label="Preț Total" />
                </TableRow>
              </TableHeader>
              <TableBody key={`livrari-page-${currentPage}`} className="animate-fade-in">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Nu există livrări înregistrate
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((livrare) => (
                    <TableRow 
                      key={livrare.id} 
                      className="h-10 cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingDetails(livrare)}
                    >
                      <TableCell className="py-1 text-xs font-medium">{livrare.id}</TableCell>
                      <TableCell className="py-1 text-xs">{formatDate(livrare.data)}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.cod || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nr_aviz || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nr_inmatriculare || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.tip_masina || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nume_sofer || "-"}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_material_total)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_transport_total)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Afișare {filteredAndSorted.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredAndSorted.length)} din {filteredAndSorted.length}
              </span>
            </div>
            
            {totalPages > 0 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details View Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Livrare - Cod: {viewingDetails?.cod || "-"}</DialogTitle>
            <DialogDescription>
              Informații complete despre livrare
            </DialogDescription>
          </DialogHeader>
          {viewingDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">{viewingDetails.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">{formatDate(viewingDetails.data)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cod</Label>
                  <p className="font-medium">{viewingDetails.cod || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Aviz</Label>
                  <p className="font-medium">{viewingDetails.nr_aviz || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Înmatriculare</Label>
                  <p className="font-medium">{viewingDetails.nr_inmatriculare || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tip Mașină</Label>
                  <p className="font-medium">{viewingDetails.tip_masina || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nume Șofer</Label>
                  <p className="font-medium">{viewingDetails.nume_sofer || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Material Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_material_total)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Transport Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_transport_total)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_total)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewingDetails(null)}>
              Închide
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                // TODO: Implement edit functionality
                setViewingDetails(null);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (viewingDetails) {
                  setDeleting(viewingDetails);
                  setViewingDetails(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi livrarea cu codul {deleting?.cod || "-"}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-700 hover:bg-red-600">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Livrari;
