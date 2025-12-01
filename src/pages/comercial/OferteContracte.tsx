import { useState, useMemo } from "react";
import { FileCheck, Plus, Download, Copy, Mail, FileText, X, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

type FilterState = {
  nr: string;
  client: string;
  proiect: string;
  produs: string;
  pret: string;
  valabilitate: string;
  termenPlata: string;
  status: string;
};

const OferteContracte = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"oferte" | "contracte">("oferte");
  
  // Data state
  const [oferte, setOferte] = useState<Oferta[]>(initialOferte);
  const [contracte, setContracte] = useState<Contract[]>(initialContracte);
  
  // Pagination
  const [ofertePage, setOfertePage] = useState(1);
  const [contractePage, setContractePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
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
  
  // Column filters
  const [oferteFilters, setOferteFilters] = useState<FilterState>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  const [contracteFilters, setContracteFilters] = useState<FilterState>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  
  // Sorting
  const [oferteSort, setOferteSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [contracteSort, setContracteSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });

  // Get unique values for dropdowns
  const clients = useMemo(() => {
    const allClients = [...oferte, ...contracte].map(item => item.client);
    return [...new Set(allClients)];
  }, [oferte, contracte]);

  const produse = useMemo(() => {
    const allProduse = [...oferte, ...contracte].map(item => item.produs);
    return [...new Set(allProduse)];
  }, [oferte, contracte]);

  // Filter and sort oferte
  const filteredOferte = useMemo(() => {
    return oferte
      .filter(item => {
        return (
          item.nr.toLowerCase().includes(oferteFilters.nr.toLowerCase()) &&
          item.client.toLowerCase().includes(oferteFilters.client.toLowerCase()) &&
          item.proiect.toLowerCase().includes(oferteFilters.proiect.toLowerCase()) &&
          item.produs.toLowerCase().includes(oferteFilters.produs.toLowerCase()) &&
          item.pret.toString().includes(oferteFilters.pret) &&
          item.valabilitate.toLowerCase().includes(oferteFilters.valabilitate.toLowerCase()) &&
          item.termenPlata.toLowerCase().includes(oferteFilters.termenPlata.toLowerCase()) &&
          (oferteFilters.status === "" || item.status === oferteFilters.status)
        );
      })
      .sort((a, b) => {
        if (!oferteSort.field || !oferteSort.direction) return 0;
        const aVal = a[oferteSort.field as keyof Oferta];
        const bVal = b[oferteSort.field as keyof Oferta];
        if (aVal < bVal) return oferteSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return oferteSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [oferte, oferteFilters, oferteSort]);

  // Filter and sort contracte
  const filteredContracte = useMemo(() => {
    return contracte
      .filter(item => {
        return (
          item.nr.toLowerCase().includes(contracteFilters.nr.toLowerCase()) &&
          item.client.toLowerCase().includes(contracteFilters.client.toLowerCase()) &&
          item.proiect.toLowerCase().includes(contracteFilters.proiect.toLowerCase()) &&
          item.produs.toLowerCase().includes(contracteFilters.produs.toLowerCase()) &&
          item.pret.toString().includes(contracteFilters.pret) &&
          item.valabilitate.toLowerCase().includes(contracteFilters.valabilitate.toLowerCase()) &&
          item.termenPlata.toLowerCase().includes(contracteFilters.termenPlata.toLowerCase()) &&
          (contracteFilters.status === "" || item.status === contracteFilters.status)
        );
      })
      .sort((a, b) => {
        if (!contracteSort.field || !contracteSort.direction) return 0;
        const aVal = a[contracteSort.field as keyof Contract];
        const bVal = b[contracteSort.field as keyof Contract];
        if (aVal < bVal) return contracteSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return contracteSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [contracte, contracteFilters, contracteSort]);

  // Pagination
  const oferteTotalPages = Math.ceil(filteredOferte.length / itemsPerPage);
  const contracteTotalPages = Math.ceil(filteredContracte.length / itemsPerPage);
  const paginatedOferte = filteredOferte.slice((ofertePage - 1) * itemsPerPage, ofertePage * itemsPerPage);
  const paginatedContracte = filteredContracte.slice((contractePage - 1) * itemsPerPage, contractePage * itemsPerPage);

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

  // Column header component with filter and sort
  const FilterHeader = ({ 
    field, 
    label, 
    filters, 
    setFilters, 
    sort, 
    setSort,
    setPage,
    isNumeric = false 
  }: { 
    field: keyof FilterState; 
    label: string; 
    filters: FilterState; 
    setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
    sort: { field: string; direction: 'asc' | 'desc' | null };
    setSort: (s: { field: string; direction: 'asc' | 'desc' | null }) => void;
    setPage: (p: number) => void;
    isNumeric?: boolean;
  }) => (
    <TableHead className="h-10 text-xs">
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
              <span>{label}</span>
              {sort.field === field ? (
                sort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
              ) : (
                <ArrowUpDown className="h-3 w-3 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-2">
              <Input 
                placeholder={`Caută ${label.toLowerCase()}...`} 
                value={filters[field] || ""} 
                onChange={(e) => { 
                  setFilters({ ...filters, [field]: e.target.value }); 
                  setPage(1); 
                }} 
                className="h-7 text-xs" 
              />
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-7 text-xs" 
                  onClick={() => setSort({ field, direction: 'asc' })}
                >
                  <ArrowUp className="h-3 w-3 mr-1" /> {isNumeric ? "Cresc." : "A-Z"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-7 text-xs" 
                  onClick={() => setSort({ field, direction: 'desc' })}
                >
                  <ArrowDown className="h-3 w-3 mr-1" /> {isNumeric ? "Descresc." : "Z-A"}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </TableHead>
  );

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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "oferte" | "contracte")}>
        <TabsList>
          <TabsTrigger value="oferte">Oferte ({filteredOferte.length})</TabsTrigger>
          <TabsTrigger value="contracte">Contracte ({filteredContracte.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="oferte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Lista Oferte</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setOfertePage(1); }}>
                    <SelectTrigger className="w-[60px] sm:w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <FilterHeader field="nr" label="Nr." filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="client" label="Client" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="proiect" label="Proiect/Șantier" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="produs" label="Produs" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="pret" label="Preț" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} isNumeric />
                    <FilterHeader field="valabilitate" label="Valabilitate" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="termenPlata" label="Termen" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                    <FilterHeader field="status" label="Status" filters={oferteFilters} setFilters={setOferteFilters} sort={oferteSort} setSort={setOferteSort} setPage={setOfertePage} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOferte.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nu există oferte care să corespundă filtrelor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedOferte.map((oferta) => (
                      <TableRow 
                        key={oferta.id} 
                        className="cursor-pointer hover:bg-muted/50 h-10"
                        onClick={() => handleRowClick(oferta)}
                      >
                        <TableCell className="py-1 text-xs font-medium">{oferta.nr}</TableCell>
                        <TableCell className="py-1 text-xs">{oferta.client}</TableCell>
                        <TableCell className="py-1 text-xs">{oferta.proiect}</TableCell>
                        <TableCell className="py-1 text-xs">{oferta.produs}</TableCell>
                        <TableCell className="py-1 text-xs text-right">{oferta.pret.toLocaleString()} RON</TableCell>
                        <TableCell className="py-1 text-xs">{oferta.valabilitate}</TableCell>
                        <TableCell className="py-1 text-xs">{oferta.termenPlata}</TableCell>
                        <TableCell className="py-1 text-xs">
                          <Badge className={statusColors[oferta.status]}>{oferta.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {/* Pagination */}
            {oferteTotalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  {(ofertePage - 1) * itemsPerPage + 1}-{Math.min(ofertePage * itemsPerPage, filteredOferte.length)} din {filteredOferte.length}
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setOfertePage(Math.max(1, ofertePage - 1))}
                        className={ofertePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: oferteTotalPages }, (_, i) => i + 1).slice(
                      Math.max(0, ofertePage - 2),
                      Math.min(oferteTotalPages, ofertePage + 1)
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setOfertePage(page)}
                          isActive={ofertePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setOfertePage(Math.min(oferteTotalPages, ofertePage + 1))}
                        className={ofertePage === oferteTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="contracte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Lista Contracte</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
                  <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setContractePage(1); }}>
                    <SelectTrigger className="w-[60px] sm:w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <FilterHeader field="nr" label="Nr." filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="client" label="Client" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="proiect" label="Proiect/Șantier" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="produs" label="Produs" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="pret" label="Preț" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} isNumeric />
                    <FilterHeader field="valabilitate" label="Valabilitate" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="termenPlata" label="Termen" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                    <FilterHeader field="status" label="Status" filters={contracteFilters} setFilters={setContracteFilters} sort={contracteSort} setSort={setContracteSort} setPage={setContractePage} />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedContracte.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        Nu există contracte care să corespundă filtrelor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedContracte.map((contract) => (
                      <TableRow 
                        key={contract.id} 
                        className="cursor-pointer hover:bg-muted/50 h-10"
                        onClick={() => handleRowClick(contract)}
                      >
                        <TableCell className="py-1 text-xs font-medium">{contract.nr}</TableCell>
                        <TableCell className="py-1 text-xs">{contract.client}</TableCell>
                        <TableCell className="py-1 text-xs">{contract.proiect}</TableCell>
                        <TableCell className="py-1 text-xs">{contract.produs}</TableCell>
                        <TableCell className="py-1 text-xs text-right">
                          {contract.pret > 0 ? `${contract.pret.toLocaleString()} RON` : "Variabil"}
                        </TableCell>
                        <TableCell className="py-1 text-xs">{contract.valabilitate}</TableCell>
                        <TableCell className="py-1 text-xs">{contract.termenPlata}</TableCell>
                        <TableCell className="py-1 text-xs">
                          <Badge className={statusColors[contract.status]}>{contract.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            {/* Pagination */}
            {contracteTotalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  {(contractePage - 1) * itemsPerPage + 1}-{Math.min(contractePage * itemsPerPage, filteredContracte.length)} din {filteredContracte.length}
                </span>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setContractePage(Math.max(1, contractePage - 1))}
                        className={contractePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: contracteTotalPages }, (_, i) => i + 1).slice(
                      Math.max(0, contractePage - 2),
                      Math.min(contracteTotalPages, contractePage + 1)
                    ).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setContractePage(page)}
                          isActive={contractePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setContractePage(Math.min(contracteTotalPages, contractePage + 1))}
                        className={contractePage === contracteTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
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

      {/* Details View Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <DialogTitle>
              Detalii {viewingDetails?.tip === "oferta" ? "Ofertă" : "Contract"} - {viewingDetails?.nr}
            </DialogTitle>
            <DialogDescription>
              Informații complete
            </DialogDescription>
          </DialogHeader>
          
          {viewingDetails && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-end">
                <Badge className={statusColors[viewingDetails.status]}>{viewingDetails.status}</Badge>
              </div>
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
