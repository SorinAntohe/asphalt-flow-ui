import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { facturiFurnizori, receptiiMateriale } from "../mockData";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, Package, Wallet, TrendingDown } from "lucide-react";

const AchizitiiTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("facturi");
  
  // Pagination states
  const [facturiPage, setFacturiPage] = useState(1);
  const [facturiPerPage, setFacturiPerPage] = useState(10);
  const [receptiiPage, setReceptiiPage] = useState(1);
  const [receptiiPerPage, setReceptiiPerPage] = useState(10);
  
  // Sorting states
  const [facturiSort, setFacturiSort] = useState<{ column: string | null; direction: "asc" | "desc" }>({ column: null, direction: "asc" });
  const [receptiiSort, setReceptiiSort] = useState<{ column: string | null; direction: "asc" | "desc" }>({ column: null, direction: "asc" });
  
  // Filter states
  const [facturiFilters, setFacturiFilters] = useState<Record<string, string>>({});
  const [receptiiFilters, setReceptiiFilters] = useState<Record<string, string>>({});

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Plătită":
        return "default";
      case "Parțial":
        return "secondary";
      case "Neplătită":
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
  const totalFacturi = facturiFurnizori.reduce((sum, f) => sum + f.total, 0);
  const totalPlatit = facturiFurnizori.reduce((sum, f) => sum + f.suma_platita, 0);
  const totalRestant = facturiFurnizori.reduce((sum, f) => sum + f.suma_restanta, 0);
  const totalReceptii = receptiiMateriale.reduce((sum, r) => sum + r.pret_total, 0);

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
    filterAndSort(facturiFurnizori, facturiFilters, facturiSort.column, facturiSort.direction),
    [facturiFilters, facturiSort]
  );
  
  const filteredReceptii = useMemo(() => 
    filterAndSort(receptiiMateriale, receptiiFilters, receptiiSort.column, receptiiSort.direction),
    [receptiiFilters, receptiiSort]
  );

  // Paginated data
  const paginatedFacturi = filteredFacturi.slice((facturiPage - 1) * facturiPerPage, facturiPage * facturiPerPage);
  const paginatedReceptii = filteredReceptii.slice((receptiiPage - 1) * receptiiPerPage, receptiiPage * receptiiPerPage);

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
                <div className="text-sm text-muted-foreground">Total Facturi</div>
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
                <div className="text-sm text-muted-foreground">Total Plătit</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPlatit)}</div>
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
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Recepții</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalReceptii)}</div>
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
              <TabsTrigger value="facturi">Facturi furnizori</TabsTrigger>
              <TabsTrigger value="receptii">Recepții / NIR-uri</TabsTrigger>
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
                          title="Furnizor"
                          sortDirection={facturiSort.column === "furnizor" ? facturiSort.direction : null}
                          onSort={(dir) => setFacturiSort({ column: "furnizor", direction: dir })}
                          filterValue={facturiFilters.furnizor || ""}
                          onFilter={(val) => { setFacturiFilters(prev => ({ ...prev, furnizor: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Total fără TVA</TableHead>
                      <TableHead className="text-right">TVA</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Dată scadență</TableHead>
                      <TableHead className="text-right">Sumă plătită</TableHead>
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
                        <TableCell>{factura.furnizor}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.total_fara_tva)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.tva)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(factura.total)}</TableCell>
                        <TableCell>{factura.data_scadenta}</TableCell>
                        <TableCell className="text-right">{formatCurrency(factura.suma_platita)}</TableCell>
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

            <TabsContent value="receptii">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortDirection={receptiiSort.column === "data" ? receptiiSort.direction : null}
                          onSort={(dir) => setReceptiiSort({ column: "data", direction: dir })}
                          filterValue={receptiiFilters.data || ""}
                          onFilter={(val) => { setReceptiiFilters(prev => ({ ...prev, data: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod (comandă)"
                          sortDirection={receptiiSort.column === "cod" ? receptiiSort.direction : null}
                          onSort={(dir) => setReceptiiSort({ column: "cod", direction: dir })}
                          filterValue={receptiiFilters.cod || ""}
                          onFilter={(val) => { setReceptiiFilters(prev => ({ ...prev, cod: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Furnizor"
                          sortDirection={receptiiSort.column === "furnizor" ? receptiiSort.direction : null}
                          onSort={(dir) => setReceptiiSort({ column: "furnizor", direction: dir })}
                          filterValue={receptiiFilters.furnizor || ""}
                          onFilter={(val) => { setReceptiiFilters(prev => ({ ...prev, furnizor: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Material"
                          sortDirection={receptiiSort.column === "material" ? receptiiSort.direction : null}
                          onSort={(dir) => setReceptiiSort({ column: "material", direction: dir })}
                          filterValue={receptiiFilters.material || ""}
                          onFilter={(val) => { setReceptiiFilters(prev => ({ ...prev, material: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Cantitate recepționată</TableHead>
                      <TableHead className="text-right">Preț material total</TableHead>
                      <TableHead className="text-right">Preț transport total</TableHead>
                      <TableHead className="text-right">Preț total</TableHead>
                      <TableHead>Nr Factură</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReceptii.map((receptie) => (
                      <TableRow key={receptie.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>{receptie.data}</TableCell>
                        <TableCell className="font-medium">{receptie.cod}</TableCell>
                        <TableCell>{receptie.furnizor}</TableCell>
                        <TableCell>{receptie.material}</TableCell>
                        <TableCell className="text-right">{receptie.cantitate_receptionata} t</TableCell>
                        <TableCell className="text-right">{formatCurrency(receptie.pret_material_total)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(receptie.pret_transport_total)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(receptie.pret_total)}</TableCell>
                        <TableCell>
                          {receptie.nr_factura ? (
                            <Badge variant="outline">{receptie.nr_factura}</Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={receptiiPage}
                totalPages={Math.ceil(filteredReceptii.length / receptiiPerPage)}
                itemsPerPage={receptiiPerPage}
                totalItems={filteredReceptii.length}
                onPageChange={setReceptiiPage}
                onItemsPerPageChange={(val) => { setReceptiiPerPage(val); setReceptiiPage(1); }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AchizitiiTab;
