import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { facturiClienti, livrariClienti, incasariClienti } from "../mockData";
import { FacturaClient, LivrareClient, IncasareClient } from "../types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { FileText, Truck, Wallet, TrendingUp, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddFacturaClientDialog, AddLivrareDialog, AddIncasareDialog } from "./AddDialogs";

const VanzariTab = () => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("facturi");
  
  // Dialog states
  const [selectedFactura, setSelectedFactura] = useState<FacturaClient | null>(null);
  const [selectedLivrare, setSelectedLivrare] = useState<LivrareClient | null>(null);
  const [selectedIncasare, setSelectedIncasare] = useState<IncasareClient | null>(null);
  
  // Add dialog states
  const [addFacturaOpen, setAddFacturaOpen] = useState(false);
  const [addLivrareOpen, setAddLivrareOpen] = useState(false);
  const [addIncasareOpen, setAddIncasareOpen] = useState(false);
  
  // Edit dialog states
  const [editFacturaOpen, setEditFacturaOpen] = useState(false);
  const [editLivrareOpen, setEditLivrareOpen] = useState(false);
  const [editIncasareOpen, setEditIncasareOpen] = useState(false);
  
  // Edit form data
  const [editFacturaData, setEditFacturaData] = useState({
    cod_comanda: "", client: "", total_fara_tva: "", tva: "", total: "",
    data_scadenta: "", suma_incasata: "", suma_restanta: "", status: ""
  });
  const [editLivrareData, setEditLivrareData] = useState({
    cod_comanda: "", nr_aviz: "", client: "", produs: "", cantitate: "",
    valoare_produs: "", valoare_transport: "", total: "", status_facturare: ""
  });
  const [editIncasareData, setEditIncasareData] = useState({
    cod_comanda: "", client: "", tip: "", suma_totala: "", suma_alocata: "", suma_nealocata: ""
  });
  
  // Delete dialog states
  const [deleteType, setDeleteType] = useState<"factura" | "livrare" | "incasare" | null>(null);

  // Open edit dialogs with data
  const openEditFactura = () => {
    if (selectedFactura) {
      setEditFacturaData({
        cod_comanda: selectedFactura.cod_comanda || "",
        client: selectedFactura.client,
        total_fara_tva: String(selectedFactura.total_fara_tva),
        tva: String(selectedFactura.tva),
        total: String(selectedFactura.total),
        data_scadenta: selectedFactura.data_scadenta,
        suma_incasata: String(selectedFactura.suma_incasata),
        suma_restanta: String(selectedFactura.suma_restanta),
        status: selectedFactura.status
      });
      setEditFacturaOpen(true);
    }
  };

  const openEditLivrare = () => {
    if (selectedLivrare) {
      setEditLivrareData({
        cod_comanda: selectedLivrare.cod_comanda || "",
        nr_aviz: selectedLivrare.nr_aviz,
        client: selectedLivrare.client,
        produs: selectedLivrare.produs,
        cantitate: String(selectedLivrare.cantitate),
        valoare_produs: String(selectedLivrare.valoare_produs),
        valoare_transport: String(selectedLivrare.valoare_transport),
        total: String(selectedLivrare.total),
        status_facturare: selectedLivrare.status_facturare
      });
      setEditLivrareOpen(true);
    }
  };

  const openEditIncasare = () => {
    if (selectedIncasare) {
      setEditIncasareData({
        cod_comanda: selectedIncasare.cod_comanda || "",
        client: selectedIncasare.client,
        tip: selectedIncasare.tip,
        suma_totala: String(selectedIncasare.suma_totala),
        suma_alocata: String(selectedIncasare.suma_alocata),
        suma_nealocata: String(selectedIncasare.suma_nealocata)
      });
      setEditIncasareOpen(true);
    }
  };

  const handleSaveFactura = () => {
    toast({ title: "Factură actualizată", description: "Factura a fost actualizată cu succes." });
    setEditFacturaOpen(false);
    setSelectedFactura(null);
  };

  const handleSaveLivrare = () => {
    toast({ title: "Livrare actualizată", description: "Livrarea a fost actualizată cu succes." });
    setEditLivrareOpen(false);
    setSelectedLivrare(null);
  };

  const handleSaveIncasare = () => {
    toast({ title: "Încasare actualizată", description: "Încasarea a fost actualizată cu succes." });
    setEditIncasareOpen(false);
    setSelectedIncasare(null);
  };

  // Pagination states for each sub-tab
  const [facturiPage, setFacturiPage] = useState(1);
  const [facturiPerPage, setFacturiPerPage] = useState(10);
  const [livrariPage, setLivrariPage] = useState(1);
  const [livrariPerPage, setLivrariPerPage] = useState(10);
  const [incasariPage, setIncasariPage] = useState(1);
  const [incasariPerPage, setIncasariPerPage] = useState(10);
  
  // Sorting states
  const [facturiSort, setFacturiSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [livrariSort, setLivrariSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [incasariSort, setIncasariSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter states
  const [facturiFilters, setFacturiFilters] = useState<Record<string, string>>({
    nr_factura: "", data: "", cod_comanda: "", client: "", status: "",
  });
  const [livrariFilters, setLivrariFilters] = useState<Record<string, string>>({
    data: "", cod: "", cod_comanda: "", client: "",
  });
  const [incasariFilters, setIncasariFilters] = useState<Record<string, string>>({
    data: "", cod_comanda: "", client: "", tip: "",
  });

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
    filterAndSort(facturiClienti, facturiFilters, facturiSort),
    [facturiFilters, facturiSort]
  );
  
  const filteredLivrari = useMemo(() => 
    filterAndSort(livrariClienti, livrariFilters, livrariSort),
    [livrariFilters, livrariSort]
  );
  
  const filteredIncasari = useMemo(() => 
    filterAndSort(incasariClienti, incasariFilters, incasariSort),
    [incasariFilters, incasariSort]
  );

  // Paginated data
  const paginatedFacturi = filteredFacturi.slice((facturiPage - 1) * facturiPerPage, facturiPage * facturiPerPage);
  const paginatedLivrari = filteredLivrari.slice((livrariPage - 1) * livrariPerPage, livrariPage * livrariPerPage);
  const paginatedIncasari = filteredIncasari.slice((incasariPage - 1) * incasariPerPage, incasariPage * incasariPerPage);

  const handleExport = (type: string) => {
    switch (type) {
      case "facturi":
        exportToCSV(filteredFacturi, "facturi_clienti", [
          { key: "nr_factura", label: "Nr Factură" },
          { key: "data", label: "Dată" },
          { key: "client", label: "Client" },
          { key: "total_fara_tva", label: "Total fără TVA" },
          { key: "tva", label: "TVA" },
          { key: "total", label: "Total" },
          { key: "data_scadenta", label: "Dată scadență" },
          { key: "suma_incasata", label: "Sumă încasată" },
          { key: "suma_restanta", label: "Sumă restantă" },
          { key: "status", label: "Status" },
        ]);
        break;
      case "livrari":
        exportToCSV(filteredLivrari, "livrari_clienti", [
          { key: "data", label: "Dată" },
          { key: "cod", label: "Cod" },
          { key: "nr_aviz", label: "Nr Aviz" },
          { key: "client", label: "Client" },
          { key: "produs", label: "Produs" },
          { key: "cantitate", label: "Cantitate" },
          { key: "valoare_produs", label: "Valoare produs" },
          { key: "valoare_transport", label: "Valoare transport" },
          { key: "total", label: "Total" },
          { key: "status_facturare", label: "Status facturare" },
        ]);
        break;
      case "incasari":
        exportToCSV(filteredIncasari, "incasari_clienti", [
          { key: "data", label: "Dată" },
          { key: "client", label: "Client" },
          { key: "tip", label: "Tip" },
          { key: "suma_totala", label: "Sumă totală" },
          { key: "suma_alocata", label: "Sumă alocată" },
          { key: "suma_nealocata", label: "Sumă nealocată" },
        ]);
        break;
    }
    toast({ title: "Export realizat", description: `Export CSV realizat cu succes.` });
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="facturi">Facturi clienți</TabsTrigger>
                <TabsTrigger value="livrari">Livrări (bonuri / avize)</TabsTrigger>
                <TabsTrigger value="incasari">Încasări clienți</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport(activeSubTab)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm" onClick={() => {
                  if (activeSubTab === "facturi") setAddFacturaOpen(true);
                  else if (activeSubTab === "livrari") setAddLivrareOpen(true);
                  else setAddIncasareOpen(true);
                }}>
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
                          title="Cod Comandă"
                          sortKey="cod_comanda"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.cod_comanda}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, cod_comanda: val })); setFacturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortKey="client"
                          currentSort={facturiSort}
                          onSort={(key, dir) => setFacturiSort({ key, direction: dir })}
                          filterValue={facturiFilters.client}
                          onFilterChange={(val) => { setFacturiFilters(prev => ({ ...prev, client: val })); setFacturiPage(1); }}
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
                        <TableCell>{factura.cod_comanda || "-"}</TableCell>
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
                          sortKey="data"
                          currentSort={livrariSort}
                          onSort={(key, dir) => setLivrariSort({ key, direction: dir })}
                          filterValue={livrariFilters.data}
                          onFilterChange={(val) => { setLivrariFilters(prev => ({ ...prev, data: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod"
                          sortKey="cod"
                          currentSort={livrariSort}
                          onSort={(key, dir) => setLivrariSort({ key, direction: dir })}
                          filterValue={livrariFilters.cod}
                          onFilterChange={(val) => { setLivrariFilters(prev => ({ ...prev, cod: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod Comandă"
                          sortKey="cod_comanda"
                          currentSort={livrariSort}
                          onSort={(key, dir) => setLivrariSort({ key, direction: dir })}
                          filterValue={livrariFilters.cod_comanda}
                          onFilterChange={(val) => { setLivrariFilters(prev => ({ ...prev, cod_comanda: val })); setLivrariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>Nr Aviz</TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortKey="client"
                          currentSort={livrariSort}
                          onSort={(key, dir) => setLivrariSort({ key, direction: dir })}
                          filterValue={livrariFilters.client}
                          onFilterChange={(val) => { setLivrariFilters(prev => ({ ...prev, client: val })); setLivrariPage(1); }}
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
                      <TableRow 
                        key={livrare.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedLivrare(livrare)}
                      >
                        <TableCell>{livrare.data}</TableCell>
                        <TableCell className="font-medium">{livrare.cod}</TableCell>
                        <TableCell>{livrare.cod_comanda || "-"}</TableCell>
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
                          sortKey="data"
                          currentSort={incasariSort}
                          onSort={(key, dir) => setIncasariSort({ key, direction: dir })}
                          filterValue={incasariFilters.data}
                          onFilterChange={(val) => { setIncasariFilters(prev => ({ ...prev, data: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cod Comandă"
                          sortKey="cod_comanda"
                          currentSort={incasariSort}
                          onSort={(key, dir) => setIncasariSort({ key, direction: dir })}
                          filterValue={incasariFilters.cod_comanda}
                          onFilterChange={(val) => { setIncasariFilters(prev => ({ ...prev, cod_comanda: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Client"
                          sortKey="client"
                          currentSort={incasariSort}
                          onSort={(key, dir) => setIncasariSort({ key, direction: dir })}
                          filterValue={incasariFilters.client}
                          onFilterChange={(val) => { setIncasariFilters(prev => ({ ...prev, client: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Tip"
                          sortKey="tip"
                          currentSort={incasariSort}
                          onSort={(key, dir) => setIncasariSort({ key, direction: dir })}
                          filterValue={incasariFilters.tip}
                          onFilterChange={(val) => { setIncasariFilters(prev => ({ ...prev, tip: val })); setIncasariPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Sumă totală</TableHead>
                      <TableHead className="text-right">Sumă alocată</TableHead>
                      <TableHead className="text-right">Sumă nealocată</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedIncasari.map((incasare) => (
                      <TableRow 
                        key={incasare.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedIncasare(incasare)}
                      >
                        <TableCell>{incasare.data}</TableCell>
                        <TableCell>{incasare.cod_comanda || "-"}</TableCell>
                        <TableCell className="font-medium">{incasare.client}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{incasare.tip}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          +{formatCurrency(incasare.suma_totala)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(incasare.suma_alocata)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(incasare.suma_nealocata)}</TableCell>
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

      {/* Factura Detail Dialog */}
      <Dialog open={!!selectedFactura} onOpenChange={() => setSelectedFactura(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detalii Factură {selectedFactura?.nr_factura}
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
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedFactura.client}</p>
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
                  <p className="text-sm text-muted-foreground">Sumă încasată</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedFactura.suma_incasata)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sumă restantă</p>
                  <p className="text-lg font-bold text-red-600">{formatCurrency(selectedFactura.suma_restanta)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditFactura}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteType("factura")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Livrare Detail Dialog */}
      <Dialog open={!!selectedLivrare} onOpenChange={() => setSelectedLivrare(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Detalii Livrare {selectedLivrare?.cod}
            </DialogTitle>
          </DialogHeader>
          {selectedLivrare && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cod</p>
                  <p className="font-medium">{selectedLivrare.cod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nr Aviz</p>
                  <p className="font-medium">{selectedLivrare.nr_aviz}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedLivrare.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedLivrare.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produs</p>
                  <p className="font-medium">{selectedLivrare.produs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cantitate</p>
                  <p className="font-medium">{selectedLivrare.cantitate} t</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Valoare produs</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedLivrare.valoare_produs)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valoare transport</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedLivrare.valoare_transport)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedLivrare.total)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status facturare</p>
                  <Badge variant={selectedLivrare.status_facturare === "Nefacturat" ? "destructive" : "default"}>
                    {selectedLivrare.status_facturare}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditLivrare}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteType("livrare")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Incasare Detail Dialog */}
      <Dialog open={!!selectedIncasare} onOpenChange={() => setSelectedIncasare(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Detalii Încasare
            </DialogTitle>
          </DialogHeader>
          {selectedIncasare && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedIncasare.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">{selectedIncasare.client}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tip plată</p>
                  <Badge variant="outline">{selectedIncasare.tip}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Sumă totală</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(selectedIncasare.suma_totala)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sumă alocată</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedIncasare.suma_alocata)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sumă nealocată</p>
                  <p className="text-lg font-bold text-amber-600">{formatCurrency(selectedIncasare.suma_nealocata)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditIncasare}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteType("incasare")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Factura Dialog */}
      <Dialog open={editFacturaOpen} onOpenChange={setEditFacturaOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Factură Client</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cod Comandă</Label>
              <Input value={editFacturaData.cod_comanda} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={editFacturaData.client} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Dată scadență</Label>
              <Input type="date" value={editFacturaData.data_scadenta} onChange={(e) => setEditFacturaData(prev => ({ ...prev, data_scadenta: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Total fără TVA</Label>
              <Input type="number" value={editFacturaData.total_fara_tva} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>TVA</Label>
              <Input type="number" value={editFacturaData.tva} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input type="number" value={editFacturaData.total} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Sumă încasată</Label>
              <Input type="number" value={editFacturaData.suma_incasata} onChange={(e) => setEditFacturaData(prev => ({ ...prev, suma_incasata: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Sumă restantă</Label>
              <Input type="number" value={editFacturaData.suma_restanta} onChange={(e) => setEditFacturaData(prev => ({ ...prev, suma_restanta: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editFacturaData.status} onValueChange={(val) => setEditFacturaData(prev => ({ ...prev, status: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Încasată">Încasată</SelectItem>
                  <SelectItem value="Parțial">Parțial</SelectItem>
                  <SelectItem value="Neîncasată">Neîncasată</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFacturaOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveFactura}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Livrare Dialog */}
      <Dialog open={editLivrareOpen} onOpenChange={setEditLivrareOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Livrare</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cod Comandă</Label>
              <Input value={editLivrareData.cod_comanda} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Nr Aviz</Label>
              <Input value={editLivrareData.nr_aviz} onChange={(e) => setEditLivrareData(prev => ({ ...prev, nr_aviz: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={editLivrareData.client} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Produs</Label>
              <Input value={editLivrareData.produs} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Cantitate (t)</Label>
              <Input type="number" value={editLivrareData.cantitate} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Valoare produs</Label>
              <Input type="number" value={editLivrareData.valoare_produs} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Valoare transport</Label>
              <Input type="number" value={editLivrareData.valoare_transport} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input type="number" value={editLivrareData.total} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Status facturare</Label>
              <Select value={editLivrareData.status_facturare} onValueChange={(val) => setEditLivrareData(prev => ({ ...prev, status_facturare: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facturat">Facturat</SelectItem>
                  <SelectItem value="Nefacturat">Nefacturat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLivrareOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveLivrare}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Incasare Dialog */}
      <Dialog open={editIncasareOpen} onOpenChange={setEditIncasareOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Încasare</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cod Comandă</Label>
              <Input value={editIncasareData.cod_comanda} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={editIncasareData.client} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Tip plată</Label>
              <Select value={editIncasareData.tip} onValueChange={(val) => setEditIncasareData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Transfer bancar">Transfer bancar</SelectItem>
                  <SelectItem value="Numerar">Numerar</SelectItem>
                  <SelectItem value="CEC">CEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sumă totală</Label>
              <Input type="number" value={editIncasareData.suma_totala} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Sumă alocată</Label>
              <Input type="number" value={editIncasareData.suma_alocata} onChange={(e) => setEditIncasareData(prev => ({ ...prev, suma_alocata: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Sumă nealocată</Label>
              <Input type="number" value={editIncasareData.suma_nealocata} onChange={(e) => setEditIncasareData(prev => ({ ...prev, suma_nealocata: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditIncasareOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveIncasare}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteType} onOpenChange={() => setDeleteType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această înregistrare? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                toast({ title: "Înregistrare ștearsă", description: "Înregistrarea a fost ștearsă cu succes." });
                setDeleteType(null);
                if (deleteType === "factura") setSelectedFactura(null);
                else if (deleteType === "livrare") setSelectedLivrare(null);
                else setSelectedIncasare(null);
              }}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialogs */}
      <AddFacturaClientDialog open={addFacturaOpen} onOpenChange={setAddFacturaOpen} />
      <AddLivrareDialog open={addLivrareOpen} onOpenChange={setAddLivrareOpen} />
      <AddIncasareDialog open={addIncasareOpen} onOpenChange={setAddIncasareOpen} />
    </div>
  );
};

export default VanzariTab;