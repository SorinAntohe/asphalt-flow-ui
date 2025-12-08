import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  FileDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Thermometer,
  Gauge,
  Clock,
  User,
  FileText,
  Camera,
  Send,
  Lock,
  Unlock,
  Tag,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  AlertCircle,
  Upload,
  Image,
  File,
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
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { API_BASE_URL } from "@/lib/api";
import { FilterableSelect } from "@/components/ui/filterable-select";

// Types
interface ParametruMasurat {
  nume: string;
  valoare: number;
  unitate: string;
  tinta: number;
  tolerantaMinus: number;
  tolerantaPlus: number;
  status: "ok" | "warning" | "error";
}

interface Atasament {
  id: number;
  nume: string;
  tip: "foto" | "document";
  dataAdaugare: string;
}

interface Lot {
  id: number;
  codLot: string;
  ordin: string;
  reteta: string;
  cantitate: number;
  unitateMasura: string;
  dataOra: string;
  operator: string;
  linie: string;
  parametri: ParametruMasurat[];
  verdictQC: "Conform" | "Neconform" | "În așteptare" | "Blocat";
  observatii: string;
  atasamente: Atasament[];
  trimisLaQC: boolean;
  dataQC?: string;
  inspectorQC?: string;
}
const verdictConfig: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ReactNode; color: string }> = {
  "Conform": { variant: "default", icon: <CheckCircle2 className="h-3 w-3" />, color: "text-green-600" },
  "Neconform": { variant: "destructive", icon: <XCircle className="h-3 w-3" />, color: "text-red-600" },
  "În așteptare": { variant: "secondary", icon: <Clock className="h-3 w-3" />, color: "text-yellow-600" },
  "Blocat": { variant: "outline", icon: <Lock className="h-3 w-3" />, color: "text-orange-600" }
};

const Loturi = () => {
  const [loturi, setLoturi] = useState<Lot[]>([]);
  const [selectedLot, setSelectedLot] = useState<Lot | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [qcDialogOpen, setQcDialogOpen] = useState(false);
  const [qcVerdict, setQcVerdict] = useState<"Conform" | "Neconform">("Conform");
  const [qcObservatii, setQcObservatii] = useState("");

  // Retete state
  const [reteteDisponibile, setReteteDisponibile] = useState<{ value: string; label: string }[]>([]);
  const [selectedReteta, setSelectedReteta] = useState("");

  // Filters & Sort
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch retete
  useEffect(() => {
    const fetchRetete = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
        if (response.ok) {
          const data = await response.json();
          const options = Array.isArray(data) 
            ? data.map((r: { cod_reteta: string; denumire?: string }) => ({
                value: r.cod_reteta,
                label: r.denumire ? `${r.cod_reteta} - ${r.denumire}` : r.cod_reteta
              }))
            : [];
          setReteteDisponibile(options);
        }
      } catch (error) {
        console.error("Error fetching retete:", error);
      }
    };
    fetchRetete();
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = loturi.length;
    const conform = loturi.filter(l => l.verdictQC === "Conform").length;
    const neconform = loturi.filter(l => l.verdictQC === "Neconform").length;
    const inAsteptare = loturi.filter(l => l.verdictQC === "În așteptare").length;
    const rataConformitate = total > 0 ? Math.round((conform / (conform + neconform || 1)) * 100) : 0;
    return { total, conform, neconform, inAsteptare, rataConformitate };
  }, [loturi]);

  // Filter and sort
  const filteredLoturi = useMemo(() => {
    let result = [...loturi];

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(item => {
          const itemValue = String(item[key as keyof Lot] || "").toLowerCase();
          return itemValue.includes(value.toLowerCase());
        });
      }
    });

    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey as keyof Lot];
        const bVal = b[sortKey as keyof Lot];
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [loturi, filters, sortKey, sortDirection]);

  const paginatedLoturi = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLoturi.slice(start, start + itemsPerPage);
  }, [filteredLoturi, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredLoturi.length / itemsPerPage);

  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortKey(key);
    setSortDirection(direction);
  };

  const handleFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const exportData = loturi.map(l => ({
      ...l,
      temperatura: l.parametri.find(p => p.nume === "Temperatură")?.valoare || "-",
      marshall: l.parametri.find(p => p.nume === "Marshall")?.valoare || "-",
      slump: l.parametri.find(p => p.nume === "Slump")?.valoare || "-"
    }));
    exportToCSV(exportData, "loturi_productie", [
      { key: "codLot", label: "Cod Lot" },
      { key: "ordin", label: "Ordin" },
      { key: "cantitate", label: "Cantitate" },
      { key: "dataOra", label: "Data/Ora" },
      { key: "operator", label: "Operator" },
      { key: "temperatura", label: "Temperatură °C" },
      { key: "marshall", label: "Marshall kN" },
      { key: "verdictQC", label: "Verdict QC" }
    ]);
    toast.success("Export CSV realizat cu succes");
  };

  const handleRowClick = (lot: Lot) => {
    setSelectedLot(lot);
    setDetailDialogOpen(true);
  };

  const handleConfirmaLot = (lot: Lot) => {
    setLoturi(prev => prev.map(l => 
      l.id === lot.id ? { ...l, verdictQC: "Conform" as const, trimisLaQC: true } : l
    ));
    toast.success(`Lotul ${lot.codLot} a fost confirmat`);
    setDetailDialogOpen(false);
  };

  const handleTrimiteQC = (lot: Lot) => {
    setSelectedLot(lot);
    setQcVerdict("Conform");
    setQcObservatii("");
    setQcDialogOpen(true);
  };

  const handleSubmitQC = () => {
    if (selectedLot) {
      setLoturi(prev => prev.map(l => 
        l.id === selectedLot.id ? { 
          ...l, 
          verdictQC: qcVerdict, 
          observatii: qcObservatii,
          trimisLaQC: true,
          dataQC: new Date().toLocaleString('ro-RO'),
          inspectorQC: "Inspector QC"
        } : l
      ));
      toast.success(`Verdict QC pentru ${selectedLot.codLot}: ${qcVerdict}`);
      setQcDialogOpen(false);
      setDetailDialogOpen(false);
    }
  };

  const handleBlocheaza = (lot: Lot) => {
    setLoturi(prev => prev.map(l => 
      l.id === lot.id ? { ...l, verdictQC: "Blocat" as const } : l
    ));
    toast.warning(`Lotul ${lot.codLot} a fost blocat`);
    setDetailDialogOpen(false);
  };

  const handleElibereaza = (lot: Lot) => {
    setLoturi(prev => prev.map(l => 
      l.id === lot.id ? { ...l, verdictQC: "În așteptare" as const } : l
    ));
    toast.success(`Lotul ${lot.codLot} a fost eliberat`);
    setDetailDialogOpen(false);
  };

  const handlePrintEticheta = (lot: Lot) => {
    toast.info(`Se generează eticheta pentru ${lot.codLot}`);
  };

  const getParameterDeviation = (param: ParametruMasurat) => {
    const deviation = param.valoare - param.tinta;
    const deviationPercent = (deviation / param.tinta) * 100;
    return { deviation, deviationPercent };
  };

  const getParameterBarWidth = (param: ParametruMasurat) => {
    const range = param.tolerantaMinus + param.tolerantaPlus;
    const position = (param.valoare - (param.tinta - param.tolerantaMinus)) / range;
    return Math.max(0, Math.min(100, position * 100));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Loturi & Telemetrie</h1>
            <p className="text-muted-foreground">Monitorizare loturi de producție și parametri de calitate</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={loturi.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Lot
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Loturi</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conforme</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.conform}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Neconforme</p>
                <p className="text-2xl font-bold text-red-600">{stats.neconform}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">În Așteptare</p>
                <p className="text-2xl font-bold text-amber-600">{stats.inAsteptare}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Rata Conformitate</p>
                <p className="text-2xl font-bold">{stats.rataConformitate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={stats.rataConformitate} className="mt-2 h-2" />
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
                    <DataTableColumnHeader
                      title="Cod Lot"
                      sortKey="codLot"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={filters.codLot || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("codLot", value)}
                    />
                  </TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Ordin"
                      sortKey="ordin"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={filters.ordin || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("ordin", value)}
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
                      title="Data/Ora"
                      sortKey="dataOra"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={filters.dataOra || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("dataOra", value)}
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
                  <TableHead>Parametri</TableHead>
                  <TableHead>
                    <DataTableColumnHeader
                      title="Verdict QC"
                      sortKey="verdictQC"
                      currentSort={sortKey ? { key: sortKey, direction: sortDirection } : null}
                      filterValue={filters.verdictQC || ""}
                      onSort={handleSort}
                      onFilterChange={(value) => handleFilter("verdictQC", value)}
                    />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLoturi.length === 0 ? (
                  <DataTableEmpty colSpan={7} message="Nu există loturi de producție" />
                ) : (
                  paginatedLoturi.map((lot) => (
                    <TableRow
                      key={lot.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(lot)}
                    >
                      <TableCell className="font-medium">{lot.codLot}</TableCell>
                      <TableCell>{lot.ordin}</TableCell>
                      <TableCell>{lot.cantitate} {lot.unitateMasura}</TableCell>
                      <TableCell>{lot.dataOra}</TableCell>
                      <TableCell>{lot.operator}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {lot.parametri.slice(0, 3).map((param, idx) => (
                            <TooltipProvider key={idx}>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Badge 
                                    variant={param.status === "ok" ? "outline" : param.status === "warning" ? "secondary" : "destructive"}
                                    className="text-xs"
                                  >
                                    {param.nume === "Temperatură" && <Thermometer className="h-3 w-3 mr-1" />}
                                    {(param.nume === "Marshall" || param.nume === "Slump") && <Gauge className="h-3 w-3 mr-1" />}
                                    {param.valoare}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{param.nume}: {param.valoare} {param.unitate}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Țintă: {param.tinta} ({param.tinta - param.tolerantaMinus} - {param.tinta + param.tolerantaPlus})
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={verdictConfig[lot.verdictQC].variant} className="gap-1">
                          {verdictConfig[lot.verdictQC].icon}
                          {lot.verdictQC}
                        </Badge>
                      </TableCell>
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
              totalItems={filteredLoturi.length}
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

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col" hideCloseButton>
          {selectedLot && (
            <>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="flex items-center gap-2">
                  {selectedLot.codLot}
                  <Badge variant={verdictConfig[selectedLot.verdictQC].variant} className="gap-1">
                    {verdictConfig[selectedLot.verdictQC].icon}
                    {selectedLot.verdictQC}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedLot.reteta}</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="parametri" className="flex-1 flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-3 flex-shrink-0">
                  <TabsTrigger value="parametri">Parametri</TabsTrigger>
                  <TabsTrigger value="info">Informații</TabsTrigger>
                  <TabsTrigger value="atasamente">Atașamente</TabsTrigger>
                </TabsList>

                <div className="flex-1 overflow-y-auto mt-3">
                  {/* Parametri Tab */}
                  <TabsContent value="parametri" className="space-y-3 m-0">
                    <div className="grid gap-3">
                      {selectedLot.parametri.map((param, idx) => {
                        const { deviation, deviationPercent } = getParameterDeviation(param);
                        const barWidth = getParameterBarWidth(param);
                        
                        return (
                          <Card key={idx} className={`border-l-4 ${
                            param.status === "ok" ? "border-l-green-500" : 
                            param.status === "warning" ? "border-l-yellow-500" : "border-l-red-500"
                          }`}>
                            <CardContent className="p-3">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  {param.nume === "Temperatură" && <Thermometer className="h-4 w-4 text-orange-500" />}
                                  {(param.nume === "Marshall" || param.nume === "Slump") && <Gauge className="h-4 w-4 text-purple-500" />}
                                  <span className="font-medium text-sm">{param.nume}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {param.status === "ok" ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  ) : param.status === "warning" ? (
                                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}
                                  <span className={`font-bold ${
                                    param.status === "ok" ? "text-green-600" : 
                                    param.status === "warning" ? "text-yellow-600" : "text-red-600"
                                  }`}>
                                    {param.valoare} {param.unitate}
                                  </span>
                                </div>
                              </div>
                              
                              {/* Visual Range Bar */}
                              <div className="relative h-5 bg-muted rounded-full overflow-hidden mb-1">
                                <div className="absolute inset-y-0 left-0 right-0 flex">
                                  <div className="flex-1 bg-red-200" />
                                  <div className="w-1/3 bg-green-200" />
                                  <div className="flex-1 bg-red-200" />
                                </div>
                                <div 
                                  className={`absolute top-0.5 bottom-0.5 w-2.5 rounded-full ${
                                    param.status === "ok" ? "bg-green-500" : 
                                    param.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                                  }`}
                                  style={{ left: `calc(${barWidth}% - 5px)` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>{param.tinta - param.tolerantaMinus} {param.unitate}</span>
                                <span className="font-medium">Țintă: {param.tinta} {param.unitate}</span>
                                <span>{param.tinta + param.tolerantaPlus} {param.unitate}</span>
                              </div>

                              {/* Deviation Info */}
                              <div className="flex items-center justify-end gap-1 text-xs">
                                {deviation > 0 ? (
                                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 text-muted-foreground" />
                                )}
                                <span className={deviation === 0 ? "text-green-600" : "text-muted-foreground"}>
                                  {deviation > 0 ? "+" : ""}{deviation.toFixed(2)} {param.unitate} ({deviationPercent.toFixed(1)}%)
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Control Chart Preview */}
                    <Card>
                      <CardContent className="p-3">
                        <p className="text-sm font-medium flex items-center gap-2 mb-2">
                          <Activity className="h-4 w-4" />
                          Grafic Control (Trend)
                        </p>
                        <div className="h-20 flex items-center justify-center bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground text-xs">
                            Grafic de control - integrare StonemontQC
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Info Tab */}
                  <TabsContent value="info" className="space-y-3 m-0">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ordin Producție:</span>
                        <span className="font-medium ml-1">{selectedLot.ordin}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cantitate:</span>
                        <span className="font-medium ml-1">{selectedLot.cantitate} {selectedLot.unitateMasura}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Data/Ora:</span>
                        <span className="font-medium ml-1">{selectedLot.dataOra}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Operator:</span>
                        <span className="font-medium ml-1">{selectedLot.operator}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Rețetă:</span>
                        <span className="font-medium ml-1">{selectedLot.reteta}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Informații QC</span>
                      {selectedLot.trimisLaQC ? (
                        <div className="grid grid-cols-2 gap-3 p-2 bg-muted/50 rounded-lg text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs">Data Verificare:</span>
                            <span className="font-medium ml-1">{selectedLot.dataQC || "-"}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Inspector QC:</span>
                            <span className="font-medium ml-1">{selectedLot.inspectorQC || "-"}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Nu a fost trimis la QC</p>
                      )}
                    </div>

                    {selectedLot.observatii && (
                      <>
                        <Separator />
                        <div>
                          <span className="text-sm text-muted-foreground">Observații:</span>
                          <p className="text-sm mt-1">{selectedLot.observatii}</p>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  {/* Atasamente Tab */}
                  <TabsContent value="atasamente" className="space-y-3 m-0">
                    {selectedLot.atasamente.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Niciun atașament</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedLot.atasamente.map((atasament) => (
                          <div 
                            key={atasament.id} 
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              {atasament.tip === "foto" ? (
                                <Camera className="h-4 w-4 text-blue-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-orange-500" />
                              )}
                              <div>
                                <p className="font-medium text-sm">{atasament.nume}</p>
                                <p className="text-xs text-muted-foreground">{atasament.dataAdaugare}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <FileDown className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Adaugă Atașament
                    </Button>
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="flex-shrink-0 flex-wrap gap-1 pt-2">
                {!selectedLot.trimisLaQC && (
                  <Button size="sm" onClick={() => handleTrimiteQC(selectedLot)}>
                    <Send className="h-4 w-4 mr-1" />
                    Trimite la QC
                  </Button>
                )}
                {selectedLot.verdictQC === "În așteptare" && (
                  <Button size="sm" variant="default" onClick={() => handleConfirmaLot(selectedLot)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Confirmă Lot
                  </Button>
                )}
                {selectedLot.verdictQC !== "Blocat" && (
                  <Button size="sm" variant="outline" onClick={() => handleBlocheaza(selectedLot)}>
                    <Lock className="h-4 w-4 mr-1" />
                    Blochează
                  </Button>
                )}
                {selectedLot.verdictQC === "Blocat" && (
                  <Button size="sm" variant="outline" onClick={() => handleElibereaza(selectedLot)}>
                    <Unlock className="h-4 w-4 mr-1" />
                    Eliberează
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => handlePrintEticheta(selectedLot)}>
                  <Tag className="h-4 w-4 mr-1" />
                  Etichetă Lot
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* QC Dialog */}
      <Dialog open={qcDialogOpen} onOpenChange={setQcDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Verdict QC</DialogTitle>
            <DialogDescription>
              Introduceți verdictul de calitate pentru {selectedLot?.codLot}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Verdict</Label>
              <Select value={qcVerdict} onValueChange={(v) => setQcVerdict(v as typeof qcVerdict)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conform">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Conform
                    </div>
                  </SelectItem>
                  <SelectItem value="Neconform">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-600" />
                      Neconform
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Observații</Label>
              <Textarea
                value={qcObservatii}
                onChange={(e) => setQcObservatii(e.target.value)}
                placeholder="Observații suplimentare..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQcDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleSubmitQC}>
              Salvează Verdict
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Lot</DialogTitle>
            <DialogDescription>
              Înregistrați un nou lot de producție
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ordin Producție</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează ordin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OP-2024-001">OP-2024-001</SelectItem>
                    <SelectItem value="OP-2024-002">OP-2024-002</SelectItem>
                    <SelectItem value="OP-2024-003">OP-2024-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Rețetă</Label>
                <FilterableSelect
                  options={reteteDisponibile}
                  value={selectedReteta}
                  onValueChange={setSelectedReteta}
                  placeholder="Selectează rețetă"
                />
              </div>
              <div>
                <Label>Cantitate</Label>
                <Input type="number" placeholder="Ex: 50" />
              </div>
              <div>
                <Label>Operator</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ion Popescu">Ion Popescu</SelectItem>
                    <SelectItem value="Maria Dumitrescu">Maria Dumitrescu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Parametri Măsurați</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Temperatură (°C)</Label>
                  <Input type="number" placeholder="Ex: 160" />
                </div>
                <div>
                  <Label className="text-xs">Marshall (kN)</Label>
                  <Input type="number" step="0.1" placeholder="Ex: 12.0" />
                </div>
              </div>
            </div>

            <div>
              <Label>Observații</Label>
              <Textarea placeholder="Observații opționale..." />
            </div>

            <Separator />

            {/* File Upload Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Atașamente
              </Label>
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      toast.info(`${files.length} fișier(e) selectat(e)`);
                    }
                  }}
                />
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-muted/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click pentru a încărca fișiere</span>
                  <span className="text-xs text-muted-foreground">Poze, PDF, DOC, XLS (max 10MB)</span>
                </div>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => {
              toast.success("Lot adăugat cu succes");
              setAddDialogOpen(false);
            }}>
              Salvează Lot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loturi;
