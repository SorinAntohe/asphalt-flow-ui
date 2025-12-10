import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { facturiClienti, livrariClienti, incasariClienti } from "../mockData";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, Truck, Wallet, TrendingUp } from "lucide-react";

const VanzariTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("facturi");
  
  // Pagination states for each sub-tab
  const [facturiPage, setFacturiPage] = useState(1);
  const [facturiPerPage, setFacturiPerPage] = useState(10);
  const [livrariPage, setLivrariPage] = useState(1);
  const [livrariPerPage, setLivrariPerPage] = useState(10);
  const [incasariPage, setIncasariPage] = useState(1);
  const [incasariPerPage, setIncasariPerPage] = useState(10);
  
  // Sorting states
  const [facturiSort, setFacturiSort] = useState<{ column: string | null; direction: "asc" | "desc" }>({ column: null, direction: "asc" });
  const [livrariSort, setLivrariSort] = useState<{ column: string | null; direction: "asc" | "desc" }>({ column: null, direction: "asc" });
  const [incasariSort, setIncasariSort] = useState<{ column: string | null; direction: "asc" | "desc" }>({ column: null, direction: "asc" });
  
  // Filter states
  const [facturiFilters, setFacturiFilters] = useState<Record<string, string>>({});
  const [livrariFilters, setLivrariFilters] = useState<Record<string, string>>({});
  const [incasariFilters, setIncasariFilters] = useState<Record<string, string>>({});

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Încasată":
      case "Facturat":
        return "default";
      case "Parțial":
        return "secondary";
      case "Neîncasată":
      case "Nefacturat":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Summary calculations
  const totalFacturi = facturiClienti.reduce((sum, f) => sum + f.total, 0);
  const totalIncasat = facturiClienti.reduce((sum, f) => sum + f.suma_incasata, 0);
  const totalRestant = facturiClienti.reduce((sum, f) => sum + f.suma_restanta, 0);
  const totalLivrari = livrariClienti.reduce((sum, l) => sum + l.total, 0);

  // Filter and sort helper
  const filterAndSort = <T extends Record<string, unknown>>(
    data: T[],
    filters: Record<string, string>,
    sortColumn: string | null,
    sortDirection: "asc" | "desc"
  ) => {
    let result = [...data];
    
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = String(item[column] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    if (sortColumn) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || "");
        const bStr = String(bValue || "");
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    
    return result;
  };

  // Processed data
  const filteredFacturi = useMemo(() => 
    filterAndSort(facturiClienti, facturiFilters, facturiSort.column, facturiSort.direction),
    [facturiFilters, facturiSort]
  );
  
  const filteredLivrari = useMemo(() => 
    filterAndSort(livrariClienti, livrariFilters, livrariSort.column, livrariSort.direction),
    [livrariFilters, livrariSort]
  );
  
  const filteredIncasari = useMemo(() => 
    filterAndSort(incasariClienti, incasariFilters, incasariSort.column, incasariSort.direction),
    [incasariFilters, incasariSort]
  );

  // Paginated data
  const paginatedFacturi = filteredFacturi.slice((facturiPage - 1) * facturiPerPage, facturiPage * facturiPerPage);
  const paginatedLivrari = filteredLivrari.slice((livrariPage - 1) * livrariPerPage, livrariPage * livrariPerPage);
  const paginatedIncasari = filteredIncasari.slice((incasariPage - 1) * incasariPerPage, incasariPage * incasariPerPage);

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
                <div className="text-sm text-muted-foreground">Total Facturat</div>
                <div className="text-2xl font-bold">{formatCurrency(totalFacturi)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Încasat</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncasat)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Restant</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRestant)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Livrări</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalLivrari)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="facturi">Facturi clienți</TabsTrigger>
              <TabsTrigger value="livrari">Livrări (bonuri / avize)</TabsTrigger>
              <TabsTrigger value="incasari">Încasări clienți</TabsTrigger>
            </TabsList>

            <TabsContent value="facturi">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Nr Factură"
                          sortDirection={facturiSort.column === "nr_factura" ? facturiSort.direction : null}
                          onSort={(dir) => setFacturiSort({ column: "nr_factura", direction: dir })}
                          filterValue={facturiFilters.nr_factura || ""}
                          onFilter={(val) => { setFacturiFilters(prev => ({ ...prev, nr_factura: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortDirection={facturiSort.column === "data" ? facturiSort.direction : null}
                          onSort={(dir) => setFacturiSort({ column: "data", direction: dir })}
                          filterValue={facturiFilters.data || ""}
                          onFilter={(val) => { setFacturiFilters(prev => ({ ...prev, data: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortDirection={facturiSort.column === "client" ? facturiSort.direction : null}
                          onSort={(dir) => setFacturiSort({ column: "client", direction: dir })}
                          filterValue={facturiFilters.client || ""}
                          onFilter={(val) => { setFacturiFilters(prev => ({ ...prev, client: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Total fără TVA</TableHead>
                      <TableHead className="text-right">TVA</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Dată scadență</TableHead>
                      <TableHead className="text-right">Sumă încasată</TableHead>
                      <TableHead className="text-right">Sumă restantă</TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Status"
                          sortDirection={facturiSort.column === "status" ? facturiSort.direction : null}
                          onSort={(dir) => setFacturiSort({ column: "status", direction: dir })}
                          filterValue={facturiFilters.status || ""}
                          onFilter={(val) => { setFacturiFilters(prev => ({ ...prev, status: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFacturi.map((factura) => (
                      <TableRow key={factura.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{factura.nr_factura}</TableCell>
                        <TableCell>{factura.data}</TableCell>
                        <TableCell>{factura.client}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.total_fara_tva)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.tva)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(factura.total)}</TableCell>
                        <TableCell>{factura.data_scadenta}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.suma_incasata)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.suma_restanta)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(factura.status)}>
                            {factura.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={facturiPage}
                totalPages={Math.ceil(filteredFacturi.length / facturiPerPage)}
                itemsPerPage={facturiPerPage}
                totalItems={filteredFacturi.length}
                onPageChange={setFacturiPage}
                onItemsPerPageChange={(val) => { setFacturiPerPage(val); setFacturiPage(1); }}
              />
            </TabsContent>

            <TabsContent value="livrari">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortDirection={livrariSort.column === "data" ? livrariSort.direction : null}
                          onSort={(dir) => setLivrariSort({ column: "data", direction: dir })}
                          filterValue={livrariFilters.data || ""}
                          onFilter={(val) => { setLivrariFilters(prev => ({ ...prev, data: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod"
                          sortDirection={livrariSort.column === "cod" ? livrariSort.direction : null}
                          onSort={(dir) => setLivrariSort({ column: "cod", direction: dir })}
                          filterValue={livrariFilters.cod || ""}
                          onFilter={(val) => { setLivrariFilters(prev => ({ ...prev, cod: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>Nr Aviz</TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortDirection={livrariSort.column === "client" ? livrariSort.direction : null}
                          onSort={(dir) => setLivrariSort({ column: "client", direction: dir })}
                          filterValue={livrariFilters.client || ""}
                          onFilter={(val) => { setLivrariFilters(prev => ({ ...prev, client: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>Produs</TableHead>
                      <TableHead className="text-right">Cantitate</TableHead>
                      <TableHead className="text-right">Valoare produs</TableHead>
                      <TableHead className="text-right">Valoare transport</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status facturare</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLivrari.map((livrare) => (
                      <TableRow key={livrare.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>{livrare.data}</TableCell>
                        <TableCell className="font-medium">{livrare.cod}</TableCell>
                        <TableCell>{livrare.nr_aviz}</TableCell>
                        <TableCell>{livrare.client}</TableCell>
                        <TableCell>{livrare.produs}</TableCell>
                        <TableCell className="text-right">{livrare.cantitate} t</TableCell>
                        <TableCell className="text-right">{formatCurrency(livrare.valoare_produs)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(livrare.valoare_transport)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(livrare.total)}</TableCell>
                        <TableCell>
                          <Badge variant={livrare.status_facturare === "Nefacturat" ? "destructive" : "default"}>
                            {livrare.status_facturare}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={livrariPage}
                totalPages={Math.ceil(filteredLivrari.length / livrariPerPage)}
                itemsPerPage={livrariPerPage}
                totalItems={filteredLivrari.length}
                onPageChange={setLivrariPage}
                onItemsPerPageChange={(val) => { setLivrariPerPage(val); setLivrariPage(1); }}
              />
            </TabsContent>

            <TabsContent value="incasari">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortDirection={incasariSort.column === "data" ? incasariSort.direction : null}
                          onSort={(dir) => setIncasariSort({ column: "data", direction: dir })}
                          filterValue={incasariFilters.data || ""}
                          onFilter={(val) => { setIncasariFilters(prev => ({ ...prev, data: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortDirection={incasariSort.column === "client" ? incasariSort.direction : null}
                          onSort={(dir) => setIncasariSort({ column: "client", direction: dir })}
                          filterValue={incasariFilters.client || ""}
                          onFilter={(val) => { setIncasariFilters(prev => ({ ...prev, client: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Tip"
                          sortDirection={incasariSort.column === "tip" ? incasariSort.direction : null}
                          onSort={(dir) => setIncasariSort({ column: "tip", direction: dir })}
                          filterValue={incasariFilters.tip || ""}
                          onFilter={(val) => { setIncasariFilters(prev => ({ ...prev, tip: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Sumă totală</TableHead>
                      <TableHead className="text-right">Sumă alocată</TableHead>
                      <TableHead className="text-right">Sumă nealocată</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIncasari.map((incasare) => (
                      <TableRow key={incasare.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>{incasare.data}</TableCell>
                        <TableCell className="font-medium">{incasare.client}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{incasare.tip}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(incasare.suma_totala)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(incasare.suma_alocata)}</TableCell>
                        <TableCell className="text-right">
                          <span className={incasare.suma_nealocata > 0 ? "text-amber-600" : ""}>
                            {formatCurrency(incasare.suma_nealocata)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={incasariPage}
                totalPages={Math.ceil(filteredIncasari.length / incasariPerPage)}
                itemsPerPage={incasariPerPage}
                totalItems={filteredIncasari.length}
                onPageChange={setIncasariPage}
                onItemsPerPageChange={(val) => { setIncasariPerPage(val); setIncasariPage(1); }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default VanzariTab;
