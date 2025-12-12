import { useState, useMemo } from "react";
import { 
  FileBox, 
  FileText, 
  Receipt, 
  Send, 
  Download, 
  Eye, 
  RefreshCw,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  FileCode,
  ArrowUp,
  ArrowDown,
  ArrowUpDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

// Types
interface Aviz {
  id: number;
  nr: string;
  client: string;
  comanda: string;
  data: string;
  produs: string;
  cantitate: number;
  unitate: string;
  sofer: string;
  status: "Draft" | "Generat" | "Transmis";
}

interface Factura {
  id: number;
  nr: string;
  client: string;
  data: string;
  suma: number;
  moneda: string;
  scadenta: string;
  status: "Draft" | "Trimis" | "Plătit" | "Anulat";
}

interface EFactura {
  id: number;
  nr_factura: string;
  client: string;
  data_transmitere: string;
  suma: number;
  status: "Generat" | "Trimis" | "Acceptat" | "Respins";
  mesaj_eroare?: string;
  jurnal: { data: string; actiune: string; detalii: string }[];
}

// Mock data
const avizeInitiale: Aviz[] = [
  { id: 1, nr: "AVZ-2024-001", client: "Construct SRL", comanda: "CMD-001", data: "28/11/2024", produs: "BA 16", cantitate: 25, unitate: "tone", sofer: "Ion Popescu", status: "Transmis" },
  { id: 2, nr: "AVZ-2024-002", client: "Drumuri SA", comanda: "CMD-002", data: "28/11/2024", produs: "BADPC 22.4", cantitate: 30, unitate: "tone", sofer: "Gheorghe Ionescu", status: "Generat" },
  { id: 3, nr: "AVZ-2024-003", client: "Infra Build", comanda: "CMD-003", data: "29/11/2024", produs: "AB 31.5", cantitate: 40, unitate: "tone", sofer: "Vasile Marin", status: "Draft" },
  { id: 4, nr: "AVZ-2024-004", client: "Construct SRL", comanda: "CMD-004", data: "29/11/2024", produs: "BA 16", cantitate: 20, unitate: "tone", sofer: "Ion Popescu", status: "Transmis" },
  { id: 5, nr: "AVZ-2024-005", client: "Metro Construct", comanda: "CMD-005", data: "30/11/2024", produs: "MAS 22.4", cantitate: 35, unitate: "tone", sofer: "Andrei Stan", status: "Draft" },
];

const facturiInitiale: Factura[] = [
  { id: 1, nr: "FCT-2024-001", client: "Construct SRL", data: "25/11/2024", suma: 45000, moneda: "RON", scadenta: "25/12/2024", status: "Trimis" },
  { id: 2, nr: "FCT-2024-002", client: "Drumuri SA", data: "26/11/2024", suma: 78500, moneda: "RON", scadenta: "26/12/2024", status: "Plătit" },
  { id: 3, nr: "FCT-2024-003", client: "Infra Build", data: "27/11/2024", suma: 32000, moneda: "RON", scadenta: "27/12/2024", status: "Draft" },
  { id: 4, nr: "FCT-2024-004", client: "Metro Construct", data: "28/11/2024", suma: 56000, moneda: "EUR", scadenta: "28/12/2024", status: "Trimis" },
  { id: 5, nr: "FCT-2024-005", client: "Construct SRL", data: "29/11/2024", suma: 23500, moneda: "RON", scadenta: "29/12/2024", status: "Anulat" },
];

const eFacturiInitiale: EFactura[] = [
  { id: 1, nr_factura: "FCT-2024-001", client: "Construct SRL", data_transmitere: "25/11/2024 14:30", suma: 45000, status: "Acceptat", jurnal: [
    { data: "25/11/2024 14:30", actiune: "Generat", detalii: "XML generat cu succes" },
    { data: "25/11/2024 14:31", actiune: "Trimis", detalii: "Transmis către ANAF" },
    { data: "25/11/2024 15:45", actiune: "Acceptat", detalii: "Validat de ANAF, index: 12345678" },
  ]},
  { id: 2, nr_factura: "FCT-2024-002", client: "Drumuri SA", data_transmitere: "26/11/2024 09:15", suma: 78500, status: "Acceptat", jurnal: [
    { data: "26/11/2024 09:15", actiune: "Generat", detalii: "XML generat cu succes" },
    { data: "26/11/2024 09:16", actiune: "Trimis", detalii: "Transmis către ANAF" },
    { data: "26/11/2024 10:30", actiune: "Acceptat", detalii: "Validat de ANAF, index: 12345679" },
  ]},
  { id: 3, nr_factura: "FCT-2024-004", client: "Metro Construct", data_transmitere: "28/11/2024 16:00", suma: 56000, status: "Respins", mesaj_eroare: "CUI furnizor invalid", jurnal: [
    { data: "28/11/2024 16:00", actiune: "Generat", detalii: "XML generat cu succes" },
    { data: "28/11/2024 16:01", actiune: "Trimis", detalii: "Transmis către ANAF" },
    { data: "28/11/2024 16:45", actiune: "Respins", detalii: "Eroare validare: CUI furnizor invalid" },
  ]},
  { id: 4, nr_factura: "FCT-2024-003", client: "Infra Build", data_transmitere: "27/11/2024 11:00", suma: 32000, status: "Trimis", jurnal: [
    { data: "27/11/2024 11:00", actiune: "Generat", detalii: "XML generat cu succes" },
    { data: "27/11/2024 11:01", actiune: "Trimis", detalii: "Transmis către ANAF, în așteptare" },
  ]},
];

const getAvizStatusBadge = (status: Aviz["status"]) => {
  switch (status) {
    case "Draft":
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Draft</Badge>;
    case "Generat":
      return <Badge variant="outline" className="gap-1 border-primary text-primary"><FileText className="h-3 w-3" />Generat</Badge>;
    case "Transmis":
      return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3" />Transmis</Badge>;
  }
};

const getFacturaStatusBadge = (status: Factura["status"]) => {
  switch (status) {
    case "Draft":
      return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Draft</Badge>;
    case "Trimis":
      return <Badge variant="outline" className="gap-1 border-primary text-primary"><Send className="h-3 w-3" />Trimis</Badge>;
    case "Plătit":
      return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3" />Plătit</Badge>;
    case "Anulat":
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Anulat</Badge>;
  }
};

const getEFacturaStatusBadge = (status: EFactura["status"]) => {
  switch (status) {
    case "Generat":
      return <Badge variant="secondary" className="gap-1"><FileCode className="h-3 w-3" />Generat</Badge>;
    case "Trimis":
      return <Badge variant="outline" className="gap-1 border-primary text-primary"><Send className="h-3 w-3" />Trimis</Badge>;
    case "Acceptat":
      return <Badge className="gap-1 bg-green-600 hover:bg-green-700"><CheckCircle2 className="h-3 w-3" />Acceptat</Badge>;
    case "Respins":
      return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Respins</Badge>;
  }
};

const Documente = () => {
  const [activeTab, setActiveTab] = useState("avize");
  
  // Avize state
  const [avize] = useState<Aviz[]>(avizeInitiale);
  const [avizeFilters, setAvizeFilters] = useState({ nr: "", client: "", produs: "", sofer: "", status: "" });
  const [avizeSort, setAvizeSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [avizePage, setAvizePage] = useState(1);
  const [avizePerPage, setAvizePerPage] = useState(10);
  const [selectedAviz, setSelectedAviz] = useState<Aviz | null>(null);
  
  // Facturi state
  const [facturi] = useState<Factura[]>(facturiInitiale);
  const [facturiFilters, setFacturiFilters] = useState({ nr: "", client: "", status: "" });
  const [facturiSort, setFacturiSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [facturiPage, setFacturiPage] = useState(1);
  const [facturiPerPage, setFacturiPerPage] = useState(10);
  const [selectedFactura, setSelectedFactura] = useState<Factura | null>(null);
  
  // E-Factura state
  const [eFacturi] = useState<EFactura[]>(eFacturiInitiale);
  const [eFacturiFilters, setEFacturiFilters] = useState({ nr: "", client: "", status: "" });
  const [eFacturiSort, setEFacturiSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({ key: "", direction: null });
  const [eFacturiPage, setEFacturiPage] = useState(1);
  const [eFacturiPerPage, setEFacturiPerPage] = useState(10);
  const [selectedEFactura, setSelectedEFactura] = useState<EFactura | null>(null);
  const [jurnalDialog, setJurnalDialog] = useState<EFactura | null>(null);
  
  // Dialogs
  const [genereazaDialog, setGenereazaDialog] = useState<{ type: "aviz" | "factura"; from?: string } | null>(null);
  const [trimiteEFacturaDialog, setTrimiteEFacturaDialog] = useState<Factura | null>(null);

  // Filtered and sorted Avize
  const filteredAvize = useMemo(() => {
    let result = avize.filter(a => {
      if (avizeFilters.nr && !a.nr.toLowerCase().includes(avizeFilters.nr.toLowerCase())) return false;
      if (avizeFilters.client && !a.client.toLowerCase().includes(avizeFilters.client.toLowerCase())) return false;
      if (avizeFilters.produs && !a.produs.toLowerCase().includes(avizeFilters.produs.toLowerCase())) return false;
      if (avizeFilters.sofer && !a.sofer.toLowerCase().includes(avizeFilters.sofer.toLowerCase())) return false;
      if (avizeFilters.status && a.status !== avizeFilters.status) return false;
      return true;
    });
    
    if (avizeSort.key && avizeSort.direction) {
      result.sort((a, b) => {
        const aVal = a[avizeSort.key as keyof Aviz];
        const bVal = b[avizeSort.key as keyof Aviz];
        const cmp = String(aVal).localeCompare(String(bVal));
        return avizeSort.direction === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [avize, avizeFilters, avizeSort]);

  const paginatedAvize = useMemo(() => {
    const start = (avizePage - 1) * avizePerPage;
    return filteredAvize.slice(start, start + avizePerPage);
  }, [filteredAvize, avizePage, avizePerPage]);

  // Filtered and sorted Facturi
  const filteredFacturi = useMemo(() => {
    let result = facturi.filter(f => {
      if (facturiFilters.nr && !f.nr.toLowerCase().includes(facturiFilters.nr.toLowerCase())) return false;
      if (facturiFilters.client && !f.client.toLowerCase().includes(facturiFilters.client.toLowerCase())) return false;
      if (facturiFilters.status && f.status !== facturiFilters.status) return false;
      return true;
    });
    
    if (facturiSort.key && facturiSort.direction) {
      result.sort((a, b) => {
        const aVal = a[facturiSort.key as keyof Factura];
        const bVal = b[facturiSort.key as keyof Factura];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return facturiSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return facturiSort.direction === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [facturi, facturiFilters, facturiSort]);

  const paginatedFacturi = useMemo(() => {
    const start = (facturiPage - 1) * facturiPerPage;
    return filteredFacturi.slice(start, start + facturiPerPage);
  }, [filteredFacturi, facturiPage, facturiPerPage]);

  // Filtered and sorted E-Facturi
  const filteredEFacturi = useMemo(() => {
    let result = eFacturi.filter(e => {
      if (eFacturiFilters.nr && !e.nr_factura.toLowerCase().includes(eFacturiFilters.nr.toLowerCase())) return false;
      if (eFacturiFilters.client && !e.client.toLowerCase().includes(eFacturiFilters.client.toLowerCase())) return false;
      if (eFacturiFilters.status && e.status !== eFacturiFilters.status) return false;
      return true;
    });
    
    if (eFacturiSort.key && eFacturiSort.direction) {
      result.sort((a, b) => {
        const aVal = a[eFacturiSort.key as keyof EFactura];
        const bVal = b[eFacturiSort.key as keyof EFactura];
        if (typeof aVal === "number" && typeof bVal === "number") {
          return eFacturiSort.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        const cmp = String(aVal).localeCompare(String(bVal));
        return eFacturiSort.direction === "asc" ? cmp : -cmp;
      });
    }
    return result;
  }, [eFacturi, eFacturiFilters, eFacturiSort]);

  const paginatedEFacturi = useMemo(() => {
    const start = (eFacturiPage - 1) * eFacturiPerPage;
    return filteredEFacturi.slice(start, start + eFacturiPerPage);
  }, [filteredEFacturi, eFacturiPage, eFacturiPerPage]);

  // Stats
  const avizeStats = useMemo(() => ({
    total: avize.length,
    draft: avize.filter(a => a.status === "Draft").length,
    transmis: avize.filter(a => a.status === "Transmis").length,
  }), [avize]);

  const facturiStats = useMemo(() => ({
    total: facturi.length,
    suma: facturi.filter(f => f.status !== "Anulat").reduce((s, f) => s + f.suma, 0),
    platite: facturi.filter(f => f.status === "Plătit").length,
  }), [facturi]);

  const eFacturiStats = useMemo(() => ({
    total: eFacturi.length,
    acceptate: eFacturi.filter(e => e.status === "Acceptat").length,
    respinse: eFacturi.filter(e => e.status === "Respins").length,
  }), [eFacturi]);

  const handleExportPDF = (type: string, item: any) => {
    toast.success(`Export PDF pentru ${type} ${item.nr || item.nr_factura}`);
  };

  const handleExportXML = (item: EFactura) => {
    toast.success(`Export XML pentru ${item.nr_factura}`);
  };

  const handleRetrimite = (item: EFactura) => {
    toast.success(`Re-trimitere inițiată pentru ${item.nr_factura}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileBox className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documente</h1>
            <p className="text-muted-foreground">Avize, Facturi și integrare RO e-Factura</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setGenereazaDialog({ type: "aviz" })}>
            <Plus className="h-4 w-4 mr-2" />
            Generează Aviz
          </Button>
          <Button onClick={() => setGenereazaDialog({ type: "factura" })}>
            <Plus className="h-4 w-4 mr-2" />
            Generează Factură
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="avize" className="gap-2">
            <Receipt className="h-4 w-4" />
            Avize
          </TabsTrigger>
          <TabsTrigger value="facturi" className="gap-2">
            <FileText className="h-4 w-4" />
            Facturi
          </TabsTrigger>
          <TabsTrigger value="efactura" className="gap-2">
            <Send className="h-4 w-4" />
            e-Factura
          </TabsTrigger>
        </TabsList>

        {/* Avize Tab */}
        <TabsContent value="avize" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Avize</p>
                    <p className="text-2xl font-bold">{avizeStats.total}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Draft</p>
                    <p className="text-2xl font-bold">{avizeStats.draft}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transmise</p>
                    <p className="text-2xl font-bold">{avizeStats.transmis}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista Avize</CardTitle>
              <CardDescription>Gestionare avize de însoțire a mărfurilor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto" tabIndex={-1}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Nr.</span>
                              {avizeSort.key === 'nr' ? (avizeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută nr..." value={avizeFilters.nr} onChange={(e) => { setAvizeFilters(f => ({ ...f, nr: e.target.value })); setAvizePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={avizeSort.key === 'nr' && avizeSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'nr', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={avizeSort.key === 'nr' && avizeSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'nr', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Client</span>
                              {avizeSort.key === 'client' ? (avizeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută client..." value={avizeFilters.client} onChange={(e) => { setAvizeFilters(f => ({ ...f, client: e.target.value })); setAvizePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={avizeSort.key === 'client' && avizeSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'client', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={avizeSort.key === 'client' && avizeSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'client', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead>Comandă</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Produs</span>
                              {avizeSort.key === 'produs' ? (avizeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută produs..." value={avizeFilters.produs} onChange={(e) => { setAvizeFilters(f => ({ ...f, produs: e.target.value })); setAvizePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={avizeSort.key === 'produs' && avizeSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'produs', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={avizeSort.key === 'produs' && avizeSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'produs', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="text-right">Cantitate</TableHead>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Șofer</span>
                              {avizeSort.key === 'sofer' ? (avizeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută șofer..." value={avizeFilters.sofer} onChange={(e) => { setAvizeFilters(f => ({ ...f, sofer: e.target.value })); setAvizePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={avizeSort.key === 'sofer' && avizeSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'sofer', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={avizeSort.key === 'sofer' && avizeSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setAvizeSort({ key: 'sofer', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAvize.length === 0 ? (
                      <DataTableEmpty colSpan={9} message="Nu există avize." />
                    ) : (
                      paginatedAvize.map((aviz) => (
                        <TableRow 
                          key={aviz.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedAviz(aviz)}
                        >
                          <TableCell className="font-medium">{aviz.nr}</TableCell>
                          <TableCell>{aviz.client}</TableCell>
                          <TableCell>{aviz.comanda}</TableCell>
                          <TableCell>{aviz.data}</TableCell>
                          <TableCell>{aviz.produs}</TableCell>
                          <TableCell className="text-right">{aviz.cantitate} {aviz.unitate}</TableCell>
                          <TableCell>{aviz.sofer}</TableCell>
                          <TableCell>{getAvizStatusBadge(aviz.status)}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleExportPDF("Aviz", aviz); }}>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Export PDF</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); toast.success("Imprimare aviz..."); }}>
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Imprimă</TooltipContent>
                                </Tooltip>
                              </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={avizePage}
                totalPages={Math.ceil(filteredAvize.length / avizePerPage)}
                totalItems={filteredAvize.length}
                itemsPerPage={avizePerPage}
                onPageChange={setAvizePage}
                onItemsPerPageChange={(val) => { setAvizePerPage(val); setAvizePage(1); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facturi Tab */}
        <TabsContent value="facturi" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Facturi</p>
                    <p className="text-2xl font-bold">{facturiStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valoare Totală</p>
                    <p className="text-2xl font-bold">{facturiStats.suma.toLocaleString()} RON</p>
                  </div>
                  <Receipt className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Plătite</p>
                    <p className="text-2xl font-bold">{facturiStats.platite}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Lista Facturi</CardTitle>
              <CardDescription>Gestionare facturi fiscale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto" tabIndex={-1}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Nr.</span>
                              {facturiSort.key === 'nr' ? (facturiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută nr..." value={facturiFilters.nr} onChange={(e) => { setFacturiFilters(f => ({ ...f, nr: e.target.value })); setFacturiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={facturiSort.key === 'nr' && facturiSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setFacturiSort({ key: 'nr', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={facturiSort.key === 'nr' && facturiSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setFacturiSort({ key: 'nr', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Client</span>
                              {facturiSort.key === 'client' ? (facturiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută client..." value={facturiFilters.client} onChange={(e) => { setFacturiFilters(f => ({ ...f, client: e.target.value })); setFacturiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={facturiSort.key === 'client' && facturiSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setFacturiSort({ key: 'client', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={facturiSort.key === 'client' && facturiSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setFacturiSort({ key: 'client', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Suma</TableHead>
                      <TableHead>Monedă</TableHead>
                      <TableHead>Scadență</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFacturi.length === 0 ? (
                      <DataTableEmpty colSpan={8} message="Nu există facturi." />
                    ) : (
                      paginatedFacturi.map((factura) => (
                        <TableRow 
                          key={factura.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedFactura(factura)}
                        >
                          <TableCell className="font-medium">{factura.nr}</TableCell>
                          <TableCell>{factura.client}</TableCell>
                          <TableCell>{factura.data}</TableCell>
                          <TableCell className="text-right font-medium">{factura.suma.toLocaleString()}</TableCell>
                          <TableCell>{factura.moneda}</TableCell>
                          <TableCell>{factura.scadenta}</TableCell>
                          <TableCell>{getFacturaStatusBadge(factura.status)}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleExportPDF("Factură", factura); }}>
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Export PDF</TooltipContent>
                                </Tooltip>
                                {factura.status === "Trimis" && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setTrimiteEFacturaDialog(factura); }}>
                                        <Send className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Trimite în e-Factura</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={facturiPage}
                totalPages={Math.ceil(filteredFacturi.length / facturiPerPage)}
                totalItems={filteredFacturi.length}
                itemsPerPage={facturiPerPage}
                onPageChange={setFacturiPage}
                onItemsPerPageChange={(val) => { setFacturiPerPage(val); setFacturiPage(1); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-Factura Tab */}
        <TabsContent value="efactura" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transmise</p>
                    <p className="text-2xl font-bold">{eFacturiStats.total}</p>
                  </div>
                  <Send className="h-8 w-8 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Acceptate</p>
                    <p className="text-2xl font-bold">{eFacturiStats.acceptate}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Respinse</p>
                    <p className="text-2xl font-bold">{eFacturiStats.respinse}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>RO e-Factura</CardTitle>
              <CardDescription>Monitorizare transmitere facturi în sistemul e-Factura ANAF</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto" tabIndex={-1}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Nr. Factură</span>
                              {eFacturiSort.key === 'nr_factura' ? (eFacturiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută nr..." value={eFacturiFilters.nr} onChange={(e) => { setEFacturiFilters(f => ({ ...f, nr: e.target.value })); setEFacturiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={eFacturiSort.key === 'nr_factura' && eFacturiSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setEFacturiSort({ key: 'nr_factura', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={eFacturiSort.key === 'nr_factura' && eFacturiSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setEFacturiSort({ key: 'nr_factura', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead className="h-10 text-xs">
                        <Popover modal={true}>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Client</span>
                              {eFacturiSort.key === 'client' ? (eFacturiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută client..." value={eFacturiFilters.client} onChange={(e) => { setEFacturiFilters(f => ({ ...f, client: e.target.value })); setEFacturiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant={eFacturiSort.key === 'client' && eFacturiSort.direction === 'asc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setEFacturiSort({ key: 'client', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant={eFacturiSort.key === 'client' && eFacturiSort.direction === 'desc' ? 'default' : 'outline'} size="sm" className="flex-1 h-7 text-xs" onClick={() => setEFacturiSort({ key: 'client', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      <TableHead>Data Transmitere</TableHead>
                      <TableHead className="text-right">Suma</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEFacturi.length === 0 ? (
                      <DataTableEmpty colSpan={6} message="Nu există facturi transmise." />
                    ) : (
                      paginatedEFacturi.map((ef) => (
                        <TableRow 
                          key={ef.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedEFactura(ef)}
                        >
                          <TableCell className="font-medium">{ef.nr_factura}</TableCell>
                          <TableCell>{ef.client}</TableCell>
                          <TableCell>{ef.data_transmitere}</TableCell>
                          <TableCell className="text-right font-medium">{ef.suma.toLocaleString()} RON</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEFacturaStatusBadge(ef.status)}
                              {ef.status === "Respins" && ef.mesaj_eroare && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <AlertCircle className="h-4 w-4 text-destructive" />
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      {ef.mesaj_eroare}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider>
                              <div className="flex justify-end gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setJurnalDialog(ef); }}>
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Vezi jurnal</TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleExportXML(ef); }}>
                                      <FileCode className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Export XML</TooltipContent>
                                </Tooltip>
                                {ef.status === "Respins" && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleRetrimite(ef); }}>
                                        <RefreshCw className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Re-trimite</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <DataTablePagination
                currentPage={eFacturiPage}
                totalPages={Math.ceil(filteredEFacturi.length / eFacturiPerPage)}
                totalItems={filteredEFacturi.length}
                itemsPerPage={eFacturiPerPage}
                onPageChange={setEFacturiPage}
                onItemsPerPageChange={(val) => { setEFacturiPerPage(val); setEFacturiPage(1); }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Aviz Detail Dialog */}
      <Dialog open={!!selectedAviz} onOpenChange={() => setSelectedAviz(null)}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Detalii Aviz</DialogTitle>
            <DialogDescription>Informații despre avizul selectat</DialogDescription>
          </DialogHeader>
          {selectedAviz && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{selectedAviz.nr}</span>
                {getAvizStatusBadge(selectedAviz.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{selectedAviz.client}</span></div>
                <div><span className="text-muted-foreground">Comandă:</span> <span className="font-medium">{selectedAviz.comanda}</span></div>
                <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{selectedAviz.data}</span></div>
                <div><span className="text-muted-foreground">Produs:</span> <span className="font-medium">{selectedAviz.produs}</span></div>
                <div><span className="text-muted-foreground">Cantitate:</span> <span className="font-medium">{selectedAviz.cantitate} {selectedAviz.unitate}</span></div>
                <div><span className="text-muted-foreground">Șofer:</span> <span className="font-medium">{selectedAviz.sofer}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleExportPDF("Aviz", selectedAviz)}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => setSelectedAviz(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Factura Detail Dialog */}
      <Dialog open={!!selectedFactura} onOpenChange={() => setSelectedFactura(null)}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Detalii Factură</DialogTitle>
            <DialogDescription>Informații despre factura selectată</DialogDescription>
          </DialogHeader>
          {selectedFactura && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{selectedFactura.nr}</span>
                {getFacturaStatusBadge(selectedFactura.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{selectedFactura.client}</span></div>
                <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{selectedFactura.data}</span></div>
                <div><span className="text-muted-foreground">Suma:</span> <span className="font-medium">{selectedFactura.suma.toLocaleString()} {selectedFactura.moneda}</span></div>
                <div><span className="text-muted-foreground">Scadență:</span> <span className="font-medium">{selectedFactura.scadenta}</span></div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => handleExportPDF("Factură", selectedFactura)}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            {selectedFactura?.status === "Trimis" && (
              <Button onClick={() => { setTrimiteEFacturaDialog(selectedFactura); setSelectedFactura(null); }}>
                <Send className="h-4 w-4 mr-2" />
                Trimite în e-Factura
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedFactura(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* E-Factura Detail Dialog */}
      <Dialog open={!!selectedEFactura} onOpenChange={() => setSelectedEFactura(null)}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Detalii e-Factura</DialogTitle>
            <DialogDescription>Status transmitere în sistemul ANAF</DialogDescription>
          </DialogHeader>
          {selectedEFactura && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">{selectedEFactura.nr_factura}</span>
                {getEFacturaStatusBadge(selectedEFactura.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{selectedEFactura.client}</span></div>
                <div><span className="text-muted-foreground">Data transmitere:</span> <span className="font-medium">{selectedEFactura.data_transmitere}</span></div>
                <div><span className="text-muted-foreground">Suma:</span> <span className="font-medium">{selectedEFactura.suma.toLocaleString()} RON</span></div>
              </div>
              {selectedEFactura.mesaj_eroare && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive font-medium">Eroare: {selectedEFactura.mesaj_eroare}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setJurnalDialog(selectedEFactura); setSelectedEFactura(null); }}>
              <Eye className="h-4 w-4 mr-2" />
              Vezi Jurnal
            </Button>
            <Button variant="outline" onClick={() => handleExportXML(selectedEFactura!)}>
              <FileCode className="h-4 w-4 mr-2" />
              Export XML
            </Button>
            {selectedEFactura?.status === "Respins" && (
              <Button onClick={() => handleRetrimite(selectedEFactura)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-trimite
              </Button>
            )}
            <Button variant="outline" onClick={() => setSelectedEFactura(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Jurnal Dialog */}
      <Dialog open={!!jurnalDialog} onOpenChange={() => setJurnalDialog(null)}>
        <DialogContent className="max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Jurnal Transmitere</DialogTitle>
            <DialogDescription>{jurnalDialog?.nr_factura}</DialogDescription>
          </DialogHeader>
          {jurnalDialog && (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {jurnalDialog.jurnal.map((entry, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-medium text-sm">{entry.actiune}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{entry.data}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{entry.detalii}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setJurnalDialog(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generează Dialog */}
      <AlertDialog open={!!genereazaDialog} onOpenChange={() => setGenereazaDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Generează {genereazaDialog?.type === "aviz" ? "Aviz" : "Factură"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Selectați o comandă din listă pentru a genera {genereazaDialog?.type === "aviz" ? "avizul" : "factura"}.
              Această funcționalitate va fi disponibilă după conectarea la sistemul de comenzi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => { toast.info("Funcționalitate în dezvoltare"); setGenereazaDialog(null); }}>
              Continuă
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Trimite e-Factura Dialog */}
      <AlertDialog open={!!trimiteEFacturaDialog} onOpenChange={() => setTrimiteEFacturaDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Trimite în RO e-Factura</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteți sigur că doriți să transmiteți factura {trimiteEFacturaDialog?.nr} în sistemul e-Factura ANAF?
              Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => { toast.success(`Factura ${trimiteEFacturaDialog?.nr} transmisă în e-Factura`); setTrimiteEFacturaDialog(null); }}>
              <Send className="h-4 w-4 mr-2" />
              Trimite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Documente;
