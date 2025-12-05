import { useState, useMemo, useEffect } from "react";
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
import { FilterableSelect } from "@/components/ui/filterable-select";
import { TimeRangePicker } from "@/components/ui/time-range-picker";
import { API_BASE_URL } from "@/lib/api";

// Types
type OrderStatus = "Preaprobat" | "Aprobat" | "Planificat" | "In Productie" | "Livrat";
type Priority = "Scazut" | "Normala" | "Ridicata" | "Urgenta";

interface ComandaClient {
  id: number;
  cod_comanda: string;
  data: string;
  client: string;
  produs: string;
  cantitate: number;
  unitate_masura: string;
  fereastra_incarcare: string;
  prioritate: Priority;
  avans: number;
  punct_descarcare: string;
  observatii: string;
  status: OrderStatus;
}

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
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [comenzi, setComenzi] = useState<ComandaClient[]>([]);
  const [clientsList, setClientsList] = useState<{ id: number; denumire: string }[]>([]);
  const [produseList, setProduseList] = useState<{ id: number; denumire: string }[]>([]);
  
  // Fetch data on mount
  useEffect(() => {
    fetchComenzi();
    fetchClienti();
    fetchProduse();
  }, []);

  const fetchComenzi = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/returneaza/comenzi_client`);
      if (!response.ok) throw new Error("Eroare la încărcarea datelor");
      const data = await response.json();
      setComenzi(data || []);
    } catch (error) {
      console.error("Error fetching comenzi:", error);
      toast({ title: "Eroare", description: "Nu s-au putut încărca comenzile.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchClienti = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/returneaza_clienti`);
      if (!response.ok) throw new Error("Eroare la încărcarea clienților");
      const data = await response.json();
      console.log("Clienti data:", data);
      setClientsList(data || []);
    } catch (error) {
      console.error("Error fetching clienti:", error);
    }
  };

  const fetchProduse = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/returneaza_produse_finite`);
      if (!response.ok) throw new Error("Eroare la încărcarea produselor");
      const data = await response.json();
      console.log("Produse data:", data);
      setProduseList(data || []);
    } catch (error) {
      console.error("Error fetching produse:", error);
    }
  };

  // Transform API data to options format for FilterableSelect
  const clientOptions = useMemo(() => {
    return clientsList.map((client: any) => ({
      value: client.denumire || client.nume || client.name || String(client.id),
      label: client.denumire || client.nume || client.name || String(client.id)
    }));
  }, [clientsList]);

  const produsOptions = useMemo(() => {
    return produseList.map((produs: any) => ({
      value: produs.produs || produs.produse || produs.denumire || produs.nume || String(produs.id),
      label: produs.produs || produs.produse || produs.denumire || produs.nume || String(produs.id)
    }));
  }, [produseList]);
  
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
    unitate_masura: "tone",
    prioritate: "Normala" as Priority,
    avans: 0,
    punct_descarcare: "",
    observatii: "",
    fereastra_incarcare: "",
    status: "Planificat" as OrderStatus,
  });
  
  // Column filters
  const [filters, setFilters] = useState<Record<string, string>>({
    cod_comanda: "", client: "", produs: "", cantitate: "", data: "", status: "", prioritate: "", avans: "", observatii: ""
  });
  
  
  // Sorting
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Get unique values for dropdowns
  const clients = useMemo(() => [...new Set(comenzi.map(c => c.client))], [comenzi]);
  const produse = useMemo(() => [...new Set(comenzi.map(c => c.produs))], [comenzi]);

  // Summary stats
  const summaryStats = useMemo(() => {
    const today = new Date().toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\./g, '/');
    const comenziAstazi = comenzi.filter(c => c.data === today).length;
    const cantitateTotal = comenzi.reduce((sum, c) => sum + (c.cantitate || 0), 0);
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
          (item.cod_comanda || "").toLowerCase().includes(filters.cod_comanda.toLowerCase()) &&
          (item.client || "").toLowerCase().includes(filters.client.toLowerCase()) &&
          (item.produs || "").toLowerCase().includes(filters.produs.toLowerCase()) &&
          (item.cantitate?.toString() || "").includes(filters.cantitate) &&
          (item.data || "").toLowerCase().includes(filters.data.toLowerCase()) &&
          (filters.status === "" || item.status === filters.status) &&
          (filters.prioritate === "" || item.prioritate === filters.prioritate) &&
          (item.avans?.toString() || "").includes(filters.avans) &&
          (item.observatii || "").toLowerCase().includes(filters.observatii.toLowerCase())
        );
      })
      .sort((a, b) => {
        if (!sort) return 0;
        const aVal = a[sort.key as keyof ComandaClient];
        const bVal = b[sort.key as keyof ComandaClient];
        if (aVal == null || bVal == null) return 0;
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
      if (!c.data) return false;
      // data is in DD/MM/YYYY format
      const [day, month, year] = c.data.split('/');
      const comandaDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return isSameDay(comandaDate, date);
    });
  };

  const handleExport = () => {
    const columns = [
      { key: "cod_comanda" as const, label: "Cod" },
      { key: "data" as const, label: "Data" },
      { key: "client" as const, label: "Client" },
      { key: "produs" as const, label: "Produs" },
      { key: "cantitate" as const, label: "Cantitate" },
      { key: "status" as const, label: "Status" },
      { key: "prioritate" as const, label: "Prioritate" },
      { key: "avans" as const, label: "Avans" },
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
      unitate_masura: "tone",
      prioritate: "Normala",
      avans: 0,
      punct_descarcare: "",
      observatii: "",
      fereastra_incarcare: "",
      status: "Planificat",
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (item: ComandaClient) => {
    setEditing(item);
    setForm({
      client: item.client || "",
      produs: item.produs || "",
      cantitate: item.cantitate || 0,
      unitate_masura: item.unitate_masura || "tone",
      prioritate: item.prioritate || "Normala",
      avans: item.avans || 0,
      punct_descarcare: item.punct_descarcare || "",
      observatii: item.observatii || "",
      fereastra_incarcare: item.fereastra_incarcare || "",
      status: item.status || "Preaprobat",
    });
    setOpenAddEdit(true);
  };

  const handleSave = async () => {
    if (!form.client || !form.produs || !form.cantitate) {
      toast({ title: "Eroare", description: "Completează câmpurile obligatorii.", variant: "destructive" });
      return;
    }

    try {
      if (editing) {
        // Edit existing
        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tabel: "comenzi_client",
            id: editing.id,
            update: {
              client: form.client,
              produs: form.produs,
              cantitate: form.cantitate,
              unitate_masura: form.unitate_masura,
              prioritate: form.prioritate,
              avans: form.avans,
              punct_descarcare: form.punct_descarcare,
              observatii: form.observatii,
              fereastra_incarcare: form.fereastra_incarcare,
              status: form.status,
            }
          })
        });
        if (!response.ok) throw new Error("Eroare la editare");
        toast({ title: "Succes", description: "Comanda a fost actualizată." });
      } else {
        // Add new - match backend ComenziClient Pydantic model
        const payload = {
          client: form.client,
          produs: form.produs,
          cantitate: form.cantitate,
          avans: form.avans,
          unitate_masura: form.unitate_masura,
          fereastra_incarcare: form.fereastra_incarcare,
          prioritate: form.prioritate,
          punct_descarcare: form.punct_descarcare,
          observatii: form.observatii,
          status: form.status,
        };
        const response = await fetch(`${API_BASE_URL}/comercial/adauga/comanda`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Eroare la adăugare");
        toast({ title: "Succes", description: "Comanda a fost adăugată." });
      }
      setOpenAddEdit(false);
      fetchComenzi(); // Refresh data
    } catch (error) {
      console.error("Error saving:", error);
      toast({ title: "Eroare", description: "Nu s-a putut salva comanda.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table: "comenzi_client", id: deleting.id })
      });
      if (!response.ok) throw new Error("Eroare la ștergere");
      toast({ title: "Succes", description: "Comanda a fost ștearsă." });
      setDeleting(null);
      fetchComenzi();
    } catch (error) {
      console.error("Error deleting:", error);
      toast({ title: "Eroare", description: "Nu s-a putut șterge comanda.", variant: "destructive" });
    }
  };

  const handleRezervaStoc = () => {
    if (viewingDetails) {
      toast({ title: "Stoc rezervat", description: `Stocul pentru comanda ${viewingDetails.cod_comanda} a fost rezervat.` });
    }
  };

  const handleGenereazaAviz = () => {
    if (viewingDetails) {
      toast({ title: "Aviz generat", description: `Avizul pentru comanda ${viewingDetails.cod_comanda} a fost generat.` });
    }
  };

  const handleStatusChange = async (comanda: ComandaClient, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/editeaza`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          table: "comenzi_client",
          id: comanda.id,
          values: { status: newStatus }
        })
      });
      if (!response.ok) throw new Error("Eroare la actualizare status");
      toast({ title: "Status actualizat", description: `Comanda ${comanda.cod_comanda} este acum "${newStatus}".` });
      fetchComenzi();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({ title: "Eroare", description: "Nu s-a putut actualiza statusul.", variant: "destructive" });
    }
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
                        <DataTableColumnHeader title="Cod" sortKey="cod_comanda" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.cod_comanda} onFilterChange={(v) => { setFilters(f => ({ ...f, cod_comanda: v })); setPage(1); }} filterPlaceholder="Caută cod..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Data" sortKey="data" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.data} onFilterChange={(v) => { setFilters(f => ({ ...f, data: v })); setPage(1); }} filterPlaceholder="Caută..." />
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
                        <DataTableColumnHeader title="Status" sortKey="status" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.status} onFilterChange={(v) => { setFilters(f => ({ ...f, status: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Prioritate" sortKey="prioritate" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.prioritate} onFilterChange={(v) => { setFilters(f => ({ ...f, prioritate: v })); setPage(1); }} filterPlaceholder="Caută..." />
                      </TableHead>
                      <TableHead className="h-10">
                        <DataTableColumnHeader title="Avans" sortKey="avans" currentSort={sort} onSort={(k, d) => setSort({ key: k, direction: d })} filterValue={filters.avans} onFilterChange={(v) => { setFilters(f => ({ ...f, avans: v })); setPage(1); }} filterPlaceholder="Caută..." />
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
                          <TableCell className="py-1 text-xs font-medium">{comanda.cod_comanda}</TableCell>
                          <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                          <TableCell className="py-1 text-xs">{comanda.client}</TableCell>
                          <TableCell className="py-1 text-xs">{comanda.produs}</TableCell>
                          <TableCell className="py-1 text-xs text-right">{comanda.cantitate} {comanda.unitate_masura}</TableCell>
                          <TableCell className="py-1 text-xs"><Badge className={statusColors[comanda.status]}>{comanda.status}</Badge></TableCell>
                          <TableCell className="py-1 text-xs"><Badge className={priorityColors[comanda.prioritate]}>{comanda.prioritate}</Badge></TableCell>
                          <TableCell className="py-1 text-xs">{comanda.avans}</TableCell>
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
                                  <span className="font-medium text-xs">{comanda.cod_comanda}</span>
                                  <Badge className={priorityColors[comanda.prioritate]} variant="outline">{comanda.prioritate}</Badge>
                                </div>
                                <p className="text-sm font-medium mb-1">{comanda.client}</p>
                                <p className="text-xs text-muted-foreground mb-2">{comanda.produs} - {comanda.cantitate} {comanda.unitate_masura}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CalendarIcon className="h-3 w-3" />
                                  {comanda.data}
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
                            <p className="text-lg font-bold">{comanda.data}</p>
                          </div>
                          <Separator orientation="vertical" className="h-12" />
                          <div className="flex-1">
                            <p className="font-medium">{comanda.client}</p>
                            <p className="text-sm text-muted-foreground">{comanda.produs} - {comanda.cantitate} {comanda.unitate_masura}</p>
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
                <DialogTitle>Detalii Comandă - {viewingDetails?.cod_comanda}</DialogTitle>
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
                <div><span className="text-muted-foreground">Cantitate:</span> <span className="font-medium">{viewingDetails.cantitate} {viewingDetails.unitate_masura}</span></div>
                <div><span className="text-muted-foreground">Data:</span> <span className="font-medium">{viewingDetails.data}</span></div>
                <div><span className="text-muted-foreground">Fereastră:</span> <span className="font-medium">{viewingDetails.fereastra_incarcare}</span></div>
                <div><span className="text-muted-foreground">Punct descărcare:</span> <span className="font-medium">{viewingDetails.punct_descarcare}</span></div>
                <div><span className="text-muted-foreground">Avans:</span> <span className="font-medium">{viewingDetails.avans}</span></div>
                {viewingDetails.observatii && (
                  <div className="col-span-2 pt-2 border-t mt-1">
                    <span className="text-muted-foreground">Observații:</span> <span className="font-medium">{viewingDetails.observatii}</span>
                  </div>
                )}
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
                <FilterableSelect
                  value={form.client}
                  onValueChange={(v) => setForm({ ...form, client: v })}
                  options={clientOptions}
                  placeholder="Selectează client"
                  searchPlaceholder="Caută client..."
                  emptyText="Nu s-au găsit clienți"
                />
              </div>
              <div className="space-y-2">
                <Label>Produs *</Label>
                <FilterableSelect
                  value={form.produs}
                  onValueChange={(v) => setForm({ ...form, produs: v })}
                  options={produsOptions}
                  placeholder="Selectează produs"
                  searchPlaceholder="Caută produs..."
                  emptyText="Nu s-au găsit produse"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Cantitate *</Label>
                <Input type="number" value={form.cantitate} onChange={(e) => setForm({ ...form, cantitate: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Unitate măsură</Label>
                <Select value={form.unitate_masura} onValueChange={(v) => setForm({ ...form, unitate_masura: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tone">tone</SelectItem>
                    <SelectItem value="mc">mc</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Fereastră încărcare</Label>
              <TimeRangePicker
                value={form.fereastra_incarcare || "08:00 - 12:00"}
                onChange={(v) => setForm({ ...form, fereastra_incarcare: v })}
              />
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
                <Label>Avans</Label>
                <Input type="number" placeholder="0" value={form.avans} onChange={(e) => setForm({ ...form, avans: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Punct descărcare</Label>
              <Input placeholder="Adresa/locația de descărcare" value={form.punct_descarcare} onChange={(e) => setForm({ ...form, punct_descarcare: e.target.value })} />
            </div>
            {editing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as OrderStatus })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Preaprobat">Preaprobat</SelectItem>
                    <SelectItem value="Aprobat">Aprobat</SelectItem>
                    <SelectItem value="Planificat">Planificat</SelectItem>
                    <SelectItem value="In Productie">In Productie</SelectItem>
                    <SelectItem value="Livrat">Livrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
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
              Ești sigur că vrei să ștergi comanda {deleting?.cod_comanda}? Această acțiune nu poate fi anulată.
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
