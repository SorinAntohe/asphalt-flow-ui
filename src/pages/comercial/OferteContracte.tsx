import { useState, useMemo } from "react";
import { FileCheck, Plus, Download, Copy, Mail, FileText, Filter, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportUtils";

// Types
interface Oferta {
  id: number;
  nr: string;
  client: string;
  proiect: string;
  produs: string;
  pret: number;
  valabilitate: string;
  termenPlata: string;
  status: "Draft" | "Trimis" | "Acceptat" | "Expirat";
  tip: "oferta";
  dataCreare: string;
  conditiiComerciale: string;
  observatii: string;
}

interface Contract {
  id: number;
  nr: string;
  client: string;
  proiect: string;
  produs: string;
  pret: number;
  valabilitate: string;
  termenPlata: string;
  status: "Draft" | "Trimis" | "Acceptat" | "Expirat";
  tip: "contract";
  dataCreare: string;
  conditiiComerciale: string;
  observatii: string;
  indexareCombustibil: string;
}

// Mock data
const mockOferte: Oferta[] = [
  { id: 1, nr: "OF-2024-001", client: "Construcții Modern SRL", proiect: "Autostrada A3 - Lot 2", produs: "Asfalt BA16", pret: 450, valabilitate: "31/12/2024", termenPlata: "30 zile", status: "Acceptat", tip: "oferta", dataCreare: "15/11/2024", conditiiComerciale: "Preț franco șantier, inclusiv transport", observatii: "Client prioritar" },
  { id: 2, nr: "OF-2024-002", client: "Drumuri Naționale SA", proiect: "DN1 - Reparații km 45-60", produs: "Asfalt MASF16", pret: 520, valabilitate: "15/01/2025", termenPlata: "45 zile", status: "Trimis", tip: "oferta", dataCreare: "20/11/2024", conditiiComerciale: "Preț EXW, transport separat", observatii: "" },
  { id: 3, nr: "OF-2024-003", client: "Primăria Sector 3", proiect: "Reabilitare Bd. Decebal", produs: "Asfalt BA8", pret: 380, valabilitate: "01/12/2024", termenPlata: "60 zile", status: "Draft", tip: "oferta", dataCreare: "25/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "Așteptare aprobare buget" },
  { id: 4, nr: "OF-2024-004", client: "Beta Construct SRL", proiect: "Parcare mall", produs: "Asfalt BA16", pret: 440, valabilitate: "20/11/2024", termenPlata: "30 zile", status: "Expirat", tip: "oferta", dataCreare: "01/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "" },
  { id: 5, nr: "OF-2024-005", client: "Infrastructură Plus SRL", proiect: "Centura ocolitoare", produs: "Emulsie cationică", pret: 2800, valabilitate: "28/02/2025", termenPlata: "30 zile", status: "Trimis", tip: "oferta", dataCreare: "28/11/2024", conditiiComerciale: "Preț per tonă, livrare în cisternă", observatii: "Volum mare estimat" },
];

const mockContracte: Contract[] = [
  { id: 1, nr: "CTR-2024-001", client: "Construcții Modern SRL", proiect: "Autostrada A3 - Lot 2", produs: "Asfalt BA16", pret: 445, valabilitate: "31/12/2025", termenPlata: "30 zile", status: "Acceptat", tip: "contract", dataCreare: "20/11/2024", conditiiComerciale: "Preț fix pe durata contractului, inclusiv transport", observatii: "Contract cadru anual", indexareCombustibil: "Ajustare trimestrială +/- 5%" },
  { id: 2, nr: "CTR-2024-002", client: "Drumuri Naționale SA", proiect: "Întreținere DN1 2024-2025", produs: "Multiple", pret: 0, valabilitate: "31/03/2025", termenPlata: "45 zile", status: "Acceptat", tip: "contract", dataCreare: "01/10/2024", conditiiComerciale: "Contract cadru cu comenzi lunare", observatii: "Include BA8, BA16, MASF16", indexareCombustibil: "Ajustare lunară conform indicele ANRE" },
  { id: 3, nr: "CTR-2024-003", client: "Alpha Roads SRL", proiect: "Dezvoltare zonă industrială", produs: "Asfalt BA16", pret: 460, valabilitate: "30/06/2025", termenPlata: "30 zile", status: "Draft", tip: "contract", dataCreare: "29/11/2024", conditiiComerciale: "În negociere", observatii: "Așteptare semnături", indexareCombustibil: "De stabilit" },
];

const statusColors: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Trimis: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  Acceptat: "bg-green-500/20 text-green-600 dark:text-green-400",
  Expirat: "bg-red-500/20 text-red-600 dark:text-red-400",
};

const OferteContracte = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"oferte" | "contracte">("oferte");
  const [selectedItem, setSelectedItem] = useState<Oferta | Contract | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // Filters
  const [filterClient, setFilterClient] = useState("");
  const [filterProdus, setFilterProdus] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const clients = useMemo(() => {
    const allClients = [...mockOferte, ...mockContracte].map(item => item.client);
    return [...new Set(allClients)];
  }, []);

  const produse = useMemo(() => {
    const allProduse = [...mockOferte, ...mockContracte].map(item => item.produs);
    return [...new Set(allProduse)];
  }, []);

  // Filter data
  const filteredOferte = useMemo(() => {
    return mockOferte.filter(item => {
      if (filterClient && !item.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
      if (filterProdus && !item.produs.toLowerCase().includes(filterProdus.toLowerCase())) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      return true;
    });
  }, [filterClient, filterProdus, filterStatus]);

  const filteredContracte = useMemo(() => {
    return mockContracte.filter(item => {
      if (filterClient && !item.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
      if (filterProdus && !item.produs.toLowerCase().includes(filterProdus.toLowerCase())) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      return true;
    });
  }, [filterClient, filterProdus, filterStatus]);

  const handleRowClick = (item: Oferta | Contract) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleExport = () => {
    const columns = [
      { key: "nr" as const, label: "Nr." },
      { key: "client" as const, label: "Client" },
      { key: "proiect" as const, label: "Proiect/Șantier" },
      { key: "produs" as const, label: "Produs" },
      { key: "pret" as const, label: "Preț" },
      { key: "valabilitate" as const, label: "Valabilitate" },
      { key: "termenPlata" as const, label: "Termen Plată" },
      { key: "status" as const, label: "Status" },
    ];
    
    if (activeTab === "oferte") {
      exportToCSV(filteredOferte, `oferte_${new Date().toISOString().split('T')[0]}`, columns);
    } else {
      exportToCSV(filteredContracte, `contracte_${new Date().toISOString().split('T')[0]}`, columns);
    }
    toast({ title: "Export realizat", description: `Fișierul ${activeTab}.csv a fost descărcat.` });
  };

  const handleDuplicate = () => {
    if (selectedItem) {
      toast({ title: "Duplicat creat", description: `${selectedItem.tip === "oferta" ? "Oferta" : "Contractul"} ${selectedItem.nr} a fost duplicat.` });
      setDrawerOpen(false);
    }
  };

  const handleSendEmail = () => {
    if (selectedItem) {
      toast({ title: "Email trimis", description: `${selectedItem.tip === "oferta" ? "Oferta" : "Contractul"} ${selectedItem.nr} a fost trimis pe email.` });
    }
  };

  const handleGenerateContract = () => {
    if (selectedItem && selectedItem.tip === "oferta") {
      toast({ title: "Contract generat", description: `Contractul a fost generat din oferta ${selectedItem.nr}.` });
      setDrawerOpen(false);
    }
  };

  const clearFilters = () => {
    setFilterClient("");
    setFilterProdus("");
    setFilterStatus("all");
  };

  const hasActiveFilters = filterClient || filterProdus || filterStatus !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Oferte & Contracte</h1>
            <p className="text-muted-foreground">Gestionare oferte și contracte comerciale</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filtre
            {hasActiveFilters && <Badge variant="secondary" className="ml-2">Activ</Badge>}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Adaugă {activeTab === "oferte" ? "Ofertă" : "Contract"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adaugă {activeTab === "oferte" ? "Ofertă Nouă" : "Contract Nou"}</DialogTitle>
                <DialogDescription>
                  Completează datele pentru {activeTab === "oferte" ? "oferta nouă" : "contractul nou"}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client} value={client}>{client}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="proiect">Proiect/Șantier</Label>
                    <Input id="proiect" placeholder="Denumire proiect" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="produs">Produs</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează produs" />
                      </SelectTrigger>
                      <SelectContent>
                        {produse.map(produs => (
                          <SelectItem key={produs} value={produs}>{produs}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pret">Preț (RON/tonă)</Label>
                    <Input id="pret" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="valabilitate">Valabilitate până la</Label>
                    <Input id="valabilitate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termenPlata">Termen plată</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectează" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 zile</SelectItem>
                        <SelectItem value="30">30 zile</SelectItem>
                        <SelectItem value="45">45 zile</SelectItem>
                        <SelectItem value="60">60 zile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditii">Condiții comerciale</Label>
                  <Textarea id="conditii" placeholder="Introduceți condițiile comerciale..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="observatii">Observații</Label>
                  <Textarea id="observatii" placeholder="Observații suplimentare..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Anulează</Button>
                <Button onClick={() => { setAddDialogOpen(false); toast({ title: "Salvat", description: `${activeTab === "oferte" ? "Oferta" : "Contractul"} a fost adăugat.` }); }}>
                  Salvează
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="space-y-1 flex-1 min-w-[200px]">
                <Label className="text-xs">Client</Label>
                <Input 
                  placeholder="Caută client..." 
                  value={filterClient}
                  onChange={(e) => setFilterClient(e.target.value)}
                />
              </div>
              <div className="space-y-1 flex-1 min-w-[200px]">
                <Label className="text-xs">Produs</Label>
                <Input 
                  placeholder="Caută produs..." 
                  value={filterProdus}
                  onChange={(e) => setFilterProdus(e.target.value)}
                />
              </div>
              <div className="space-y-1 min-w-[150px]">
                <Label className="text-xs">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Trimis">Trimis</SelectItem>
                    <SelectItem value="Acceptat">Acceptat</SelectItem>
                    <SelectItem value="Expirat">Expirat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Resetează
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "oferte" | "contracte")}>
        <TabsList>
          <TabsTrigger value="oferte">Oferte ({filteredOferte.length})</TabsTrigger>
          <TabsTrigger value="contracte">Contracte ({filteredContracte.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="oferte" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Proiect/Șantier</TableHead>
                    <TableHead>Produs</TableHead>
                    <TableHead className="text-right">Preț</TableHead>
                    <TableHead className="hidden lg:table-cell">Valabilitate</TableHead>
                    <TableHead className="hidden lg:table-cell">Termen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOferte.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nu există oferte care să corespundă filtrelor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOferte.map((oferta) => (
                      <TableRow 
                        key={oferta.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(oferta)}
                      >
                        <TableCell className="font-medium">{oferta.nr}</TableCell>
                        <TableCell>{oferta.client}</TableCell>
                        <TableCell className="hidden md:table-cell">{oferta.proiect}</TableCell>
                        <TableCell>{oferta.produs}</TableCell>
                        <TableCell className="text-right">{oferta.pret.toLocaleString()} RON</TableCell>
                        <TableCell className="hidden lg:table-cell">{oferta.valabilitate}</TableCell>
                        <TableCell className="hidden lg:table-cell">{oferta.termenPlata}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[oferta.status]}>{oferta.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracte" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr.</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="hidden md:table-cell">Proiect/Șantier</TableHead>
                    <TableHead>Produs</TableHead>
                    <TableHead className="text-right">Preț</TableHead>
                    <TableHead className="hidden lg:table-cell">Valabilitate</TableHead>
                    <TableHead className="hidden lg:table-cell">Termen</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracte.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nu există contracte care să corespundă filtrelor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContracte.map((contract) => (
                      <TableRow 
                        key={contract.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(contract)}
                      >
                        <TableCell className="font-medium">{contract.nr}</TableCell>
                        <TableCell>{contract.client}</TableCell>
                        <TableCell className="hidden md:table-cell">{contract.proiect}</TableCell>
                        <TableCell>{contract.produs}</TableCell>
                        <TableCell className="text-right">
                          {contract.pret > 0 ? `${contract.pret.toLocaleString()} RON` : "Variabil"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{contract.valabilitate}</TableCell>
                        <TableCell className="hidden lg:table-cell">{contract.termenPlata}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[contract.status]}>{contract.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Sheet/Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedItem && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5" />
                  {selectedItem.nr}
                </SheetTitle>
                <SheetDescription>
                  {selectedItem.tip === "oferta" ? "Detalii ofertă" : "Detalii contract"}
                </SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={statusColors[selectedItem.status]}>{selectedItem.status}</Badge>
                </div>

                <Separator />

                {/* Info cards */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Client</h4>
                    <p className="text-foreground">{selectedItem.client}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Proiect/Șantier</h4>
                    <p className="text-foreground">{selectedItem.proiect}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Produs</h4>
                      <p className="text-foreground">{selectedItem.produs}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Preț</h4>
                      <p className="text-foreground font-semibold">
                        {selectedItem.pret > 0 ? `${selectedItem.pret.toLocaleString()} RON/t` : "Variabil"}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Valabilitate</h4>
                      <p className="text-foreground">{selectedItem.valabilitate}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Termen plată</h4>
                      <p className="text-foreground">{selectedItem.termenPlata}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Conditii comerciale */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Condiții comerciale</h4>
                  <Card>
                    <CardContent className="p-3">
                      <p className="text-sm">{selectedItem.conditiiComerciale || "Nespecificat"}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Indexare combustibil (doar pentru contracte) */}
                {selectedItem.tip === "contract" && "indexareCombustibil" in selectedItem && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Indexare combustibil</h4>
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-sm">{selectedItem.indexareCombustibil || "Nespecificat"}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Observatii */}
                {selectedItem.observatii && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Observații</h4>
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-sm">{selectedItem.observatii}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Istoric (placeholder) */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Istoric negocieri</h4>
                  <Card>
                    <CardContent className="p-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{selectedItem.dataCreare}</span>
                          <span>Creat</span>
                        </div>
                        {selectedItem.status !== "Draft" && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Data trimitere</span>
                            <span>Trimis la client</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleDuplicate}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplichează
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleSendEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Trimite pe email
                  </Button>
                  {selectedItem.tip === "oferta" && selectedItem.status === "Acceptat" && (
                    <Button variant="default" className="w-full justify-start" onClick={handleGenerateContract}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generează contract
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default OferteContracte;
