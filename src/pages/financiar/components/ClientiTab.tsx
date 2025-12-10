import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { clientiCuSold, facturiClienti, incasariClienti, soldIntervaleClienti } from "../parteneri-mockData";
import { ClientCuSold } from "../parteneri-types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { Users, TrendingUp, AlertTriangle, Clock, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddClientDialog } from "./AddDialogs";

const ClientiTab = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<ClientCuSold | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ nume: "", cui: "", adresa: "", sold_curent: "", zile_intarziere_max: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Sorting state
  const [currentSort, setCurrentSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter state
  const [filters, setFilters] = useState<Record<string, string>>({
    nume: "",
    cui: "",
    adresa: "",
    sold_curent: "",
    zile_intarziere_max: "",
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRowClick = (client: ClientCuSold) => {
    setSelectedClient(client);
    setDialogOpen(true);
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

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let data = [...clientiCuSold];
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (value) {
        data = data.filter(item => {
          const itemValue = String(item[column as keyof ClientCuSold] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (currentSort) {
      data.sort((a, b) => {
        const aValue = a[currentSort.key as keyof ClientCuSold];
        const bValue = b[currentSort.key as keyof ClientCuSold];
        
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

  const clientFacturi = selectedClient ? facturiClienti[selectedClient.id] || [] : [];
  const clientIncasari = selectedClient ? incasariClienti[selectedClient.id] || [] : [];
  const clientSoldIntervale = selectedClient ? soldIntervaleClienti[selectedClient.id] : null;

  return (
    <div className="space-y-6">
      {/* Summary Cards - TOP */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Clienți</div>
                <div className="text-2xl font-bold">{clientiCuSold.length}</div>
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
                <div className="text-sm text-muted-foreground">Total Sold Clienți</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(clientiCuSold.reduce((sum, c) => sum + c.sold_curent, 0))}
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
                <div className="text-sm text-muted-foreground">Clienți cu Întârzieri</div>
                <div className="text-2xl font-bold text-amber-600">
                  {clientiCuSold.filter((c) => c.zile_intarziere_max > 0).length}
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
                <div className="text-sm text-muted-foreground">Clienți &gt;60 zile</div>
                <div className="text-2xl font-bold text-red-600">
                  {clientiCuSold.filter((c) => c.zile_intarziere_max > 60).length}
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
                exportToCSV(filteredAndSortedData, "clienti_solduri", [
                  { key: "nume", label: "Client" },
                  { key: "cui", label: "CUI" },
                  { key: "adresa", label: "Adresă" },
                  { key: "sold_curent", label: "Sold curent" },
                  { key: "zile_intarziere_max", label: "Zile întârziere max." },
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
                      title="Client"
                      sortKey="nume"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.nume}
                      onFilterChange={(val) => handleFilter("nume", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="CUI"
                      sortKey="cui"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.cui}
                      onFilterChange={(val) => handleFilter("cui", val)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Adresă"
                      sortKey="adresa"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.adresa}
                      onFilterChange={(val) => handleFilter("adresa", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Sold curent"
                      sortKey="sold_curent"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.sold_curent}
                      onFilterChange={(val) => handleFilter("sold_curent", val)}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <DataTableColumnHeader
                      title="Zile întârziere max."
                      sortKey="zile_intarziere_max"
                      currentSort={currentSort}
                      onSort={handleSort}
                      filterValue={filters.zile_intarziere_max}
                      onFilterChange={(val) => handleFilter("zile_intarziere_max", val)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell className="font-medium">{client.nume}</TableCell>
                    <TableCell>{client.cui}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{client.adresa}</TableCell>
                    <TableCell className="text-right">
                      <span className={client.sold_curent > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(client.sold_curent)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getZileIntarziereColor(client.zile_intarziere_max)}`}>
                      {client.zile_intarziere_max} zile
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

      {/* Client Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              Fișă Client: {selectedClient?.nume}
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-4">
              {/* Client Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">CUI</p>
                  <p className="font-medium text-sm">{selectedClient.cui}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adresă</p>
                  <p className="font-medium text-sm break-words">{selectedClient.adresa}</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sold Curent</p>
                  <p className={`font-bold text-lg ${selectedClient.sold_curent > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(selectedClient.sold_curent)}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Zile Întârziere Max.</p>
                  <p className={`font-bold text-lg ${getZileIntarziereColor(selectedClient.zile_intarziere_max)}`}>
                    {selectedClient.zile_intarziere_max} zile
                  </p>
                </div>
              </div>

              {/* Sold pe Intervale */}
              {clientSoldIntervale && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Sold pe Intervale</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                      <p className="text-xs text-muted-foreground">0-30 zile</p>
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(clientSoldIntervale.interval_0_30)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <p className="text-xs text-muted-foreground">30-60 zile</p>
                      <p className="text-sm font-bold text-amber-600">
                        {formatCurrency(clientSoldIntervale.interval_30_60)}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                      <p className="text-xs text-muted-foreground">60+ zile</p>
                      <p className="text-sm font-bold text-red-600">
                        {formatCurrency(clientSoldIntervale.interval_60_plus)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Facturi & Încasări as cards */}
              <Tabs defaultValue="facturi" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="facturi" className="text-xs">Facturi ({clientFacturi.length})</TabsTrigger>
                  <TabsTrigger value="incasari" className="text-xs">Încasări ({clientIncasari.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="facturi" className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {clientFacturi.map((factura) => (
                    <div key={factura.id} className="p-3 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{factura.nr_factura}</p>
                          <p className="text-xs text-muted-foreground">{factura.data}</p>
                        </div>
                        <Badge variant={
                          factura.status === "Achitată" ? "default" :
                          factura.status === "Parțial" ? "secondary" : "destructive"
                        } className="text-xs">
                          {factura.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-medium">{formatCurrency(factura.total)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Achitat</p>
                          <p className="font-medium text-green-600">{formatCurrency(factura.suma_achitata)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Restant</p>
                          <p className="font-medium text-red-600">{formatCurrency(factura.suma_restanta)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {clientFacturi.length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">Nu există facturi</p>
                  )}
                </TabsContent>

                <TabsContent value="incasari" className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {clientIncasari.map((incasare) => (
                    <div key={incasare.id} className="p-3 border rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">{incasare.data}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{incasare.tip}</Badge>
                          <span className="text-xs text-muted-foreground">{incasare.document_referinta}</span>
                        </div>
                      </div>
                      <p className="font-bold text-green-600">+{formatCurrency(incasare.suma)}</p>
                    </div>
                  ))}
                  {clientIncasari.length === 0 && (
                    <p className="text-center text-muted-foreground py-4 text-sm">Nu există încasări</p>
                  )}
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => {
                    setEditFormData({
                      nume: selectedClient.nume,
                      cui: selectedClient.cui,
                      adresa: selectedClient.adresa,
                      sold_curent: String(selectedClient.sold_curent),
                      zile_intarziere_max: String(selectedClient.zile_intarziere_max),
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
            <DialogTitle>Editează Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nume Client</Label>
              <Input 
                value={editFormData.nume} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, nume: e.target.value }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CUI</Label>
                <Input 
                  value={editFormData.cui} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, cui: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label>Adresă</Label>
                <Input 
                  value={editFormData.adresa} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, adresa: e.target.value }))} 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sold Curent (RON)</Label>
                <Input 
                  type="number" 
                  value={editFormData.sold_curent} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, sold_curent: e.target.value }))} 
                />
              </div>
              <div className="space-y-2">
                <Label>Zile Întârziere Max</Label>
                <Input 
                  type="number" 
                  value={editFormData.zile_intarziere_max} 
                  onChange={(e) => setEditFormData(prev => ({ ...prev, zile_intarziere_max: e.target.value }))} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={() => {
              toast({ title: "Client actualizat", description: "Înregistrarea a fost actualizată cu succes." });
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
              Sigur doriți să ștergeți acest client? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                toast({ title: "Client șters", description: "Înregistrarea a fost ștearsă cu succes." });
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
      <AddClientDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
};

export default ClientiTab;
