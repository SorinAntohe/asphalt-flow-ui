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
  Printer,
  Split,
  Merge,
  Clock,
  User,
  Factory,
  FileText,
  Link2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft
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
interface OrdinProductie {
  id: number;
  numar: string;
  reteta: string;
  cantitate: number;
  unitateMasura: string;
  linie: string;
  planta: string;
  startPlanificat: string;
  operator: string;
  sefSchimb: string;
  status: "Draft" | "Planificată" | "În lucru" | "Închisă";
  observatii: string;
  consumEstimat: { material: string; cantitate: number; disponibil: number }[];
  rezervariStoc: { material: string; cantitate: number; dataRezervare: string }[];
  loturiAsociate: string[];
  atasamente: string[];
}

// Mock data
const mockOrdine: OrdinProductie[] = [
  {
    id: 1,
    numar: "OP-2024-001",
    reteta: "BA16 - Beton Asfaltic",
    cantitate: 500,
    unitateMasura: "tone",
    linie: "Linia 1",
    planta: "Stația Asfalt Nord",
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
    atasamente: ["specificatie_tehnica.pdf", "plan_calitate.pdf"]
  },
  {
    id: 2,
    numar: "OP-2024-002",
    reteta: "MASF16 - Mixtură Asfaltică",
    cantitate: 300,
    unitateMasura: "tone",
    linie: "Linia 2",
    planta: "Stația Asfalt Nord",
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
    atasamente: []
  },
  {
    id: 3,
    numar: "OP-2024-003",
    reteta: "BSC - Beton Stabilizat",
    cantitate: 800,
    unitateMasura: "tone",
    linie: "Linia 1",
    planta: "Stația Beton Sud",
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
    atasamente: ["caiet_sarcini.pdf"]
  },
  {
    id: 4,
    numar: "OP-2024-004",
    reteta: "BA16 - Beton Asfaltic",
    cantitate: 250,
    unitateMasura: "tone",
    linie: "Linia 2",
    planta: "Stația Asfalt Nord",
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
    atasamente: ["raport_final.pdf"]
  },
  {
    id: 5,
    numar: "OP-2024-005",
    reteta: "MASF16 - Mixtură Asfaltică",
    cantitate: 450,
    unitateMasura: "tone",
    linie: "Linia 1",
    planta: "Stația Asfalt Nord",
    startPlanificat: "17/01/2024 07:00",
    operator: "Ion Popescu",
    sefSchimb: "Gheorghe Ionescu",
    status: "Draft",
    observatii: "",
    consumEstimat: [
      { material: "Bitum 50/70", cantitate: 27, disponibil: 100 },
      { material: "Agregat 4/8", cantitate: 180, disponibil: 200 }
    ],
    rezervariStoc: [],
    loturiAsociate: [],
    atasamente: []
  }
];

const mockRetete = ["BA16 - Beton Asfaltic", "MASF16 - Mixtură Asfaltică", "BSC - Beton Stabilizat", "AB2 - Anrobat Bituminos"];
const mockLinii = ["Linia 1", "Linia 2", "Linia 3"];
const mockPlante = ["Stația Asfalt Nord", "Stația Beton Sud", "Stația Balast"];
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
  const [splitMergeDialogOpen, setSplitMergeDialogOpen] = useState(false);
  const [splitMergeMode, setSplitMergeMode] = useState<"split" | "merge">("split");

  // Filters
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Wizard form state
  const [wizardForm, setWizardForm] = useState({
    reteta: "",
    cantitate: "",
    unitateMasura: "tone",
    linie: "",
    planta: "",
    startPlanificat: "",
    operator: "",
    sefSchimb: "",
    observatii: "",
    batches: [{ cantitate: "", prioritate: "Normal" }]
  });

  // Calendar state
  const [calendarWeek, setCalendarWeek] = useState(0);

  // Stats
  const stats = useMemo(() => {
    const total = ordine.length;
    const inLucru = ordine.filter(o => o.status === "În lucru").length;
    const planificate = ordine.filter(o => o.status === "Planificată").length;
    const cantitateTotal = ordine.filter(o => o.status !== "Închisă").reduce((sum, o) => sum + o.cantitate, 0);
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
    exportToCSV(ordine, "ordine_productie", [
      { key: "numar", label: "Nr." },
      { key: "reteta", label: "Rețetă" },
      { key: "cantitate", label: "Cantitate" },
      { key: "linie", label: "Linie" },
      { key: "planta", label: "Plantă" },
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

  const handlePrint = (ordin: OrdinProductie) => {
    toast.info(`Se imprimă biletul de producție pentru ${ordin.numar}`);
  };

  const handleWizardNext = () => {
    if (wizardStep < 3) {
      setWizardStep(wizardStep + 1);
    } else {
      // Submit
      const newOrdin: OrdinProductie = {
        id: ordine.length + 1,
        numar: `OP-2024-${String(ordine.length + 1).padStart(3, '0')}`,
        reteta: wizardForm.reteta,
        cantitate: parseFloat(wizardForm.cantitate) || 0,
        unitateMasura: wizardForm.unitateMasura,
        linie: wizardForm.linie,
        planta: wizardForm.planta,
        startPlanificat: wizardForm.startPlanificat,
        operator: wizardForm.operator,
        sefSchimb: wizardForm.sefSchimb,
        status: "Draft",
        observatii: wizardForm.observatii,
        consumEstimat: [],
        rezervariStoc: [],
        loturiAsociate: [],
        atasamente: []
      };
      setOrdine(prev => [...prev, newOrdin]);
      toast.success(`Ordinul ${newOrdin.numar} a fost creat`);
      setWizardOpen(false);
      setWizardStep(1);
      setWizardForm({
        reteta: "",
        cantitate: "",
        unitateMasura: "tone",
        linie: "",
        planta: "",
        startPlanificat: "",
        operator: "",
        sefSchimb: "",
        observatii: "",
        batches: [{ cantitate: "", prioritate: "Normal" }]
      });
    }
  };

  const addBatch = () => {
    setWizardForm(prev => ({
      ...prev,
      batches: [...prev.batches, { cantitate: "", prioritate: "Normal" }]
    }));
  };

  const updateBatch = (index: number, field: string, value: string) => {
    setWizardForm(prev => ({
      ...prev,
      batches: prev.batches.map((b, i) => i === index ? { ...b, [field]: value } : b)
    }));
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
    const linii = ["Linia 1", "Linia 2", "Linia 3"];
    
    return { hours, days, linii };
  }, []);

  const getCapacityColor = (load: number) => {
    if (load === 0) return "bg-muted";
    if (load < 50) return "bg-green-500/30";
    if (load < 80) return "bg-yellow-500/30";
    return "bg-red-500/30";
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ordine</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În Lucru</CardTitle>
            <Play className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.inLucru}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.planificate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cantitate Activă</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cantitateTotal.toLocaleString()} t</div>
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
                      <TableHead>
                        <DataTableColumnHeader
                          title="Rețetă"
                          sortKey="reteta"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.reteta || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("reteta", value)}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Cantitate"
                          sortKey="cantitate"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.cantitate || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("cantitate", value)}
                        />
                      </TableHead>
                      <TableHead>
                        <DataTableColumnHeader
                          title="Linie/Plantă"
                          sortKey="linie"
                          currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                          filterValue={filters.linie || ""}
                          onSort={handleSort}
                          onFilterChange={(value) => handleFilter("linie", value)}
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
                      <DataTableEmpty colSpan={8} message="Nu există ordine de producție" />
                    ) : (
                      paginatedOrdine.map((ordin) => (
                        <TableRow
                          key={ordin.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => handleRowClick(ordin)}
                        >
                          <TableCell className="font-medium">{ordin.numar}</TableCell>
                          <TableCell>{ordin.reteta}</TableCell>
                          <TableCell>{ordin.cantitate} {ordin.unitateMasura}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{ordin.linie}</span>
                              <span className="text-xs text-muted-foreground">{ordin.planta}</span>
                            </div>
                          </TableCell>
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
                              <Badge variant="outline" className="text-xs">{ordin.linie}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{ordin.reteta}</p>
                            <div className="flex items-center justify-between text-xs">
                              <span>{ordin.cantitate} {ordin.unitateMasura}</span>
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
              <div className="space-y-4">
                {calendarData.linii.map((linie) => (
                  <div key={linie} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{linie}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="grid grid-cols-8 gap-1 min-w-[600px]">
                        <div className="text-xs text-muted-foreground"></div>
                        {calendarData.days.map((day) => (
                          <div key={day} className="text-xs text-center font-medium">{day}</div>
                        ))}
                        {calendarData.hours.map((hour) => (
                          <>
                            <div key={`${hour}-label`} className="text-xs text-muted-foreground text-right pr-2">{hour}</div>
                            {calendarData.days.map((day) => {
                              const load = Math.floor(Math.random() * 100);
                              return (
                                <TooltipProvider key={`${day}-${hour}`}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className={`h-6 rounded ${getCapacityColor(load)} cursor-pointer hover:ring-1 hover:ring-primary`} />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{day} {hour} - {load}% capacitate</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-muted" />
                    <span>Liber</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-green-500/30" />
                    <span>&lt;50%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-yellow-500/30" />
                    <span>50-80%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded bg-red-500/30" />
                    <span>&gt;80%</span>
                  </div>
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
                <DialogTitle className="flex items-center gap-2">
                  {selectedOrdin.numar}
                  <Badge variant={statusConfig[selectedOrdin.status].variant} className="gap-1">
                    {statusConfig[selectedOrdin.status].icon}
                    {selectedOrdin.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedOrdin.reteta}</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Cantitate</Label>
                    <p className="font-medium">{selectedOrdin.cantitate} {selectedOrdin.unitateMasura}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Linie</Label>
                    <p className="font-medium">{selectedOrdin.linie}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Plantă</Label>
                    <p className="font-medium">{selectedOrdin.planta}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Start Planificat</Label>
                    <p className="font-medium">{selectedOrdin.startPlanificat}</p>
                  </div>
                </div>

                <Separator />

                {/* Personnel */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Operator</Label>
                    <p className="font-medium">{selectedOrdin.operator}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Șef Schimb</Label>
                    <p className="font-medium">{selectedOrdin.sefSchimb}</p>
                  </div>
                </div>

                {/* Consum Estimat vs Disponibil */}
                <div>
                  <Label className="text-muted-foreground mb-2 block">Consum Estimat vs Disponibil</Label>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead className="text-right">Necesar</TableHead>
                        <TableHead className="text-right">Disponibil</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrdin.consumEstimat.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.material}</TableCell>
                          <TableCell className="text-right">{item.cantitate} t</TableCell>
                          <TableCell className="text-right">{item.disponibil} t</TableCell>
                          <TableCell className="text-right">
                            {item.disponibil >= item.cantitate ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-600">OK</Badge>
                            ) : (
                              <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Insuficient
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Rezervări Stoc */}
                {selectedOrdin.rezervariStoc.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Rezervări Stoc</Label>
                    <div className="space-y-1">
                      {selectedOrdin.rezervariStoc.map((rez, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                          <span>{rez.material}</span>
                          <span>{rez.cantitate} t - {rez.dataRezervare}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Loturi Asociate */}
                {selectedOrdin.loturiAsociate.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Loturi Asociate</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrdin.loturiAsociate.map((lot) => (
                        <Badge key={lot} variant="outline" className="gap-1 cursor-pointer hover:bg-muted">
                          <Link2 className="h-3 w-3" />
                          {lot}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Atașamente */}
                {selectedOrdin.atasamente.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground mb-2 block">Atașamente</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrdin.atasamente.map((file) => (
                        <Badge key={file} variant="secondary" className="gap-1 cursor-pointer">
                          <FileText className="h-3 w-3" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observații */}
                {selectedOrdin.observatii && (
                  <div>
                    <Label className="text-muted-foreground">Observații</Label>
                    <p className="text-sm">{selectedOrdin.observatii}</p>
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
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleRezervaStoc(selectedOrdin)}>
                        <Package className="h-4 w-4 mr-1" />
                        Rezervă Stoc
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSplitMergeMode("split");
                        setSplitMergeDialogOpen(true);
                      }}>
                        <Split className="h-4 w-4 mr-1" />
                        Split
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setSplitMergeMode("merge");
                        setSplitMergeDialogOpen(true);
                      }}>
                        <Merge className="h-4 w-4 mr-1" />
                        Merge
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handlePrint(selectedOrdin)}>
                    <Printer className="h-4 w-4 mr-1" />
                    Imprimă
                  </Button>
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
        <DialogContent className="max-w-2xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Lansează Ordin de Producție</DialogTitle>
            <DialogDescription>
              Pasul {wizardStep} din 3: {wizardStep === 1 ? "Antet" : wizardStep === 2 ? "Linii/Batching" : "Confirmă"}
            </DialogDescription>
          </DialogHeader>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === wizardStep ? "bg-primary text-primary-foreground" : 
                  step < wizardStep ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  {step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 ${step < wizardStep ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Antet */}
          {wizardStep === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Rețetă *</Label>
                <Select value={wizardForm.reteta} onValueChange={(v) => setWizardForm(prev => ({ ...prev, reteta: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează rețeta" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRetete.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Cantitate *</Label>
                <Input
                  type="number"
                  value={wizardForm.cantitate}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, cantitate: e.target.value }))}
                  placeholder="Ex: 500"
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
                <Label>Plantă *</Label>
                <Select value={wizardForm.planta} onValueChange={(v) => setWizardForm(prev => ({ ...prev, planta: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează planta" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPlante.map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linie *</Label>
                <Select value={wizardForm.linie} onValueChange={(v) => setWizardForm(prev => ({ ...prev, linie: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează linia" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLinii.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Start Planificat *</Label>
                <Input
                  type="datetime-local"
                  value={wizardForm.startPlanificat}
                  onChange={(e) => setWizardForm(prev => ({ ...prev, startPlanificat: e.target.value }))}
                />
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
            </div>
          )}

          {/* Step 2: Linii/Batching */}
          {wizardStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Împărțire pe loturi (Batching)</Label>
                <Button variant="outline" size="sm" onClick={addBatch}>
                  <Plus className="h-4 w-4 mr-1" />
                  Adaugă Lot
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lot</TableHead>
                    <TableHead>Cantitate</TableHead>
                    <TableHead>Prioritate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wizardForm.batches.map((batch, idx) => (
                    <TableRow key={idx}>
                      <TableCell>Lot {idx + 1}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={batch.cantitate}
                          onChange={(e) => updateBatch(idx, "cantitate", e.target.value)}
                          placeholder="Cantitate"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={batch.prioritate} onValueChange={(v) => updateBatch(idx, "prioritate", v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Ridicată">Ridicată</SelectItem>
                            <SelectItem value="Normal">Normal</SelectItem>
                            <SelectItem value="Scăzută">Scăzută</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-sm text-muted-foreground">
                Total cantitate loturi: {wizardForm.batches.reduce((sum, b) => sum + (parseFloat(b.cantitate) || 0), 0)} / {wizardForm.cantitate || 0} {wizardForm.unitateMasura}
              </div>
            </div>
          )}

          {/* Step 3: Confirmă */}
          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium">Rezumat Ordin</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Rețetă:</span> {wizardForm.reteta}</div>
                  <div><span className="text-muted-foreground">Cantitate:</span> {wizardForm.cantitate} {wizardForm.unitateMasura}</div>
                  <div><span className="text-muted-foreground">Plantă:</span> {wizardForm.planta}</div>
                  <div><span className="text-muted-foreground">Linie:</span> {wizardForm.linie}</div>
                  <div><span className="text-muted-foreground">Start:</span> {wizardForm.startPlanificat}</div>
                  <div><span className="text-muted-foreground">Operator:</span> {wizardForm.operator || "-"}</div>
                  <div><span className="text-muted-foreground">Șef Schimb:</span> {wizardForm.sefSchimb || "-"}</div>
                  <div><span className="text-muted-foreground">Loturi:</span> {wizardForm.batches.length}</div>
                </div>
                {wizardForm.observatii && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Observații:</span> {wizardForm.observatii}
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
              {wizardStep < 3 ? (
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

      {/* Split/Merge Dialog */}
      <Dialog open={splitMergeDialogOpen} onOpenChange={setSplitMergeDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>{splitMergeMode === "split" ? "Split Ordin" : "Merge Ordine"}</DialogTitle>
            <DialogDescription>
              {splitMergeMode === "split" 
                ? "Împărțiți acest ordin în mai multe ordine mai mici"
                : "Combinați mai multe ordine într-unul singur"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Funcționalitate în dezvoltare. Aceasta va permite {splitMergeMode === "split" ? "împărțirea" : "combinarea"} ordinelor de producție.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSplitMergeDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => {
              toast.info(`${splitMergeMode === "split" ? "Split" : "Merge"} - funcționalitate în dezvoltare`);
              setSplitMergeDialogOpen(false);
            }}>
              Confirmă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdineProductie;
