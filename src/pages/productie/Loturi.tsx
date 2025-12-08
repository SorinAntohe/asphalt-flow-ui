import { useState, useMemo, useEffect } from "react";
import { 
  Layers, 
  Plus, 
  FileDown, 
  CheckCircle2, 
  XCircle, 
  Thermometer,
  Gauge,
  Clock,
  FileText,
  Send,
  Lock,
  Unlock,
  Tag,
  BarChart3,
  Upload,
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
interface Lot {
  id: number;
  codLot: string;
  ordin: string;
  reteta: string;
  cantitate: number;
  dataOra: string;
  operator: string;
  temperatura: number;
  marshall: number;
  verdictQC: "Conform" | "Neconform" | "În așteptare" | "Blocat";
  observatii: string;
  caiFisiere: string;
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

  // Ordine state
  const [ordineDisponibile, setOrdineDisponibile] = useState<{ value: string; label: string }[]>([]);

  // Retete state
  const [reteteDisponibile, setReteteDisponibile] = useState<{ value: string; label: string }[]>([]);
  const [selectedReteta, setSelectedReteta] = useState("");

  // Operators state
  const [operatoriDisponibili, setOperatoriDisponibili] = useState<{ value: string; label: string }[]>([]);
  const [selectedOperator, setSelectedOperator] = useState("");

  // Materials state
  const [materialeDisponibile, setMaterialeDisponibile] = useState<{ value: string; label: string }[]>([]);

  // Add form state
  const [addFormData, setAddFormData] = useState({
    cod_ordin: "",
    operator: "",
    material: "",
    cod_reteta: "",
    cantitate: "",
    temperatura: "",
    marshall: "",
    verdict_calitate: "În așteptare",
    observatii: ""
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters & Sort
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch loturi from API
  const fetchLoturi = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/productie/returneaza/loturi_telemetrie`);
      if (response.ok) {
        const data = await response.json();
        const mappedData: Lot[] = Array.isArray(data) 
          ? data.map((item: any) => ({
              id: item.id,
              codLot: item.cod_lot || "",
              ordin: item.cod_ordin || "",
              reteta: item.cod_reteta || "",
              cantitate: parseFloat(item.cantitate) || 0,
              dataOra: item.data_ora || "",
              operator: item.operator || "",
              temperatura: parseFloat(item.temperatura) || 0,
              marshall: parseFloat(item.marshall) || 0,
              verdictQC: item.verdict_calitate || "În așteptare",
              observatii: item.observatii || "",
              caiFisiere: item.cai_fisiere || ""
            }))
          : [];
        setLoturi(mappedData);
      }
    } catch (error) {
      console.error("Error fetching loturi:", error);
      toast.error("Eroare la încărcarea loturilor");
    }
  };

  useEffect(() => {
    fetchLoturi();
  }, []);

  // Fetch coduri_ordin
  useEffect(() => {
    const fetchOrdine = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/coduri_ordin`);
        if (response.ok) {
          const data = await response.json();
          const uniqueCodes = new Set<string>();
          const options: { value: string; label: string }[] = [];
          if (Array.isArray(data)) {
            data.forEach((r: any) => {
              const code = r.cod_ordin || r;
              if (code && !uniqueCodes.has(code)) {
                uniqueCodes.add(code);
                options.push({ value: code, label: code });
              }
            });
          }
          setOrdineDisponibile(options);
        }
      } catch (error) {
        console.error("Error fetching ordine:", error);
      }
    };
    fetchOrdine();
  }, []);

  // Fetch retete (coduri_retete)
  useEffect(() => {
    const fetchRetete = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/coduri_retete`);
        if (response.ok) {
          const data = await response.json();
          const uniqueCodes = new Set<string>();
          const options: { value: string; label: string }[] = [];
          if (Array.isArray(data)) {
            data.forEach((r: any) => {
              const code = r.cod_reteta || r;
              if (code && !uniqueCodes.has(code)) {
                uniqueCodes.add(code);
                options.push({ value: code, label: code });
              }
            });
          }
          setReteteDisponibile(options);
        }
      } catch (error) {
        console.error("Error fetching retete:", error);
      }
    };
    fetchRetete();
  }, []);

  // Fetch operators
  useEffect(() => {
    const fetchOperatori = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/operator`);
        if (response.ok) {
          const data = await response.json();
          const options = Array.isArray(data) 
            ? data.map((op: any) => ({
                value: op.operator || op.nume || op,
                label: op.operator || op.nume || op
              }))
            : [];
          setOperatoriDisponibili(options);
        }
      } catch (error) {
        console.error("Error fetching operatori:", error);
      }
    };
    fetchOperatori();
  }, []);

  // Fetch materials
  useEffect(() => {
    const fetchMateriale = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/liste/returneaza/materii_prime`);
        if (response.ok) {
          const data = await response.json();
          const options = Array.isArray(data)
            ? data.map((m: any) => ({
                value: m.denumire || m.material || m,
                label: m.denumire || m.material || m
              }))
            : [];
          setMaterialeDisponibile(options);
        }
      } catch (error) {
        console.error("Error fetching materiale:", error);
      }
    };
    fetchMateriale();
  }, []);


  // Stats
  const stats = useMemo(() => {
    const total = loturi.length;
    const conform = loturi.filter(l => l.verdictQC === "Conform").length;
    const neconform = loturi.filter(l => l.verdictQC === "Neconform").length;
    const inAsteptare = loturi.filter(l => l.verdictQC === "În așteptare" || l.verdictQC === "Blocat").length;
    const rataConformitate = total > 0 ? Math.round((conform / (conform + neconform || 1)) * 100) : 0;
    return { total, conform, neconform, inAsteptare, rataConformitate };
  }, [loturi]);

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("folder", "fisiere_loturi");
    formData.append("file", file);
    formData.append("return_physical_path", "false");

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData
      });
      if (response.ok) {
        const result = await response.json();
        return result.public_url;
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    return null;
  };

  // Handle add lot
  const handleAddLot = async () => {
    if (!addFormData.cod_ordin || !addFormData.cod_reteta || !addFormData.cantitate || !addFormData.operator) {
      toast.error("Completați toate câmpurile obligatorii (cod ordin, rețetă, cantitate, operator)");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload files first
      const uploadedPaths: string[] = [];
      for (const file of uploadedFiles) {
        const path = await handleFileUpload(file);
        if (path) {
          uploadedPaths.push(path);
        }
      }

      const payload = {
        cod_ordin: addFormData.cod_ordin,
        operator: addFormData.operator,
        material: addFormData.material,
        cod_reteta: addFormData.cod_reteta,
        cantitate: addFormData.cantitate,
        temperatura: parseFloat(addFormData.temperatura) || 0,
        marshall: parseFloat(addFormData.marshall) || 0,
        verdict_calitate: addFormData.verdict_calitate,
        observatii: addFormData.observatii,
        cai_fisiere: uploadedPaths.join(",")
      };

      const response = await fetch(`${API_BASE_URL}/productie/adauga/loturi_telemetrie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        toast.error("Eroare la adăugarea lotului");
        return;
      }

      toast.success("Lot adăugat cu succes");
      setAddDialogOpen(false);
      setAddFormData({
        cod_ordin: "",
        operator: "",
        material: "",
        cod_reteta: "",
        cantitate: "",
        temperatura: "",
        marshall: "",
        verdict_calitate: "În așteptare",
        observatii: ""
      });
      setUploadedFiles([]);
      fetchLoturi();
    } catch (error) {
      console.error("Error adding lot:", error);
      toast.error("Eroare la adăugarea lotului");
    } finally {
      setIsSubmitting(false);
    }
  };

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
    exportToCSV(loturi, "loturi_productie", [
      { key: "codLot", label: "Cod Lot" },
      { key: "ordin", label: "Ordin" },
      { key: "reteta", label: "Rețetă" },
      { key: "cantitate", label: "Cantitate" },
      { key: "dataOra", label: "Data/Ora" },
      { key: "operator", label: "Operator" },
      { key: "temperatura", label: "Temperatură °C" },
      { key: "marshall", label: "Marshall kN" },
      { key: "verdictQC", label: "Verdict Calitate" },
      { key: "observatii", label: "Observații" }
    ]);
    toast.success("Export CSV realizat cu succes");
  };

  const handleRowClick = (lot: Lot) => {
    setSelectedLot(lot);
    setDetailDialogOpen(true);
  };

  const handleConfirmaLot = (lot: Lot) => {
    setLoturi(prev => prev.map(l => 
      l.id === lot.id ? { ...l, verdictQC: "Conform" as const } : l
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
          observatii: qcObservatii
        } : l
      ));
      toast.success(`Verdict Calitate pentru ${selectedLot.codLot}: ${qcVerdict}`);
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
                      title="Verdict Calitate"
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
                      <TableCell>{lot.cantitate}</TableCell>
                      <TableCell>{lot.dataOra}</TableCell>
                      <TableCell>{lot.operator}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  <Thermometer className="h-3 w-3 mr-1" />
                                  {lot.temperatura}°C
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Temperatură: {lot.temperatura}°C</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge variant="outline" className="text-xs">
                                  <Gauge className="h-3 w-3 mr-1" />
                                  {lot.marshall} kN
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Marshall: {lot.marshall} kN</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                  <TabsContent value="parametri" className="space-y-3 m-0">
                    <div className="grid gap-3">
                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Thermometer className="h-4 w-4 text-orange-500" />
                              <span className="font-medium text-sm">Temperatură</span>
                            </div>
                            <span className="font-bold text-foreground">
                              {selectedLot.temperatura}°C
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gauge className="h-4 w-4 text-purple-500" />
                              <span className="font-medium text-sm">Marshall</span>
                            </div>
                            <span className="font-bold text-foreground">
                              {selectedLot.marshall} kN
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
                        <span className="font-medium ml-1">{selectedLot.cantitate}</span>
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

                  <TabsContent value="atasamente" className="space-y-3 m-0">
                    {!selectedLot.caiFisiere ? (
                      <div className="text-center py-6 text-muted-foreground">
                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Niciun atașament</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedLot.caiFisiere.split(",").filter(Boolean).map((path, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="font-medium text-sm">{path.split("/").pop()}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <a href={`${API_BASE_URL}${path}`} target="_blank" rel="noopener noreferrer">
                                <FileDown className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </div>
              </Tabs>

              <DialogFooter className="flex-shrink-0 flex-wrap gap-1 pt-2">
                <Button size="sm" onClick={() => handleTrimiteQC(selectedLot)}>
                  <Send className="h-4 w-4 mr-1" />
                  Trimite la QC
                </Button>
                {selectedLot.verdictQC === "În așteptare" && (
                  <Button size="sm" variant="default" onClick={() => handleConfirmaLot(selectedLot)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Confirmă Lot
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
            <DialogTitle>Verdict Calitate</DialogTitle>
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
        <DialogContent hideCloseButton className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adaugă Lot</DialogTitle>
            <DialogDescription>
              Înregistrați un nou lot de producție
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Cod Ordin *</Label>
                <FilterableSelect
                  options={ordineDisponibile}
                  value={addFormData.cod_ordin}
                  onValueChange={(v) => setAddFormData(prev => ({ ...prev, cod_ordin: v }))}
                  placeholder="Selectează ordin"
                />
              </div>
              <div>
                <Label>Operator *</Label>
                <FilterableSelect
                  options={operatoriDisponibili}
                  value={addFormData.operator}
                  onValueChange={(v) => setAddFormData(prev => ({ ...prev, operator: v }))}
                  placeholder="Selectează operator"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Material *</Label>
                <FilterableSelect
                  options={materialeDisponibile}
                  value={addFormData.material}
                  onValueChange={(v) => setAddFormData(prev => ({ ...prev, material: v }))}
                  placeholder="Selectează material"
                />
              </div>
              <div>
                <Label>Rețetă *</Label>
                <FilterableSelect
                  options={reteteDisponibile}
                  value={addFormData.cod_reteta}
                  onValueChange={(v) => setAddFormData(prev => ({ ...prev, cod_reteta: v }))}
                  placeholder="Selectează rețetă"
                />
              </div>
              <div>
                <Label>Cantitate *</Label>
                <Input
                  type="number"
                  value={addFormData.cantitate}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, cantitate: e.target.value }))}
                  placeholder="Ex: 50"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Parametri Măsurați</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Temperatură (°C)</Label>
                  <Input
                    type="number"
                    value={addFormData.temperatura}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, temperatura: e.target.value }))}
                    placeholder="Ex: 160"
                  />
                </div>
                <div>
                  <Label className="text-xs">Marshall (kN)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={addFormData.marshall}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, marshall: e.target.value }))}
                    placeholder="Ex: 12.0"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Verdict Calitate</Label>
              <Select
                value={addFormData.verdict_calitate}
                onValueChange={(v) => setAddFormData(prev => ({ ...prev, verdict_calitate: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="În așteptare">În așteptare</SelectItem>
                  <SelectItem value="Conform">Conform</SelectItem>
                  <SelectItem value="Neconform">Neconform</SelectItem>
                  <SelectItem value="Blocat">Blocat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Observații</Label>
              <Textarea
                value={addFormData.observatii}
                onChange={(e) => setAddFormData(prev => ({ ...prev, observatii: e.target.value }))}
                placeholder="Observații opționale..."
              />
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
                      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
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
              {uploadedFiles.length > 0 && (
                <div className="space-y-1">
                  {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)} disabled={isSubmitting}>
              Anulează
            </Button>
            <Button onClick={handleAddLot} disabled={isSubmitting}>
              {isSubmitting ? "Se salvează..." : "Salvează Lot"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loturi;
