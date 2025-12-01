import { useState, useMemo } from "react";
import { FileCheck, Plus, Download, Copy, Mail, FileText, Filter, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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

type Item = Oferta | Contract;

// Mock data
const initialOferte: Oferta[] = [
  { id: 1, nr: "OF-2024-001", client: "Construcții Modern SRL", proiect: "Autostrada A3 - Lot 2", produs: "Asfalt BA16", pret: 450, valabilitate: "31/12/2024", termenPlata: "30 zile", status: "Acceptat", tip: "oferta", dataCreare: "15/11/2024", conditiiComerciale: "Preț franco șantier, inclusiv transport", observatii: "Client prioritar" },
  { id: 2, nr: "OF-2024-002", client: "Drumuri Naționale SA", proiect: "DN1 - Reparații km 45-60", produs: "Asfalt MASF16", pret: 520, valabilitate: "15/01/2025", termenPlata: "45 zile", status: "Trimis", tip: "oferta", dataCreare: "20/11/2024", conditiiComerciale: "Preț EXW, transport separat", observatii: "" },
  { id: 3, nr: "OF-2024-003", client: "Primăria Sector 3", proiect: "Reabilitare Bd. Decebal", produs: "Asfalt BA8", pret: 380, valabilitate: "01/12/2024", termenPlata: "60 zile", status: "Draft", tip: "oferta", dataCreare: "25/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "Așteptare aprobare buget" },
  { id: 4, nr: "OF-2024-004", client: "Beta Construct SRL", proiect: "Parcare mall", produs: "Asfalt BA16", pret: 440, valabilitate: "20/11/2024", termenPlata: "30 zile", status: "Expirat", tip: "oferta", dataCreare: "01/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "" },
  { id: 5, nr: "OF-2024-005", client: "Infrastructură Plus SRL", proiect: "Centura ocolitoare", produs: "Emulsie cationică", pret: 2800, valabilitate: "28/02/2025", termenPlata: "30 zile", status: "Trimis", tip: "oferta", dataCreare: "28/11/2024", conditiiComerciale: "Preț per tonă, livrare în cisternă", observatii: "Volum mare estimat" },
];

const initialContracte: Contract[] = [
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
  
  // Data state
  const [oferte, setOferte] = useState<Oferta[]>(initialOferte);
  const [contracte, setContracte] = useState<Contract[]>(initialContracte);
  
  // Dialog states
  const [viewingDetails, setViewingDetails] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    client: "",
    proiect: "",
    produs: "",
    pret: 0,
    valabilitate: "",
    termenPlata: "30 zile",
    conditiiComerciale: "",
    observatii: "",
    indexareCombustibil: "",
  });
  
  // Filters
  const [filterClient, setFilterClient] = useState("");
  const [filterProdus, setFilterProdus] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique values for filters
  const clients = useMemo(() => {
    const allClients = [...oferte, ...contracte].map(item => item.client);
    return [...new Set(allClients)];
  }, [oferte, contracte]);

  const produse = useMemo(() => {
    const allProduse = [...oferte, ...contracte].map(item => item.produs);
    return [...new Set(allProduse)];
  }, [oferte, contracte]);

  // Filter data
  const filteredOferte = useMemo(() => {
    return oferte.filter(item => {
      if (filterClient && !item.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
      if (filterProdus && !item.produs.toLowerCase().includes(filterProdus.toLowerCase())) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      return true;
    });
  }, [oferte, filterClient, filterProdus, filterStatus]);

  const filteredContracte = useMemo(() => {
    return contracte.filter(item => {
      if (filterClient && !item.client.toLowerCase().includes(filterClient.toLowerCase())) return false;
      if (filterProdus && !item.produs.toLowerCase().includes(filterProdus.toLowerCase())) return false;
      if (filterStatus !== "all" && item.status !== filterStatus) return false;
      return true;
    });
  }, [contracte, filterClient, filterProdus, filterStatus]);

  const handleRowClick = (item: Item) => {
    setViewingDetails(item);
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

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      client: "",
      proiect: "",
      produs: "",
      pret: 0,
      valabilitate: "",
      termenPlata: "30 zile",
      conditiiComerciale: "",
      observatii: "",
      indexareCombustibil: "",
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditing(item);
    setForm({
      client: item.client,
      proiect: item.proiect,
      produs: item.produs,
      pret: item.pret,
      valabilitate: item.valabilitate,
      termenPlata: item.termenPlata,
      conditiiComerciale: item.conditiiComerciale,
      observatii: item.observatii,
      indexareCombustibil: item.tip === "contract" ? (item as Contract).indexareCombustibil : "",
    });
    setOpenAddEdit(true);
  };

  const handleSave = () => {
    if (!form.client || !form.produs) {
      toast({ title: "Eroare", description: "Completează câmpurile obligatorii.", variant: "destructive" });
      return;
    }

    const currentDate = new Date().toLocaleDateString('ro-RO');

    if (editing) {
      // Edit existing
      if (editing.tip === "oferta") {
        setOferte(prev => prev.map(item => 
          item.id === editing.id 
            ? { ...item, ...form, valabilitate: form.valabilitate || item.valabilitate }
            : item
        ));
      } else {
        setContracte(prev => prev.map(item => 
          item.id === editing.id 
            ? { ...item, ...form, valabilitate: form.valabilitate || item.valabilitate, indexareCombustibil: form.indexareCombustibil }
            : item
        ));
      }
      toast({ title: "Succes", description: `${editing.tip === "oferta" ? "Oferta" : "Contractul"} a fost actualizat.` });
    } else {
      // Add new
      if (activeTab === "oferte") {
        const newOferta: Oferta = {
          id: Math.max(...oferte.map(o => o.id), 0) + 1,
          nr: `OF-2024-${String(oferte.length + 1).padStart(3, '0')}`,
          client: form.client,
          proiect: form.proiect,
          produs: form.produs,
          pret: form.pret,
          valabilitate: form.valabilitate,
          termenPlata: form.termenPlata,
          status: "Draft",
          tip: "oferta",
          dataCreare: currentDate,
          conditiiComerciale: form.conditiiComerciale,
          observatii: form.observatii,
        };
        setOferte(prev => [...prev, newOferta]);
        toast({ title: "Succes", description: "Oferta a fost adăugată." });
      } else {
        const newContract: Contract = {
          id: Math.max(...contracte.map(c => c.id), 0) + 1,
          nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
          client: form.client,
          proiect: form.proiect,
          produs: form.produs,
          pret: form.pret,
          valabilitate: form.valabilitate,
          termenPlata: form.termenPlata,
          status: "Draft",
          tip: "contract",
          dataCreare: currentDate,
          conditiiComerciale: form.conditiiComerciale,
          observatii: form.observatii,
          indexareCombustibil: form.indexareCombustibil,
        };
        setContracte(prev => [...prev, newContract]);
        toast({ title: "Succes", description: "Contractul a fost adăugat." });
      }
    }
    setOpenAddEdit(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    
    if (deleting.tip === "oferta") {
      setOferte(prev => prev.filter(item => item.id !== deleting.id));
    } else {
      setContracte(prev => prev.filter(item => item.id !== deleting.id));
    }
    
    toast({ title: "Succes", description: `${deleting.tip === "oferta" ? "Oferta" : "Contractul"} a fost șters.` });
    setDeleting(null);
  };

  const handleDuplicate = () => {
    if (!viewingDetails) return;
    
    const currentDate = new Date().toLocaleDateString('ro-RO');
    
    if (viewingDetails.tip === "oferta") {
      const newOferta: Oferta = {
        ...viewingDetails as Oferta,
        id: Math.max(...oferte.map(o => o.id), 0) + 1,
        nr: `OF-2024-${String(oferte.length + 1).padStart(3, '0')}`,
        status: "Draft",
        dataCreare: currentDate,
      };
      setOferte(prev => [...prev, newOferta]);
    } else {
      const newContract: Contract = {
        ...viewingDetails as Contract,
        id: Math.max(...contracte.map(c => c.id), 0) + 1,
        nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
        status: "Draft",
        dataCreare: currentDate,
      };
      setContracte(prev => [...prev, newContract]);
    }
    
    toast({ title: "Duplicat creat", description: `${viewingDetails.tip === "oferta" ? "Oferta" : "Contractul"} ${viewingDetails.nr} a fost duplicat.` });
    setViewingDetails(null);
  };

  const handleSendEmail = () => {
    if (viewingDetails) {
      toast({ title: "Email trimis", description: `${viewingDetails.tip === "oferta" ? "Oferta" : "Contractul"} ${viewingDetails.nr} a fost trimis pe email.` });
    }
  };

  const handleGenerateContract = () => {
    if (viewingDetails && viewingDetails.tip === "oferta") {
      const oferta = viewingDetails as Oferta;
      const newContract: Contract = {
        id: Math.max(...contracte.map(c => c.id), 0) + 1,
        nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
        client: oferta.client,
        proiect: oferta.proiect,
        produs: oferta.produs,
        pret: oferta.pret,
        valabilitate: oferta.valabilitate,
        termenPlata: oferta.termenPlata,
        status: "Draft",
        tip: "contract",
        dataCreare: new Date().toLocaleDateString('ro-RO'),
        conditiiComerciale: oferta.conditiiComerciale,
        observatii: `Generat din oferta ${oferta.nr}`,
        indexareCombustibil: "",
      };
      setContracte(prev => [...prev, newContract]);
      toast({ title: "Contract generat", description: `Contractul ${newContract.nr} a fost generat din oferta ${oferta.nr}.` });
      setViewingDetails(null);
      setActiveTab("contracte");
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
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă {activeTab === "oferte" ? "Ofertă" : "Contract"}
          </Button>
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

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onOpenChange={setOpenAddEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing 
                ? `Editează ${editing.tip === "oferta" ? "Oferta" : "Contractul"} ${editing.nr}` 
                : `Adaugă ${activeTab === "oferte" ? "Ofertă Nouă" : "Contract Nou"}`
              }
            </DialogTitle>
            <DialogDescription>
              {editing ? "Modifică detaliile" : "Completează datele"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                <Select value={form.client} onValueChange={(v) => setForm({ ...form, client: v })}>
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
                <Input 
                  id="proiect" 
                  placeholder="Denumire proiect" 
                  value={form.proiect}
                  onChange={(e) => setForm({ ...form, proiect: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="produs">Produs *</Label>
                <Select value={form.produs} onValueChange={(v) => setForm({ ...form, produs: v })}>
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
                <Input 
                  id="pret" 
                  type="number" 
                  placeholder="0.00" 
                  value={form.pret || ""}
                  onChange={(e) => setForm({ ...form, pret: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valabilitate">Valabilitate până la</Label>
                <Input 
                  id="valabilitate" 
                  type="date" 
                  value={form.valabilitate}
                  onChange={(e) => setForm({ ...form, valabilitate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="termenPlata">Termen plată</Label>
                <Select value={form.termenPlata} onValueChange={(v) => setForm({ ...form, termenPlata: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15 zile">15 zile</SelectItem>
                    <SelectItem value="30 zile">30 zile</SelectItem>
                    <SelectItem value="45 zile">45 zile</SelectItem>
                    <SelectItem value="60 zile">60 zile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditii">Condiții comerciale</Label>
              <Textarea 
                id="conditii" 
                placeholder="Introduceți condițiile comerciale..." 
                value={form.conditiiComerciale}
                onChange={(e) => setForm({ ...form, conditiiComerciale: e.target.value })}
              />
            </div>
            {(activeTab === "contracte" || (editing && editing.tip === "contract")) && (
              <div className="space-y-2">
                <Label htmlFor="indexare">Indexare combustibil</Label>
                <Input 
                  id="indexare" 
                  placeholder="Ex: Ajustare trimestrială +/- 5%" 
                  value={form.indexareCombustibil}
                  onChange={(e) => setForm({ ...form, indexareCombustibil: e.target.value })}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="observatii">Observații</Label>
              <Textarea 
                id="observatii" 
                placeholder="Observații suplimentare..." 
                value={form.observatii}
                onChange={(e) => setForm({ ...form, observatii: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)}>Anulează</Button>
            <Button onClick={handleSave}>
              {editing ? "Salvează Modificările" : "Adaugă"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog (like Livrari) */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>
                  Detalii {viewingDetails?.tip === "oferta" ? "Ofertă" : "Contract"} - {viewingDetails?.nr}
                </DialogTitle>
                <DialogDescription>
                  Informații complete
                </DialogDescription>
              </div>
              <Badge className={viewingDetails ? statusColors[viewingDetails.status] : ""}>
                {viewingDetails?.status}
              </Badge>
            </div>
          </DialogHeader>
          
          {viewingDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="font-medium">{viewingDetails.client}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Proiect/Șantier</Label>
                  <p className="font-medium">{viewingDetails.proiect}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Produs</Label>
                  <p className="font-medium">{viewingDetails.produs}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț</Label>
                  <p className="font-medium">
                    {viewingDetails.pret > 0 ? `${viewingDetails.pret.toLocaleString()} RON/t` : "Variabil"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Valabilitate</Label>
                  <p className="font-medium">{viewingDetails.valabilitate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Termen Plată</Label>
                  <p className="font-medium">{viewingDetails.termenPlata}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data Creare</Label>
                  <p className="font-medium">{viewingDetails.dataCreare}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Condiții Comerciale</Label>
                <p className="font-medium">{viewingDetails.conditiiComerciale || "-"}</p>
              </div>
              {viewingDetails.tip === "contract" && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Indexare Combustibil</Label>
                  <p className="font-medium">{(viewingDetails as Contract).indexareCombustibil || "-"}</p>
                </div>
              )}
              <div className="space-y-1">
                <Label className="text-muted-foreground">Observații</Label>
                <p className="font-medium">{viewingDetails.observatii || "-"}</p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplichează
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Trimite Email
              </Button>
              {viewingDetails?.tip === "oferta" && viewingDetails.status === "Acceptat" && (
                <Button variant="secondary" size="sm" onClick={handleGenerateContract}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generează Contract
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  if (viewingDetails) {
                    handleOpenEdit(viewingDetails);
                    setViewingDetails(null);
                  }
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Editează
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (viewingDetails) {
                    setDeleting(viewingDetails);
                    setViewingDetails(null);
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Șterge
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewingDetails(null)}>
                <X className="w-4 h-4 mr-2" />
                Închide
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi {deleting?.tip === "oferta" ? "oferta" : "contractul"} {deleting?.nr}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OferteContracte;
