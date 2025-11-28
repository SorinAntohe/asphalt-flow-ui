import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Truck, ArrowUpDown, Pencil, Trash2, FileText, Download, X } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { API_BASE_URL } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface Livrare {
  id: number;
  data: string | null;
  cod: string | null;
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
    nr_aviz: "",
    nr_inmatriculare: "",
    tip_masina: "",
    nume_sofer: "",
    produs: "",
    temperatura: 0,
    masa_brut: 0,
    masa_net: 0,
    tara: 0,
    pret_produs_total: 0,
    pret_transport_total: 0,
    pret_total: 0,
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
      pret_produs_total: 0, 
      pret_transport_total: 0, 
      pret_total: 0 
    });
    setUnitPrices({
      pret_fara_tva: 0,
      pret_transport: 0
    });
  };

  // Fetch prices when tara changes (after cod is selected)
  useEffect(() => {
    const fetchPrices = async () => {
      if (form.cod && form.tara > 0) {
        try {
          const response = await fetch(`${API_BASE_URL}/livrari/returneaza_preturi_dupa_cod_livrari/livrari/${form.cod}`);
          if (response.ok) {
            const data = await response.json();
            setUnitPrices({
              pret_fara_tva: data.pret_fara_tva || 0,
              pret_transport: data.pret_transport || 0
            });
            setForm(prev => ({ 
              ...prev,
              produs: data.produs || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching prices:", error);
        }
      }
    };

    fetchPrices();
  }, [form.tara, form.cod]);

  // Calculate masa_net when masa_brut or tara changes
  useEffect(() => {
    const masa_net = form.masa_brut - form.tara;
    setForm(prev => ({ ...prev, masa_net }));
  }, [form.masa_brut, form.tara]);

  // Calculate prices when masa_net changes
  useEffect(() => {
    if (form.masa_net > 0 && (unitPrices.pret_fara_tva > 0 || unitPrices.pret_transport > 0)) {
      // Convert kg to tons for price calculation
      const masa_net_tone = form.masa_net / 1000;
      const pret_produs_total = unitPrices.pret_fara_tva * masa_net_tone;
      const pret_transport_total = unitPrices.pret_transport * masa_net_tone;
      const pret_total = pret_produs_total + pret_transport_total;
      
      setForm(prev => ({
        ...prev,
        pret_produs_total,
        pret_transport_total,
        pret_total
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

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      cod: "",
      nr_aviz: "",
      nr_inmatriculare: "",
      tip_masina: "",
      nume_sofer: "",
      produs: "",
      temperatura: 0,
      masa_brut: 0,
      masa_net: 0,
      tara: 0,
      pret_produs_total: 0,
      pret_transport_total: 0,
      pret_total: 0,
      observatii: ""
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (livrare: Livrare) => {
    setEditing(livrare);
    setForm({
      cod: livrare.cod || "",
      nr_aviz: livrare.nr_aviz || "",
      nr_inmatriculare: livrare.nr_inmatriculare || "",
      tip_masina: livrare.tip_masina || "",
      nume_sofer: livrare.nume_sofer || "",
      produs: "",
      temperatura: livrare.temperatura || 0,
      masa_brut: livrare.masa_brut || 0,
      masa_net: livrare.masa_net || 0,
      tara: livrare.tara || 0,
      pret_produs_total: livrare.pret_produs_total || 0,
      pret_transport_total: livrare.pret_transport_total || 0,
      pret_total: livrare.pret_total || 0,
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
          temperatura: form.temperatura,
          tara: form.tara,
          masa_brut: form.masa_brut,
          masa_net: form.masa_net,
          nr_inmatriculare: form.nr_inmatriculare,
          tip_masina: form.tip_masina,
          nume_sofer: form.nume_sofer,
          pret_produs_total: form.pret_produs_total.toString(),
          pret_transport_total: form.pret_transport_total.toString(),
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
          temperatura: form.temperatura,
          tara: form.tara,
          masa_brut: form.masa_brut,
          masa_net: form.masa_net,
          nr_inmatriculare: form.nr_inmatriculare,
          tip_masina: form.tip_masina,
          nume_sofer: form.nume_sofer,
          pret_produs_total: form.pret_produs_total.toString(),
          pret_transport_total: form.pret_transport_total.toString(),
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

  // Calculate today's statistics
  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const todayDate = getTodayDate();
  const todayLivrari = livrari.filter(livrare => livrare.data === todayDate);
  const todayTotalValue = todayLivrari.reduce((sum, livrare) => sum + (livrare.pret_total || 0), 0);

  const FilterHeader = ({ field, label }: { field: keyof typeof filters; label: string }) => (
    <TableHead className="h-10 text-xs">
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer hover:text-primary">
            <span>{label}</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-2">
            <Input
              value={filters[field]}
              onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
              placeholder={`Caută ${label.toLowerCase()}...`}
              className="h-7 text-xs"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1 h-7 text-xs"
              >
                Cresc.
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1 h-7 text-xs"
              >
                Descresc.
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );

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
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleOpenAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Livrare Nouă
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrări Astăzi</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayLivrari.length}</div>
            <p className="text-xs text-muted-foreground">
              Total livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoare Totală</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(todayTotalValue)} RON</div>
            <p className="text-xs text-muted-foreground">
              Valoare livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livrări</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livrari.length}</div>
            <p className="text-xs text-muted-foreground">
              Înregistrări totale
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Istoric Livrări Produs Finit</CardTitle>
              <CardDescription>
                Toate livrările de produse finite către clienți
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Înregistrări per pagină:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
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
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <FilterHeader field="id" label="ID" />
                  <FilterHeader field="data" label="Data" />
                  <FilterHeader field="cod" label="Cod" />
                  <FilterHeader field="nr_aviz" label="Nr. Aviz" />
                  <FilterHeader field="nr_inmatriculare" label="Nr. Înmatriculare" />
                  <FilterHeader field="tip_masina" label="Tip Mașină" />
                  <FilterHeader field="nume_sofer" label="Nume Șofer" />
                  <FilterHeader field="temperatura" label="Temperatură" />
                  <FilterHeader field="masa_brut" label="Masa Brut" />
                  <FilterHeader field="masa_net" label="Masa Net" />
                  <FilterHeader field="tara" label="Tara" />
                  <FilterHeader field="pret_produs_total" label="Preț Produs" />
                  <FilterHeader field="pret_transport_total" label="Preț Transport" />
                  <FilterHeader field="pret_total" label="Preț Total" />
                  <FilterHeader field="observatii" label="Observații" />
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editează Livrarea" : "Adaugă Livrare Nouă"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifică detaliile livrării" : "Completează detaliile pentru noua livrare"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cod">Cod</Label>
              <FilterableSelect
                id="cod"
                value={form.cod}
                onValueChange={handleCodChange}
                options={codOptions}
                placeholder="Selectează cod..."
                searchPlaceholder="Caută cod..."
                emptyText="Nu s-au găsit coduri."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nr_inmatriculare">Nr. Înmatriculare</Label>
                <FilterableSelect
                  id="nr_inmatriculare"
                  value={form.nr_inmatriculare}
                  onValueChange={handleNrInmatriculareChange}
                  options={nrInmatriculareOptions}
                  placeholder="Selectează nr. înmatriculare..."
                  searchPlaceholder="Caută nr. înmatriculare..."
                  emptyText="Nu s-au găsit numere de înmatriculare."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tip_masina">Tip Mașină</Label>
                <Input
                  id="tip_masina"
                  value={form.tip_masina}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nume_sofer">Nume Șofer</Label>
              <FilterableSelect
                id="nume_sofer"
                value={form.nume_sofer}
                onValueChange={(value) => setForm({ ...form, nume_sofer: value })}
                options={numeSoferOptions}
                placeholder="Selectează șofer..."
                searchPlaceholder="Caută șofer..."
                emptyText="Nu s-au găsit șoferi."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="temperatura">Temperatură</Label>
              <Input
                id="temperatura"
                type="number"
                step="0.1"
                value={form.temperatura}
                onChange={(e) => setForm({ ...form, temperatura: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="masa_brut">Masa Brut</Label>
                <Input
                  id="masa_brut"
                  type="number"
                  step="0.01"
                  value={form.masa_brut}
                  onChange={(e) => setForm({ ...form, masa_brut: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="masa_net">Masa Net</Label>
                <Input
                  id="masa_net"
                  type="number"
                  step="0.01"
                  value={form.masa_net}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tara">Tara</Label>
                <Input
                  id="tara"
                  type="number"
                  step="0.01"
                  value={form.tara}
                  onChange={(e) => setForm({ ...form, tara: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pret_produs_total">Preț Produs Total</Label>
                <Input
                  id="pret_produs_total"
                  type="number"
                  step="0.01"
                  value={form.pret_produs_total}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_transport_total">Preț Transport Total</Label>
                <Input
                  id="pret_transport_total"
                  type="number"
                  step="0.01"
                  value={form.pret_transport_total}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_total">Preț Total</Label>
                <Input
                  id="pret_total"
                  type="number"
                  step="0.01"
                  value={form.pret_total}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observatii">Observații</Label>
              <Textarea
                id="observatii"
                value={form.observatii}
                onChange={(e) => setForm({ ...form, observatii: e.target.value })}
                placeholder="Adaugă observații..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)}>
              Anulează
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Salvează Modificările" : "Adaugă Livrarea"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" hideCloseButton>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detalii Livrare - Cod: {viewingDetails?.cod || "-"}</DialogTitle>
                <DialogDescription>
                  Informații complete despre livrare
                </DialogDescription>
              </div>
              <Button 
                variant="secondary"
                size="sm"
                onClick={async () => {
                  if (viewingDetails?.cod) {
                    try {
                      const response = await fetch(`${API_BASE_URL}/generare_tichet_livrare/${viewingDetails.cod}`, {
                        method: 'GET',
                      });
                      
                      if (response.ok) {
                        toast({
                          title: "Succes",
                          description: `Avizul pentru livrarea ${viewingDetails.cod} a fost generat.`,
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
            <div className="grid gap-4 py-4">
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
          <DialogFooter className="flex-col sm:flex-row gap-2">
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
