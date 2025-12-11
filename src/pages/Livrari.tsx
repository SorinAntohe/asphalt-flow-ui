import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Truck, Pencil, Trash2, FileText, Download, X, Calendar, TrendingUp, Package } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { API_BASE_URL } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { TableFilterPopover } from "@/components/ui/table-filter-popover";

interface Livrare {
  id: number;
  data: string | null;
  cod: string | null;
  nr_comanda: string | null;
  nr_aviz: string | null;
  nr_inmatriculare: string | null;
  tip_masina: string | null;
  nume_sofer: string | null;
  temperatura: number | null;
  masa_brut: number | null;
  masa_net: number | null;
  tara: number | null;
  pret_produs_total: number | null;
  pret_transport_total: number | null;
  pret_total: number | null;
  observatii: string | null;
}

const Livrari = () => {
  const { toast } = useToast();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingDetails, setViewingDetails] = useState<Livrare | null>(null);
  const [deleting, setDeleting] = useState<Livrare | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<Livrare | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    cod: "",
    nr_comanda: "",
    nr_aviz: "",
    nr_inmatriculare: "",
    tip_masina: "",
    nume_sofer: "",
    produs: "",
    temperatura: "",
    masa_brut: "",
    masa_net: "",
    tara: "",
    pret_produs_total: "",
    pret_transport_total: "",
    pret_total: "",
    observatii: ""
  });

  // Store unit prices from API
  const [unitPrices, setUnitPrices] = useState({
    pret_fara_tva: 0,
    pret_transport: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    id: "",
    data: "",
    cod: "",
    nr_comanda: "",
    nr_aviz: "",
    nr_inmatriculare: "",
    tip_masina: "",
    nume_sofer: "",
    temperatura: "",
    masa_brut: "",
    masa_net: "",
    tara: "",
    pret_produs_total: "",
    pret_transport_total: "",
    pret_total: "",
    observatii: ""
  });

  // Sort
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });
  
  const [codOptions, setCodOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [nrInmatriculareOptions, setNrInmatriculareOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [numeSoferOptions, setNumeSoferOptions] = useState<Array<{ value: string; label: string }>>([]);
  
  const [livrari, setLivrari] = useState<Livrare[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch livrari data
  const fetchLivrari = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/livrari/returneaza/livrari`);
      if (response.ok) {
        const data = await response.json();
        setLivrari(data);
      } else {
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca datele de livrări",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching livrari:", error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele de livrări",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch livrari on mount
  useEffect(() => {
    fetchLivrari();
  }, []);

  // Fetch dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch cod options
        const codResponse = await fetch(`${API_BASE_URL}/livrari/returneaza_coduri_comenzi_produs_finit/livrari`);
        if (codResponse.ok) {
          const codData = await codResponse.json();
          setCodOptions(codData.map((item: any) => ({ 
            value: item.cod || item, 
            label: item.cod || item 
          })));
        }
      } catch (error) {
        console.error("Error fetching cod options:", error);
      }

      try {
        // Fetch nr_inmatriculare options
        const nrInmatriculareResponse = await fetch(`${API_BASE_URL}/livrari/returneaza_numere_inmatriculare/livrari`);
        if (nrInmatriculareResponse.ok) {
          const nrInmatriculareData = await nrInmatriculareResponse.json();
          setNrInmatriculareOptions(nrInmatriculareData.map((item: any) => ({ 
            value: item.nr_inmatriculare || item, 
            label: item.nr_inmatriculare || item 
          })));
        }
      } catch (error) {
        console.error("Error fetching nr_inmatriculare options:", error);
      }

      try {
        // Fetch nume_sofer options
        const numeSoferResponse = await fetch(`${API_BASE_URL}/livrari/returneaza_soferii/livrari`);
        if (numeSoferResponse.ok) {
          const numeSoferData = await numeSoferResponse.json();
          setNumeSoferOptions(numeSoferData.map((item: any) => ({ 
            value: item.nume_sofer || item, 
            label: item.nume_sofer || item 
          })));
        }
      } catch (error) {
        console.error("Error fetching nume_sofer options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Fetch tip_masina when nr_inmatriculare changes
  const handleNrInmatriculareChange = async (value: string) => {
    setForm({ ...form, nr_inmatriculare: value, tip_masina: "" });
    
    if (value) {
      try {
        const response = await fetch(`${API_BASE_URL}/livrari/returneaza_tip_masina_dupa_nr/livrari/${value}`);
        if (response.ok) {
          const data = await response.json();
          setForm(prev => ({ ...prev, tip_masina: data.tip_masina || data }));
        }
      } catch (error) {
        console.error("Error fetching tip_masina:", error);
      }
    }
  };

  // Fetch prices when cod changes
  const handleCodChange = async (value: string) => {
    setForm({ 
      ...form, 
      cod: value,
      produs: "",
      pret_produs_total: "", 
      pret_transport_total: "", 
      pret_total: "" 
    });
    setUnitPrices({
      pret_fara_tva: 0,
      pret_transport: 0
    });

    // Fetch prices immediately when cod is selected
    if (value) {
      try {
        console.log("Fetching prices for cod:", value);
        const response = await fetch(`${API_BASE_URL}/livrari/returneaza_preturi_dupa_cod_livrari/livrari/${value}`);
        console.log("API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("API returned data:", data);
          const newUnitPrices = {
            pret_fara_tva: data.pret_fara_tva || 0,
            pret_transport: data.pret_transport || 0
          };
          console.log("Setting unit prices:", newUnitPrices);
          setUnitPrices(newUnitPrices);
          setForm(prev => ({ 
            ...prev,
            produs: data.produs || ""
          }));
        } else {
          console.error("API error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
      }
    }
  };

  // Calculate masa_net when masa_brut or tara changes
  useEffect(() => {
    const masaBrutNum = parseFloat(form.masa_brut) || 0;
    const taraNum = parseFloat(form.tara) || 0;
    const masa_net = masaBrutNum - taraNum;
    setForm(prev => ({ ...prev, masa_net: masa_net.toString() }));
  }, [form.masa_brut, form.tara]);

  // Calculate prices when masa_net or unit prices change
  useEffect(() => {
    const masaNetNum = parseFloat(form.masa_net) || 0;
    console.log("Price calculation triggered - masa_net:", masaNetNum, "unitPrices:", unitPrices);
    if (masaNetNum > 0 && (unitPrices.pret_fara_tva > 0 || unitPrices.pret_transport > 0)) {
      // Convert kg to tons for price calculation
      const masa_net_tone = masaNetNum / 1000;
      const pret_produs_total = unitPrices.pret_fara_tva * masa_net_tone;
      const pret_transport_total = unitPrices.pret_transport * masa_net_tone;
      const pret_total = pret_produs_total + pret_transport_total;
      
      console.log("Calculated prices - produs:", pret_produs_total, "transport:", pret_transport_total, "total:", pret_total);
      
      setForm(prev => ({
        ...prev,
        pret_produs_total: pret_produs_total.toString(),
        pret_transport_total: pret_transport_total.toString(),
        pret_total: pret_total.toString()
      }));
    }
  }, [form.masa_net, unitPrices.pret_fara_tva, unitPrices.pret_transport]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return dateString; // Return as-is from backend (DD/MM/YYYY format)
  };

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Filtering and sorting logic
  const filteredAndSorted = livrari
    .filter((item) => {
      return (
        item.id.toString().includes(filters.id) &&
        (item.data || "").toLowerCase().includes(filters.data.toLowerCase()) &&
        (item.cod || "").toLowerCase().includes(filters.cod.toLowerCase()) &&
        (item.nr_comanda || "").toLowerCase().includes(filters.nr_comanda.toLowerCase()) &&
        (item.nr_aviz || "").toLowerCase().includes(filters.nr_aviz.toLowerCase()) &&
        (item.nr_inmatriculare || "").toLowerCase().includes(filters.nr_inmatriculare.toLowerCase()) &&
        (item.tip_masina || "").toLowerCase().includes(filters.tip_masina.toLowerCase()) &&
        (item.nume_sofer || "").toLowerCase().includes(filters.nume_sofer.toLowerCase()) &&
        (item.temperatura?.toString() || "").includes(filters.temperatura) &&
        (item.masa_brut?.toString() || "").includes(filters.masa_brut) &&
        (item.masa_net?.toString() || "").includes(filters.masa_net) &&
        (item.tara?.toString() || "").includes(filters.tara) &&
        (item.pret_produs_total?.toString() || "").includes(filters.pret_produs_total) &&
        (item.pret_transport_total?.toString() || "").includes(filters.pret_transport_total) &&
        (item.pret_total?.toString() || "").includes(filters.pret_total) &&
        (item.observatii || "").toLowerCase().includes(filters.observatii.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sort.field || !sort.direction) return 0;
      
      let aVal: any = a[sort.field as keyof Livrare];
      let bVal: any = b[sort.field as keyof Livrare];
      
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sort.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sort.direction === 'asc' ? -1 : 1;
      
      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSorted.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleSort = (field: string, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      cod: "",
      nr_comanda: "",
      nr_aviz: "",
      nr_inmatriculare: "",
      tip_masina: "",
      nume_sofer: "",
      produs: "",
      temperatura: "0",
      masa_brut: "0",
      masa_net: "0",
      tara: "0",
      pret_produs_total: "",
      pret_transport_total: "",
      pret_total: "",
      observatii: ""
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (livrare: Livrare) => {
    setEditing(livrare);
    setForm({
      cod: livrare.cod || "",
      nr_comanda: livrare.nr_comanda || "",
      nr_aviz: livrare.nr_aviz || "",
      nr_inmatriculare: livrare.nr_inmatriculare || "",
      tip_masina: livrare.tip_masina || "",
      nume_sofer: livrare.nume_sofer || "",
      produs: "",
      temperatura: String(livrare.temperatura ?? "0"),
      masa_brut: String(livrare.masa_brut ?? "0"),
      masa_net: String(livrare.masa_net ?? "0"),
      tara: String(livrare.tara ?? "0"),
      pret_produs_total: String(livrare.pret_produs_total ?? ""),
      pret_transport_total: String(livrare.pret_transport_total ?? ""),
      pret_total: String(livrare.pret_total ?? ""),
      observatii: livrare.observatii || ""
    });
    setOpenAddEdit(true);
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!form.cod || !form.nr_inmatriculare || !form.nume_sofer) {
        toast({
          title: "Eroare",
          description: "Completează toate câmpurile obligatorii",
          variant: "destructive"
        });
        return;
      }

      if (editing) {
        // Edit existing livrare
        const updatePayload = {
          cod: form.cod,
          nr_comanda: form.nr_comanda,
          temperatura: parseFloat(form.temperatura) || 0,
          tara: parseFloat(form.tara) || 0,
          masa_brut: parseFloat(form.masa_brut) || 0,
          masa_net: parseFloat(form.masa_net) || 0,
          nr_inmatriculare: form.nr_inmatriculare,
          tip_masina: form.tip_masina,
          nume_sofer: form.nume_sofer,
          pret_produs_total: form.pret_produs_total,
          pret_transport_total: form.pret_transport_total,
          pret_total: form.pret_total,
          observatii: form.observatii
        };

        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "livrari_produs_finit",
            id: editing.id,
            update: updatePayload
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update livrare');
        }

        toast({
          title: "Succes",
          description: "Livrarea a fost actualizată cu succes"
        });
      } else {
        // Add new livrare
        const currentDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const payload = {
          data: currentDate,
          cod: form.cod,
          nr_comanda: form.nr_comanda,
          temperatura: parseFloat(form.temperatura) || 0,
          tara: parseFloat(form.tara) || 0,
          masa_brut: parseFloat(form.masa_brut) || 0,
          masa_net: parseFloat(form.masa_net) || 0,
          nr_inmatriculare: form.nr_inmatriculare,
          tip_masina: form.tip_masina,
          nume_sofer: form.nume_sofer,
          pret_produs_total: form.pret_produs_total,
          pret_transport_total: form.pret_transport_total,
          pret_total: form.pret_total,
          observatii: form.observatii
        };

        const response = await fetch(`${API_BASE_URL}/livrari/adauga/livrare`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add livrare');
        }

        const result = await response.json();
        
        toast({
          title: "Succes",
          description: result.message || "Livrarea a fost adăugată cu succes"
        });
      }

      setOpenAddEdit(false);
      fetchLivrari(); // Refresh livrari list
    } catch (error) {
      console.error("Error saving livrare:", error);
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "Nu s-a putut salva livrarea",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "livrari_produs_finit",
          id: deleting.id
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete livrare');
      }

      toast({
        title: "Succes",
        description: "Livrarea a fost ștearsă cu succes"
      });

      setDeleting(null);
      fetchLivrari(); // Refresh livrari list
    } catch (error) {
      console.error("Error deleting livrare:", error);
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "Nu s-a putut șterge livrarea",
        variant: "destructive"
      });
    }
  };

  // Summary statistics - matching Receptii design
  const summaryStats = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const livrariAstazi = livrari.filter(l => l.data === todayStr).length;
    const valoareTotala = livrari.reduce((sum, l) => sum + (l.pret_total || 0), 0);
    const totalLivrari = livrari.length;
    
    return { livrariAstazi, valoareTotala, totalLivrari };
  }, [livrari]);

  const handleFilterChange = useCallback((field: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSortChange = useCallback((field: string) => (direction: 'asc' | 'desc') => {
    handleSort(field, direction);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livrări</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare livrări produse finite către clienți
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToCSV(filteredAndSorted, 'livrari', [
              { key: 'id', label: 'ID' },
              { key: 'data', label: 'Data' },
              { key: 'cod', label: 'Cod' },
              { key: 'nr_aviz', label: 'Nr. Aviz' },
              { key: 'nr_inmatriculare', label: 'Nr. Înmatr.' },
              { key: 'tip_masina', label: 'Tip Mașină' },
              { key: 'nume_sofer', label: 'Nume Șofer' },
              { key: 'temperatura', label: 'Temperatură' },
              { key: 'masa_brut', label: 'Masa Brut' },
              { key: 'masa_net', label: 'Masa Net' },
              { key: 'tara', label: 'Tara' },
              { key: 'pret_produs_total', label: 'Preț Produs' },
              { key: 'pret_transport_total', label: 'Preț Transport' },
              { key: 'pret_total', label: 'Preț Total' },
              { key: 'observatii', label: 'Observații' }
            ])}
            disabled={filteredAndSorted.length === 0}
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Livrare Nouă</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards - matching Receptii design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Livrări Astăzi</p>
                <p className="text-2xl font-bold">{summaryStats.livrariAstazi}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valoare Totală</p>
                <p className="text-2xl font-bold">{summaryStats.valoareTotala.toLocaleString('ro-RO')} lei</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Livrări</p>
                <p className="text-2xl font-bold">{summaryStats.totalLivrari}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base sm:text-lg">Istoric Livrări Produs Finit</CardTitle>
              <CardDescription className="hidden sm:block">
                Toate livrările de produse finite către clienți
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[60px] sm:w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableFilterPopover field="id" label="ID" filterValue={filters.id} onFilterChange={handleFilterChange("id")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("id")} />
                  <TableFilterPopover field="data" label="Data" filterValue={filters.data} onFilterChange={handleFilterChange("data")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("data")} />
                  <TableFilterPopover field="cod" label="Cod" filterValue={filters.cod} onFilterChange={handleFilterChange("cod")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("cod")} />
                  <TableFilterPopover field="nr_aviz" label="Nr. Aviz" filterValue={filters.nr_aviz} onFilterChange={handleFilterChange("nr_aviz")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("nr_aviz")} />
                  <TableFilterPopover field="nr_inmatriculare" label="Nr. Înmatriculare" filterValue={filters.nr_inmatriculare} onFilterChange={handleFilterChange("nr_inmatriculare")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("nr_inmatriculare")} />
                  <TableFilterPopover field="tip_masina" label="Tip Mașină" filterValue={filters.tip_masina} onFilterChange={handleFilterChange("tip_masina")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("tip_masina")} />
                  <TableFilterPopover field="nume_sofer" label="Nume Șofer" filterValue={filters.nume_sofer} onFilterChange={handleFilterChange("nume_sofer")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("nume_sofer")} />
                  <TableFilterPopover field="temperatura" label="Temperatură" filterValue={filters.temperatura} onFilterChange={handleFilterChange("temperatura")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("temperatura")} />
                  <TableFilterPopover field="masa_brut" label="Masa Brut" filterValue={filters.masa_brut} onFilterChange={handleFilterChange("masa_brut")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("masa_brut")} />
                  <TableFilterPopover field="masa_net" label="Masa Net" filterValue={filters.masa_net} onFilterChange={handleFilterChange("masa_net")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("masa_net")} />
                  <TableFilterPopover field="tara" label="Tara" filterValue={filters.tara} onFilterChange={handleFilterChange("tara")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("tara")} />
                  <TableFilterPopover field="pret_produs_total" label="Preț Produs" filterValue={filters.pret_produs_total} onFilterChange={handleFilterChange("pret_produs_total")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("pret_produs_total")} />
                  <TableFilterPopover field="pret_transport_total" label="Preț Transport" filterValue={filters.pret_transport_total} onFilterChange={handleFilterChange("pret_transport_total")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("pret_transport_total")} />
                  <TableFilterPopover field="pret_total" label="Preț Total" filterValue={filters.pret_total} onFilterChange={handleFilterChange("pret_total")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("pret_total")} />
                  <TableFilterPopover field="observatii" label="Observații" filterValue={filters.observatii} onFilterChange={handleFilterChange("observatii")} sortField={sort.field} sortDirection={sort.direction} onSort={handleSortChange("observatii")} />
                </TableRow>
              </TableHeader>
              <TableBody key={`livrari-page-${currentPage}`} className="animate-fade-in">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={15} className="text-center py-8 text-muted-foreground">
                      Nu există livrări înregistrate
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((livrare) => (
                    <TableRow 
                      key={livrare.id} 
                      className="h-10 cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingDetails(livrare)}
                    >
                      <TableCell className="py-1 text-xs font-medium">{livrare.id}</TableCell>
                      <TableCell className="py-1 text-xs">{formatDate(livrare.data)}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.cod || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nr_aviz || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nr_inmatriculare || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.tip_masina || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.nume_sofer || "-"}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{livrare.temperatura || "-"}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.masa_brut)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.masa_net)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.tara)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_produs_total)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_transport_total)}</TableCell>
                      <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_total)}</TableCell>
                      <TableCell className="py-1 text-xs">{livrare.observatii || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Afișare {filteredAndSorted.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredAndSorted.length)} din {filteredAndSorted.length}
              </span>
            </div>
            
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onOpenChange={setOpenAddEdit}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="h-3.5 w-3.5 text-primary" />
              </div>
              {editing ? "Editează Livrarea" : "Adaugă Livrare Nouă"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editing ? "Modifică detaliile livrării" : "Completează detaliile pentru noua livrare"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-5 py-4 space-y-4">
            {/* Identificare */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Identificare</p>
              <div className="p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label htmlFor="cod" className="text-xs">Cod</Label>
                  <FilterableSelect
                    id="cod"
                    value={form.cod}
                    onValueChange={handleCodChange}
                    options={codOptions}
                    placeholder="Cod"
                    searchPlaceholder="Caută..."
                    emptyText="Nu s-au găsit coduri."
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transport</p>
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label htmlFor="nr_inmatriculare" className="text-xs">Nr. Înmatr.</Label>
                  <FilterableSelect
                    id="nr_inmatriculare"
                    value={form.nr_inmatriculare}
                    onValueChange={handleNrInmatriculareChange}
                    options={nrInmatriculareOptions}
                    placeholder="Nr. auto"
                    searchPlaceholder="Caută..."
                    emptyText="Nu s-au găsit."
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tip_masina" className="text-xs">Tip Mașină</Label>
                  <Input
                    id="tip_masina"
                    value={form.tip_masina}
                    disabled
                    className="h-9 text-sm bg-muted/50"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nume_sofer" className="text-xs">Șofer</Label>
                  <FilterableSelect
                    id="nume_sofer"
                    value={form.nume_sofer}
                    onValueChange={(value) => setForm({ ...form, nume_sofer: value })}
                    options={numeSoferOptions}
                    placeholder="Șofer"
                    searchPlaceholder="Caută..."
                    emptyText="Nu s-au găsit."
                    className="h-9 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cantități */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cantități & Măsurători</p>
              <div className="grid grid-cols-4 gap-3 p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label htmlFor="temperatura" className="text-xs">Temperatură</Label>
                  <Input
                    id="temperatura"
                    type="number"
                    step="0.1"
                    value={form.temperatura}
                    onChange={(e) => setForm({ ...form, temperatura: e.target.value })}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="masa_brut" className="text-xs">Masa Brut</Label>
                  <Input
                    id="masa_brut"
                    type="number"
                    step="0.01"
                    value={form.masa_brut}
                    onChange={(e) => setForm({ ...form, masa_brut: e.target.value })}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tara" className="text-xs">Tara</Label>
                  <Input
                    id="tara"
                    type="number"
                    step="0.01"
                    value={form.tara}
                    onChange={(e) => setForm({ ...form, tara: e.target.value })}
                    className="h-9 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="masa_net" className="text-xs">Masa Net</Label>
                  <Input
                    id="masa_net"
                    type="number"
                    step="0.01"
                    value={form.masa_net}
                    disabled
                    className="h-9 text-sm bg-muted/50 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Prețuri */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prețuri (RON)</p>
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border bg-card">
                <div className="space-y-1">
                  <Label htmlFor="pret_produs_total" className="text-xs">Preț Produs</Label>
                  <Input
                    id="pret_produs_total"
                    type="number"
                    step="0.01"
                    value={form.pret_produs_total}
                    disabled
                    className="h-9 text-sm bg-muted/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pret_transport_total" className="text-xs">Preț Transport</Label>
                  <Input
                    id="pret_transport_total"
                    type="number"
                    step="0.01"
                    value={form.pret_transport_total}
                    disabled
                    className="h-9 text-sm bg-muted/50 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pret_total" className="text-xs text-primary font-medium">Preț Total</Label>
                  <Input
                    id="pret_total"
                    type="number"
                    step="0.01"
                    value={form.pret_total}
                    disabled
                    className="h-9 text-sm bg-primary/5 font-mono font-semibold border-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Observații */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Observații</p>
              <div className="p-3 rounded-lg border bg-card">
                <Textarea
                  id="observatii"
                  value={form.observatii}
                  onChange={(e) => setForm({ ...form, observatii: e.target.value })}
                  placeholder="Observații suplimentare..."
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-5 py-3 flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => setOpenAddEdit(false)}>Anulează</Button>
            <Button size="sm" onClick={handleSave}>
              {editing ? "Salvează" : "Adaugă"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0" hideCloseButton>
          <DialogHeader className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">Detalii Livrare - Cod: {viewingDetails?.cod || "-"}</DialogTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  if (viewingDetails?.cod) {
                    try {
                      const response = await fetch(`${API_BASE_URL}/generare_tichet_livrare/${viewingDetails.cod}`, {
                        method: 'POST',
                      });
                      
                      if (response.ok) {
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `tichet_${viewingDetails.cod}.xlsx`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                        
                        toast({
                          title: "Succes",
                          description: `Avizul pentru livrarea ${viewingDetails.cod} a fost generat și descărcat.`,
                        });
                      } else {
                        toast({
                          title: "Eroare",
                          description: "Nu s-a putut genera avizul.",
                          variant: "destructive"
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Eroare",
                        description: "Eroare la generarea avizului.",
                        variant: "destructive"
                      });
                    }
                  }
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Generează Aviz
              </Button>
            </div>
          </DialogHeader>
          {viewingDetails && (
            <div className="px-5 py-3 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">{viewingDetails.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">{formatDate(viewingDetails.data)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cod</Label>
                  <p className="font-medium">{viewingDetails.cod || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Aviz</Label>
                  <p className="font-medium">{viewingDetails.nr_aviz || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Înmatriculare</Label>
                  <p className="font-medium">{viewingDetails.nr_inmatriculare || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tip Mașină</Label>
                  <p className="font-medium">{viewingDetails.tip_masina || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nume Șofer</Label>
                  <p className="font-medium">{viewingDetails.nume_sofer || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Temperatură</Label>
                  <p className="font-medium">{viewingDetails.temperatura || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Masa Brut</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.masa_brut)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Masa Net</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.masa_net)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tara</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.tara)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Produs Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_produs_total)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Transport Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_transport_total)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Total</Label>
                  <p className="font-medium">{formatNumber(viewingDetails.pret_total)}</p>
                </div>
              </div>
              <div className="grid gap-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Observații</Label>
                  <p className="font-medium">{viewingDetails.observatii || "-"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="px-5 py-3 flex-col sm:flex-row gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewingDetails) {
                  handleOpenEdit(viewingDetails);
                  setViewingDetails(null);
                }
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button 
              variant="destructive"
              size="sm"
              onClick={() => {
                if (viewingDetails) {
                  setDeleting(viewingDetails);
                  setViewingDetails(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
            <Button variant="outline" size="sm" onClick={() => setViewingDetails(null)}>
              <X className="w-4 h-4 mr-2" />
              Închide
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi livrarea cu codul {deleting?.cod || "-"}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-700 hover:bg-red-600">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Livrari;
