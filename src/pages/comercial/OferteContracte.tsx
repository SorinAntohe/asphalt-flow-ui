import { useState, useMemo, useRef } from "react";
import { FileCheck, Plus, Download, Copy, Mail, FileText, Pencil, Trash2, X, CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { format, addDays } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Types
interface ProdusItem {
  produs: string;
  pret: number;
  cantitate?: number;
}

interface TransportPricing {
  tipTransport: "inchiriere" | "tona_km" | "inclus";
  pretInchiriere?: number;
  pretTonaKm?: number;
}

interface Oferta {
  id: number;
  nr: string;
  client: string;
  proiect: string;
  produs: string; // Pentru afișare în tabel (primul produs sau "Multiple")
  pret: number; // Pentru afișare în tabel (suma totală)
  produse: ProdusItem[];
  transport: TransportPricing;
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
  produse: ProdusItem[];
  transport: TransportPricing;
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
  { id: 1, nr: "OF-2024-001", client: "Construcții Modern SRL", proiect: "Autostrada A3 - Lot 2", produs: "Asfalt BA16", pret: 450, produse: [{ produs: "Asfalt BA16", pret: 450 }], transport: { tipTransport: "inclus" }, valabilitate: "31/12/2024", termenPlata: "30 zile", status: "Acceptat", tip: "oferta", dataCreare: "15/11/2024", conditiiComerciale: "Preț franco șantier, inclusiv transport", observatii: "Client prioritar" },
  { id: 2, nr: "OF-2024-002", client: "Drumuri Naționale SA", proiect: "DN1 - Reparații km 45-60", produs: "Asfalt MASF16", pret: 520, produse: [{ produs: "Asfalt MASF16", pret: 520 }], transport: { tipTransport: "tona_km", pretTonaKm: 0.85 }, valabilitate: "15/01/2025", termenPlata: "45 zile", status: "Trimis", tip: "oferta", dataCreare: "20/11/2024", conditiiComerciale: "Preț EXW, transport separat", observatii: "" },
  { id: 3, nr: "OF-2024-003", client: "Primăria Sector 3", proiect: "Reabilitare Bd. Decebal", produs: "Asfalt BA8", pret: 380, produse: [{ produs: "Asfalt BA8", pret: 380 }], transport: { tipTransport: "inclus" }, valabilitate: "01/12/2024", termenPlata: "60 zile", status: "Draft", tip: "oferta", dataCreare: "25/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "Așteptare aprobare buget" },
  { id: 4, nr: "OF-2024-004", client: "Beta Construct SRL", proiect: "Parcare mall", produs: "Asfalt BA16", pret: 440, produse: [{ produs: "Asfalt BA16", pret: 440 }], transport: { tipTransport: "inchiriere", pretInchiriere: 1500 }, valabilitate: "20/11/2024", termenPlata: "30 zile", status: "Expirat", tip: "oferta", dataCreare: "01/11/2024", conditiiComerciale: "Preț franco șantier", observatii: "" },
  { id: 5, nr: "OF-2024-005", client: "Infrastructură Plus SRL", proiect: "Centura ocolitoare", produs: "Multiple", pret: 3320, produse: [{ produs: "Emulsie cationică", pret: 2800 }, { produs: "Asfalt BA16", pret: 520 }], transport: { tipTransport: "tona_km", pretTonaKm: 0.75 }, valabilitate: "28/02/2025", termenPlata: "30 zile", status: "Trimis", tip: "oferta", dataCreare: "28/11/2024", conditiiComerciale: "Preț per tonă, livrare în cisternă", observatii: "Volum mare estimat" },
];

const initialContracte: Contract[] = [
  { id: 1, nr: "CTR-2024-001", client: "Construcții Modern SRL", proiect: "Autostrada A3 - Lot 2", produs: "Asfalt BA16", pret: 445, produse: [{ produs: "Asfalt BA16", pret: 445 }], transport: { tipTransport: "inclus" }, valabilitate: "31/12/2025", termenPlata: "30 zile", status: "Acceptat", tip: "contract", dataCreare: "20/11/2024", conditiiComerciale: "Preț fix pe durata contractului, inclusiv transport", observatii: "Contract cadru anual", indexareCombustibil: "Ajustare trimestrială +/- 5%" },
  { id: 2, nr: "CTR-2024-002", client: "Drumuri Naționale SA", proiect: "Întreținere DN1 2024-2025", produs: "Multiple", pret: 1320, produse: [{ produs: "Asfalt BA8", pret: 380 }, { produs: "Asfalt BA16", pret: 450 }, { produs: "Asfalt MASF16", pret: 490 }], transport: { tipTransport: "tona_km", pretTonaKm: 0.80 }, valabilitate: "31/03/2025", termenPlata: "45 zile", status: "Acceptat", tip: "contract", dataCreare: "01/10/2024", conditiiComerciale: "Contract cadru cu comenzi lunare", observatii: "Include BA8, BA16, MASF16", indexareCombustibil: "Ajustare lunară conform indicele ANRE" },
  { id: 3, nr: "CTR-2024-003", client: "Alpha Roads SRL", proiect: "Dezvoltare zonă industrială", produs: "Asfalt BA16", pret: 460, produse: [{ produs: "Asfalt BA16", pret: 460 }], transport: { tipTransport: "inchiriere", pretInchiriere: 1800 }, valabilitate: "30/06/2025", termenPlata: "30 zile", status: "Draft", tip: "contract", dataCreare: "29/11/2024", conditiiComerciale: "În negociere", observatii: "Așteptare semnături", indexareCombustibil: "De stabilit" },
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
    produse: [{ produs: "", pret: 0 }] as ProdusItem[],
    transport: { tipTransport: "inclus" as TransportPricing["tipTransport"], pretInchiriere: 0, pretTonaKm: 0 },
    valabilitate: "",
    termenPlata: "30 zile",
    observatii: "",
    indexareCombustibil: "",
    garantie: { biletOrdin: null as File | null, procesVerbal: null as File | null },
    avansPlata: 0,
  });
  
  // File input refs
  const biletOrdinRef = useRef<HTMLInputElement>(null);
  const procesVerbalRef = useRef<HTMLInputElement>(null);
  
  // Column filters
  const [oferteFilters, setOferteFilters] = useState<Record<string, string>>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  const [contracteFilters, setContracteFilters] = useState<Record<string, string>>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  
  // Sorting
  const [oferteSort, setOferteSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [contracteSort, setContracteSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

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
        if (!oferteSort) return 0;
        const aVal = a[oferteSort.key as keyof Oferta];
        const bVal = b[oferteSort.key as keyof Oferta];
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
        if (!contracteSort) return 0;
        const aVal = a[contracteSort.key as keyof Contract];
        const bVal = b[contracteSort.key as keyof Contract];
        if (aVal < bVal) return contracteSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return contracteSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [contracte, contracteFilters, contracteSort]);

  // Pagination calculations
  const oferteTotalPages = Math.ceil(filteredOferte.length / itemsPerPage);
  const contracteTotalPages = Math.ceil(filteredContracte.length / itemsPerPage);
  const paginatedOferte = filteredOferte.slice((ofertePage - 1) * itemsPerPage, ofertePage * itemsPerPage);
  const paginatedContracte = filteredContracte.slice((contractePage - 1) * itemsPerPage, contractePage * itemsPerPage);

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
      produse: [{ produs: "", pret: 0 }],
      transport: { tipTransport: "inclus", pretInchiriere: 0, pretTonaKm: 0 },
      valabilitate: "",
      termenPlata: "30 zile",
      observatii: "",
      indexareCombustibil: "",
      garantie: { biletOrdin: null, procesVerbal: null },
      avansPlata: 0,
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditing(item);
    const itemTransport = item.transport || { tipTransport: "inclus" as const };
    setForm({
      client: item.client,
      proiect: item.proiect,
      produse: item.produse && item.produse.length > 0 ? item.produse : [{ produs: item.produs, pret: item.pret }],
      transport: { 
        tipTransport: itemTransport.tipTransport, 
        pretInchiriere: itemTransport.pretInchiriere || 0, 
        pretTonaKm: itemTransport.pretTonaKm || 0 
      },
      valabilitate: item.valabilitate,
      termenPlata: item.termenPlata,
      observatii: item.observatii,
      indexareCombustibil: item.tip === "contract" ? (item as Contract).indexareCombustibil : "",
      garantie: { biletOrdin: null, procesVerbal: null },
      avansPlata: 0,
    });
    setOpenAddEdit(true);
  };

  const handleAddProdus = () => {
    setForm(prev => ({
      ...prev,
      produse: [...prev.produse, { produs: "", pret: 0 }]
    }));
  };

  const handleRemoveProdus = (index: number) => {
    if (form.produse.length > 1) {
      setForm(prev => ({
        ...prev,
        produse: prev.produse.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProdusChange = (index: number, field: keyof ProdusItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      produse: prev.produse.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const handleSave = () => {
    const validProduse = form.produse.filter(p => p.produs);
    if (!form.client || validProduse.length === 0) {
      toast({ title: "Eroare", description: "Completează câmpurile obligatorii (client și cel puțin un produs).", variant: "destructive" });
      return;
    }

    const currentDate = new Date().toLocaleDateString('ro-RO');
    const totalPret = validProduse.reduce((sum, p) => sum + p.pret, 0);
    const produsDisplay = validProduse.length === 1 ? validProduse[0].produs : "Multiple";
    const transport: TransportPricing = {
      tipTransport: form.transport.tipTransport,
      ...(form.transport.tipTransport === "inchiriere" && { pretInchiriere: form.transport.pretInchiriere }),
      ...(form.transport.tipTransport === "tona_km" && { pretTonaKm: form.transport.pretTonaKm }),
    };

    if (editing) {
      if (editing.tip === "oferta") {
        setOferte(prev => prev.map(item => 
          item.id === editing.id 
            ? { ...item, client: form.client, proiect: form.proiect, produs: produsDisplay, pret: totalPret, produse: validProduse, transport, valabilitate: form.valabilitate || item.valabilitate, termenPlata: form.termenPlata, observatii: form.observatii }
            : item
        ));
      } else {
        setContracte(prev => prev.map(item => 
          item.id === editing.id 
            ? { ...item, client: form.client, proiect: form.proiect, produs: produsDisplay, pret: totalPret, produse: validProduse, transport, valabilitate: form.valabilitate || item.valabilitate, termenPlata: form.termenPlata, observatii: form.observatii, indexareCombustibil: form.indexareCombustibil }
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
          produs: produsDisplay,
          pret: totalPret,
          produse: validProduse,
          transport,
          valabilitate: form.valabilitate,
          termenPlata: form.termenPlata,
          status: "Draft",
          tip: "oferta",
          dataCreare: currentDate,
          conditiiComerciale: "",
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
          produs: produsDisplay,
          pret: totalPret,
          produse: validProduse,
          transport,
          valabilitate: form.valabilitate,
          termenPlata: form.termenPlata,
          status: "Draft",
          tip: "contract",
          dataCreare: currentDate,
          conditiiComerciale: "",
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
      const sourceOferta = viewingDetails as Oferta;
      const newOferta: Oferta = {
        ...sourceOferta,
        id: Math.max(...oferte.map(o => o.id), 0) + 1,
        nr: `OF-2024-${String(oferte.length + 1).padStart(3, '0')}`,
        status: "Draft",
        dataCreare: currentDate,
        produse: [...sourceOferta.produse],
        transport: { ...sourceOferta.transport },
      };
      setOferte(prev => [...prev, newOferta]);
    } else {
      const sourceContract = viewingDetails as Contract;
      const newContract: Contract = {
        ...sourceContract,
        id: Math.max(...contracte.map(c => c.id), 0) + 1,
        nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
        status: "Draft",
        dataCreare: currentDate,
        produse: [...sourceContract.produse],
        transport: { ...sourceContract.transport },
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
        produse: [...oferta.produse],
        transport: { ...oferta.transport },
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
  
  const getTransportLabel = (transport: TransportPricing) => {
    switch (transport.tipTransport) {
      case "inclus": return "Inclus în preț";
      case "inchiriere": return `Închiriere: ${transport.pretInchiriere?.toLocaleString()} RON`;
      case "tona_km": return `${transport.pretTonaKm?.toFixed(2)} RON/tonă·km`;
      default: return "-";
    }
  };

  // Render table with unified components
  const renderTable = (
    data: Item[],
    filters: Record<string, string>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    sort: { key: string; direction: "asc" | "desc" } | null,
    setSort: React.Dispatch<React.SetStateAction<{ key: string; direction: "asc" | "desc" } | null>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalItems: number,
    totalPages: number
  ) => (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Nr."
                  sortKey="nr"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.nr}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, nr: val })); setPage(1); }}
                  filterPlaceholder="Caută nr..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Client"
                  sortKey="client"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.client}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, client: val })); setPage(1); }}
                  filterPlaceholder="Caută client..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Proiect/Șantier"
                  sortKey="proiect"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.proiect}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, proiect: val })); setPage(1); }}
                  filterPlaceholder="Caută proiect..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Produs"
                  sortKey="produs"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.produs}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, produs: val })); setPage(1); }}
                  filterPlaceholder="Caută produs..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Preț"
                  sortKey="pret"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.pret}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, pret: val })); setPage(1); }}
                  filterPlaceholder="Caută preț..."
                  sortAscLabel="Cresc."
                  sortDescLabel="Descresc."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Valabilitate"
                  sortKey="valabilitate"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.valabilitate}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, valabilitate: val })); setPage(1); }}
                  filterPlaceholder="Caută dată..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Termen de plată"
                  sortKey="termenPlata"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.termenPlata}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, termenPlata: val })); setPage(1); }}
                  filterPlaceholder="Caută termen..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Status"
                  sortKey="status"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.status}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, status: val })); setPage(1); }}
                  filterPlaceholder="Caută status..."
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="animate-fade-in">
            {data.length === 0 ? (
              <DataTableEmpty colSpan={8} message="Nu există înregistrări care să corespundă filtrelor." />
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 h-10"
                  onClick={() => setViewingDetails(item)}
                >
                  <TableCell className="py-1 text-xs font-medium">{item.nr}</TableCell>
                  <TableCell className="py-1 text-xs">{item.client}</TableCell>
                  <TableCell className="py-1 text-xs">{item.proiect}</TableCell>
                  <TableCell className="py-1 text-xs">{item.produs}</TableCell>
                  <TableCell className="py-1 text-xs text-right">{item.pret > 0 ? `${item.pret.toLocaleString()} RON` : "-"}</TableCell>
                  <TableCell className="py-1 text-xs">{item.valabilitate}</TableCell>
                  <TableCell className="py-1 text-xs">{item.termenPlata}</TableCell>
                  <TableCell className="py-1 text-xs">
                    <Badge className={statusColors[item.status]}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <DataTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
      />
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oferte & Contracte</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare oferte comerciale și contracte cu clienți
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={(activeTab === "oferte" ? filteredOferte : filteredContracte).length === 0}
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{activeTab === "oferte" ? "Ofertă Nouă" : "Contract Nou"}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "oferte" | "contracte")}>
        <TabsList>
          <TabsTrigger value="oferte">Oferte</TabsTrigger>
          <TabsTrigger value="contracte">Contracte</TabsTrigger>
        </TabsList>

        <TabsContent value="oferte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">Lista Oferte</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Toate ofertele comerciale trimise clienților
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {renderTable(
                paginatedOferte,
                oferteFilters,
                setOferteFilters,
                oferteSort,
                setOferteSort,
                ofertePage,
                setOfertePage,
                filteredOferte.length,
                oferteTotalPages
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">Lista Contracte</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Toate contractele active și arhivate
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {renderTable(
                paginatedContracte,
                contracteFilters,
                setContracteFilters,
                contracteSort,
                setContracteSort,
                contractePage,
                setContractePage,
                filteredContracte.length,
                contracteTotalPages
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-2xl" hideCloseButton>
          <DialogHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle>
                  Detalii {viewingDetails?.tip === "oferta" ? "Ofertă" : "Contract"} - {viewingDetails?.nr}
                </DialogTitle>
                <DialogDescription>
                  Informații complete
                </DialogDescription>
              </div>
              {viewingDetails && (
                <Badge className={statusColors[viewingDetails.status]}>{viewingDetails.status}</Badge>
              )}
            </div>
          </DialogHeader>
          
          {viewingDetails && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm border rounded-lg p-3 bg-muted/30">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{viewingDetails.client}</span></div>
                <div><span className="text-muted-foreground">Proiect:</span> <span className="font-medium">{viewingDetails.proiect}</span></div>
                <div><span className="text-muted-foreground">Valabilitate:</span> <span className="font-medium">{viewingDetails.valabilitate}</span></div>
                <div><span className="text-muted-foreground">Termen plată:</span> <span className="font-medium">{viewingDetails.termenPlata}</span></div>
                <div><span className="text-muted-foreground">Data creare:</span> <span className="font-medium">{viewingDetails.dataCreare}</span></div>
                <div><span className="text-muted-foreground">Transport:</span> <span className="font-medium">{viewingDetails.transport ? getTransportLabel(viewingDetails.transport) : "-"}</span></div>
                {viewingDetails.tip === "contract" && (
                  <div className="col-span-2"><span className="text-muted-foreground">Indexare:</span> <span className="font-medium">{(viewingDetails as Contract).indexareCombustibil || "-"}</span></div>
                )}
              </div>

              {/* Products List */}
              {viewingDetails.produse && viewingDetails.produse.length > 0 && (
                <div className="border rounded-lg p-3">
                  <p className="text-muted-foreground text-sm mb-2">Produse:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingDetails.produse.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/50 rounded px-3 py-2 text-sm">
                        <span className="font-medium">{p.produs}</span>
                        <span>{p.pret.toLocaleString()} RON</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-2 pt-2 border-t">
                    <span className="text-sm"><span className="text-muted-foreground">Total:</span> <span className="font-semibold">{viewingDetails.pret.toLocaleString()} RON</span></span>
                  </div>
                </div>
              )}
              
              {(viewingDetails.conditiiComerciale || viewingDetails.observatii) && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {viewingDetails.conditiiComerciale && (
                    <div className="border rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Condiții comerciale:</p>
                      <p>{viewingDetails.conditiiComerciale}</p>
                    </div>
                  )}
                  {viewingDetails.observatii && (
                    <div className="border rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Observații:</p>
                      <p>{viewingDetails.observatii}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-wrap gap-1 pt-2">
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-1" />Duplichează
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-1" />Trimite pe email
            </Button>
            {viewingDetails?.tip === "oferta" && viewingDetails?.status === "Acceptat" && (
              <Button variant="outline" size="sm" onClick={handleGenerateContract}>
                <FileText className="w-4 h-4 mr-1" />Generează contract
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={() => { if (viewingDetails) { handleOpenEdit(viewingDetails); setViewingDetails(null); } }}>
              <Pencil className="w-4 h-4 mr-1" />Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { if (viewingDetails) { setDeleting(viewingDetails); setViewingDetails(null); } }}>
              <Trash2 className="w-4 h-4 mr-1" />Șterge
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setViewingDetails(null)}>Închide</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onOpenChange={setOpenAddEdit}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing 
                ? `Editează ${editing.tip === "oferta" ? "Ofertă" : "Contract"}` 
                : `Adaugă ${activeTab === "oferte" ? "Ofertă" : "Contract"} ${activeTab === "oferte" ? "Nouă" : "Nou"}`
              }
            </DialogTitle>
            <DialogDescription>Completează informațiile necesare.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={form.client} onValueChange={(v) => setForm({ ...form, client: v })}>
                  <SelectTrigger><SelectValue placeholder="Selectează client" /></SelectTrigger>
                  <SelectContent>
                    {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Proiect/Șantier</Label>
                <Input placeholder="Denumire proiect" value={form.proiect} onChange={(e) => setForm({ ...form, proiect: e.target.value })} />
              </div>
            </div>

            {/* Multiple Products Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Produse *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddProdus}>
                  <Plus className="w-4 h-4 mr-1" />Adaugă produs
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {form.produse.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Produs</Label>
                      <Select value={item.produs} onValueChange={(v) => handleProdusChange(index, "produs", v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Selectează" /></SelectTrigger>
                        <SelectContent>
                          {produse.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs">Preț (RON)</Label>
                      <Input 
                        type="number" 
                        className="h-9"
                        value={item.pret} 
                        onChange={(e) => handleProdusChange(index, "pret", Number(e.target.value))} 
                      />
                    </div>
                    {form.produse.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveProdus(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Pricing Section */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <Label className="text-base font-medium">Preț Transport</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Preț chirie transport (RON)</Label>
                  <Input 
                    type="number" 
                    className="h-9"
                    placeholder="ex: 1500"
                    value={form.transport.pretInchiriere || ""} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      transport: { 
                        ...form.transport, 
                        tipTransport: e.target.value ? "inchiriere" : form.transport.tipTransport,
                        pretInchiriere: Number(e.target.value),
                        pretTonaKm: e.target.value ? 0 : form.transport.pretTonaKm
                      } 
                    })} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Preț tonă/km (RON)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    className="h-9"
                    placeholder="ex: 0.85"
                    value={form.transport.pretTonaKm || ""} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      transport: { 
                        ...form.transport, 
                        tipTransport: e.target.value ? "tona_km" : form.transport.tipTransport,
                        pretTonaKm: Number(e.target.value),
                        pretInchiriere: e.target.value ? 0 : form.transport.pretInchiriere
                      } 
                    })} 
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Completează doar unul dintre cele două câmpuri de preț transport</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valabilitate (max 30 zile)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !form.valabilitate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.valabilitate || "Selectează data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.valabilitate ? (() => {
                        const parts = form.valabilitate.split('/');
                        if (parts.length === 3) {
                          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                        }
                        return undefined;
                      })() : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setForm({ ...form, valabilitate: format(date, 'dd/MM/yyyy') });
                        }
                      }}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      initialFocus
                      locale={ro}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Termen plată (zile)</Label>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="ex: 30"
                  value={form.termenPlata.replace(' zile', '')} 
                  onChange={(e) => setForm({ ...form, termenPlata: e.target.value ? `${e.target.value} zile` : '' })} 
                />
              </div>
            </div>
            {(activeTab === "contracte" || editing?.tip === "contract") && (
              <div className="space-y-2">
                <Label>Indexare combustibil</Label>
                <Input placeholder="ex: Ajustare trimestrială +/- 5%" value={form.indexareCombustibil} onChange={(e) => setForm({ ...form, indexareCombustibil: e.target.value })} />
              </div>
            )}

            {/* Garanție Section */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <Label className="text-base font-medium">Garanție</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Bilet de ordin / Cec (document scanat)</Label>
                  <input
                    type="file"
                    ref={biletOrdinRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, garantie: { ...form.garantie, biletOrdin: file } });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-start"
                    onClick={() => biletOrdinRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {form.garantie.biletOrdin ? form.garantie.biletOrdin.name : "Încarcă document"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Proces verbal predare-primire (document scanat)</Label>
                  <input
                    type="file"
                    ref={procesVerbalRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, garantie: { ...form.garantie, procesVerbal: file } });
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-start"
                    onClick={() => procesVerbalRef.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {form.garantie.procesVerbal ? form.garantie.procesVerbal.name : "Încarcă document"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Avans de plată */}
            <div className="space-y-2">
              <Label>Avans de plată (RON)</Label>
              <Input 
                type="number" 
                min="0"
                placeholder="ex: 5000"
                value={form.avansPlata || ""} 
                onChange={(e) => setForm({ ...form, avansPlata: Number(e.target.value) })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Observații</Label>
              <Textarea placeholder="Observații suplimentare..." value={form.observatii} onChange={(e) => setForm({ ...form, observatii: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)}>Anulează</Button>
            <Button onClick={handleSave}>{editing ? "Salvează" : "Adaugă"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Șterge</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OferteContracte;
