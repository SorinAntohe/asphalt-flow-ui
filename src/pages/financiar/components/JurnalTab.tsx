import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { noteContabile, liniiNoteContabile } from "../contabilitate-mockData";
import { NotaContabila, LinieNotaContabila } from "../contabilitate-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { BookOpen, FileText, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddNotaContabilaDialog } from "./AddDialogs";

const JurnalTab = () => {
  const { toast } = useToast();
  const [selectedNota, setSelectedNota] = useState<NotaContabila | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ tipJurnal: "", explicatie: "", totalDebit: "", totalCredit: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({
    data: "",
    nrNota: "",
    tipJurnal: "",
    explicatie: "",
    totalDebit: "",
    totalCredit: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const getTipJurnalColor = (tip: string) => {
    switch (tip) {
      case 'Vânzări': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Cumpărări': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Bancă': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Casă': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };


  const handleRowClick = (nota: NotaContabila) => {
    setSelectedNota(nota);
    setDialogOpen(true);
  };

  const getLiniiForNota = (notaId: string): LinieNotaContabila[] => {
    return liniiNoteContabile.filter(linie => linie.notaId === notaId);
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setCurrentSort({ key, direction });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Summary calculations
  const totalNote = noteContabile.length;

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...noteContabile];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        data = data.filter(item => {
          const itemValue = String(item[column as keyof NotaContabila] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (currentSort) {
      data.sort((a, b) => {
        const aValue = a[currentSort.key as keyof NotaContabila];
        const bValue = b[currentSort.key as keyof NotaContabila];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return currentSort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || "");
        const bStr = String(bValue || "");
        return currentSort.direction === "asc" 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }
    
    return data;
  }, [filters, currentSort]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Summary Card - TOP */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Note</p>
              <p className="text-2xl font-bold">{totalNote}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                exportToCSV(filteredAndSortedData, "jurnal_note_contabile", [
                  { key: "data", label: "Dată" },
                  { key: "nrNota", label: "Nr. Notă" },
                  { key: "tipJurnal", label: "Tip Jurnal" },
                  { key: "explicatie", label: "Explicație" },
                  { key: "totalDebit", label: "Total Debit" },
                  { key: "totalCredit", label: "Total Credit" },
                ]);
                toast({ title: "Export realizat", description: "Export CSV realizat cu succes." });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adaugă
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Dată"
                      sortKey="data"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.data}
                      onFilterChange={(val) => handleFilter("data", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Nr. Notă"
                      sortKey="nrNota"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.nrNota}
                      onFilterChange={(val) => handleFilter("nrNota", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Tip Jurnal"
                      sortKey="tipJurnal"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.tipJurnal}
                      onFilterChange={(val) => handleFilter("tipJurnal", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Explicație"
                      sortKey="explicatie"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.explicatie}
                      onFilterChange={(val) => handleFilter("explicatie", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Total Debit"
                      sortKey="totalDebit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.totalDebit}
                      onFilterChange={(val) => handleFilter("totalDebit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Total Credit"
                      sortKey="totalCredit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.totalCredit}
                      onFilterChange={(val) => handleFilter("totalCredit", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((nota) => (
                  <TableRow 
                    key={nota.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(nota)}
                  >
                    <TableCell>{formatDate(nota.data)}</TableCell>
                    <TableCell className="font-medium">{nota.nrNota}</TableCell>
                    <TableCell>
                      <Badge className={getTipJurnalColor(nota.tipJurnal)} variant="secondary">
                        {nota.tipJurnal}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{nota.explicatie}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(nota.totalDebit)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(nota.totalCredit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAndSortedData.length}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(val) => {
              setItemsPerPage(val);
              setCurrentPage(1);
            }}
          />
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              Notă Contabilă {selectedNota?.nrNota}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNota && (
            <div className="space-y-4">
              {/* Note Header Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Dată</p>
                  <p className="font-medium text-sm">{formatDate(selectedNota.data)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tip Jurnal</p>
                  <Badge className={getTipJurnalColor(selectedNota.tipJurnal)} variant="secondary">
                    {selectedNota.tipJurnal}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Explicație</p>
                  <p className="font-medium text-sm break-words">{selectedNota.explicatie}</p>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Debit</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedNota.totalDebit)}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total Credit</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedNota.totalCredit)}</p>
                </div>
              </div>

              {/* Lines as cards */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Linii Notă Contabilă</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getLiniiForNota(selectedNota.id).map((linie) => (
                    <div key={linie.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-mono font-medium text-sm">{linie.cont}</p>
                          <p className="text-xs text-muted-foreground">{linie.denumireCont}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Debit</p>
                          <p className="font-medium text-green-600">
                            {linie.debit > 0 ? formatCurrency(linie.debit) : '-'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Credit</p>
                          <p className="font-medium text-blue-600">
                            {linie.credit > 0 ? formatCurrency(linie.credit) : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditFormData({
                      tipJurnal: selectedNota.tipJurnal,
                      explicatie: selectedNota.explicatie,
                      totalDebit: String(selectedNota.totalDebit),
                      totalCredit: String(selectedNota.totalCredit),
                    });
                    setEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Notă Contabilă</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tip Jurnal</Label>
              <Select value={editFormData.tipJurnal} onValueChange={(val) => setEditFormData(prev => ({ ...prev, tipJurnal: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vânzări">Vânzări</SelectItem>
                  <SelectItem value="Cumpărări">Cumpărări</SelectItem>
                  <SelectItem value="Bancă">Bancă</SelectItem>
                  <SelectItem value="Casă">Casă</SelectItem>
                  <SelectItem value="Diverse">Diverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Explicație</Label>
              <Input 
                value={editFormData.explicatie} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, explicatie: e.target.value }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Total Debit (RON)</Label>
                <Input 
                  type="number" 
                  value={editFormData.totalDebit} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, totalDebit: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label>Total Credit (RON)</Label>
                <Input 
                  type="number" 
                  value={editFormData.totalCredit} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, totalCredit: e.target.value }))} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={() => {
              toast({ title: "Notă actualizată", description: "Nota contabilă a fost actualizată cu succes." });
              setEditDialogOpen(false);
              setDialogOpen(false);
            }}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această notă contabilă? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                toast({ title: "Notă ștearsă", description: "Nota contabilă a fost ștearsă cu succes." });
                setDeleteDialogOpen(false);
                setDialogOpen(false);
              }}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialog */}
      <AddNotaContabilaDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default JurnalTab;
