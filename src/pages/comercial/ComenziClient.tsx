import { useState, useMemo } from "react";
import { 
  ShoppingCart, Plus, Download, Calendar as CalendarIcon, List, Columns3, 
  Package, FileText, Clock, Paperclip,
  ChevronLeft, ChevronRight, Pencil, Trash2, TrendingUp
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportUtils";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import { ro } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";

// Types
type OrderStatus = "Preaprobat" | "Aprobat" | "Planificat" | "In Productie" | "Livrat";
type Priority = "Scazut" | "Normala" | "Ridicata" | "Urgenta";

interface ComandaClient {
  id: number;
  nr: string;
  client: string;
  produs: string;
  cantitate: number;
  unitateMasura: string;
  planta: string;
  dataOra: string;
  status: OrderStatus;
  prioritate: Priority;
  avansPlata: string;
  punctDescarcare: string;
  observatii: string;
  fereastraIncarcare: string;
  atasamente: string[];
  timeline: { data: string; eveniment: string; user: string }[];
}

// Mock data
const initialComenzi: ComandaClient[] = [];

const statusColors: Record<OrderStatus, string> = {
  "Preaprobat": "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  "Aprobat": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "Planificat": "bg-purple-500/20 text-purple-600 dark:text-purple-400",
  "In Productie": "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  "Livrat": "bg-green-500/20 text-green-600 dark:text-green-400",
};

const priorityColors: Record<Priority, string> = {
  "Scazut": "bg-gray-500/20 text-gray-600 dark:text-gray-400",
  "Normala": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "Ridicata": "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  "Urgenta": "bg-red-500/20 text-red-600 dark:text-red-400",
};

const kanbanStatuses: OrderStatus[] = ["Preaprobat", "Aprobat", "Planificat", "In Productie", "Livrat"];

const ComenziClient = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState<"lista" | "kanban" | "calendar">("lista");
  
  // Data state
  const [comenzi, setComenzi] = useState<ComandaClient[]>(initialComenzi);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dialog states
  const [viewingDetails, setViewingDetails] = useState<ComandaClient | null>(null);
  const [deleting, setDeleting] = useState<ComandaClient | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<ComandaClient | null>(null);
  const [openPlanificare, setOpenPlanificare] = useState(false);
  
  // Calendar state
  const [calendarView, setCalendarView] = useState<"zi" | "saptamana">("saptamana");
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Form state
  const [form, setForm] = useState({
    client: "",
    produs: "",
    cantitate: 0,
    unitateMasura: "tone",
    planta: "Asfalt + Emulsie",
    dataOra: "",
    prioritate: "Normala" as Priority,
    avansPlata: "",
    punctDescarcare: "",
    observatii: "",
    fereastraIncarcare: "",
  });
  
  // Column filters
  const [filters, setFilters] = useState<Record<string, string>>({
    nr: "", client: "", produs: "", cantitate: "", planta: "", dataOra: "", status: "", prioritate: "", avansPlata: "", observatii: ""
  });
  
  
  // Sorting
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Get unique values for dropdowns
  const clients = useMemo(() => [...new Set(comenzi.map(c => c.client))], [comenzi]);
  const produse = useMemo(() => [...new Set(comenzi.map(c => c.produs))], [comenzi]);
  const plante = useMemo(() => [...new Set(comenzi.map(c => c.planta))], [comenzi]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const comenziAstazi = comenzi.filter(c => c.dataOra.startsWith(today)).length;
    const cantitateTotal = comenzi.reduce((sum, c) => sum + c.cantitate, 0);
    return {
      comenziAstazi,
      cantitateTotal,
      totalComenzi: comenzi.length
    };
  }, [comenzi]);

  // Filter and sort comenzi
  const filteredComenzi = useMemo(() => {
    return comenzi
      .filter(item => {
        return (
          item.nr.toLowerCase().includes(filters.nr.toLowerCase()) &&
          item.client.toLowerCase().includes(filters.client.toLowerCase()) &&
          item.produs.toLowerCase().includes(filters.produs.toLowerCase()) &&
          item.cantitate.toString().includes(filters.cantitate) &&
          item.planta.toLowerCase().includes(filters.planta.toLowerCase()) &&
          item.dataOra.toLowerCase().includes(filters.dataOra.toLowerCase()) &&
          (filters.status === "" || item.status === filters.status) &&
          (filters.prioritate === "" || item.prioritate === filters.prioritate) &&
          item.avansPlata.toLowerCase().includes(filters.avansPlata.toLowerCase()) &&
          item.observatii.toLowerCase().includes(filters.observatii.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (!sort) return 0;
        const aVal = a[sort.key as keyof ComandaClient];
        const bVal = b[sort.key as keyof ComandaClient];
        if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [comenzi, filters, sort]);

  // Pagination
  const totalPages = Math.ceil(filteredComenzi.length / itemsPerPage);
  const paginatedComenzi = filteredComenzi.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Calendar helpers
  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getComenziForDate = (date: Date) => {
    return filteredComenzi.filter(c => {
      const comandaDate = parseISO(c.dataOra);
      return isSameDay(comandaDate, date);
    });
  };

  const handleExport = () => {
    const columns = [
      { key: "nr" as const, label: "Nr." },
      { key: "client" as const, label: "Client" },
      { key: "produs" as const, label: "Produs" },
      { key: "cantitate" as const, label: "Cantitate" },
      { key: "dataOra" as const, label: "Dată/Ora" },
      { key: "status" as const, label: "Status" },
      { key: "prioritate" as const, label: "Prioritate" },
      { key: "avansPlata" as const, label: "Avans/Plată" },
      { key: "observatii" as const, label: "Observații" },
    ];
    exportToCSV(filteredComenzi, `comenzi_client_${new Date().toISOString().split('T')[0]}`, columns);
    toast({ title: "Export realizat", description: "Fișierul CSV a fost descărcat." });
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      client: "",
      produs: "",
      cantitate: 0,
      unitateMasura: "tone",
      planta: "Asfalt + Emulsie",
      dataOra: "",
      prioritate: "Normala",
      avansPlata: "",
      punctDescarcare: "",
      observatii: "",
      fereastraIncarcare: "",
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (item: ComandaClient) => {
    setEditing(item);
    setForm({
      client: item.client,
      produs: item.produs,
      cantitate: item.cantitate,
      unitateMasura: item.unitateMasura,
      planta: item.planta,
      dataOra: item.dataOra,
      prioritate: item.prioritate,
      avansPlata: item.avansPlata,
      punctDescarcare: item.punctDescarcare,
      observatii: item.observatii,
      fereastraIncarcare: item.fereastraIncarcare,
    });
    setOpenAddEdit(true);
  };

  const handleSave = () => {
    if (!form.client || !form.produs || !form.cantitate) {
      toast({ title: "Eroare", description: "Completează câmpurile obligatorii.", variant: "destructive" });
      return;
    }

    const currentDateStr = new Date().toLocaleDateString('ro-RO');

    if (editing) {
      setComenzi(prev => prev.map(item => 
        item.id === editing.id 
          ? { ...item, ...form, timeline: [...item.timeline, { data: `${currentDateStr} ${new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`, eveniment: "Comandă editată", user: "Utilizator" }] }
          : item
      ));
      toast({ title: "Succes", description: "Comanda a fost actualizată." });
    } else {
      const newComanda: ComandaClient = {
        id: Math.max(...comenzi.map(c => c.id), 0) + 1,
        nr: `CMD-2024-${String(comenzi.length + 1).padStart(3, '0')}`,
        client: form.client,
        produs: form.produs,
        cantitate: form.cantitate,
        unitateMasura: form.unitateMasura,
        planta: form.planta,
        dataOra: form.dataOra,
        status: "Preaprobat",
        prioritate: form.prioritate,
        avansPlata: form.avansPlata,
        punctDescarcare: form.punctDescarcare,
        observatii: form.observatii,
        fereastraIncarcare: form.fereastraIncarcare,
        atasamente: [],
        timeline: [{ data: `${currentDateStr} ${new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`, eveniment: "Comandă creată", user: "Utilizator" }]
      };
      setComenzi(prev => [...prev, newComanda]);
      toast({ title: "Succes", description: "Comanda a fost adăugată." });
    }
    setOpenAddEdit(false);
  };

  const handleDelete = () => {
    if (!deleting) return;
    setComenzi(prev => prev.filter(item => item.id !== deleting.id));
    toast({ title: "Succes", description: "Comanda a fost ștearsă." });
    setDeleting(null);
  };

  const handleRezervaStoc = () => {
    if (viewingDetails) {
      toast({ title: "Stoc rezervat", description: `Stocul pentru comanda ${viewingDetails.nr} a fost rezervat.` });
    }
  };

  const handleGenereazaAviz = () => {
    if (viewingDetails) {
      toast({ title: "Aviz generat", description: `Avizul pentru comanda ${viewingDetails.nr} a fost generat.` });
    }
  };

  const handleStatusChange = (comanda: ComandaClient, newStatus: OrderStatus) => {
    setComenzi(prev => prev.map(item => 
      item.id === comanda.id 
        ? { 
            ...item, 
            status: newStatus,
            timeline: [...item.timeline, { 
              data: `${new Date().toLocaleDateString('ro-RO')} ${new Date().toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}`, 
              eveniment: `Status schimbat în ${newStatus}`, 
              user: "Utilizator" 
            }]
          }
        : item
    ));
    toast({ title: "Status actualizat", description: `Comanda ${comanda.nr} este acum "${newStatus}".` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comenzi Client</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare și urmărire comenzi de la clienți
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredComenzi.length === 0}>
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button size="sm" onClick={handleOpenAdd}>
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Comandă Nouă</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Comenzi Astăzi</p>
                <p className="text-2xl font-bold">{summaryStats.comenziAstazi}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cantitate Totală</p>
                <p className="text-2xl font-bold">{summaryStats.cantitateTotal.toLocaleString('ro-RO')}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Comenzi</p>
                <p className="text-2xl font-bold">{summaryStats.totalComenzi}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Views Tabs */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "lista" | "kanban" | "calendar")}>
        <TabsList>
          <TabsTrigger value="lista"><List className="h-4 w-4 mr-2" />Listă</TabsTrigger>
          <TabsTrigger value="kanban"><Columns3 className="h-4 w-4 mr-2" />Kanban</TabsTrigger>
          <TabsTrigger value="calendar"><CalendarIcon className="h-4 w-4 mr-2" />Calendar</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="lista" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">Lista Comenzi</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Toate comenzile de la clienți
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Nr." sortKey="nr" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.nr} onFilterChange={(v) => { setFilters(f => ({ ...f, nr: v })); setPage(1); }} filterPlaceholder="Caută nr..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Client" sortKey="client" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.client} onFilterChange={(v) => { setFilters(f => ({ ...f, client: v })); setPage(1); }} filterPlaceholder="Caută client..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Produs" sortKey="produs" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.produs} onFilterChange={(v) => { setFilters(f => ({ ...f, produs: v })); setPage(1); }} filterPlaceholder="Caută produs..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Cantitate" sortKey="cantitate" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.cantitate} onFilterChange={(v) => { setFilters(f => ({ ...f, cantitate: v })); setPage(1); }} filterPlaceholder="Caută..." sortAscLabel="Cresc." sortDescLabel="Descresc." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Dată/Ora" sortKey="dataOra" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.dataOra} onFilterChange={(v) => { setFilters(f => ({ ...f, dataOra: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Status" sortKey="status" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.status} onFilterChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Prioritate" sortKey="prioritate" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.prioritate} onFilterChange={(v) => { setFilters(f => ({ ...f, prioritate: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Avans/Plată" sortKey="avansPlata" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.avansPlata} onFilterChange={(v) => { setFilters(f => ({ ...f, avansPlata: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Observații" sortKey="observatii" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.observatii} onFilterChange={(v) => { setFilters(f => ({ ...f, observatii: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="animate-fade-in">
                    {paginatedComenzi.length === 0 ? (
                      <DataTableEmpty colSpan={9} message="Nu există comenzi care să corespundă filtrelor." />
                    ) : (
                      paginatedComenzi.map((comanda) => (
                        <TableRow key={comanda.id} className="cursor-pointer hover:bg-muted/50 h-10" onClick={() => setViewingDetails(comanda)}>
                          <TableCell className="py-1 text-xs font-medium">{comanda.nr}</TableCell>
                          <TableCell className="py-1 text-xs">{comanda.client}</TableCell>
                          <TableCell className="py-1 text-xs">{comanda.produs}</TableCell>
                          <TableCell className="py-1 text-xs text-right">{comanda.cantitate} {comanda.unitateMasura}</TableCell>
                          <TableCell className="py-1 text-xs">{format(parseISO(comanda.dataOra), "dd/MM/yyyy HH:mm")}</TableCell>
                          <TableCell className="py-1 text-xs"><Badge className={statusColors[comanda.status]}>{comanda.status}</Badge></TableCell>
                          <TableCell className="py-1 text-xs"><Badge className={priorityColors[comanda.prioritate]}>{comanda.prioritate}</Badge></TableCell>
                          <TableCell className="py-1 text-xs">{comanda.avansPlata}</TableCell>
                          <TableCell className="py-1 text-xs max-w-[150px] truncate">{comanda.observatii}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <DataTablePagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={filteredComenzi.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban" className="mt-4">
          <div className="flex gap-3 overflow-x-auto pb-4">
            {kanbanStatuses.map((status) => {
              const statusComenzi = filteredComenzi.filter(c => c.status === status);
              return (
                <div key={status} className="flex-shrink-0 w-[280px]">
                  <Card className="h-full">
                    <CardHeader className="p-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Badge className={statusColors[status]}>{status}</Badge>
                          <span className="text-muted-foreground">({statusComenzi.length})</span>
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <ScrollArea className="h-[calc(100vh-400px)]">
                        <div className="space-y-2 pr-2">
                          {statusComenzi.map((comanda) => (
                            <Card key={comanda.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setViewingDetails(comanda)}>
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between mb-2">
                                  <span className="font-medium text-xs">{comanda.nr}</span>
                                  <Badge className={priorityColors[comanda.prioritate]} variant="outline">{comanda.prioritate}</Badge>
                                </div>
                                <p className="text-sm font-medium mb-1">{comanda.client}</p>
                                <p className="text-xs text-muted-foreground mb-2">{comanda.produs} - {comanda.cantitate} {comanda.unitateMasura}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CalendarIcon className="h-3 w-3" />
                                  {format(parseISO(comanda.dataOra), "dd/MM HH:mm")}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          {statusComenzi.length === 0 && (
                            <p className="text-center text-xs text-muted-foreground py-4">Nicio comandă</p>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(d => addDays(d, calendarView === "zi" ? -1 : -7))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium text-sm">
                    {calendarView === "zi" 
                      ? format(currentDate, "EEEE, d MMMM yyyy", { locale: ro })
                      : `${format(startOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM", { locale: ro })} - ${format(endOfWeek(currentDate, { weekStartsOn: 1 }), "d MMM yyyy", { locale: ro })}`
                    }
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentDate(d => addDays(d, calendarView === "zi" ? 1 : 7))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={calendarView === "zi" ? "default" : "outline"} size="sm" onClick={() => setCalendarView("zi")}>Zi</Button>
                  <Button variant={calendarView === "saptamana" ? "default" : "outline"} size="sm" onClick={() => setCalendarView("saptamana")}>Săptămână</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3">
              {calendarView === "saptamana" ? (
                <div className="grid grid-cols-7 gap-2">
                  {getWeekDays().map((day) => {
                    const dayComenzi = getComenziForDate(day);
                    const isToday = isSameDay(day, new Date());
                    return (
                      <div key={day.toISOString()} className={`min-h-[200px] border rounded-lg p-2 ${isToday ? 'border-primary bg-primary/5' : 'border-border'}`}>
                        <div className="text-center mb-2">
                          <p className="text-xs text-muted-foreground">{format(day, "EEE", { locale: ro })}</p>
                          <p className={`text-lg font-medium ${isToday ? 'text-primary' : ''}`}>{format(day, "d")}</p>
                        </div>
                        <div className="space-y-1">
                          {dayComenzi.slice(0, 3).map((comanda) => (
                            <div key={comanda.id} className="text-xs p-1.5 rounded bg-primary/10 cursor-pointer hover:bg-primary/20" onClick={() => setViewingDetails(comanda)}>
                              <p className="font-medium truncate">{comanda.client}</p>
                              <p className="text-muted-foreground truncate">{comanda.produs}</p>
                            </div>
                          ))}
                          {dayComenzi.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center">+{dayComenzi.length - 3} mai mult</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {getComenziForDate(currentDate).length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nicio comandă pentru această zi.</p>
                  ) : (
                    getComenziForDate(currentDate).map((comanda) => (
                      <Card key={comanda.id} className="cursor-pointer hover:shadow-md" onClick={() => setViewingDetails(comanda)}>
                        <CardContent className="p-3 flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-lg font-bold">{format(parseISO(comanda.dataOra), "HH:mm")}</p>
                          </div>
                          <Separator orientation="vertical" className="h-12" />
                          <div className="flex-1">
                            <p className="font-medium">{comanda.client}</p>
                            <p className="text-sm text-muted-foreground">{comanda.produs} - {comanda.cantitate} {comanda.unitateMasura}</p>
                          </div>
                          <Badge className={statusColors[comanda.status]}>{comanda.status}</Badge>
                          <Badge className={priorityColors[comanda.prioritate]}>{comanda.prioritate}</Badge>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
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
                <DialogTitle>Detalii Comandă - {viewingDetails?.nr}</DialogTitle>
                <DialogDescription>Informații complete despre comandă</DialogDescription>
              </div>
              {viewingDetails && (
                <div className="flex gap-2">
                  <Badge className={statusColors[viewingDetails.status]}>{viewingDetails.status}</Badge>
                  <Badge className={priorityColors[viewingDetails.prioritate]}>{viewingDetails.prioritate}</Badge>
                </div>
              )}
            </div>
          </DialogHeader>
          
          {viewingDetails && (
            <div className="grid gap-3">
              {/* Rezumat - compact grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm border rounded-lg p-3 bg-muted/30">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{viewingDetails.client}</span></div>
                <div><span className="text-muted-foreground">Produs:</span> <span className="font-medium">{viewingDetails.produs}</span></div>
                <div><span className="text-muted-foreground">Cantitate:</span> <span className="font-medium">{viewingDetails.cantitate} {viewingDetails.unitateMasura}</span></div>
                <div><span className="text-muted-foreground">Dată/Ora:</span> <span className="font-medium">{format(parseISO(viewingDetails.dataOra), "dd/MM/yyyy HH:mm")}</span></div>
                <div><span className="text-muted-foreground">Fereastră:</span> <span className="font-medium">{viewingDetails.fereastraIncarcare}</span></div>
                <div><span className="text-muted-foreground">Punct descărcare:</span> <span className="font-medium">{viewingDetails.punctDescarcare}</span></div>
                <div><span className="text-muted-foreground">Avans/Plată:</span> <span className="font-medium">{viewingDetails.avansPlata}</span></div>
                {viewingDetails.observatii && (
                  <div className="col-span-2 pt-2 border-t mt-1">
                    <span className="text-muted-foreground">Observații:</span> <span className="font-medium">{viewingDetails.observatii}</span>
                  </div>
                )}
              </div>

              {/* Atașamente și Timeline - side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium flex items-center gap-2 mb-2"><Paperclip className="h-4 w-4" />Atașamente</p>
                  {viewingDetails.atasamente.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {viewingDetails.atasamente.map((file, idx) => (
                        <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-muted text-xs">
                          <FileText className="h-3 w-3 mr-1" />{file}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Niciun atașament</p>
                  )}
                </div>

                <div className="border rounded-lg p-3">
                  <p className="text-sm font-medium flex items-center gap-2 mb-2"><Clock className="h-4 w-4" />Timeline</p>
                  <div className="space-y-1">
                    {viewingDetails.timeline.slice(0, 3).map((event, idx) => (
                      <div key={idx} className="flex gap-2 items-start">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium">{event.eveniment}</p>
                          <p className="text-xs text-muted-foreground">{event.data}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-wrap gap-1 pt-2">
            <Button variant="outline" size="sm" onClick={() => { if (viewingDetails) { handleStatusChange(viewingDetails, "Planificat"); setViewingDetails(null); } }}>
              <CalendarIcon className="w-4 h-4 mr-1" />Planifică
            </Button>
            <Button variant="outline" size="sm" onClick={handleRezervaStoc}>
              <Package className="w-4 h-4 mr-1" />Rezervă stoc
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenereazaAviz}>
              <FileText className="w-4 h-4 mr-1" />Generează aviz
            </Button>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Editează Comandă" : "Adaugă Comandă Nouă"}</DialogTitle>
            <DialogDescription>Completează informațiile comenzii.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={form.client} onValueChange={(v) => setForm({ ...form, client: v })}>
                  <SelectTrigger><SelectValue placeholder="Selectează client" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client 1">Client 1</SelectItem>
                    <SelectItem value="Client 2">Client 2</SelectItem>
                    <SelectItem value="Client 3">Client 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Produs *</Label>
                <Select value={form.produs} onValueChange={(v) => setForm({ ...form, produs: v })}>
                  <SelectTrigger><SelectValue placeholder="Selectează produs" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asfalt BA16">Asfalt BA16</SelectItem>
                    <SelectItem value="Asfalt BA8">Asfalt BA8</SelectItem>
                    <SelectItem value="Asfalt MASF16">Asfalt MASF16</SelectItem>
                    <SelectItem value="Emulsie cationică">Emulsie cationică</SelectItem>
                    <SelectItem value="Beton C25/30">Beton C25/30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cantitate *</Label>
                <Input type="number" value={form.cantitate} onChange={(e) => setForm({ ...form, cantitate: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Unitate măsură</Label>
                <Select value={form.unitateMasura} onValueChange={(v) => setForm({ ...form, unitateMasura: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tone">tone</SelectItem>
                    <SelectItem value="mc">mc</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Dată/Ora</Label>
                <Input type="datetime-local" value={form.dataOra} onChange={(e) => setForm({ ...form, dataOra: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fereastră încărcare</Label>
                <Input placeholder="ex: 08:00 - 12:00" value={form.fereastraIncarcare} onChange={(e) => setForm({ ...form, fereastraIncarcare: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioritate</Label>
                <Select value={form.prioritate} onValueChange={(v) => setForm({ ...form, prioritate: v as Priority })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scazut">Scazut</SelectItem>
                    <SelectItem value="Normala">Normala</SelectItem>
                    <SelectItem value="Ridicata">Ridicata</SelectItem>
                    <SelectItem value="Urgenta">Urgenta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Avans/Plată</Label>
                <Input placeholder="ex: 30% achitat" value={form.avansPlata} onChange={(e) => setForm({ ...form, avansPlata: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Punct descărcare</Label>
              <Input placeholder="Adresa/locația de descărcare" value={form.punctDescarcare} onChange={(e) => setForm({ ...form, punctDescarcare: e.target.value })} />
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
              Ești sigur că vrei să ștergi comanda {deleting?.nr}? Această acțiune nu poate fi anulată.
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

export default ComenziClient;
