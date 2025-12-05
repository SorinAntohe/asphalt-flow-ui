import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardCheck, 
  Plus, 
  FileDown, 
  List, 
  LayoutGrid, 
  CalendarDays,
  Play,
  Pause,
  CheckCircle2,
  Package,
  Clock,
  User,
  Factory,
  FileText,
  Link2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  Pencil,
  Trash2
} from "lucide-react";
import CalendarProductie from "./CalendarProductie";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/api";

// Types
interface ProdusOrdin {
  produs: string;
  cantitate: number;
  reteta: string;
}

interface OrdinProductie {
  id: number;
  numar: string;
  produse: ProdusOrdin[];
  cantitateTotala: number;
  unitateMasura: string;
  startPlanificat: string;
  operator: string;
  sefSchimb: string;
  status: "Planificat" | "În lucru" | "Finalizat";
  observatii: string;
  consumEstimat: { material: string; cantitate: number; disponibil: number }[];
  rezervariStoc: { material: string; cantitate: number; dataRezervare: string }[];
  loturiAsociate: string[];
  atasamente: string[];
  comenziAsociate: string[];
}

// Types for API data
interface SefSchimb {
  id: number;
  nume: string;
}

interface Operator {
  id: number;
  nume: string;
}

// Types for estimare API response
interface EstimareMaterial {
  material: string;
  cantitate_originala: number;
  material_x1000: number;
  cantitate_cu_factor: number;
  stoc: number;
  diferenta: number;
  status: "OK" | "NOT OK";
}

interface EstimareResponse {
  status_general: "OK" | "NOT OK";
  materiale: EstimareMaterial[];
}

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }> = {
  "Planificat": { variant: "secondary", icon: <Clock className="h-3 w-3" />, color: "bg-amber-500 text-white" },
  "În lucru": { variant: "default", icon: <Play className="h-3 w-3" />, color: "bg-blue-500 text-white" },
  "Finalizat": { variant: "outline", icon: <CheckCircle2 className="h-3 w-3" />, color: "bg-emerald-500 text-white" }
};

// Mock data for display
const mockOrdine: OrdinProductie[] = [
  {
    id: 1,
    numar: "OP-2024-001",
    produse: [
      { produs: "BA16 - Beton Asfaltic", cantitate: 300, reteta: "R001 - Rețetă BA16" },
      { produs: "MASF16 - Mixtură Asfaltică", cantitate: 200, reteta: "R002 - Rețetă MASF16" }
    ],
    cantitateTotala: 500,
    unitateMasura: "tone",
    startPlanificat: "15/01/2024 08:00",
    operator: "Ion Popescu",
    sefSchimb: "Gheorghe Ionescu",
    status: "În lucru" as const,
    observatii: "Comandă urgentă pentru autostradă",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 25, disponibil: 100 },
      { material: "Agregat 0/4", cantitate: 200, disponibil: 250 },
      { material: "Agregat 4/8", cantitate: 150, disponibil: 180 },
      { material: "Filler", cantitate: 40, disponibil: 60 }
    ],
    rezervariStoc: [],
    loturiAsociate: ["LOT-001", "LOT-002"],
    atasamente: [],
    comenziAsociate: ["CMD-2024-001"]
  },
  {
    id: 2,
    numar: "OP-2024-002",
    produse: [
      { produs: "MASF16 - Mixtură Asfaltică", cantitate: 300, reteta: "R002 - Rețetă MASF16" }
    ],
    cantitateTotala: 300,
    unitateMasura: "tone",
    startPlanificat: "15/01/2024 14:00",
    operator: "Maria Dumitrescu",
    sefSchimb: "Gheorghe Ionescu",
    status: "Planificat" as const,
    observatii: "",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 15, disponibil: 100 },
      { material: "Agregat 0/4", cantitate: 120, disponibil: 250 },
      { material: "Agregat 4/8", cantitate: 90, disponibil: 180 },
      { material: "Filler", cantitate: 24, disponibil: 60 }
    ],
    rezervariStoc: [],
    loturiAsociate: [],
    atasamente: [],
    comenziAsociate: ["CMD-2024-003"]
  },
  {
    id: 3,
    numar: "OP-2024-003",
    produse: [
      { produs: "BSC - Beton Stabilizat", cantitate: 500, reteta: "R003 - Rețetă BSC" }
    ],
    cantitateTotala: 500,
    unitateMasura: "tone",
    startPlanificat: "16/01/2024 06:00",
    operator: "Andrei Vasilescu",
    sefSchimb: "Mihai Constantinescu",
    status: "Planificat" as const,
    observatii: "Așteaptă aprobare tehnică",
    consumEstimat: [
      { material: "Ciment", cantitate: 75, disponibil: 200 },
      { material: "Nisip", cantitate: 250, disponibil: 400 },
      { material: "Pietriș", cantitate: 175, disponibil: 300 }
    ],
    rezervariStoc: [],
    loturiAsociate: [],
    atasamente: [],
    comenziAsociate: []
  },
  {
    id: 4,
    numar: "OP-2024-004",
    produse: [
      { produs: "BA16 - Beton Asfaltic", cantitate: 250, reteta: "R001 - Rețetă BA16" }
    ],
    cantitateTotala: 250,
    unitateMasura: "tone",
    startPlanificat: "14/01/2024 08:00",
    operator: "Elena Stanciu",
    sefSchimb: "Gheorghe Ionescu",
    status: "Finalizat" as const,
    observatii: "Finalizat conform planului",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 12.5, disponibil: 100 },
      { material: "Agregat 0/4", cantitate: 100, disponibil: 250 },
      { material: "Agregat 4/8", cantitate: 75, disponibil: 180 },
      { material: "Filler", cantitate: 20, disponibil: 60 }
    ],
    rezervariStoc: [],
    loturiAsociate: ["LOT-003", "LOT-004"],
    atasamente: [],
    comenziAsociate: ["CMD-2024-004"]
  }
];

const OrdineProductie = () => {
  const navigate = useNavigate();
  const [ordine, setOrdine] = useState<OrdinProductie[]>(mockOrdine);
  const [activeView, setActiveView] = useState<"list" | "kanban" | "calendar">("list");
  const [selectedOrdin, setSelectedOrdin] = useState<OrdinProductie | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Estimare data state
  const [estimareData, setEstimareData] = useState<EstimareResponse | null>(null);
  const [estimareLoading, setEstimareLoading] = useState(false);

  // API data states
  const [operatori, setOperatori] = useState<Operator[]>([]);
  const [sefiSchimb, setSefiSchimb] = useState<SefSchimb[]>([]);
  const [produseFinite, setProduseFinite] = useState<string[]>([]);
  const [retete, setRetete] = useState<string[]>([]);
  const [comenziDisponibile, setComenziDisponibile] = useState<string[]>([]);

  // Fetch operatori and sefi schimb
  useEffect(() => {
    const fetchOperatori = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/operator`);
        if (response.ok) {
          const data = await response.json();
          setOperatori(data);
        }
      } catch (error) {
        console.error("Error fetching operatori:", error);
      }
    };

    const fetchSefiSchimb = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/sefi_schimb`);
        if (response.ok) {
          const data = await response.json();
          setSefiSchimb(data);
        }
      } catch (error) {
        console.error("Error fetching sefi schimb:", error);
      }
    };

    const fetchProduseFinite = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/returneaza_produse_finite`);
        if (response.ok) {
          const data = await response.json();
          setProduseFinite(data.map((p: { produs: string }) => p.produs).filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching produse finite:", error);
      }
    };

    const fetchRetete = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
        if (response.ok) {
          const data = await response.json();
          setRetete(data.map((r: { cod_reteta: string; denumire: string }) => `${r.cod_reteta} - ${r.denumire}`));
        }
      } catch (error) {
        console.error("Error fetching retete:", error);
      }
    };

    const fetchComenzi = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/comercial/returneaza/comenzi_client`);
        if (response.ok) {
          const data = await response.json();
          setComenziDisponibile(data.map((c: { cod: string }) => c.cod));
        }
      } catch (error) {
        console.error("Error fetching comenzi:", error);
      }
    };

    fetchOperatori();
    fetchSefiSchimb();
    fetchProduseFinite();
    fetchRetete();
    fetchComenzi();
  }, []);

  // Fetch estimare when detail dialog opens
  useEffect(() => {
    const fetchEstimare = async () => {
      if (!detailDialogOpen || !selectedOrdin) {
        setEstimareData(null);
        return;
      }

      // Get cod_reteta and cantitate from first product (or iterate all)
      // For now, aggregate all products
      setEstimareLoading(true);
      try {
        const allMateriale: EstimareMaterial[] = [];
        let statusGeneral: "OK" | "NOT OK" = "OK";

        for (const produs of selectedOrdin.produse) {
          // Extract cod_reteta from reteta string (format: "R001 - Rețetă BA16")
          const codReteta = produs.reteta.split(" - ")[0];
          const cantitate = produs.cantitate;

          if (codReteta && cantitate > 0) {
            const response = await fetch(
              `${API_BASE_URL}/productie/returneaza/estimare/${codReteta}/${cantitate}`
            );
            if (response.ok) {
              const data: EstimareResponse = await response.json();
              if (data.status_general === "NOT OK") {
                statusGeneral = "NOT OK";
              }
              allMateriale.push(...data.materiale);
            }
          }
        }

        setEstimareData({
          status_general: statusGeneral,
          materiale: allMateriale
        });
      } catch (error) {
        console.error("Error fetching estimare:", error);
        setEstimareData(null);
      } finally {
        setEstimareLoading(false);
      }
    };

    fetchEstimare();
  }, [detailDialogOpen, selectedOrdin]);

  // Filters
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Wizard form state
  const [wizardForm, setWizardForm] = useState<{
    produse: { produs: string; cantitate: string; reteta: string }[];
    unitateMasura: string;
    startPlanificat: string;
    operator: string;
    sefSchimb: string;
    observatii: string;
    comenziAsociate: string[];
  }>({
    produse: [{ produs: "", cantitate: "", reteta: "" }],
    unitateMasura: "tone",
    startPlanificat: "",
    operator: "",
    sefSchimb: "",
    observatii: "",
    comenziAsociate: []
  });

  // Stats
  const stats = useMemo(() => {
    const total = ordine.length;
    const inLucru = ordine.filter(o => o.status === "În lucru").length;
    const planificate = ordine.filter(o => o.status === "Planificat").length;
    const cantitateTotal = ordine.filter(o => o.status !== "Finalizat").reduce((sum, o) => sum + o.cantitateTotala, 0);
    return { total, inLucru, planificate, cantitateTotal };
  }, [ordine]);

  // Filter and sort
  const filteredOrdine = useMemo(() => {
    let result = [...ordine];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = String(item[key as keyof OrdinProductie] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof OrdinProductie];
        const bVal = b[sortKey as keyof OrdinProductie];
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [ordine, filters, sortKey, sortDirection]);

  const paginatedOrdine = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrdine.slice(start, start + itemsPerPage);
  }, [filteredOrdine, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrdine.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const exportData = ordine.map(o => ({
      numar: o.numar,
      produse: o.produse.map(p => `${p.produs} (${p.cantitate}t - ${p.reteta})`).join("; "),
      cantitateTotala: o.cantitateTotala,
      unitateMasura: o.unitateMasura,
      startPlanificat: o.startPlanificat,
      operator: o.operator,
      sefSchimb: o.sefSchimb,
      status: o.status,
      observatii: o.observatii
    }));
    exportToCSV(exportData, "ordine_productie", [
      { key: "numar", label: "Nr." },
      { key: "produse", label: "Produse" },
      { key: "cantitateTotala", label: "Cantitate Totală" },
      { key: "startPlanificat", label: "Start Planificat" },
      { key: "operator", label: "Operator" },
      { key: "sefSchimb", label: "Șef Schimb" },
      { key: "status", label: "Status" },
      { key: "observatii", label: "Observații" }
    ]);
    toast.success("Export CSV realizat cu succes");
  };

  const handleRowClick = (ordin: OrdinProductie) => {
    setSelectedOrdin(ordin);
    setDetailDialogOpen(true);
  };

  const handlePlanifica = (ordin: OrdinProductie) => {
    setOrdine(prev => prev.map(o => 
      o.id === ordin.id ? { ...o, status: "Planificat" as const } : o
    ));
    toast.success(`Ordinul ${ordin.numar} a fost planificat`);
    setDetailDialogOpen(false);
  };

  const handleRezervaStoc = (ordin: OrdinProductie) => {
    toast.success(`Stocul a fost rezervat pentru ${ordin.numar}`);
  };

  const handleInchideOrdin = (ordin: OrdinProductie) => {
    setOrdine(prev => prev.map(o => 
      o.id === ordin.id ? { ...o, status: "Finalizat" as const } : o
    ));
    toast.success(`Ordinul ${ordin.numar} a fost finalizat`);
    setDetailDialogOpen(false);
  };

  const handleOpenEdit = (ordin: OrdinProductie) => {
    setWizardForm({
      produse: ordin.produse.map(p => ({
        produs: p.produs,
        cantitate: String(p.cantitate),
        reteta: p.reteta
      })),
      unitateMasura: ordin.unitateMasura,
      startPlanificat: ordin.startPlanificat,
      operator: ordin.operator,
      sefSchimb: ordin.sefSchimb,
      observatii: ordin.observatii,
      comenziAsociate: ordin.comenziAsociate
    });
    setDetailDialogOpen(false);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedOrdin) return;
    
    const validProduse = wizardForm.produse.filter(p => p.produs && p.cantitate && p.reteta);
    if (validProduse.length === 0) {
      toast.error("Adăugați cel puțin un produs cu cantitate și rețetă");
      return;
    }

    setOrdine(prev => prev.map(o => 
      o.id === selectedOrdin.id ? {
        ...o,
        produse: validProduse.map(p => ({
          produs: p.produs,
          cantitate: parseFloat(p.cantitate) || 0,
          reteta: p.reteta
        })),
        cantitateTotala: validProduse.reduce((sum, p) => sum + (parseFloat(p.cantitate) || 0), 0),
        unitateMasura: wizardForm.unitateMasura,
        startPlanificat: wizardForm.startPlanificat,
        operator: wizardForm.operator,
        sefSchimb: wizardForm.sefSchimb,
        observatii: wizardForm.observatii,
        comenziAsociate: wizardForm.comenziAsociate
      } : o
    ));
    
    toast.success(`Ordinul ${selectedOrdin.numar} a fost actualizat`);
    setEditDialogOpen(false);
    resetWizardForm();
  };

  const handleDelete = () => {
    if (!selectedOrdin) return;
    setOrdine(prev => prev.filter(o => o.id !== selectedOrdin.id));
    toast.success(`Ordinul ${selectedOrdin.numar} a fost șters`);
    setDeleteDialogOpen(false);
    setDetailDialogOpen(false);
    setSelectedOrdin(null);
  };

  const resetWizardForm = () => {
    setWizardForm({
      produse: [{ produs: "", cantitate: "", reteta: "" }],
      unitateMasura: "tone",
      startPlanificat: "",
      operator: "",
      sefSchimb: "",
      observatii: "",
      comenziAsociate: []
    });
  };

  // Wizard helpers
  const addProdus = () => {
    setWizardForm(prev => ({
      ...prev,
      produse: [...prev.produse, { produs: "", cantitate: "", reteta: "" }]
    }));
  };

  const removeProdus = (index: number) => {
    if (wizardForm.produse.length > 1) {
      setWizardForm(prev => ({
        ...prev,
        produse: prev.produse.filter((_, i) => i !== index)
      }));
    }
  };

  const updateProdus = (index: number, field: string, value: string) => {
    setWizardForm(prev => ({
      ...prev,
      produse: prev.produse.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const cantitateTotalaForm = useMemo(() => {
    return wizardForm.produse.reduce((sum, p) => sum + (parseFloat(p.cantitate) || 0), 0);
  }, [wizardForm.produse]);

  const handleWizardNext = async () => {
    if (wizardStep < 2) {
      setWizardStep(wizardStep + 1);
    } else {
      // Submit to API
      const validProduse = wizardForm.produse.filter(p => p.produs && p.cantitate && p.reteta);
      if (validProduse.length === 0) {
        toast.error("Adăugați cel puțin un produs cu cantitate și rețetă");
        return;
      }

      // Format date from datetime-local to dd/mm/yyyy HH:mm
      const formatDateForApi = (dateTimeLocal: string) => {
        if (!dateTimeLocal) return "";
        const date = new Date(dateTimeLocal);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };

      // Prepare API payload - comma-separated values
      const payload = {
        produse: validProduse.map(p => p.produs).join(","),
        cantitati: validProduse.map(p => p.cantitate).join(","),
        retete: validProduse.map(p => p.reteta).join(","),
        masa_totala: String(validProduse.reduce((sum, p) => sum + (parseFloat(p.cantitate) || 0), 0)),
        start_planificat: formatDateForApi(wizardForm.startPlanificat),
        unitate_masura: wizardForm.unitateMasura,
        operator: wizardForm.operator,
        sef_schimb: wizardForm.sefSchimb,
        comenzi_asociate: wizardForm.comenziAsociate.join(","),
        observatii: wizardForm.observatii || ""
      };

      try {
        const response = await fetch(`${API_BASE_URL}/productie/adauga/ordine`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("Eroare la adăugarea ordinului");
        }

        const result = await response.json();
        
        // Add to local state with the generated code
        const newOrdin: OrdinProductie = {
          id: ordine.length + 1,
          numar: result.cod_ordin || `OP-${Date.now()}`,
          produse: validProduse.map(p => ({
            produs: p.produs,
            cantitate: parseFloat(p.cantitate) || 0,
            reteta: p.reteta
          })),
          cantitateTotala: validProduse.reduce((sum, p) => sum + (parseFloat(p.cantitate) || 0), 0),
          unitateMasura: wizardForm.unitateMasura,
          startPlanificat: formatDateForApi(wizardForm.startPlanificat),
          operator: wizardForm.operator,
          sefSchimb: wizardForm.sefSchimb,
          status: "Planificat" as const,
          observatii: wizardForm.observatii,
          consumEstimat: [],
          rezervariStoc: [],
          loturiAsociate: [],
          atasamente: [],
          comenziAsociate: wizardForm.comenziAsociate
        };
        
        setOrdine(prev => [...prev, newOrdin]);
        toast.success(`Ordinul ${result.cod_ordin} a fost creat cu succes`);
        setWizardOpen(false);
        setWizardStep(1);
        setWizardForm({
          produse: [{ produs: "", cantitate: "", reteta: "" }],
          unitateMasura: "tone",
          startPlanificat: "",
          operator: "",
          sefSchimb: "",
          observatii: "",
          comenziAsociate: []
        });
      } catch (error) {
        console.error("Error adding order:", error);
        toast.error("Eroare la adăugarea ordinului de producție");
      }
    }
  };

  // Kanban grouped data
  const kanbanColumns = useMemo(() => {
    const statuses = ["Planificat", "În lucru", "Finalizat"] as const;
    return statuses.map(status => ({
      status,
      items: ordine.filter(o => o.status === status)
    }));
  }, [ordine]);

  // Helper to format products for display
  const formatProduseDisplay = (produse: ProdusOrdin[]) => {
    if (produse.length === 1) {
      return produse[0].produs;
    }
    return `${produse.length} produse`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardCheck className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ordine de Producție</h1>
            <p className="text-muted-foreground">Planificare și urmărire ordine de producție</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={ordine.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setWizardOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Lansează Ordin
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ordine</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ClipboardCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">În Lucru</p>
                <p className="text-2xl font-bold text-primary">{stats.inLucru}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Play className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planificate</p>
                <p className="text-2xl font-bold">{stats.planificate}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as typeof activeView)}>
        <TabsList>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Listă
          </TabsTrigger>
          <TabsTrigger value="kanban" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Nr."
                          sortKey="numar"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.numar || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("numar", value)}
                        />
                      </TableHead>
                      <TableHead>Produse</TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Masă Totală"
                          sortKey="cantitateTotala"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.cantitateTotala || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("cantitateTotala", value)}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Start Planificat"
                          sortKey="startPlanificat"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.startPlanificat || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("startPlanificat", value)}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Operator"
                          sortKey="operator"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.operator || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("operator", value)}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Status"
                          sortKey="status"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.status || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("status", value)}
                        />
                      </TableHead>
                      <TableHead>Observații</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedOrdine.length === 0 ? (
                      <DataTableEmpty colSpan={7} message="Nu există ordine de producție" />
                    ) : (
                      paginatedOrdine.map((ordin) => (
                        <TableRow
                          key={ordin.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(ordin)}
                        >
                          <TableCell className="font-medium">{ordin.numar}</TableCell>
                          <TableCell className="max-w-[200px]">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="truncate text-xs cursor-help">
                                    <span className="font-medium">{ordin.produse[0]?.produs}</span>
                                    {ordin.produse.length > 1 && (
                                      <span className="text-muted-foreground"> +{ordin.produse.length - 1}</span>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-xs">
                                  <div className="space-y-1">
                                    {ordin.produse.map((p, idx) => (
                                      <div key={idx} className="text-xs">
                                        <span className="font-medium">{p.produs}</span>
                                        <span className="text-muted-foreground"> - {p.cantitate}t ({p.reteta})</span>
                                      </div>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="font-semibold">{ordin.cantitateTotala} {ordin.unitateMasura}</TableCell>
                          <TableCell>{ordin.startPlanificat}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{ordin.operator}</span>
                              <span className="text-xs text-muted-foreground">{ordin.sefSchimb}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[ordin.status].variant} className="gap-1">
                              {statusConfig[ordin.status].icon}
                              {ordin.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{ordin.observatii || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="p-4 border-t">
                <DataTablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredOrdine.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanColumns.map((column) => (
              <Card key={column.status} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {statusConfig[column.status].icon}
                      {column.status}
                    </CardTitle>
                    <Badge variant="secondary">{column.items.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ScrollArea className="h-[400px] pr-2">
                    <div className="space-y-2">
                      {column.items.map((ordin) => (
                        <Card
                          key={ordin.id}
                          className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleRowClick(ordin)}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-sm">{ordin.numar}</span>
                              <Badge variant="outline" className="text-xs">{ordin.cantitateTotala}t</Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {ordin.produse.map((p, idx) => (
                                <div key={idx}>{p.produs} ({p.cantitate}t)</div>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{ordin.startPlanificat.split(' ')[0]}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              {ordin.operator}
                            </div>
                          </div>
                        </Card>
                      ))}
                      {column.items.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          Niciun ordin
                        </p>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-4">
          <CalendarProductie ordine={ordine} />
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          {selectedOrdin && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    {selectedOrdin.numar}
                    <Badge variant={statusConfig[selectedOrdin.status].variant} className="ml-2">
                      {statusConfig[selectedOrdin.status].icon}
                      {selectedOrdin.status}
                    </Badge>
                  </DialogTitle>
                </div>
                <DialogDescription>
                  Detalii ordin de producție
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Produse */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Produse</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produs</TableHead>
                        <TableHead>Cantitate</TableHead>
                        <TableHead>Rețetă</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrdin.produse.map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{p.produs}</TableCell>
                          <TableCell>{p.cantitate} {selectedOrdin.unitateMasura}</TableCell>
                          <TableCell>{p.reteta}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-bold">TOTAL</TableCell>
                        <TableCell className="font-bold">{selectedOrdin.cantitateTotala} {selectedOrdin.unitateMasura}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Start Planificat</Label>
                    <p className="font-medium">{selectedOrdin.startPlanificat}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Operator</Label>
                    <p className="font-medium">{selectedOrdin.operator}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Șef Schimb</Label>
                    <p className="font-medium">{selectedOrdin.sefSchimb}</p>
                  </div>
                  {selectedOrdin.observatii && (
                    <div className="space-y-1 col-span-2">
                      <Label className="text-muted-foreground text-xs">Observații</Label>
                      <p>{selectedOrdin.observatii}</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Consum Estimat */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Consum Estimat Materii Prime</h4>
                    {estimareData && (
                      <Badge 
                        variant={estimareData.status_general === "OK" ? "outline" : "destructive"}
                        className={estimareData.status_general === "OK" ? "bg-green-500/10 text-green-600" : ""}
                      >
                        {estimareData.status_general === "OK" ? "Stoc Suficient" : "Stoc Insuficient"}
                      </Badge>
                    )}
                  </div>
                  {estimareLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-sm text-muted-foreground">Se încarcă estimarea...</span>
                    </div>
                  ) : estimareData && estimareData.materiale.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead className="text-right">Necesar</TableHead>
                          <TableHead className="text-right">Stoc</TableHead>
                          <TableHead className="text-right">Diferență</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {estimareData.materiale.map((m, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{m.material}</TableCell>
                            <TableCell className="text-right">{m.cantitate_cu_factor.toLocaleString('ro-RO')} kg</TableCell>
                            <TableCell className="text-right">{m.stoc.toLocaleString('ro-RO')} kg</TableCell>
                            <TableCell className={`text-right font-medium ${m.diferenta < 0 ? 'text-destructive' : 'text-green-600'}`}>
                              {m.diferenta.toLocaleString('ro-RO')} kg
                            </TableCell>
                            <TableCell>
                              {m.status === "OK" ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-600">OK</Badge>
                              ) : (
                                <Badge variant="destructive">Insuficient</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-sm text-muted-foreground">Nu există date de consum estimat</p>
                  )}
                </div>

                {/* Comenzi Asociate */}
                {selectedOrdin.comenziAsociate.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Comenzi Asociate</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrdin.comenziAsociate.map((cmd) => (
                        <Badge 
                          key={cmd} 
                          variant="secondary" 
                          className="gap-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => {
                            setDetailDialogOpen(false);
                            navigate(`/comenzi?tab=materie-prima&open=${cmd}`);
                          }}
                        >
                          <FileText className="h-3 w-3" />
                          {cmd}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                <div className="flex flex-wrap gap-2">
                  {selectedOrdin.status === "Planificat" && (
                    <Button size="sm" onClick={() => {
                      setOrdine(prev => prev.map(o => 
                        o.id === selectedOrdin.id ? { ...o, status: "În lucru" as const } : o
                      ));
                      toast.success(`Ordinul ${selectedOrdin.numar} a fost pornit`);
                      setDetailDialogOpen(false);
                    }}>
                      <Play className="h-4 w-4 mr-1" />
                      Pornește
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleOpenEdit(selectedOrdin)}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Editează
                  </Button>
                  {selectedOrdin.status === "În lucru" && (
                    <Button size="sm" variant="outline" onClick={() => handleInchideOrdin(selectedOrdin)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Închide
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Șterge
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Wizard Dialog */}
      <Dialog open={wizardOpen} onOpenChange={(open) => {
        setWizardOpen(open);
        if (!open) setWizardStep(1);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Lansează Ordin de Producție</DialogTitle>
            <DialogDescription>
              Pasul {wizardStep} din 2: {wizardStep === 1 ? "Produse și Cantități" : "Confirmare"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === wizardStep ? "bg-primary text-primary-foreground" : 
                  step < wizardStep ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {step}
                </div>
                {step < 2 && <div className={`w-12 h-0.5 ${step < wizardStep ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Produse și Cantități */}
          {wizardStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Produse Finite *</Label>
                <Button variant="outline" size="sm" onClick={addProdus}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă Produs
                </Button>
              </div>
              
              <div className="space-y-3">
                {wizardForm.produse.map((item, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Produs {index + 1}</span>
                      {wizardForm.produse.length > 1 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeProdus(index)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Produs Finit</Label>
                        <Select value={item.produs} onValueChange={(v) => updateProdus(index, "produs", v)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selectează" />
                          </SelectTrigger>
                          <SelectContent>
                            {produseFinite.map((p) => (
                              <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Cantitate (tone)</Label>
                        <Input
                          type="number"
                          className="h-9"
                          placeholder="Ex: 100"
                          value={item.cantitate}
                          onChange={(e) => updateProdus(index, "cantitate", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rețetă</Label>
                        <Select value={item.reteta} onValueChange={(v) => updateProdus(index, "reteta", v)}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Selectează" />
                          </SelectTrigger>
                          <SelectContent>
                            {retete.map((r) => (
                              <SelectItem key={r} value={r}>{r}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Masă Totală:</span>
                  <span className="text-xl font-bold">{cantitateTotalaForm} tone</span>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Planificat *</Label>
                  <Input
                    type="datetime-local"
                    value={wizardForm.startPlanificat}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, startPlanificat: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Unitate măsură</Label>
                  <Select value={wizardForm.unitateMasura} onValueChange={(v) => setWizardForm(prev => ({ ...prev, unitateMasura: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tone">Tone</SelectItem>
                      <SelectItem value="mc">m³</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Operator</Label>
                  <Select value={wizardForm.operator} onValueChange={(v) => setWizardForm(prev => ({ ...prev, operator: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează operator" />
                    </SelectTrigger>
                    <SelectContent>
                      {operatori.map((o) => (
                        <SelectItem key={o.id} value={o.nume}>{o.nume}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Șef Schimb</Label>
                  <Select value={wizardForm.sefSchimb} onValueChange={(v) => setWizardForm(prev => ({ ...prev, sefSchimb: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selectează șef schimb" />
                    </SelectTrigger>
                    <SelectContent>
                      {sefiSchimb.map((s) => (
                        <SelectItem key={s.id} value={s.nume}>{s.nume}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Comenzi Asociate</Label>
                  <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md min-h-[40px]">
                    {wizardForm.comenziAsociate.map((cmd) => (
                      <Badge key={cmd} variant="secondary" className="gap-1">
                        {cmd}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => setWizardForm(prev => ({
                            ...prev,
                            comenziAsociate: prev.comenziAsociate.filter(c => c !== cmd)
                          }))}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Select onValueChange={(v) => {
                    if (!wizardForm.comenziAsociate.includes(v)) {
                      setWizardForm(prev => ({
                        ...prev,
                        comenziAsociate: [...prev.comenziAsociate, v]
                      }));
                    }
                  }}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Adaugă comandă..." />
                    </SelectTrigger>
                    <SelectContent>
                      {comenziDisponibile.filter(c => !wizardForm.comenziAsociate.includes(c)).map((cmd) => (
                        <SelectItem key={cmd} value={cmd}>{cmd}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Observații</Label>
                  <Textarea
                    value={wizardForm.observatii}
                    onChange={(e) => setWizardForm(prev => ({ ...prev, observatii: e.target.value }))}
                    placeholder="Observații suplimentare..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Confirmă */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Rezumat Ordin</h4>
                
                <div>
                  <Label className="text-xs text-muted-foreground">Produse:</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produs</TableHead>
                        <TableHead>Cantitate</TableHead>
                        <TableHead>Rețetă</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {wizardForm.produse.filter(p => p.produs && p.cantitate).map((p, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{p.produs}</TableCell>
                          <TableCell>{p.cantitate} {wizardForm.unitateMasura}</TableCell>
                          <TableCell>{p.reteta}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-bold bg-muted/30">
                        <TableCell>TOTAL</TableCell>
                        <TableCell>{cantitateTotalaForm} {wizardForm.unitateMasura}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Start:</span> {wizardForm.startPlanificat}</div>
                  <div><span className="text-muted-foreground">Operator:</span> {wizardForm.operator || "-"}</div>
                  <div><span className="text-muted-foreground">Șef Schimb:</span> {wizardForm.sefSchimb || "-"}</div>
                </div>
                {wizardForm.observatii && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Observații:</span> {wizardForm.observatii}
                  </div>
                )}
                {wizardForm.comenziAsociate.length > 0 && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Comenzi Asociate:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {wizardForm.comenziAsociate.map((cmd) => (
                        <Badge key={cmd} variant="secondary" className="text-xs">{cmd}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 p-3 bg-yellow-500/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Verificați datele înainte de confirmare. Ordinul va fi creat în status Planificat.</span>
              </div>
            </div>
          )}

          <DialogFooter>
            {wizardStep > 1 && (
              <Button variant="outline" onClick={() => setWizardStep(s => s - 1)}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Înapoi
              </Button>
            )}
            <Button onClick={handleWizardNext}>
              {wizardStep < 2 ? (
                <>
                  Continuă
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Creează Ordin
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) resetWizardForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Editează Ordin de Producție</DialogTitle>
            <DialogDescription>
              Modificați datele ordinului {selectedOrdin?.numar}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Produse */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Produse</Label>
                <Button variant="outline" size="sm" onClick={addProdus}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă Produs
                </Button>
              </div>
              {wizardForm.produse.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Produs {index + 1}</span>
                    {wizardForm.produse.length > 1 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeProdus(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Produs Finit</Label>
                      <Select value={item.produs} onValueChange={(v) => updateProdus(index, "produs", v)}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selectează" />
                        </SelectTrigger>
                        <SelectContent>
                          {produseFinite.map((p) => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Cantitate (tone)</Label>
                      <Input
                        type="number"
                        className="h-9"
                        placeholder="Ex: 100"
                        value={item.cantitate}
                        onChange={(e) => updateProdus(index, "cantitate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Rețetă</Label>
                      <Select value={item.reteta} onValueChange={(v) => updateProdus(index, "reteta", v)}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selectează" />
                        </SelectTrigger>
                        <SelectContent>
                          {retete.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Masă Totală:</span>
                <span className="text-xl font-bold">{cantitateTotalaForm} tone</span>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Planificat</Label>
                <Input
                  type="datetime-local"
                  value={wizardForm.startPlanificat}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, startPlanificat: e.target.value }))}
                />
              </div>
              <div>
                <Label>Unitate măsură</Label>
                <Select value={wizardForm.unitateMasura} onValueChange={(v) => setWizardForm(prev => ({ ...prev, unitateMasura: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tone">Tone</SelectItem>
                    <SelectItem value="mc">m³</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Operator</Label>
                <Select value={wizardForm.operator} onValueChange={(v) => setWizardForm(prev => ({ ...prev, operator: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operatori.map((o) => (
                      <SelectItem key={o.id} value={o.nume}>{o.nume}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Șef Schimb</Label>
                <Select value={wizardForm.sefSchimb} onValueChange={(v) => setWizardForm(prev => ({ ...prev, sefSchimb: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează șef schimb" />
                  </SelectTrigger>
                  <SelectContent>
                    {sefiSchimb.map((s) => (
                      <SelectItem key={s.id} value={s.nume}>{s.nume}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Comenzi Asociate</Label>
                <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md min-h-[40px]">
                  {wizardForm.comenziAsociate.map((cmd) => (
                    <Badge key={cmd} variant="secondary" className="gap-1">
                      {cmd}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => setWizardForm(prev => ({
                          ...prev,
                          comenziAsociate: prev.comenziAsociate.filter(c => c !== cmd)
                        }))}
                      />
                    </Badge>
                  ))}
                </div>
                <Select onValueChange={(v) => {
                  if (!wizardForm.comenziAsociate.includes(v)) {
                    setWizardForm(prev => ({
                      ...prev,
                      comenziAsociate: [...prev.comenziAsociate, v]
                    }));
                  }
                }}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Adaugă comandă..." />
                  </SelectTrigger>
                  <SelectContent>
                    {comenziDisponibile.filter(c => !wizardForm.comenziAsociate.includes(c)).map((cmd) => (
                      <SelectItem key={cmd} value={cmd}>{cmd}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Observații</Label>
                <Textarea
                  value={wizardForm.observatii}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, observatii: e.target.value }))}
                  placeholder="Observații suplimentare..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditDialogOpen(false);
              resetWizardForm();
            }}>
              Anulează
            </Button>
            <Button onClick={handleSaveEdit}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmați ștergerea</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteți sigur că doriți să ștergeți ordinul {selectedOrdin?.numar}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default OrdineProductie;
