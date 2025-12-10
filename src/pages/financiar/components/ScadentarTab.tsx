import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scadentarEntries } from "../parteneri-mockData";
import { ScadentarEntry } from "../parteneri-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, TrendingUp, TrendingDown, Scale } from "lucide-react";

const ScadentarTab = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>("zile_intarziere");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({});

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

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortColumn(column);
    setSortDirection(direction);
  };

  const handleFilter = (column: string, value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
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
    if (sortColumn) {
      data.sort((a, b) => {
        const aValue = a[sortColumn as keyof ScadentarEntry];
        const bValue = b[sortColumn as keyof ScadentarEntry];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || "");
        const bStr = String(bValue || "");
        return sortDirection === "asc" 
          ? aStr.localeCompare(bStr) 
          : bStr.localeCompare(aStr);
      });
    }
    
    return data;
  }, [filters, sortColumn, sortDirection]);

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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Tip Partener"
                      sortDirection={sortColumn === "tip_partener" ? sortDirection : null}
                      onSort={(dir) => handleSort("tip_partener", dir)}
                      filterValue={filters.tip_partener || ""}
                      onFilter={(val) => handleFilter("tip_partener", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Nume Partener"
                      sortDirection={sortColumn === "nume_partener" ? sortDirection : null}
                      onSort={(dir) => handleSort("nume_partener", dir)}
                      filterValue={filters.nume_partener || ""}
                      onFilter={(val) => handleFilter("nume_partener", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Tip Document"
                      sortDirection={sortColumn === "tip_document" ? sortDirection : null}
                      onSort={(dir) => handleSort("tip_document", dir)}
                      filterValue={filters.tip_document || ""}
                      onFilter={(val) => handleFilter("tip_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Număr Document"
                      sortDirection={sortColumn === "numar_document" ? sortDirection : null}
                      onSort={(dir) => handleSort("numar_document", dir)}
                      filterValue={filters.numar_document || ""}
                      onFilter={(val) => handleFilter("numar_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Dată Document"
                      sortDirection={sortColumn === "data_document" ? sortDirection : null}
                      onSort={(dir) => handleSort("data_document", dir)}
                      filterValue={filters.data_document || ""}
                      onFilter={(val) => handleFilter("data_document", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Dată Scadență"
                      sortDirection={sortColumn === "data_scadenta" ? sortDirection : null}
                      onSort={(dir) => handleSort("data_scadenta", dir)}
                      filterValue={filters.data_scadenta || ""}
                      onFilter={(val) => handleFilter("data_scadenta", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sumă Restantă"
                      sortDirection={sortColumn === "suma_restanta" ? sortDirection : null}
                      onSort={(dir) => handleSort("suma_restanta", dir)}
                      filterValue={filters.suma_restanta || ""}
                      onFilter={(val) => handleFilter("suma_restanta", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Zile Întârziere"
                      sortDirection={sortColumn === "zile_intarziere" ? sortDirection : null}
                      onSort={(dir) => handleSort("zile_intarziere", dir)}
                      filterValue={filters.zile_intarziere || ""}
                      onFilter={(val) => handleFilter("zile_intarziere", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Status"
                      sortDirection={sortColumn === "status" ? sortDirection : null}
                      onSort={(dir) => handleSort("status", dir)}
                      filterValue={filters.status || ""}
                      onFilter={(val) => handleFilter("status", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((entry) => (
                  <TableRow key={entry.id} className="hover:bg-muted/50">
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
    </div>
  );
};

export default ScadentarTab;
