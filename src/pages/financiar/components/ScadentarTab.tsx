import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scadentarEntries } from "../parteneri-mockData";
import { ScadentarEntry } from "../parteneri-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, TrendingUp, TrendingDown, Scale, Plus, Download, Calendar } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddScadentarDialog } from "./AddDialogs";

const ScadentarTab = () => {
  const { toast } = useToast();
  const [selectedEntry, setSelectedEntry] = useState<ScadentarEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: "asc" | "desc" } | null>({ key: "zile_intarziere", direction: "desc" });
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({
    tip_partener: "",
    nume_partener: "",
    tip_document: "",
    numar_document: "",
    data_document: "",
    data_scadenta: "",
    suma_restanta: "",
    zile_intarziere: "",
    status: "",
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getZileIntarziereColor = (zile: number) => {
    if (zile === 0) return "text-green-600";
    if (zile <= 30) return "text-amber-600";
    return "text-red-600";
  };

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setCurrentSort({ key, direction });
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const totalRestantClienti = scadentarEntries
    .filter((e) => e.tip_partener === "Client")
    .reduce((sum, e) => sum + e.suma_restanta, 0);

  const totalRestantFurnizori = scadentarEntries
    .filter((e) => e.tip_partener === "Furnizor")
    .reduce((sum, e) => sum + e.suma_restanta, 0);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...scadentarEntries];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        data = data.filter(item => {
          const itemValue = String(item[column as keyof ScadentarEntry] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (currentSort) {
      data.sort((a, b) => {
        const aValue = a[currentSort.key as keyof ScadentarEntry];
        const bValue = b[currentSort.key as keyof ScadentarEntry];
        
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
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Documente</div>
                <div className="text-2xl font-bold">{scadentarEntries.length}</div>
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
                <div className="text-sm text-muted-foreground">De Încasat (Clienți)</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRestantClienti)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">De Plătit (Furnizori)</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalRestantFurnizori)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Sold Net</div>
                <div className={`text-2xl font-bold ${totalRestantClienti - totalRestantFurnizori >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(totalRestantClienti - totalRestantFurnizori)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end gap-2 mb-4">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                exportToCSV(filteredAndSortedData, "scadentar", [
                  { key: "tip_partener", label: "Tip Partener" },
                  { key: "nume_partener", label: "Nume Partener" },
                  { key: "tip_document", label: "Tip Document" },
                  { key: "numar_document", label: "Număr Document" },
                  { key: "data_document", label: "Dată Document" },
                  { key: "data_scadenta", label: "Dată Scadență" },
                  { key: "suma_restanta", label: "Sumă Restantă" },
                  { key: "zile_intarziere", label: "Zile Întârziere" },
                  { key: "status", label: "Status" },
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
                      title="Tip Partener"
                      sortKey="tip_partener"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.tip_partener}
                      onFilterChange={(val) => handleFilter("tip_partener", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Nume Partener"
                      sortKey="nume_partener"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.nume_partener}
                      onFilterChange={(val) => handleFilter("nume_partener", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Tip Document"
                      sortKey="tip_document"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.tip_document}
                      onFilterChange={(val) => handleFilter("tip_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Număr Document"
                      sortKey="numar_document"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.numar_document}
                      onFilterChange={(val) => handleFilter("numar_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Dată Document"
                      sortKey="data_document"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.data_document}
                      onFilterChange={(val) => handleFilter("data_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Dată Scadență"
                      sortKey="data_scadenta"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.data_scadenta}
                      onFilterChange={(val) => handleFilter("data_scadenta", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sumă Restantă"
                      sortKey="suma_restanta"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.suma_restanta}
                      onFilterChange={(val) => handleFilter("suma_restanta", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Zile Întârziere"
                      sortKey="zile_intarziere"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.zile_intarziere}
                      onFilterChange={(val) => handleFilter("zile_intarziere", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Status"
                      sortKey="status"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.status}
                      onFilterChange={(val) => handleFilter("status", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((entry) => (
                  <TableRow 
                    key={entry.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedEntry(entry);
                      setDialogOpen(true);
                    }}
                  >
                    <TableCell>
                      <Badge variant={entry.tip_partener === "Client" ? "default" : "secondary"}>
                        {entry.tip_partener}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.nume_partener}</TableCell>
                    <TableCell>{entry.tip_document}</TableCell>
                    <TableCell>{entry.numar_document}</TableCell>
                    <TableCell>{entry.data_document}</TableCell>
                    <TableCell>{entry.data_scadenta}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(entry.suma_restanta)}
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getZileIntarziereColor(entry.zile_intarziere)}`}>
                      {entry.zile_intarziere} zile
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.status === "La zi" ? "default" : "destructive"}>
                        {entry.status}
                      </Badge>
                    </TableCell>
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
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4" />
              Detalii Scadență
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-4">
              {/* Partner Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Tip Partener</p>
                  <Badge variant={selectedEntry.tip_partener === "Client" ? "default" : "secondary"} className="mt-1">
                    {selectedEntry.tip_partener}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Nume Partener</p>
                  <p className="font-medium text-sm">{selectedEntry.nume_partener}</p>
                </div>
              </div>

              {/* Document Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Tip Document</p>
                  <p className="font-medium text-sm">{selectedEntry.tip_document}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Număr Document</p>
                  <p className="font-medium text-sm">{selectedEntry.numar_document}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dată Document</p>
                  <p className="font-medium text-sm">{selectedEntry.data_document}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Dată Scadență</p>
                  <p className="font-medium text-sm">{selectedEntry.data_scadenta}</p>
                </div>
              </div>

              {/* Financial Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sumă Restantă</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedEntry.suma_restanta)}</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Zile Întârziere</p>
                  <p className={`text-lg font-bold ${getZileIntarziereColor(selectedEntry.zile_intarziere)}`}>
                    {selectedEntry.zile_intarziere} zile
                  </p>
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <Badge variant={selectedEntry.status === "La zi" ? "default" : "destructive"}>
                  {selectedEntry.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <AddScadentarDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default ScadentarTab;
