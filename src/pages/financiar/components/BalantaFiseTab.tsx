import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { balanta, miscariCont } from "../contabilitate-mockData";
import { ContBalanta, MiscareCont } from "../contabilitate-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { Calculator, FileSpreadsheet, TrendingUp, TrendingDown, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddContBalantaDialog } from "./AddDialogs";

const BalantaFiseTab = () => {
  const { toast } = useToast();
  const [selectedCont, setSelectedCont] = useState<ContBalanta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ denumire: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({
    cont: "",
    denumire: "",
    soldInitialDebit: "",
    soldInitialCredit: "",
    rulajDebit: "",
    rulajCredit: "",
    soldFinalDebit: "",
    soldFinalCredit: "",
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const handleRowClick = (cont: ContBalanta) => {
    setSelectedCont(cont);
    setDialogOpen(true);
  };

  const getMiscariForCont = (cont: string): MiscareCont[] => {
    return miscariCont[cont] || [];
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setCurrentSort({ key, direction });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Summary calculations
  const totalSoldDebit = balanta.reduce((sum, c) => sum + c.soldFinalDebit, 0);
  const totalSoldCredit = balanta.reduce((sum, c) => sum + c.soldFinalCredit, 0);
  const totalRulajDebit = balanta.reduce((sum, c) => sum + c.rulajDebit, 0);
  const totalRulajCredit = balanta.reduce((sum, c) => sum + c.rulajCredit, 0);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...balanta];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        data = data.filter(item => {
          const itemValue = String(item[column as keyof ContBalanta] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (currentSort) {
      data.sort((a, b) => {
        const aValue = a[currentSort.key as keyof ContBalanta];
        const bValue = b[currentSort.key as keyof ContBalanta];
        
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
      {/* Summary Cards - TOP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conturi Active</p>
                <p className="text-2xl font-bold">{balanta.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sold Debit</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalSoldDebit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sold Credit</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalSoldCredit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Rulaj Perioadă</p>
                <p className="text-xl font-bold">{formatCurrency(totalRulajDebit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                exportToCSV(filteredAndSortedData, "balanta_conturi", [
                  { key: "cont", label: "Cont" },
                  { key: "denumire", label: "Denumire" },
                  { key: "soldInitialDebit", label: "Sold Inițial D" },
                  { key: "soldInitialCredit", label: "Sold Inițial C" },
                  { key: "rulajDebit", label: "Rulaj D" },
                  { key: "rulajCredit", label: "Rulaj C" },
                  { key: "soldFinalDebit", label: "Sold Final D" },
                  { key: "soldFinalCredit", label: "Sold Final C" },
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
                      title="Cont"
                      sortKey="cont"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.cont}
                      onFilterChange={(val) => handleFilter("cont", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Denumire"
                      sortKey="denumire"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.denumire}
                      onFilterChange={(val) => handleFilter("denumire", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold Inițial Debit"
                      sortKey="soldInitialDebit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.soldInitialDebit}
                      onFilterChange={(val) => handleFilter("soldInitialDebit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold Inițial Credit"
                      sortKey="soldInitialCredit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.soldInitialCredit}
                      onFilterChange={(val) => handleFilter("soldInitialCredit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Rulaj Debit"
                      sortKey="rulajDebit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.rulajDebit}
                      onFilterChange={(val) => handleFilter("rulajDebit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Rulaj Credit"
                      sortKey="rulajCredit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.rulajCredit}
                      onFilterChange={(val) => handleFilter("rulajCredit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold Final Debit"
                      sortKey="soldFinalDebit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.soldFinalDebit}
                      onFilterChange={(val) => handleFilter("soldFinalDebit", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold Final Credit"
                      sortKey="soldFinalCredit"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.soldFinalCredit}
                      onFilterChange={(val) => handleFilter("soldFinalCredit", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((cont) => (
                  <TableRow 
                    key={cont.cont} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(cont)}
                  >
                    <TableCell className="font-mono font-medium">{cont.cont}</TableCell>
                    <TableCell>{cont.denumire}</TableCell>
                    <TableCell className="text-right">
                      {cont.soldInitialDebit > 0 ? formatCurrency(cont.soldInitialDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.soldInitialCredit > 0 ? formatCurrency(cont.soldInitialCredit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.rulajDebit > 0 ? formatCurrency(cont.rulajDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.rulajCredit > 0 ? formatCurrency(cont.rulajCredit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                      {cont.soldFinalDebit > 0 ? formatCurrency(cont.soldFinalDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400">
                      {cont.soldFinalCredit > 0 ? formatCurrency(cont.soldFinalCredit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={2}>TOTAL</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(balanta.reduce((s, c) => s + c.soldInitialDebit, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(balanta.reduce((s, c) => s + c.soldInitialCredit, 0))}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(totalRulajDebit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalRulajCredit)}</TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-400">
                    {formatCurrency(totalSoldDebit)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalSoldCredit)}
                  </TableCell>
                </TableRow>
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

      {/* Account Statement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <FileSpreadsheet className="h-4 w-4" />
              Fișă Cont {selectedCont?.cont}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCont && (
            <div className="space-y-4">
              {/* Account Name */}
              <div>
                <p className="text-xs text-muted-foreground">Denumire Cont</p>
                <p className="font-medium text-sm">{selectedCont.denumire}</p>
              </div>

              {/* Account Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sold Inițial</p>
                  <p className="text-lg font-bold">
                    {selectedCont.soldInitialDebit > 0 
                      ? `${formatCurrency(selectedCont.soldInitialDebit)} D`
                      : `${formatCurrency(selectedCont.soldInitialCredit)} C`
                    }
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sold Final</p>
                  <p className="text-lg font-bold">
                    {selectedCont.soldFinalDebit > 0 
                      ? `${formatCurrency(selectedCont.soldFinalDebit)} D`
                      : `${formatCurrency(selectedCont.soldFinalCredit)} C`
                    }
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <p className="text-xs text-muted-foreground">Rulaj Debit</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedCont.rulajDebit)}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-xs text-muted-foreground">Rulaj Credit</p>
                  <p className="text-lg font-bold text-blue-600">{formatCurrency(selectedCont.rulajCredit)}</p>
                </div>
              </div>

              {/* Movements as cards */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Mișcări Cont</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getMiscariForCont(selectedCont.cont).length > 0 ? (
                    getMiscariForCont(selectedCont.cont).map((miscare) => (
                      <div key={miscare.id} className="p-3 border rounded-lg space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{formatDate(miscare.data)}</p>
                            <p className="text-xs text-muted-foreground font-mono">{miscare.document}</p>
                          </div>
                          <p className="font-bold text-sm">{formatCurrency(miscare.soldDupa)}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{miscare.explicatie}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-muted-foreground">Debit</p>
                            <p className="font-medium text-green-600">
                              {miscare.debit > 0 ? formatCurrency(miscare.debit) : '-'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Credit</p>
                            <p className="font-medium text-blue-600">
                              {miscare.credit > 0 ? formatCurrency(miscare.credit) : '-'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4 text-sm">Nu există mișcări</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditFormData({ denumire: selectedCont.denumire });
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editează Cont</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Denumire Cont</Label>
              <Input 
                value={editFormData.denumire} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, denumire: e.target.value }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={() => {
              toast({ title: "Cont actualizat", description: "Contul a fost actualizat cu succes." });
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
              Sigur doriți să ștergeți acest cont? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                toast({ title: "Cont șters", description: "Contul a fost șters cu succes." });
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
      <AddContBalantaDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default BalantaFiseTab;
