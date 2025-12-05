import { useState, useMemo } from "react";
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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  status: "Draft" | "Planificată" | "În lucru" | "Închisă";
  observatii: string;
  consumEstimat: { material: string; cantitate: number; disponibil: number }[];
  rezervariStoc: { material: string; cantitate: number; dataRezervare: string }[];
  loturiAsociate: string[];
  atasamente: string[];
  comenziAsociate: string[];
}

// Mock data
const mockOrdine: OrdinProductie[] = [
  {
    id: 1,
    numar: "OP-2024-001",
    produse: [
      { produs: "BA16 - Beton Asfaltic", cantitate: 300, reteta: "Rețetă BA16 Standard" },
      { produs: "MASF16 - Mixtură Asfaltică", cantitate: 200, reteta: "Rețetă MASF16 Premium" }
    ],
    cantitateTotala: 500,
    unitateMasura: "tone",
    startPlanificat: "15/01/2024 08:00",
    operator: "Ion Popescu",
    sefSchimb: "Gheorghe Ionescu",
    status: "În lucru",
    observatii: "Comandă urgentă pentru autostradă",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 25, disponibil: 100 },
      { material: "Agregat 0/4", cantitate: 200, disponibil: 180 },
      { material: "Filler", cantitate: 30, disponibil: 50 }
    ],
    rezervariStoc: [
      { material: "Bitum 50/70", cantitate: 25, dataRezervare: "14/01/2024" },
      { material: "Filler", cantitate: 30, dataRezervare: "14/01/2024" }
    ],
    loturiAsociate: ["LOT-001", "LOT-002"],
    atasamente: ["specificatie_tehnica.pdf", "plan_calitate.pdf"],
    comenziAsociate: ["CMD-2024-001", "CMD-2024-002"]
  },
  {
    id: 2,
    numar: "OP-2024-002",
    produse: [
      { produs: "MASF16 - Mixtură Asfaltică", cantitate: 300, reteta: "Rețetă MASF16 Standard" }
    ],
    cantitateTotala: 300,
    unitateMasura: "tone",
    startPlanificat: "15/01/2024 14:00",
    operator: "Maria Dumitrescu",
    sefSchimb: "Gheorghe Ionescu",
    status: "Planificată",
    observatii: "",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 18, disponibil: 75 },
      { material: "Agregat 4/8", cantitate: 120, disponibil: 200 }
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
      { produs: "BSC - Beton Stabilizat", cantitate: 500, reteta: "Rețetă BSC Standard" },
      { produs: "AB2 - Anrobat Bituminos", cantitate: 300, reteta: "Rețetă AB2 Premium" }
    ],
    cantitateTotala: 800,
    unitateMasura: "tone",
    startPlanificat: "16/01/2024 06:00",
    operator: "Andrei Vasilescu",
    sefSchimb: "Mihai Constantinescu",
    status: "Draft",
    observatii: "Așteaptă aprobare tehnică",
    consumEstimat: [
      { material: "Ciment", cantitate: 40, disponibil: 60 },
      { material: "Agregat 0/4", cantitate: 400, disponibil: 180 }
    ],
    rezervariStoc: [],
    loturiAsociate: [],
    atasamente: ["caiet_sarcini.pdf"],
    comenziAsociate: []
  },
  {
    id: 4,
    numar: "OP-2024-004",
    produse: [
      { produs: "BA16 - Beton Asfaltic", cantitate: 250, reteta: "Rețetă BA16 Standard" }
    ],
    cantitateTotala: 250,
    unitateMasura: "tone",
    startPlanificat: "14/01/2024 08:00",
    operator: "Elena Stanciu",
    sefSchimb: "Gheorghe Ionescu",
    status: "Închisă",
    observatii: "Finalizat conform planului",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 12.5, disponibil: 0 },
      { material: "Agregat 0/4", cantitate: 100, disponibil: 0 }
    ],
    rezervariStoc: [],
    loturiAsociate: ["LOT-003", "LOT-004", "LOT-005"],
    atasamente: ["raport_final.pdf"],
    comenziAsociate: ["CMD-2024-004"]
  }
];

const mockComenzi = [
  "CMD-2024-001",
  "CMD-2024-002", 
  "CMD-2024-003",
  "CMD-2024-004",
  "CMD-2024-005",
  "CMD-2024-006"
];

const mockRetete = [
  "Rețetă BA16 Standard",
  "Rețetă BA16 Premium",
  "Rețetă MASF16 Standard",
  "Rețetă MASF16 Premium",
  "Rețetă BSC Standard",
  "Rețetă AB2 Premium"
];
const mockProduseFinite = ["BA16 - Beton Asfaltic", "MASF16 - Mixtură Asfaltică", "BSC - Beton Stabilizat", "AB2 - Anrobat Bituminos"];
const mockOperatori = ["Ion Popescu", "Maria Dumitrescu", "Andrei Vasilescu", "Elena Stanciu"];
const mockSefiSchimb = ["Gheorghe Ionescu", "Mihai Constantinescu"];

const statusConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode }> = {
  "Draft": { variant: "secondary", icon: <FileText className="h-3 w-3" /> },
  "Planificată": { variant: "outline", icon: <Clock className="h-3 w-3" /> },
  "În lucru": { variant: "default", icon: <Play className="h-3 w-3" /> },
  "Închisă": { variant: "destructive", icon: <CheckCircle2 className="h-3 w-3" /> }
};

const OrdineProductie = () => {
  const [ordine, setOrdine] = useState<OrdinProductie[]>(mockOrdine);
  const [activeView, setActiveView] = useState<"list" | "kanban" | "calendar">("list");
  const [selectedOrdin, setSelectedOrdin] = useState<OrdinProductie | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

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

  // Calendar state
  const [calendarWeek, setCalendarWeek] = useState(0);

  // Stats
  const stats = useMemo(() => {
    const total = ordine.length;
    const inLucru = ordine.filter(o => o.status === "În lucru").length;
    const planificate = ordine.filter(o => o.status === "Planificată").length;
    const cantitateTotal = ordine.filter(o => o.status !== "Închisă").reduce((sum, o) => sum + o.cantitateTotala, 0);
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
      o.id === ordin.id ? { ...o, status: "Planificată" as const } : o
    ));
    toast.success(`Ordinul ${ordin.numar} a fost planificat`);
    setDetailDialogOpen(false);
  };

  const handleRezervaStoc = (ordin: OrdinProductie) => {
    toast.success(`Stocul a fost rezervat pentru ${ordin.numar}`);
  };

  const handleInchideOrdin = (ordin: OrdinProductie) => {
    setOrdine(prev => prev.map(o => 
      o.id === ordin.id ? { ...o, status: "Închisă" as const } : o
    ));
    toast.success(`Ordinul ${ordin.numar} a fost închis`);
    setDetailDialogOpen(false);
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

  const handleWizardNext = () => {
    if (wizardStep < 2) {
      setWizardStep(wizardStep + 1);
    } else {
      // Submit
      const validProduse = wizardForm.produse.filter(p => p.produs && p.cantitate && p.reteta);
      if (validProduse.length === 0) {
        toast.error("Adăugați cel puțin un produs cu cantitate și rețetă");
        return;
      }

      const newOrdin: OrdinProductie = {
        id: ordine.length + 1,
        numar: `OP-2024-${String(ordine.length + 1).padStart(3, '0')}`,
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
        status: "Draft",
        observatii: wizardForm.observatii,
        consumEstimat: [],
        rezervariStoc: [],
        loturiAsociate: [],
        atasamente: [],
        comenziAsociate: wizardForm.comenziAsociate
      };
      setOrdine(prev => [...prev, newOrdin]);
      toast.success(`Ordinul ${newOrdin.numar} a fost creat`);
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
    }
  };

  // Kanban grouped data
  const kanbanColumns = useMemo(() => {
    const statuses = ["Draft", "Planificată", "În lucru", "Închisă"] as const;
    return statuses.map(status => ({
      status,
      items: ordine.filter(o => o.status === status)
    }));
  }, [ordine]);

  // Calendar data
  const calendarData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => `${6 + i}:00`);
    const days = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminică"];
    
    return { hours, days };
  }, []);

  const getCapacityColor = (load: number) => {
    if (load === 0) return "bg-muted";
    if (load < 50) return "bg-green-500/30";
    if (load < 80) return "bg-yellow-500/30";
    return "bg-red-500/30";
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Masă Totală Activă</p>
                <p className="text-2xl font-bold">{stats.cantitateTotal.toLocaleString()} t</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-emerald-500" />
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
                          <TableCell>
                            <div className="flex flex-col gap-0.5">
                              {ordin.produse.map((p, idx) => (
                                <div key={idx} className="text-xs">
                                  <span className="font-medium">{p.produs}</span>
                                  <span className="text-muted-foreground"> - {p.cantitate}t ({p.reteta})</span>
                                </div>
                              ))}
                            </div>
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
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Heatmap Capacitate</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setCalendarWeek(w => w - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">Săptămâna {calendarWeek >= 0 ? `+${calendarWeek}` : calendarWeek}</span>
                <Button variant="outline" size="icon" onClick={() => setCalendarWeek(w => w + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Ora</TableHead>
                      {calendarData.days.map(day => (
                        <TableHead key={day} className="text-center">{day}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calendarData.hours.map(hour => (
                      <TableRow key={hour}>
                        <TableCell className="font-medium">{hour}</TableCell>
                        {calendarData.days.map(day => {
                          const load = Math.floor(Math.random() * 100);
                          return (
                            <TableCell key={`${day}-${hour}`} className="p-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={`h-8 rounded ${getCapacityColor(load)} cursor-pointer`} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{day} {hour} - Încărcare: {load}%</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <span>Liber</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/30" />
                  <span>&lt;50%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-500/30" />
                  <span>50-80%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/30" />
                  <span>&gt;80%</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
                {selectedOrdin.consumEstimat.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Consum Estimat Materii Prime</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Necesar</TableHead>
                          <TableHead>Disponibil</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrdin.consumEstimat.map((c, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{c.material}</TableCell>
                            <TableCell>{c.cantitate} t</TableCell>
                            <TableCell>{c.disponibil} t</TableCell>
                            <TableCell>
                              {c.disponibil >= c.cantitate ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-600">OK</Badge>
                              ) : (
                                <Badge variant="destructive">Insuficient</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Loturi Asociate */}
                {selectedOrdin.loturiAsociate.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Loturi Asociate</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrdin.loturiAsociate.map((lot) => (
                        <Badge key={lot} variant="outline" className="gap-1">
                          <Link2 className="h-3 w-3" />
                          {lot}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comenzi Asociate */}
                {selectedOrdin.comenziAsociate.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Comenzi Asociate</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrdin.comenziAsociate.map((cmd) => (
                        <Badge key={cmd} variant="secondary" className="gap-1">
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
                  {selectedOrdin.status === "Draft" && (
                    <Button size="sm" onClick={() => handlePlanifica(selectedOrdin)}>
                      <Clock className="h-4 w-4 mr-1" />
                      Planifică
                    </Button>
                  )}
                  {selectedOrdin.status !== "Închisă" && (
                    <Button size="sm" variant="outline" onClick={() => handleRezervaStoc(selectedOrdin)}>
                      <Package className="h-4 w-4 mr-1" />
                      Rezervă Stoc
                    </Button>
                  )}
                  {selectedOrdin.status === "În lucru" && (
                    <Button size="sm" variant="destructive" onClick={() => handleInchideOrdin(selectedOrdin)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Închide
                    </Button>
                  )}
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
                            {mockProduseFinite.map((p) => (
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
                            {mockRetete.map((r) => (
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
                      {mockOperatori.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
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
                      {mockSefiSchimb.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
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
                      {mockComenzi.filter(c => !wizardForm.comenziAsociate.includes(c)).map((cmd) => (
                        <SelectItem key={cmd} value={cmd}>{cmd}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                <span className="text-sm">Verificați datele înainte de confirmare. Ordinul va fi creat în status Draft.</span>
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

    </div>
  );
};

export default OrdineProductie;
