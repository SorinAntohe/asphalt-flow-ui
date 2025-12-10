import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { facturiFurnizori, receptiiMateriale } from "../mockData";
import { FacturaFurnizor, ReceptieMaterial } from "../types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, Package, Wallet, TrendingDown, Plus, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

const AchizitiiTab = () => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("facturi");
  
  // Dialog states
  const [selectedFactura, setSelectedFactura] = useState<FacturaFurnizor | null>(null);
  const [selectedReceptie, setSelectedReceptie] = useState<ReceptieMaterial | null>(null);
  
  // Pagination states
  const [facturiPage, setFacturiPage] = useState(1);
  const [facturiPerPage, setFacturiPerPage] = useState(10);
  const [receptiiPage, setReceptiiPage] = useState(1);
  const [receptiiPerPage, setReceptiiPerPage] = useState(10);
  
  // Sorting states
  const [facturiSort, setFacturiSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [receptiiSort, setReceptiiSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter states
  const [facturiFilters, setFacturiFilters] = useState<Record<string, string>>({
    nr_factura: "", data: "", furnizor: "", status: "",
  });
  const [receptiiFilters, setReceptiiFilters] = useState<Record<string, string>>({
    data: "", cod: "", furnizor: "", material: "",
  });

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
  const filterAndSort = <T,>(
    data: T[],
    filters: Record<string, string>,
    sort: { key: string; direction: "asc" | "desc" } | null
  ): T[] => {
    let result = [...data];
    
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = String((item as Record<string, unknown>)[column] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    if (sort) {
      result.sort((a, b) => {
        const aValue = (a as Record<string, unknown>)[sort.key];
        const bValue = (b as Record<string, unknown>)[sort.key];
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue || "");
        const bStr = String(bValue || "");
        return sort.direction === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    
    return result;
  };

  // Processed data
  const filteredFacturi = useMemo(() => 
    filterAndSort(facturiFurnizori, facturiFilters, facturiSort),
    [facturiFilters, facturiSort]
  );
  
  const filteredReceptii = useMemo(() => 
    filterAndSort(receptiiMateriale, receptiiFilters, receptiiSort),
    [receptiiFilters, receptiiSort]
  );

  // Paginated data
  const paginatedFacturi = filteredFacturi.slice((facturiPage - 1) * facturiPerPage, facturiPage * facturiPerPage);
  const paginatedReceptii = filteredReceptii.slice((receptiiPage - 1) * receptiiPerPage, receptiiPage * receptiiPerPage);

  const handleExport = (type: string) => {
    let data: Record<string, unknown>[] = [];
    let filename = "";
    
    switch (type) {
      case "facturi":
        data = filteredFacturi.map(f => ({
          "Nr Factură": f.nr_factura,
          "Dată": f.data,
          "Furnizor": f.furnizor,
          "Total fără TVA": f.total_fara_tva,
          "TVA": f.tva,
          "Total": f.total,
          "Dată scadență": f.data_scadenta,
          "Sumă plătită": f.suma_platita,
          "Sumă restantă": f.suma_restanta,
          "Status": f.status,
        }));
        filename = "facturi_furnizori";
        break;
      case "receptii":
        data = filteredReceptii.map(r => ({
          "Dată": r.data,
          "Cod": r.cod,
          "Furnizor": r.furnizor,
          "Material": r.material,
          "Cantitate recepționată": r.cantitate_receptionata,
          "Preț material total": r.pret_material_total,
          "Preț transport total": r.pret_transport_total,
          "Preț total": r.pret_total,
          "Nr Factură": r.nr_factura,
        }));
        filename = "receptii_materiale";
        break;
    }
    
    exportToCSV(data, filename);
    toast({ title: "Export realizat", description: `Fișierul ${filename}.csv a fost descărcat.` });
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="facturi">Facturi furnizori</TabsTrigger>
                <TabsTrigger value="receptii">Recepții / NIR-uri</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport(activeSubTab)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă
                </Button>
              </div>
            </div>

            <TabsContent value="facturi">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Nr Factură"
                          sortKey="nr_factura"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.nr_factura}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, nr_factura: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortKey="data"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.data}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, data: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Furnizor"
                          sortKey="furnizor"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.furnizor}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, furnizor: val })); setFacturiPage(1); }}
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
                          sortKey="status"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.status}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, status: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFacturi.map((factura) => (
                      <TableRow 
                        key={factura.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedFactura(factura)}
                      >
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
                          sortKey="data"
                          currentSort={receptiiSort}
                          onSort={(key, dir) => setReceptiiSort({ key, direction: dir })}
                          filterValue={receptiiFilters.data}
                          onFilterChange={(val) => { setReceptiiFilters(prev => ({ ...prev, data: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod (comandă)"
                          sortKey="cod"
                          currentSort={receptiiSort}
                          onSort={(key, dir) => setReceptiiSort({ key, direction: dir })}
                          filterValue={receptiiFilters.cod}
                          onFilterChange={(val) => { setReceptiiFilters(prev => ({ ...prev, cod: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Furnizor"
                          sortKey="furnizor"
                          currentSort={receptiiSort}
                          onSort={(key, dir) => setReceptiiSort({ key, direction: dir })}
                          filterValue={receptiiFilters.furnizor}
                          onFilterChange={(val) => { setReceptiiFilters(prev => ({ ...prev, furnizor: val })); setReceptiiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Material"
                          sortKey="material"
                          currentSort={receptiiSort}
                          onSort={(key, dir) => setReceptiiSort({ key, direction: dir })}
                          filterValue={receptiiFilters.material}
                          onFilterChange={(val) => { setReceptiiFilters(prev => ({ ...prev, material: val })); setReceptiiPage(1); }}
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
                      <TableRow 
                        key={receptie.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedReceptie(receptie)}
                      >
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

      {/* Factura Furnizor Detail Dialog */}
      <Dialog open={!!selectedFactura} onOpenChange={() => setSelectedFactura(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalii Factură Furnizor {selectedFactura?.nr_factura}
            </DialogTitle>
          </DialogHeader>
          {selectedFactura && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nr Factură</p>
                  <p className="font-medium">{selectedFactura.nr_factura}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedFactura.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Furnizor</p>
                  <p className="font-medium">{selectedFactura.furnizor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dată scadență</p>
                  <p className="font-medium">{selectedFactura.data_scadenta}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusBadgeVariant(selectedFactura.status)}>
                    {selectedFactura.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total fără TVA</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedFactura.total_fara_tva)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">TVA</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedFactura.tva)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedFactura.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sumă plătită</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedFactura.suma_platita)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sumă restantă</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(selectedFactura.suma_restanta)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receptie Detail Dialog */}
      <Dialog open={!!selectedReceptie} onOpenChange={() => setSelectedReceptie(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalii Recepție {selectedReceptie?.cod}
            </DialogTitle>
          </DialogHeader>
          {selectedReceptie && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cod</p>
                  <p className="font-medium">{selectedReceptie.cod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedReceptie.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Furnizor</p>
                  <p className="font-medium">{selectedReceptie.furnizor}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Material</p>
                  <p className="font-medium">{selectedReceptie.material}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cantitate recepționată</p>
                  <p className="font-medium">{selectedReceptie.cantitate_receptionata} t</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nr Factură</p>
                  <p className="font-medium">{selectedReceptie.nr_factura || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Preț material total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedReceptie.pret_material_total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preț transport total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedReceptie.pret_transport_total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preț total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedReceptie.pret_total)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AchizitiiTab;