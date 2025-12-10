import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { conturiBancare, miscariBanca, registruCasa } from "../mockData";
import { ContBancar, MiscareBanca, InregistrareCasa } from "../types";
import { DataTableColumnHeader, DataTablePagination } from "@/components/ui/data-table";
import { Building, Wallet, ArrowUpDown, Landmark, Plus, Download } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

const BancaCasaTab = () => {
  const { toast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState("conturi");
  
  // Dialog states
  const [selectedCont, setSelectedCont] = useState<ContBancar | null>(null);
  const [selectedMiscare, setSelectedMiscare] = useState<MiscareBanca | null>(null);
  const [selectedCasa, setSelectedCasa] = useState<InregistrareCasa | null>(null);
  
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
    let data: Record<string, unknown>[] = [];
    let filename = "";
    
    switch (type) {
      case "conturi":
        data = filteredConturi.map(c => ({
          "Bancă": c.banca,
          "IBAN": c.iban,
          "Monedă": c.moneda,
          "Sold curent": c.sold_curent,
        }));
        filename = "conturi_bancare";
        break;
      case "miscari":
        data = filteredMiscari.map(m => ({
          "Dată": m.data,
          "Cont bancar": m.cont_bancar,
          "Tip": m.tip,
          "Partener": m.partener,
          "Sumă": m.suma,
          "Document asociat": m.document_asociat,
        }));
        filename = "miscari_banca";
        break;
      case "casa":
        data = filteredCasa.map(c => ({
          "Dată": c.data,
          "Tip": c.tip,
          "Partener": c.partener,
          "Sumă": c.suma,
          "Document asociat": c.document_asociat,
        }));
        filename = "registru_casa";
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
                <Button size="sm">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BancaCasaTab;