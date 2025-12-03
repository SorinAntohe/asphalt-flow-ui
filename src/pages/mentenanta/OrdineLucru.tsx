import { useState, useMemo } from "react";
import { HardHat, Plus, Download, AlertCircle, Clock, CheckCircle2, Wrench, Users, Printer, FileText, Upload, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table";
import { exportToCSV } from "@/lib/exportUtils";
import { cn } from "@/lib/utils";

type WorkOrderStatus = "deschis" | "alocat" | "in_lucru" | "inchis";
type WorkOrderType = "preventiva" | "corectiva";
type WorkOrderPriority = "scazuta" | "medie" | "ridicata" | "critica";

interface WorkOrder {
  id: number;
  nr_ordine: string;
  utilaj: string;
  tip: WorkOrderType;
  prioritate: WorkOrderPriority;
  status: WorkOrderStatus;
  timp_stationare: number; // hours
  cost: number;
  descriere: string;
  data_creare: string;
  data_finalizare?: string;
  tehnician?: string;
  piese_folosite: { nume: string; cantitate: number; cost: number }[];
  timpi: { activitate: string; durata: number }[];
  fotografii: string[];
  timeline: { data: string; actiune: string; user: string }[];
}

// Mock data
const mockWorkOrders: WorkOrder[] = [
  {
    id: 1,
    nr_ordine: "OL-2025-001",
    utilaj: "EXC-001 - Excavator Komatsu PC210",
    tip: "corectiva",
    prioritate: "critica",
    status: "in_lucru",
    timp_stationare: 6,
    cost: 1850,
    descriere: "Sistem hidraulic defect - scurgere ulei la cilindrul braț",
    data_creare: "28/11/2025",
    tehnician: "Ion Popescu",
    piese_folosite: [
      { nume: "Garnitură cilindru", cantitate: 1, cost: 350 },
      { nume: "Ulei hidraulic 20L", cantitate: 2, cost: 450 },
    ],
    timpi: [
      { activitate: "Diagnosticare", durata: 1.5 },
      { activitate: "Demontare cilindru", durata: 2 },
      { activitate: "Montare garnituri noi", durata: 1.5 },
    ],
    fotografii: ["photo1.jpg", "photo2.jpg"],
    timeline: [
      { data: "28/11/2025 08:30", actiune: "Ordine creată", user: "Maria Ionescu" },
      { data: "28/11/2025 09:00", actiune: "Asignat tehnicianului Ion Popescu", user: "Maria Ionescu" },
      { data: "28/11/2025 09:30", actiune: "Început intervenție", user: "Ion Popescu" },
    ],
  },
  {
    id: 2,
    nr_ordine: "OL-2025-002",
    utilaj: "MIX-001 - Centrală asfalt Ammann 240t/h",
    tip: "preventiva",
    prioritate: "medie",
    status: "alocat",
    timp_stationare: 0,
    cost: 2400,
    descriere: "Revizie preventivă programată - 250h funcționare",
    data_creare: "01/12/2025",
    tehnician: "Andrei Dumitrescu",
    piese_folosite: [
      { nume: "Filtru ulei", cantitate: 3, cost: 450 },
      { nume: "Ulei motor", cantitate: 20, cost: 1200 },
      { nume: "Bandă transportoare", cantitate: 1, cost: 750 },
    ],
    timpi: [],
    fotografii: [],
    timeline: [
      { data: "01/12/2025 14:00", actiune: "Ordine creată", user: "Maria Ionescu" },
      { data: "01/12/2025 14:30", actiune: "Asignat tehnicianului Andrei Dumitrescu", user: "Maria Ionescu" },
    ],
  },
  {
    id: 3,
    nr_ordine: "OL-2025-003",
    utilaj: "FIN-001 - Finișer Vogele Super 1800",
    tip: "corectiva",
    prioritate: "ridicata",
    status: "deschis",
    timp_stationare: 12,
    cost: 0,
    descriere: "Sistem de nivelare automată nu funcționează corect",
    data_creare: "27/11/2025",
    piese_folosite: [],
    timpi: [],
    fotografii: [],
    timeline: [
      { data: "27/11/2025 16:45", actiune: "Ordine creată", user: "Șofer Constantin" },
    ],
  },
  {
    id: 4,
    nr_ordine: "OL-2025-004",
    utilaj: "CAM-003 - Camion MAN TGS 8x4",
    tip: "corectiva",
    prioritate: "scazuta",
    status: "inchis",
    timp_stationare: 4,
    cost: 850,
    descriere: "Înlocuire plăcuțe frână față",
    data_creare: "25/11/2025",
    data_finalizare: "26/11/2025",
    tehnician: "Ion Popescu",
    piese_folosite: [
      { nume: "Set plăcuțe frână", cantitate: 1, cost: 600 },
      { nume: "Lichid frână", cantitate: 1, cost: 50 },
    ],
    timpi: [
      { activitate: "Demontare roți", durata: 0.5 },
      { activitate: "Înlocuire plăcuțe", durata: 2 },
      { activitate: "Test frânare", durata: 0.5 },
    ],
    fotografii: ["photo3.jpg"],
    timeline: [
      { data: "25/11/2025 10:00", actiune: "Ordine creată", user: "Maria Ionescu" },
      { data: "25/11/2025 10:30", actiune: "Asignat tehnicianului Ion Popescu", user: "Maria Ionescu" },
      { data: "25/11/2025 11:00", actiune: "Început intervenție", user: "Ion Popescu" },
      { data: "26/11/2025 14:00", actiune: "Ordine închisă", user: "Ion Popescu" },
    ],
  },
];

const OrdineLucru = () => {
  const [workOrders] = useState<WorkOrder[]>(mockWorkOrders);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting state
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtered and sorted data
  const filteredWorkOrders = useMemo(() => {
    let filtered = workOrders;

    if (filterStatus !== "all") {
      filtered = filtered.filter(wo => wo.status === filterStatus);
    }
    if (filterPriority !== "all") {
      filtered = filtered.filter(wo => wo.prioritate === filterPriority);
    }
    if (filterType !== "all") {
      filtered = filtered.filter(wo => wo.tip === filterType);
    }

    if (sortField) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortField as keyof WorkOrder];
        const bVal = b[sortField as keyof WorkOrder];
        
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        return 0;
      });
    }

    return filtered;
  }, [workOrders, filterStatus, filterPriority, filterType, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const total = workOrders.length;
    const deschis = workOrders.filter(wo => wo.status === "deschis").length;
    const in_lucru = workOrders.filter(wo => wo.status === "in_lucru").length;
    const inchis = workOrders.filter(wo => wo.status === "inchis").length;
    const cost_total = workOrders.reduce((sum, wo) => sum + wo.cost, 0);
    
    return { total, deschis, in_lucru, inchis, cost_total };
  }, [workOrders]);

  // Pagination
  const paginatedWorkOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredWorkOrders.slice(startIndex, endIndex);
  }, [filteredWorkOrders, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredWorkOrders.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleExport = () => {
    const exportData = filteredWorkOrders.map(wo => ({
      nr_ordine: wo.nr_ordine,
      utilaj: wo.utilaj,
      tip: wo.tip === "preventiva" ? "Preventivă" : "Corectivă",
      prioritate: getPriorityLabel(wo.prioritate),
      status: getStatusLabel(wo.status),
      timp_stationare: wo.timp_stationare,
      cost: wo.cost,
      data_creare: wo.data_creare,
      tehnician: wo.tehnician || "-",
    }));

    const columns = [
      { key: "nr_ordine" as const, label: "Nr. Ordine" },
      { key: "utilaj" as const, label: "Utilaj" },
      { key: "tip" as const, label: "Tip" },
      { key: "prioritate" as const, label: "Prioritate" },
      { key: "status" as const, label: "Status" },
      { key: "timp_stationare" as const, label: "Timp Staționare (ore)" },
      { key: "cost" as const, label: "Cost (RON)" },
      { key: "data_creare" as const, label: "Data Creare" },
      { key: "tehnician" as const, label: "Tehnician" },
    ];

    exportToCSV(exportData, "ordine_lucru", columns);
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    const variants: Record<WorkOrderStatus, { variant: "default" | "warning" | "success" | "info"; label: string; icon: any }> = {
      deschis: { variant: "warning", label: "Deschis", icon: AlertCircle },
      alocat: { variant: "info", label: "Alocat", icon: Users },
      in_lucru: { variant: "default", label: "În lucru", icon: Wrench },
      inchis: { variant: "success", label: "Închis", icon: CheckCircle2 },
    };
    const config = variants[status];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getStatusLabel = (status: WorkOrderStatus) => {
    const labels: Record<WorkOrderStatus, string> = {
      deschis: "Deschis",
      alocat: "Alocat",
      in_lucru: "În lucru",
      inchis: "Închis",
    };
    return labels[status];
  };

  const getPriorityBadge = (priority: WorkOrderPriority) => {
    const variants: Record<WorkOrderPriority, { variant: "default" | "warning" | "destructive" | "info"; label: string }> = {
      scazuta: { variant: "info", label: "Scăzută" },
      medie: { variant: "default", label: "Medie" },
      ridicata: { variant: "warning", label: "Ridicată" },
      critica: { variant: "destructive", label: "Critică" },
    };
    const config = variants[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityLabel = (priority: WorkOrderPriority) => {
    const labels: Record<WorkOrderPriority, string> = {
      scazuta: "Scăzută",
      medie: "Medie",
      ridicata: "Ridicată",
      critica: "Critică",
    };
    return labels[priority];
  };

  const getTypeBadge = (type: WorkOrderType) => {
    return type === "preventiva" ? (
      <Badge variant="outline">Preventivă</Badge>
    ) : (
      <Badge variant="outline">Corectivă</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <HardHat className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ordine de Lucru</h1>
            <p className="text-muted-foreground">Intervenții corective și preventive</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă Ordine
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Ordine</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Deschise</p>
                <p className="text-2xl font-bold">{stats.deschis}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">În Lucru</p>
                <p className="text-2xl font-bold">{stats.in_lucru}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Închise</p>
                <p className="text-2xl font-bold">{stats.inchis}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Total</p>
                <p className="text-2xl font-bold">{stats.cost_total.toLocaleString()} RON</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 gap-1.5 font-semibold text-xs hover:bg-primary/10 transition-colors",
                        sortField === "nr_ordine" && "text-primary"
                      )}
                      onClick={() => handleSort("nr_ordine")}
                    >
                      Nr.
                      <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "nr_ordine" ? "" : "opacity-50")} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 gap-1.5 font-semibold text-xs hover:bg-primary/10 transition-colors",
                        sortField === "utilaj" && "text-primary"
                      )}
                      onClick={() => handleSort("utilaj")}
                    >
                      Utilaj
                      <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "utilaj" ? "" : "opacity-50")} />
                    </Button>
                  </TableHead>
                  <TableHead>Tip</TableHead>
                  <TableHead>Prioritate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 gap-1.5 font-semibold text-xs hover:bg-primary/10 transition-colors",
                        sortField === "timp_stationare" && "text-primary"
                      )}
                      onClick={() => handleSort("timp_stationare")}
                    >
                      Timp Staționare (h)
                      <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "timp_stationare" ? "" : "opacity-50")} />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 px-2 gap-1.5 font-semibold text-xs hover:bg-primary/10 transition-colors",
                        sortField === "cost" && "text-primary"
                      )}
                      onClick={() => handleSort("cost")}
                    >
                      Cost (RON)
                      <ArrowUpDown className={cn("h-3.5 w-3.5", sortField === "cost" ? "" : "opacity-50")} />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedWorkOrders.length > 0 ? (
                  paginatedWorkOrders.map((wo) => (
                    <TableRow
                      key={wo.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedWorkOrder(wo)}
                    >
                      <TableCell className="font-medium">{wo.nr_ordine}</TableCell>
                      <TableCell>{wo.utilaj}</TableCell>
                      <TableCell>{getTypeBadge(wo.tip)}</TableCell>
                      <TableCell>{getPriorityBadge(wo.prioritate)}</TableCell>
                      <TableCell>{getStatusBadge(wo.status)}</TableCell>
                      <TableCell>
                        <span className={wo.timp_stationare > 8 ? "text-destructive font-semibold" : ""}>
                          {wo.timp_stationare}h
                        </span>
                      </TableCell>
                      <TableCell>{wo.cost.toLocaleString()} RON</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                      Nu există ordine de lucru care să corespundă filtrelor selectate
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredWorkOrders.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Ordine de Lucru</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="utilaj">Utilaj / Echipament</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează utilaj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXC-001">EXC-001 - Excavator Komatsu PC210</SelectItem>
                  <SelectItem value="MIX-001">MIX-001 - Centrală asfalt Ammann 240t/h</SelectItem>
                  <SelectItem value="CAM-003">CAM-003 - Camion MAN TGS 8x4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tip">Tip Intervenție</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="preventiva">Preventivă</SelectItem>
                    <SelectItem value="corectiva">Corectivă</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="prioritate">Prioritate</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează prioritate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scazuta">Scăzută</SelectItem>
                    <SelectItem value="medie">Medie</SelectItem>
                    <SelectItem value="ridicata">Ridicată</SelectItem>
                    <SelectItem value="critica">Critică</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descriere">Descriere Problemă</Label>
              <Textarea 
                id="descriere" 
                placeholder="Descrie problema raportată..."
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fotografii">Încarcă Fotografii (opțional)</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Selectează fișiere
                </Button>
                <span className="text-sm text-muted-foreground">Max 5 fotografii</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Creează Ordine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Peek Drawer (Sheet) */}
      <Sheet open={!!selectedWorkOrder} onOpenChange={(open) => !open && setSelectedWorkOrder(null)}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {selectedWorkOrder && (
            <>
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle>{selectedWorkOrder.nr_ordine}</SheetTitle>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedWorkOrder.status)}
                    {getPriorityBadge(selectedWorkOrder.prioritate)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{selectedWorkOrder.utilaj}</p>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tip Intervenție</p>
                    <p className="font-medium text-foreground mt-1">
                      {selectedWorkOrder.tip === "preventiva" ? "Preventivă" : "Corectivă"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data Creare</p>
                    <p className="font-medium text-foreground mt-1">{selectedWorkOrder.data_creare}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tehnician</p>
                    <p className="font-medium text-foreground mt-1">{selectedWorkOrder.tehnician || "Neasignat"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timp Staționare</p>
                    <p className={`font-medium mt-1 ${selectedWorkOrder.timp_stationare > 8 ? "text-destructive" : "text-foreground"}`}>
                      {selectedWorkOrder.timp_stationare} ore
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Total</p>
                    <p className="font-medium text-foreground mt-1">{selectedWorkOrder.cost.toLocaleString()} RON</p>
                  </div>
                  {selectedWorkOrder.data_finalizare && (
                    <div>
                      <p className="text-sm text-muted-foreground">Data Finalizare</p>
                      <p className="font-medium text-foreground mt-1">{selectedWorkOrder.data_finalizare}</p>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Descriere</p>
                  <p className="text-sm text-foreground">{selectedWorkOrder.descriere}</p>
                </div>

                {/* Piese folosite */}
                {selectedWorkOrder.piese_folosite.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Piese Folosite</p>
                    <div className="space-y-2">
                      {selectedWorkOrder.piese_folosite.map((piesa, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div>
                            <p className="text-sm font-medium text-foreground">{piesa.nume}</p>
                            <p className="text-xs text-muted-foreground">Cantitate: {piesa.cantitate}</p>
                          </div>
                          <p className="text-sm font-semibold text-foreground">{piesa.cost.toLocaleString()} RON</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timpi */}
                {selectedWorkOrder.timpi.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Timp Alocat pe Activități</p>
                    <div className="space-y-2">
                      {selectedWorkOrder.timpi.map((timp, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <p className="text-sm text-foreground">{timp.activitate}</p>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            {timp.durata}h
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fotografii */}
                {selectedWorkOrder.fotografii.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">Fotografii</p>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedWorkOrder.fotografii.map((foto, idx) => (
                        <div key={idx} className="aspect-video bg-muted rounded-md flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">{foto}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Timeline Execuție</p>
                  <div className="space-y-3">
                    {selectedWorkOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-3 relative">
                        {idx !== selectedWorkOrder.timeline.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
                        )}
                        <div className="w-4 h-4 rounded-full bg-primary mt-1 z-10" />
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-medium text-foreground">{event.actiune}</p>
                          <p className="text-xs text-muted-foreground">
                            {event.data} • {event.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                  {selectedWorkOrder.status !== "inchis" && (
                    <>
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => {
                          setIsAssignDialogOpen(true);
                        }}
                      >
                        <Users className="h-4 w-4" />
                        Asignează
                      </Button>
                      <Button className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Închide Ordine
                      </Button>
                    </>
                  )}
                  <Button variant="outline" className="gap-2">
                    <Printer className="h-4 w-4" />
                    Tipărește Raport
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Assign Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Asignează Tehnician</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tehnician">Tehnician</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează tehnician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ion">Ion Popescu</SelectItem>
                  <SelectItem value="maria">Maria Ionescu</SelectItem>
                  <SelectItem value="andrei">Andrei Dumitrescu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => setIsAssignDialogOpen(false)}>
              Asignează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdineLucru;
