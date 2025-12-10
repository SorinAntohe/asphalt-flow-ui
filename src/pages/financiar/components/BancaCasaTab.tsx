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
import { conturiBancare, miscariBanca, registruCasa } from "../mockData";
import { ContBancar, MiscareBanca, InregistrareCasa } from "../types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { Building, Wallet, ArrowUpDown, Landmark, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { AddContBancarDialog, AddMiscareBancaDialog, AddRegistruCasaDialog } from "./AddDialogs";

const BancaCasaTab = () => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("conturi");
  
  // Dialog states
  const [selectedCont, setSelectedCont] = useState<ContBancar | null>(null);
  const [selectedMiscare, setSelectedMiscare] = useState<MiscareBanca | null>(null);
  const [selectedCasa, setSelectedCasa] = useState<InregistrareCasa | null>(null);
  
  // Add dialog states
  const [addContOpen, setAddContOpen] = useState(false);
  const [addMiscareOpen, setAddMiscareOpen] = useState(false);
  const [addCasaOpen, setAddCasaOpen] = useState(false);
  
  // Edit dialog states
  const [editContOpen, setEditContOpen] = useState(false);
  const [editMiscareOpen, setEditMiscareOpen] = useState(false);
  const [editCasaOpen, setEditCasaOpen] = useState(false);
  
  // Edit form data
  const [editContData, setEditContData] = useState({
    banca: "", iban: "", moneda: "", sold_curent: ""
  });
  const [editMiscareData, setEditMiscareData] = useState({
    data: "", cont_bancar: "", tip: "", partener: "", suma: "", document_asociat: ""
  });
  const [editCasaData, setEditCasaData] = useState({
    data: "", tip: "", partener: "", suma: "", document_asociat: ""
  });
  
  // Delete dialog states
  const [deleteType, setDeleteType] = useState<"cont" | "miscare" | "casa" | null>(null);

  // Open edit dialogs
  const openEditCont = () => {
    if (selectedCont) {
      setEditContData({
        banca: selectedCont.banca,
        iban: selectedCont.iban,
        moneda: selectedCont.moneda,
        sold_curent: String(selectedCont.sold_curent)
      });
      setEditContOpen(true);
    }
  };

  const openEditMiscare = () => {
    if (selectedMiscare) {
      setEditMiscareData({
        data: selectedMiscare.data,
        cont_bancar: selectedMiscare.cont_bancar,
        tip: selectedMiscare.tip,
        partener: selectedMiscare.partener,
        suma: String(selectedMiscare.suma),
        document_asociat: selectedMiscare.document_asociat
      });
      setEditMiscareOpen(true);
    }
  };

  const openEditCasa = () => {
    if (selectedCasa) {
      setEditCasaData({
        data: selectedCasa.data,
        tip: selectedCasa.tip,
        partener: selectedCasa.partener,
        suma: String(selectedCasa.suma),
        document_asociat: selectedCasa.document_asociat
      });
      setEditCasaOpen(true);
    }
  };

  const handleSaveCont = () => {
    toast({ title: "Cont actualizat", description: "Contul bancar a fost actualizat cu succes." });
    setEditContOpen(false);
    setSelectedCont(null);
  };

  const handleSaveMiscare = () => {
    toast({ title: "Mișcare actualizată", description: "Mișcarea a fost actualizată cu succes." });
    setEditMiscareOpen(false);
    setSelectedMiscare(null);
  };

  const handleSaveCasa = () => {
    toast({ title: "Înregistrare actualizată", description: "Înregistrarea a fost actualizată cu succes." });
    setEditCasaOpen(false);
    setSelectedCasa(null);
  };
  
  // Pagination states
  const [conturiPage, setConturiPage] = useState(1);
  const [conturiPerPage, setConturiPerPage] = useState(10);
  const [miscariPage, setMiscariPage] = useState(1);
  const [miscariPerPage, setMiscariPerPage] = useState(10);
  const [casaPage, setCasaPage] = useState(1);
  const [casaPerPage, setCasaPerPage] = useState(10);
  
  // Sorting states
  const [conturiSort, setConturiSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [miscariSort, setMiscariSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [casaSort, setCasaSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  
  // Filter states
  const [conturiFilters, setConturiFilters] = useState<Record<string, string>>({
    banca: "", iban: "", moneda: "", sold_curent: "",
  });
  const [miscariFilters, setMiscariFilters] = useState<Record<string, string>>({
    data: "", cont_bancar: "", tip: "", partener: "",
  });
  const [casaFilters, setCasaFilters] = useState<Record<string, string>>({
    data: "", tip: "", partener: "",
  });

  const formatCurrency = (value: number, currency: string = "RON") => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Summary calculations
  const totalRON = conturiBancare.filter((c) => c.moneda === "RON").reduce((sum, c) => sum + c.sold_curent, 0);
  const totalEUR = conturiBancare.filter((c) => c.moneda === "EUR").reduce((sum, c) => sum + c.sold_curent, 0);
  const totalIncasariCasa = registruCasa.filter((r) => r.tip === "Încasare").reduce((sum, r) => sum + r.suma, 0);
  const totalPlatiCasa = registruCasa.filter((r) => r.tip === "Plată").reduce((sum, r) => sum + r.suma, 0);

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
  const filteredConturi = useMemo(() => 
    filterAndSort(conturiBancare, conturiFilters, conturiSort),
    [conturiFilters, conturiSort]
  );
  
  const filteredMiscari = useMemo(() => 
    filterAndSort(miscariBanca, miscariFilters, miscariSort),
    [miscariFilters, miscariSort]
  );
  
  const filteredCasa = useMemo(() => 
    filterAndSort(registruCasa, casaFilters, casaSort),
    [casaFilters, casaSort]
  );

  // Paginated data
  const paginatedConturi = filteredConturi.slice((conturiPage - 1) * conturiPerPage, conturiPage * conturiPerPage);
  const paginatedMiscari = filteredMiscari.slice((miscariPage - 1) * miscariPerPage, miscariPage * miscariPerPage);
  const paginatedCasa = filteredCasa.slice((casaPage - 1) * casaPerPage, casaPage * casaPerPage);

  const handleExport = (type: string) => {
    switch (type) {
      case "conturi":
        exportToCSV(filteredConturi, "conturi_bancare", [
          { key: "banca", label: "Bancă" },
          { key: "iban", label: "IBAN" },
          { key: "moneda", label: "Monedă" },
          { key: "sold_curent", label: "Sold curent" },
        ]);
        break;
      case "miscari":
        exportToCSV(filteredMiscari, "miscari_banca", [
          { key: "data", label: "Dată" },
          { key: "cont_bancar", label: "Cont bancar" },
          { key: "tip", label: "Tip" },
          { key: "partener", label: "Partener" },
          { key: "suma", label: "Sumă" },
          { key: "document_asociat", label: "Document asociat" },
        ]);
        break;
      case "casa":
        exportToCSV(filteredCasa, "registru_casa", [
          { key: "data", label: "Dată" },
          { key: "tip", label: "Tip" },
          { key: "partener", label: "Partener" },
          { key: "suma", label: "Sumă" },
          { key: "document_asociat", label: "Document asociat" },
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
                <Landmark className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total RON</div>
                <div className="text-2xl font-bold">{formatCurrency(totalRON)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total EUR</div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(totalEUR, "EUR")}</div>
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
                <div className="text-sm text-muted-foreground">Încasări Casă</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncasariCasa)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <ArrowUpDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Plăți Casă</div>
                <div className="text-2xl font-bold text-red-600">{formatCurrency(totalPlatiCasa)}</div>
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
                <TabsTrigger value="conturi">Conturi bancare</TabsTrigger>
                <TabsTrigger value="miscari">Mișcări bancă</TabsTrigger>
                <TabsTrigger value="casa">Registru de casă</TabsTrigger>
              </TabsList>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleExport(activeSubTab)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button size="sm" onClick={() => {
                  if (activeSubTab === "conturi") setAddContOpen(true);
                  else if (activeSubTab === "miscari") setAddMiscareOpen(true);
                  else if (activeSubTab === "casa") setAddCasaOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă
                </Button>
              </div>
            </div>

            <TabsContent value="conturi">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Bancă"
                          sortKey="banca"
                          currentSort={conturiSort}
                          onSort={(key, dir) => setConturiSort({ key, direction: dir })}
                          filterValue={conturiFilters.banca}
                          onFilterChange={(val) => { setConturiFilters(prev => ({ ...prev, banca: val })); setConturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="IBAN"
                          sortKey="iban"
                          currentSort={conturiSort}
                          onSort={(key, dir) => setConturiSort({ key, direction: dir })}
                          filterValue={conturiFilters.iban}
                          onFilterChange={(val) => { setConturiFilters(prev => ({ ...prev, iban: val })); setConturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Monedă"
                          sortKey="moneda"
                          currentSort={conturiSort}
                          onSort={(key, dir) => setConturiSort({ key, direction: dir })}
                          filterValue={conturiFilters.moneda}
                          onFilterChange={(val) => { setConturiFilters(prev => ({ ...prev, moneda: val })); setConturiPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">
                        <DataTableColumnHeader
                          title="Sold curent"
                          sortKey="sold_curent"
                          currentSort={conturiSort}
                          onSort={(key, dir) => setConturiSort({ key, direction: dir })}
                          filterValue={conturiFilters.sold_curent}
                          onFilterChange={(val) => { setConturiFilters(prev => ({ ...prev, sold_curent: val })); setConturiPage(1); }}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedConturi.map((cont) => (
                      <TableRow 
                        key={cont.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedCont(cont)}
                      >
                        <TableCell className="font-medium">{cont.banca}</TableCell>
                        <TableCell className="font-mono text-sm">{cont.iban}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{cont.moneda}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(cont.sold_curent, cont.moneda)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={conturiPage}
                totalPages={Math.ceil(filteredConturi.length / conturiPerPage)}
                itemsPerPage={conturiPerPage}
                totalItems={filteredConturi.length}
                onPageChange={setConturiPage}
                onItemsPerPageChange={(val) => { setConturiPerPage(val); setConturiPage(1); }}
              />
            </TabsContent>

            <TabsContent value="miscari">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortKey="data"
                          currentSort={miscariSort}
                          onSort={(key, dir) => setMiscariSort({ key, direction: dir })}
                          filterValue={miscariFilters.data}
                          onFilterChange={(val) => { setMiscariFilters(prev => ({ ...prev, data: val })); setMiscariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cont bancar"
                          sortKey="cont_bancar"
                          currentSort={miscariSort}
                          onSort={(key, dir) => setMiscariSort({ key, direction: dir })}
                          filterValue={miscariFilters.cont_bancar}
                          onFilterChange={(val) => { setMiscariFilters(prev => ({ ...prev, cont_bancar: val })); setMiscariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Tip"
                          sortKey="tip"
                          currentSort={miscariSort}
                          onSort={(key, dir) => setMiscariSort({ key, direction: dir })}
                          filterValue={miscariFilters.tip}
                          onFilterChange={(val) => { setMiscariFilters(prev => ({ ...prev, tip: val })); setMiscariPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Partener"
                          sortKey="partener"
                          currentSort={miscariSort}
                          onSort={(key, dir) => setMiscariSort({ key, direction: dir })}
                          filterValue={miscariFilters.partener}
                          onFilterChange={(val) => { setMiscariFilters(prev => ({ ...prev, partener: val })); setMiscariPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Sumă</TableHead>
                      <TableHead>Document asociat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedMiscari.map((miscare) => (
                      <TableRow 
                        key={miscare.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedMiscare(miscare)}
                      >
                        <TableCell>{miscare.data}</TableCell>
                        <TableCell className="font-medium">{miscare.cont_bancar}</TableCell>
                        <TableCell>
                          <Badge variant={miscare.tip === "Încasare" ? "default" : "secondary"}>
                            {miscare.tip}
                          </Badge>
                        </TableCell>
                        <TableCell>{miscare.partener}</TableCell>
                        <TableCell className={`text-right font-medium ${miscare.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                          {miscare.tip === "Încasare" ? "+" : "-"}{formatCurrency(miscare.suma)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{miscare.document_asociat}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={miscariPage}
                totalPages={Math.ceil(filteredMiscari.length / miscariPerPage)}
                itemsPerPage={miscariPerPage}
                totalItems={filteredMiscari.length}
                onPageChange={setMiscariPage}
                onItemsPerPageChange={(val) => { setMiscariPerPage(val); setMiscariPage(1); }}
              />
            </TabsContent>

            <TabsContent value="casa">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Dată"
                          sortKey="data"
                          currentSort={casaSort}
                          onSort={(key, dir) => setCasaSort({ key, direction: dir })}
                          filterValue={casaFilters.data}
                          onFilterChange={(val) => { setCasaFilters(prev => ({ ...prev, data: val })); setCasaPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Tip"
                          sortKey="tip"
                          currentSort={casaSort}
                          onSort={(key, dir) => setCasaSort({ key, direction: dir })}
                          filterValue={casaFilters.tip}
                          onFilterChange={(val) => { setCasaFilters(prev => ({ ...prev, tip: val })); setCasaPage(1); }}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Partener"
                          sortKey="partener"
                          currentSort={casaSort}
                          onSort={(key, dir) => setCasaSort({ key, direction: dir })}
                          filterValue={casaFilters.partener}
                          onFilterChange={(val) => { setCasaFilters(prev => ({ ...prev, partener: val })); setCasaPage(1); }}
                        />
                      </TableHead>
                      <TableHead className="text-right">Sumă</TableHead>
                      <TableHead>Document asociat</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCasa.map((inregistrare) => (
                      <TableRow 
                        key={inregistrare.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedCasa(inregistrare)}
                      >
                        <TableCell>{inregistrare.data}</TableCell>
                        <TableCell>
                          <Badge variant={inregistrare.tip === "Încasare" ? "default" : "secondary"}>
                            {inregistrare.tip}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{inregistrare.partener}</TableCell>
                        <TableCell className={`text-right font-medium ${inregistrare.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                          {inregistrare.tip === "Încasare" ? "+" : "-"}{formatCurrency(inregistrare.suma)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{inregistrare.document_asociat}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={casaPage}
                totalPages={Math.ceil(filteredCasa.length / casaPerPage)}
                itemsPerPage={casaPerPage}
                totalItems={filteredCasa.length}
                onPageChange={setCasaPage}
                onItemsPerPageChange={(val) => { setCasaPerPage(val); setCasaPage(1); }}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Cont Bancar Detail Dialog */}
      <Dialog open={!!selectedCont} onOpenChange={() => setSelectedCont(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              Detalii Cont Bancar
            </DialogTitle>
          </DialogHeader>
          {selectedCont && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bancă</p>
                  <p className="font-medium">{selectedCont.banca}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monedă</p>
                  <Badge variant="outline">{selectedCont.moneda}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">IBAN</p>
                  <p className="font-mono font-medium">{selectedCont.iban}</p>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Sold curent</p>
                <p className="text-2xl font-bold">{formatCurrency(selectedCont.sold_curent, selectedCont.moneda)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditCont}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteType("cont")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Miscare Banca Detail Dialog */}
      <Dialog open={!!selectedMiscare} onOpenChange={() => setSelectedMiscare(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Detalii Mișcare Bancă
            </DialogTitle>
          </DialogHeader>
          {selectedMiscare && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedMiscare.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tip</p>
                  <Badge variant={selectedMiscare.tip === "Încasare" ? "default" : "secondary"}>
                    {selectedMiscare.tip}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cont bancar</p>
                  <p className="font-medium">{selectedMiscare.cont_bancar}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partener</p>
                  <p className="font-medium">{selectedMiscare.partener}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Document asociat</p>
                  <Badge variant="outline">{selectedMiscare.document_asociat}</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Sumă</p>
                <p className={`text-2xl font-bold ${selectedMiscare.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                  {selectedMiscare.tip === "Încasare" ? "+" : "-"}{formatCurrency(selectedMiscare.suma)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditMiscare}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button variant="destructive" size="sm" onClick={() => setDeleteType("miscare")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Registru Casa Detail Dialog */}
      <Dialog open={!!selectedCasa} onOpenChange={() => setSelectedCasa(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Detalii Înregistrare Casă
            </DialogTitle>
          </DialogHeader>
          {selectedCasa && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{selectedCasa.data}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tip</p>
                  <Badge variant={selectedCasa.tip === "Încasare" ? "default" : "secondary"}>
                    {selectedCasa.tip}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partener</p>
                  <p className="font-medium">{selectedCasa.partener}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Document asociat</p>
                  <Badge variant="outline">{selectedCasa.document_asociat}</Badge>
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Sumă</p>
                <p className={`text-2xl font-bold ${selectedCasa.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                  {selectedCasa.tip === "Încasare" ? "+" : "-"}{formatCurrency(selectedCasa.suma)}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={openEditCasa}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editează
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setDeleteType("casa")}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Șterge
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Cont Bancar Dialog */}
      <Dialog open={editContOpen} onOpenChange={setEditContOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Cont Bancar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bancă</Label>
              <Input value={editContData.banca} onChange={(e) => setEditContData(prev => ({ ...prev, banca: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Monedă</Label>
              <Select value={editContData.moneda} onValueChange={(val) => setEditContData(prev => ({ ...prev, moneda: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RON">RON</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>IBAN</Label>
              <Input value={editContData.iban} onChange={(e) => setEditContData(prev => ({ ...prev, iban: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Sold curent</Label>
              <Input type="number" value={editContData.sold_curent} onChange={(e) => setEditContData(prev => ({ ...prev, sold_curent: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditContOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveCont}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Miscare Banca Dialog */}
      <Dialog open={editMiscareOpen} onOpenChange={setEditMiscareOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Mișcare Bancă</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={editMiscareData.data} onChange={(e) => setEditMiscareData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={editMiscareData.tip} onValueChange={(val) => setEditMiscareData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Încasare">Încasare</SelectItem>
                  <SelectItem value="Plată">Plată</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cont bancar</Label>
              <Input value={editMiscareData.cont_bancar} onChange={(e) => setEditMiscareData(prev => ({ ...prev, cont_bancar: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Partener</Label>
              <Input value={editMiscareData.partener} onChange={(e) => setEditMiscareData(prev => ({ ...prev, partener: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Sumă</Label>
              <Input type="number" value={editMiscareData.suma} onChange={(e) => setEditMiscareData(prev => ({ ...prev, suma: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Document asociat</Label>
              <Input value={editMiscareData.document_asociat} onChange={(e) => setEditMiscareData(prev => ({ ...prev, document_asociat: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMiscareOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveMiscare}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Registru Casa Dialog */}
      <Dialog open={editCasaOpen} onOpenChange={setEditCasaOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editează Înregistrare Casă</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={editCasaData.data} onChange={(e) => setEditCasaData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={editCasaData.tip} onValueChange={(val) => setEditCasaData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Încasare">Încasare</SelectItem>
                  <SelectItem value="Plată">Plată</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Partener</Label>
              <Input value={editCasaData.partener} onChange={(e) => setEditCasaData(prev => ({ ...prev, partener: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Sumă</Label>
              <Input type="number" value={editCasaData.suma} onChange={(e) => setEditCasaData(prev => ({ ...prev, suma: e.target.value }))} />
            </div>
            <div className="col-span-2 space-y-2">
              <Label>Document asociat</Label>
              <Input value={editCasaData.document_asociat} onChange={(e) => setEditCasaData(prev => ({ ...prev, document_asociat: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCasaOpen(false)}>Anulează</Button>
            <Button onClick={handleSaveCasa}>Salvează</Button>
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
                if (deleteType === "cont") setSelectedCont(null);
                else if (deleteType === "miscare") setSelectedMiscare(null);
                else setSelectedCasa(null);
                setDeleteType(null);
              }}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Dialogs */}
      <AddContBancarDialog open={addContOpen} onOpenChange={setAddContOpen} />
      <AddMiscareBancaDialog open={addMiscareOpen} onOpenChange={setAddMiscareOpen} />
      <AddRegistruCasaDialog open={addCasaOpen} onOpenChange={setAddCasaOpen} />
    </div>
  );
};

export default BancaCasaTab;