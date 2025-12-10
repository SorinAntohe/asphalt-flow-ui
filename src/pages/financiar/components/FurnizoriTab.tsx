import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { furnizoriCuSold, facturiFurnizoriIstoric, platiFurnizori, soldIntervaleFurnizori } from "../parteneri-mockData";
import { FurnizorCuSold } from "../parteneri-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { Building2, TrendingDown, AlertTriangle, Clock } from "lucide-react";

const FurnizoriTab = () => {
  const [selectedFurnizor, setSelectedFurnizor] = useState<FurnizorCuSold | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({});

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRowClick = (furnizor: FurnizorCuSold) => {
    setSelectedFurnizor(furnizor);
    setDialogOpen(true);
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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...furnizoriCuSold];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        data = data.filter(item => {
          const itemValue = String(item[column as keyof FurnizorCuSold] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortColumn) {
      data.sort((a, b) => {
        const aValue = a[sortColumn as keyof FurnizorCuSold];
        const bValue = b[sortColumn as keyof FurnizorCuSold];
        
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

  const furnizorFacturi = selectedFurnizor ? facturiFurnizoriIstoric[selectedFurnizor.id] || [] : [];
  const furnizorPlati = selectedFurnizor ? platiFurnizori[selectedFurnizor.id] || [] : [];
  const furnizorSoldIntervale = selectedFurnizor ? soldIntervaleFurnizori[selectedFurnizor.id] : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards - TOP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Furnizori</div>
                <div className="text-2xl font-bold">{furnizoriCuSold.length}</div>
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
                <div className="text-sm text-muted-foreground">Total Sold Furnizori</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(furnizoriCuSold.reduce((sum, f) => sum + f.sold_curent, 0))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Furnizori cu Întârzieri</div>
                <div className="text-2xl font-bold text-amber-600">
                  {furnizoriCuSold.filter((f) => f.zile_intarziere_max > 0).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Furnizori &gt;60 zile</div>
                <div className="text-2xl font-bold text-red-600">
                  {furnizoriCuSold.filter((f) => f.zile_intarziere_max > 60).length}
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
                      title="Furnizor"
                      sortDirection={sortColumn === "nume" ? sortDirection : null}
                      onSort={(dir) => handleSort("nume", dir)}
                      filterValue={filters.nume || ""}
                      onFilter={(val) => handleFilter("nume", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="CUI"
                      sortDirection={sortColumn === "cui" ? sortDirection : null}
                      onSort={(dir) => handleSort("cui", dir)}
                      filterValue={filters.cui || ""}
                      onFilter={(val) => handleFilter("cui", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Adresă"
                      sortDirection={sortColumn === "adresa" ? sortDirection : null}
                      onSort={(dir) => handleSort("adresa", dir)}
                      filterValue={filters.adresa || ""}
                      onFilter={(val) => handleFilter("adresa", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold curent"
                      sortDirection={sortColumn === "sold_curent" ? sortDirection : null}
                      onSort={(dir) => handleSort("sold_curent", dir)}
                      filterValue={filters.sold_curent || ""}
                      onFilter={(val) => handleFilter("sold_curent", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Zile întârziere max."
                      sortDirection={sortColumn === "zile_intarziere_max" ? sortDirection : null}
                      onSort={(dir) => handleSort("zile_intarziere_max", dir)}
                      filterValue={filters.zile_intarziere_max || ""}
                      onFilter={(val) => handleFilter("zile_intarziere_max", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((furnizor) => (
                  <TableRow 
                    key={furnizor.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(furnizor)}
                  >
                    <TableCell className="font-medium">{furnizor.nume}</TableCell>
                    <TableCell>{furnizor.cui}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{furnizor.adresa}</TableCell>
                    <TableCell className="text-right">
                      <span className={furnizor.sold_curent > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(furnizor.sold_curent)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getZileIntarziereColor(furnizor.zile_intarziere_max)}`}>
                      {furnizor.zile_intarziere_max} zile
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

      {/* Furnizor Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Fișă Furnizor: {selectedFurnizor?.nume}
            </DialogTitle>
          </DialogHeader>

          {selectedFurnizor && (
            <div className="space-y-6">
              {/* Furnizor Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">CUI</div>
                  <div className="font-medium">{selectedFurnizor.cui}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Adresă</div>
                  <div className="font-medium">{selectedFurnizor.adresa}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sold Curent</div>
                  <div className={`font-bold text-lg ${selectedFurnizor.sold_curent > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(selectedFurnizor.sold_curent)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zile Întârziere Max.</div>
                  <div className={`font-bold text-lg ${getZileIntarziereColor(selectedFurnizor.zile_intarziere_max)}`}>
                    {selectedFurnizor.zile_intarziere_max} zile
                  </div>
                </div>
              </div>

              {/* Sold pe Intervale */}
              {furnizorSoldIntervale && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-base font-medium mb-3">Sold pe Intervale</div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">0-30 zile</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(furnizorSoldIntervale.interval_0_30)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">30-60 zile</div>
                        <div className="text-xl font-bold text-amber-600">
                          {formatCurrency(furnizorSoldIntervale.interval_30_60)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">60+ zile</div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(furnizorSoldIntervale.interval_60_plus)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for Facturi & Plăți */}
              <Tabs defaultValue="facturi">
                <TabsList>
                  <TabsTrigger value="facturi">Istoric Facturi ({furnizorFacturi.length})</TabsTrigger>
                  <TabsTrigger value="plati">Istoric Plăți ({furnizorPlati.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="facturi" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nr Factură</TableHead>
                          <TableHead>Dată</TableHead>
                          <TableHead>Dată Scadență</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Plătit</TableHead>
                          <TableHead className="text-right">Restant</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {furnizorFacturi.map((factura) => (
                          <TableRow key={factura.id}>
                            <TableCell className="font-medium">{factura.nr_factura}</TableCell>
                            <TableCell>{factura.data}</TableCell>
                            <TableCell>{factura.data_scadenta}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.total)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.suma_achitata)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.suma_restanta)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                factura.status === "Achitată" ? "default" :
                                factura.status === "Parțial" ? "secondary" : "destructive"
                              }>
                                {factura.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {furnizorFacturi.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nu există facturi pentru acest furnizor
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="plati" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dată</TableHead>
                          <TableHead>Tip</TableHead>
                          <TableHead className="text-right">Sumă</TableHead>
                          <TableHead>Document Referință</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {furnizorPlati.map((plata) => (
                          <TableRow key={plata.id}>
                            <TableCell>{plata.data}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{plata.tip}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              -{formatCurrency(plata.suma)}
                            </TableCell>
                            <TableCell>{plata.document_referinta}</TableCell>
                          </TableRow>
                        ))}
                        {furnizorPlati.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nu există plăți pentru acest furnizor
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FurnizoriTab;
