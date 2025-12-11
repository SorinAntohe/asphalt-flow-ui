import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowUpDown, Ticket, Download, X, Package, TrendingUp, Calendar } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { z } from "zod";
import { API_BASE_URL } from "@/lib/api";

interface ReceptieMaterial {
  id: number;
  data: string;
  cod: string;
  furnizor: string;
  material: string;
  nr_aviz_provizoriu: string;
  nr_aviz_intrare: string;
  nr_factura: string;
  nr_tichet: string;
  nume_sofer: string;
  nr_inmatriculare: string;
  tip_masina: string;
  cantitate_livrata: number;
  cantitate_receptionata: number;
  tara: number;
  masa_net: number;
  diferenta: number;
  umiditate: number;
  pret_material_total: number;
  pret_total: number;
  pret_transport_total: number;
  observatii: string;
}

const receptieSchema = z.object({
  data: z.string().trim().optional(),
  cod: z.string().trim().min(1, "Codul este obligatoriu").max(10),
  furnizor: z.string().trim().min(1, "Furnizorul este obligatoriu").max(100),
  material: z.string().trim().min(1, "Materialul este obligatoriu").max(100),
  nr_aviz_provizoriu: z.string().trim().max(10).optional(),
  nr_aviz_intrare: z.string().trim().max(10).optional(),
  nr_factura: z.string().trim().max(20).optional(),
  nr_tichet: z.string().trim().max(20).optional(),
  nume_sofer: z.string().trim().min(1, "Numele șoferului este obligatoriu").max(100),
  nr_inmatriculare: z.string().trim().min(1, "Numărul de înmatriculare este obligatoriu").max(10),
  tip_masina: z.string().trim().min(1, "Tipul mașinii este obligatoriu").max(20),
  cantitate_livrata: z.number().min(0, "Cantitatea livrată trebuie să fie pozitivă"),
  cantitate_receptionata: z.number().min(0, "Cantitatea recepționată trebuie să fie pozitivă"),
  tara: z.number().min(0, "Tara trebuie să fie pozitivă"),
  masa_net: z.number().min(0, "Masa netă trebuie să fie pozitivă"),
  diferenta: z.number(),
  umiditate: z.number().min(0, "Umiditatea trebuie să fie pozitivă").max(100, "Umiditatea nu poate depăși 100%"),
  pret_material_total: z.number().min(0, "Prețul material trebuie să fie pozitiv"),
  pret_total: z.number().min(0, "Prețul total trebuie să fie pozitiv"),
  pret_transport_total: z.number().min(0, "Prețul transport trebuie să fie pozitiv"),
  observatii: z.string().trim().max(255).optional()
});

export default function Receptii() {
  const { toast } = useToast();
  const [receptii, setReceptii] = useState<ReceptieMaterial[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<string[]>([]);
  const [availableRegistrationNumbers, setAvailableRegistrationNumbers] = useState<string[]>([]);
  
  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<ReceptieMaterial | null>(null);
  const [deleting, setDeleting] = useState<ReceptieMaterial | null>(null);
  const [viewingDetails, setViewingDetails] = useState<ReceptieMaterial | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    data: "",
    cod: "",
    furnizor: "",
    material: "",
    nr_aviz_provizoriu: "",
    nr_aviz_intrare: "",
    nr_factura: "",
    nr_tichet: "",
    nume_sofer: "",
    nr_inmatriculare: "",
    tip_masina: "",
    cantitate_livrata: 0,
    cantitate_receptionata: 0,
    tara: 0,
    masa_net: 0,
    diferenta: 0,
    umiditate: 0,
    pret_material_total: 0,
    pret_total: 0,
    pret_transport_total: 0,
    observatii: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filters (for all columns)
  const [filters, setFilters] = useState({
    id: "", 
    data: "", 
    cod: "", 
    furnizor: "", 
    material: "", 
    nr_aviz_provizoriu: "",
    nr_aviz_intrare: "",
    nr_factura: "",
    nr_tichet: "",
    nume_sofer: "",
    nr_inmatriculare: "",
    tip_masina: "",
    cantitate_livrata: "",
    cantitate_receptionata: "",
    tara: "",
    masa_net: "",
    diferenta: "",
    umiditate: "",
    pret_material_total: "",
    pret_transport_total: "",
    pret_total: "",
    observatii: ""
  });

  // Sort
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  const fetchReceptii = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/receptii/returneaza/materiale`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        setReceptii(data);
      }
    } catch (error) {
      console.error('Error fetching receptii:', error);
      // Keep mock data when API fails
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchReceptii();
    
    const fetchCodes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_coduri`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAvailableCodes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching codes:', error);
        setAvailableCodes([]);
      }
    };
    
    const fetchDrivers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_nume_soferi`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAvailableDrivers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setAvailableDrivers([]);
      }
    };
    
    const fetchRegistrationNumbers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_nr_inmatriculare`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setAvailableRegistrationNumbers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching registration numbers:', error);
        setAvailableRegistrationNumbers([]);
      }
    };
    
    fetchCodes();
    fetchDrivers();
    fetchRegistrationNumbers();
  }, []);

  // Calculate diferenta when cantitate_livrata or cantitate_receptionata changes
  useEffect(() => {
    const diferenta = form.cantitate_livrata - form.cantitate_receptionata;
    setForm(prev => ({ ...prev, diferenta }));
  }, [form.cantitate_livrata, form.cantitate_receptionata]);

  // Calculate masa_net when cantitate_receptionata or tara changes
  useEffect(() => {
    const masa_net = form.cantitate_receptionata - form.tara;
    setForm(prev => ({ ...prev, masa_net }));
  }, [form.cantitate_receptionata, form.tara]);

  // Fetch tip_masina based on selected nr_inmatriculare
  useEffect(() => {
    const fetchTipMasina = async () => {
      if (!form.nr_inmatriculare) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_tip_masina_dupa_nr/${form.nr_inmatriculare}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setForm(prev => ({ ...prev, tip_masina: data }));
      } catch (error) {
        console.error('Error fetching tip masina:', error);
      }
    };
    
    fetchTipMasina();
  }, [form.nr_inmatriculare]);

  // Fetch cantitate_livrata based on selected cod
  useEffect(() => {
    const fetchCantitate = async () => {
      if (!form.cod) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_cantitate_dupa_cod/${form.cod}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setForm(prev => ({ ...prev, cantitate_livrata: data }));
      } catch (error) {
        console.error('Error fetching cantitate livrata:', error);
      }
    };
    
    fetchCantitate();
  }, [form.cod]);

  // Fetch furnizor based on selected cod
  useEffect(() => {
    const fetchFurnizor = async () => {
      if (!form.cod) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_furnizor_dupa_cod/${form.cod}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setForm(prev => ({ ...prev, furnizor: data }));
      } catch (error) {
        console.error('Error fetching furnizor:', error);
      }
    };
    
    fetchFurnizor();
  }, [form.cod]);

  // Fetch material based on selected cod
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!form.cod) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_material_dupa_cod/${form.cod}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setForm(prev => ({ ...prev, material: data }));
      } catch (error) {
        console.error('Error fetching material:', error);
      }
    };
    
    fetchMaterial();
  }, [form.cod]);

  // Fetch prices based on cod and cantitate_receptionata
  useEffect(() => {
    const fetchPrices = async () => {
      if (!form.cod || !form.cantitate_receptionata) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/returneaza_preturi_dupa_cod/${form.cod}/${form.cantitate_receptionata}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setForm(prev => ({ 
          ...prev, 
          pret_transport_total: data.pret_transport_total,
          pret_material_total: data.pret_material_total,
          pret_total: data.pret_total
        }));
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    
    fetchPrices();
  }, [form.cod, form.cantitate_receptionata]);

  // Add/Edit handlers
  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      data: "",
      cod: "",
      furnizor: "",
      material: "",
      nr_aviz_provizoriu: "",
      nr_aviz_intrare: "",
      nr_factura: "",
      nr_tichet: "",
      nume_sofer: "",
      nr_inmatriculare: "",
      tip_masina: "",
      cantitate_livrata: 0,
      cantitate_receptionata: 0,
      tara: 0,
      masa_net: 0,
      diferenta: 0,
      umiditate: 0,
      pret_material_total: 0,
      pret_total: 0,
      pret_transport_total: 0,
      observatii: ""
    });
    setFormErrors({});
    setOpenAddEdit(true);
  };
  
  const handleOpenEdit = (receptie: ReceptieMaterial) => {
    setEditing(receptie);
    // Pre-populate all fields from selected row
    setForm({
      data: "", // Excluded from edit
      cod: String(receptie.cod ?? ""),
      furnizor: receptie.furnizor,
      material: receptie.material,
      nr_aviz_provizoriu: receptie.nr_aviz_provizoriu || "",
      nr_aviz_intrare: receptie.nr_aviz_intrare || "",
      nr_factura: receptie.nr_factura || "",
      nr_tichet: receptie.nr_tichet || "",
      nume_sofer: receptie.nume_sofer,
      nr_inmatriculare: receptie.nr_inmatriculare,
      tip_masina: receptie.tip_masina,
      cantitate_livrata: receptie.cantitate_livrata,
      cantitate_receptionata: receptie.cantitate_receptionata,
      tara: receptie.tara,
      masa_net: receptie.masa_net,
      diferenta: receptie.diferenta,
      umiditate: receptie.umiditate || 0,
      pret_material_total: receptie.pret_material_total,
      pret_total: receptie.pret_total,
      pret_transport_total: receptie.pret_transport_total,
      observatii: receptie.observatii || ""
    });
    setFormErrors({});
    setOpenAddEdit(true);
  };
  
  const handleSave = async () => {
    try {
      // Validate
      const validatedData = receptieSchema.parse({
        ...form,
        nr_aviz_provizoriu: form.nr_aviz_provizoriu || undefined,
        nr_aviz_intrare: form.nr_aviz_intrare || undefined,
        observatii: form.observatii || undefined
      });
      
      setFormErrors({});
      
      if (editing) {
        // Edit - use specialized endpoint with cod and cantitate_receptionata
        // Exclude 'data' field from update payload
        const { data, ...updatePayload } = validatedData;
        
        const response = await fetch(`${API_BASE_URL}/receptii/editeaza/material/${form.cod}/${form.cantitate_receptionata}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "receptii_materiale",
            id: editing.id,
            update: updatePayload
          })
        });
        
        if (!response.ok) throw new Error('Failed to update receptie');
        
        toast({
          title: "Succes",
          description: "Recepția a fost actualizată cu succes"
        });
      } else {
        // Add - prepare ReceptieModel and ReceptieToStocuri
        const receptie = {
          cod: form.cod,
          furnizor: form.furnizor,
          material: form.material,
          nr_aviz_provizoriu: form.nr_aviz_provizoriu || "",
          nr_aviz_intrare: form.nr_aviz_intrare || "",
          nr_factura: form.nr_factura || "",
          nume_sofer: form.nume_sofer,
          nr_inmatriculare: form.nr_inmatriculare,
          tip_masina: form.tip_masina,
          cantitate_livrata: form.cantitate_livrata,
          cantitate_receptionata: form.cantitate_receptionata,
          tara: form.tara,
          masa_net: form.masa_net,
          diferenta: form.diferenta,
          umiditate: form.umiditate,
          pret_material_total: form.pret_material_total,
          pret_total: form.pret_total,
          pret_transport_total: form.pret_transport_total,
          observatii: form.observatii || ""
        };
        
        const tostoc = {
          cod: form.cod,
          cantitate_receptionata: form.cantitate_receptionata
        };
        
        const response = await fetch(`${API_BASE_URL}/receptii/materiale/adauga`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receptie, tostoc })
        });
        
        if (!response.ok) throw new Error('Failed to add receptie');
        
        toast({
          title: "Succes",
          description: "Recepția a fost adăugată cu succes"
        });
      }
      
      setOpenAddEdit(false);
      fetchReceptii();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        toast({
          title: "Eroare",
          description: `Nu s-a putut salva recepția: ${error}`,
          variant: "destructive"
        });
      }
    }
  };
  
  const handleDelete = async () => {
    if (!deleting) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/sterge_fifo_stoc_dupa_cod/${deleting.cod}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "receptii_materiale",
          id: deleting.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to delete receptie');
      
      toast({
        title: "Succes",
        description: "Recepția a fost ștearsă cu succes"
      });
      
      setDeleting(null);
      fetchReceptii();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge recepția",
        variant: "destructive"
      });
    }
  };

  // Filtering and sorting logic
  const filteredAndSorted = receptii
    .filter((item) => {
      return (
        item.id.toString().includes(filters.id) &&
        (item.data || "").toLowerCase().includes(filters.data.toLowerCase()) &&
        (item.cod || "").toLowerCase().includes(filters.cod.toLowerCase()) &&
        (item.furnizor || "").toLowerCase().includes(filters.furnizor.toLowerCase()) &&
        (item.material || "").toLowerCase().includes(filters.material.toLowerCase()) &&
        (item.nr_aviz_provizoriu || "").toLowerCase().includes(filters.nr_aviz_provizoriu.toLowerCase()) &&
        (item.nr_aviz_intrare || "").toLowerCase().includes(filters.nr_aviz_intrare.toLowerCase()) &&
        (item.nr_factura || "").toLowerCase().includes(filters.nr_factura.toLowerCase()) &&
        (item.nr_tichet || "").toLowerCase().includes(filters.nr_tichet.toLowerCase()) &&
        (item.nume_sofer || "").toLowerCase().includes(filters.nume_sofer.toLowerCase()) &&
        (item.nr_inmatriculare || "").toLowerCase().includes(filters.nr_inmatriculare.toLowerCase()) &&
        (item.tip_masina || "").toLowerCase().includes(filters.tip_masina.toLowerCase()) &&
        (item.cantitate_livrata?.toString() || "").includes(filters.cantitate_livrata) &&
        (item.cantitate_receptionata?.toString() || "").includes(filters.cantitate_receptionata) &&
        (item.tara?.toString() || "").includes(filters.tara) &&
        (item.masa_net?.toString() || "").includes(filters.masa_net) &&
        (item.diferenta?.toString() || "").includes(filters.diferenta) &&
        (item.umiditate?.toString() || "").includes(filters.umiditate) &&
        (item.pret_material_total?.toString() || "").includes(filters.pret_material_total) &&
        (item.pret_transport_total?.toString() || "").includes(filters.pret_transport_total) &&
        (item.pret_total?.toString() || "").includes(filters.pret_total) &&
        (item.observatii || "").toLowerCase().includes(filters.observatii.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sort.field || !sort.direction) return 0;
      
      let aVal: any = a[sort.field as keyof ReceptieMaterial];
      let bVal: any = b[sort.field as keyof ReceptieMaterial];
      
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

  // Summary statistics
  const summaryStats = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
    
    const receptiiAstazi = receptii.filter(r => r.data === todayStr).length;
    const valoareTotala = receptii.reduce((sum, r) => sum + (r.pret_total || 0), 0);
    const totalReceptii = receptii.length;
    
    return { receptiiAstazi, valoareTotala, totalReceptii };
  }, [receptii]);

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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recepții Materiale</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Gestionare recepții materii prime
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToCSV(filteredAndSorted, 'receptii_materiale', [
              { key: 'id', label: 'ID' },
              { key: 'data', label: 'Data' },
              { key: 'cod', label: 'Cod' },
              { key: 'furnizor', label: 'Furnizor' },
              { key: 'material', label: 'Material' },
              { key: 'nr_aviz_provizoriu', label: 'Nr. Aviz Prov.' },
              { key: 'nr_aviz_intrare', label: 'Nr. Aviz Intr.' },
              { key: 'nr_factura', label: 'Nr. Factură' },
              { key: 'nume_sofer', label: 'Nume Șofer' },
              { key: 'nr_inmatriculare', label: 'Nr. Înmatr.' },
              { key: 'tip_masina', label: 'Tip Mașină' },
              { key: 'cantitate_livrata', label: 'Cant. Livrată' },
              { key: 'cantitate_receptionata', label: 'Cant. Recepț.' },
              { key: 'tara', label: 'Tara' },
              { key: 'masa_net', label: 'Masa Net' },
              { key: 'diferenta', label: 'Diferență' },
              { key: 'umiditate', label: 'Umiditate (%)' },
              { key: 'pret_material_total', label: 'Preț Material' },
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
            <span className="hidden sm:inline">Recepție Nouă</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recepții Astăzi</p>
                <p className="text-2xl font-bold">{summaryStats.receptiiAstazi}</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Recepții</p>
                <p className="text-2xl font-bold">{summaryStats.totalReceptii}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg sm:text-xl">Lista Recepții</CardTitle>
            <div className="flex items-center gap-2">
              <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
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
        <CardContent className="px-2 sm:px-6">
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <Table className="min-w-[1800px]">
              <TableHeader>
                <TableRow>
                  <FilterHeader field="id" label="ID" />
                  <FilterHeader field="data" label="Data" />
                  <FilterHeader field="cod" label="Cod" />
                  <FilterHeader field="furnizor" label="Furnizor" />
                  <FilterHeader field="material" label="Material" />
                  <FilterHeader field="nr_aviz_provizoriu" label="Nr. Aviz Provizoriu" />
                  <FilterHeader field="nr_aviz_intrare" label="Nr. Aviz Intrare" />
                  <FilterHeader field="nume_sofer" label="Nume Șofer" />
                  <FilterHeader field="nr_inmatriculare" label="Nr. Înmatriculare" />
                  <FilterHeader field="tip_masina" label="Tip Mașină" />
                  <FilterHeader field="cantitate_livrata" label="Cant. Livrată" />
                  <FilterHeader field="cantitate_receptionata" label="Cant. Recepționată" />
                  <FilterHeader field="tara" label="Tara" />
                  <FilterHeader field="masa_net" label="Masa Net" />
                  <FilterHeader field="diferenta" label="Diferență" />
                  <FilterHeader field="umiditate" label="Umiditate (%)" />
                  <FilterHeader field="pret_material_total" label="Preț Material" />
                  <FilterHeader field="pret_transport_total" label="Preț Transport" />
                  <FilterHeader field="pret_total" label="Preț Total" />
                  <FilterHeader field="observatii" label="Observații" />
                  <FilterHeader field="nr_factura" label="Nr. Factură" />
                  <FilterHeader field="nr_tichet" label="Nr. Tichet" />
                </TableRow>
              </TableHeader>
              <TableBody key={`receptii-page-${currentPage}`} className="animate-fade-in">
                {loading ? (
                  <TableRow className="h-10">
                    <TableCell colSpan={21} className="text-center py-1 text-xs">
                      Se încarcă...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow className="h-10">
                    <TableCell colSpan={21} className="text-center py-1 text-xs">
                      Nu există recepții înregistrate
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((receptie) => (
                    <TableRow 
                      key={receptie.id}
                      className="h-10 cursor-pointer hover:bg-muted/50"
                      onClick={() => setViewingDetails(receptie)}
                    >
                      <TableCell className="py-1 text-xs">{receptie.id}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.data}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.cod}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.furnizor}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.material}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_aviz_provizoriu || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_aviz_intrare || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nume_sofer}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_inmatriculare}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.tip_masina}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.cantitate_livrata}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.cantitate_receptionata}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.tara}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.masa_net}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.diferenta}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.umiditate}%</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_material_total}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_transport_total}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_total}</TableCell>
                      <TableCell className="py-1 text-xs max-w-xs truncate">{receptie.observatii || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_factura || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_tichet || "-"}</TableCell>
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
                Afișare {startIndex + 1}-{Math.min(endIndex, filteredAndSorted.length)} din {filteredAndSorted.length}
              </span>
            </div>
            
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                <span className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1">
                  Afișare {startIndex + 1}-{Math.min(endIndex, filteredAndSorted.length)} din {filteredAndSorted.length}
                </span>
                <Pagination className="order-1 sm:order-2">
                  <PaginationContent className="gap-1">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={`h-8 px-2 sm:px-3 ${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={page} className="hidden sm:block">
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer h-8 w-8"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <span className="sm:hidden text-xs px-2">{currentPage}/{totalPages}</span>
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={`h-8 px-2 sm:px-3 ${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onOpenChange={setOpenAddEdit}>
        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto p-0" hideCloseButton>
          <DialogHeader className="px-5 pt-4 pb-2">
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              {editing ? "Editează Recepția" : "Adaugă Recepție Nouă"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {editing ? "Modifică datele recepției selectate" : "Completează informațiile pentru noua recepție"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-5 py-3 space-y-3">
            {/* Identificare Comandă */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Identificare Comandă</p>
              <div className="grid grid-cols-3 gap-3 p-2 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="cod" className="text-xs">Cod *</Label>
                  <FilterableSelect
                    id="cod"
                    value={form.cod}
                    onValueChange={(value) => setForm(prev => ({ ...prev, cod: value }))}
                    options={availableCodes.map(code => ({ value: code, label: code }))}
                    placeholder="Cod"
                    searchPlaceholder="Caută..."
                    className={`h-9 text-sm ${formErrors.cod ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="furnizor" className="text-xs">Furnizor</Label>
                  <Input id="furnizor" value={form.furnizor} disabled className="h-9 text-sm bg-muted/50" />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="material" className="text-xs">Material</Label>
                  <Input id="material" value={form.material} disabled className="h-9 text-sm bg-muted/50" />
                </div>
              </div>
            </div>

            {/* Transport */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Transport</p>
              <div className="grid grid-cols-3 gap-3 p-2 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="nume_sofer" className="text-xs">Șofer *</Label>
                  <FilterableSelect
                    id="nume_sofer"
                    value={form.nume_sofer}
                    onValueChange={(value) => setForm({ ...form, nume_sofer: value })}
                    options={availableDrivers.map(driver => ({ value: driver, label: driver }))}
                    placeholder="Șofer"
                    searchPlaceholder="Caută..."
                    className={`h-9 text-sm ${formErrors.nume_sofer ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="nr_inmatriculare" className="text-xs">Nr. Înmatr. *</Label>
                  <FilterableSelect
                    id="nr_inmatriculare"
                    value={form.nr_inmatriculare}
                    onValueChange={(value) => setForm({ ...form, nr_inmatriculare: value })}
                    options={availableRegistrationNumbers.map(regNum => ({ value: regNum, label: regNum }))}
                    placeholder="Nr. auto"
                    searchPlaceholder="Caută..."
                    className={`h-9 text-sm ${formErrors.nr_inmatriculare ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="tip_masina" className="text-xs">Tip Mașină</Label>
                  <Input id="tip_masina" value={form.tip_masina} disabled className="h-9 text-sm bg-muted/50" />
                </div>
              </div>
            </div>

            {/* Cantități & Măsurători */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cantități & Măsurători</p>
              <div className="grid grid-cols-6 gap-3 p-2 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="cantitate_livrata" className="text-xs">Cant. Livrată</Label>
                  <Input
                    id="cantitate_livrata"
                    type="number"
                    step="0.01"
                    value={form.cantitate_livrata}
                    disabled
                    className="h-9 text-sm bg-muted/50 font-mono"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="cantitate_receptionata" className="text-xs">Cant. Recepț. *</Label>
                  <Input
                    id="cantitate_receptionata"
                    type="number"
                    step="0.01"
                    value={form.cantitate_receptionata}
                    onChange={(e) => setForm(prev => ({ ...prev, cantitate_receptionata: parseFloat(e.target.value) || 0 }))}
                    className={`h-9 text-sm font-mono ${formErrors.cantitate_receptionata ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="tara" className="text-xs">Tara *</Label>
                  <Input
                    id="tara"
                    type="number"
                    step="0.01"
                    value={form.tara}
                    onChange={(e) => setForm(prev => ({ ...prev, tara: parseFloat(e.target.value) || 0 }))}
                    className={`h-9 text-sm font-mono ${formErrors.tara ? "border-destructive" : ""}`}
                  />
                </div>
                <div className="space-y-0.5">
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
                <div className="space-y-0.5">
                  <Label htmlFor="diferenta" className="text-xs">Diferență</Label>
                  <Input 
                    id="diferenta" 
                    type="number" 
                    value={form.diferenta} 
                    disabled 
                    className={`h-9 text-sm bg-muted/50 font-mono ${form.diferenta !== 0 ? 'text-destructive' : ''}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="umiditate" className="text-xs">Umiditate %</Label>
                  <Input
                    id="umiditate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={form.umiditate}
                    onChange={(e) => setForm(prev => ({ ...prev, umiditate: parseFloat(e.target.value) || 0 }))}
                    className={`h-9 text-sm font-mono ${formErrors.umiditate ? "border-destructive" : ""}`}
                  />
                </div>
              </div>
            </div>

            {/* Prețuri (RON) */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prețuri (RON)</p>
              <div className="grid grid-cols-3 gap-3 p-2 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="pret_material_total" className="text-xs">Preț Material</Label>
                  <Input 
                    id="pret_material_total" 
                    type="number" 
                    value={form.pret_material_total} 
                    disabled 
                    className="h-9 text-sm bg-muted/50 font-mono" 
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="pret_transport_total" className="text-xs">Preț Transport</Label>
                  <Input 
                    id="pret_transport_total" 
                    type="number" 
                    value={form.pret_transport_total} 
                    disabled 
                    className="h-9 text-sm bg-muted/50 font-mono" 
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="pret_total" className="text-xs text-primary font-medium">Preț Total</Label>
                  <Input 
                    id="pret_total" 
                    type="number" 
                    value={form.pret_total} 
                    disabled 
                    className="h-9 text-sm bg-primary/5 font-mono font-semibold border-primary/20" 
                  />
                </div>
              </div>
            </div>

            {/* Documente */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Documente</p>
              <div className="grid grid-cols-3 gap-3 p-2 rounded-lg border bg-card">
                <div className="space-y-0.5">
                  <Label htmlFor="nr_aviz_provizoriu" className="text-xs">Nr. Aviz Prov.</Label>
                  <Input
                    id="nr_aviz_provizoriu"
                    value={form.nr_aviz_provizoriu}
                    onChange={(e) => setForm({ ...form, nr_aviz_provizoriu: e.target.value })}
                    className="h-9 text-sm"
                    placeholder="Opțional"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="nr_aviz_intrare" className="text-xs">Nr. Aviz Intr.</Label>
                  <Input
                    id="nr_aviz_intrare"
                    value={form.nr_aviz_intrare}
                    onChange={(e) => setForm({ ...form, nr_aviz_intrare: e.target.value })}
                    className="h-9 text-sm"
                    placeholder="Opțional"
                  />
                </div>
                <div className="space-y-0.5">
                  <Label htmlFor="nr_factura" className="text-xs">Nr. Factură</Label>
                  <Input
                    id="nr_factura"
                    value={form.nr_factura}
                    onChange={(e) => setForm({ ...form, nr_factura: e.target.value })}
                    className="h-9 text-sm"
                    placeholder="Opțional"
                  />
                </div>
              </div>
            </div>

            {/* Observații */}
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Observații</p>
              <div className="p-2 rounded-lg border bg-card">
                <Textarea
                  id="observatii"
                  value={form.observatii}
                  onChange={(e) => setForm({ ...form, observatii: e.target.value })}
                  rows={3}
                  placeholder="Observații suplimentare..."
                  className="text-sm min-h-[80px] resize-y"
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
        <DialogContent className="w-[95vw] max-w-4xl" hideCloseButton>
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">Detalii Recepție - Cod: {viewingDetails?.cod}</DialogTitle>
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  if (viewingDetails?.cod) {
                    try {
                      const response = await fetch(`${API_BASE_URL}/generare_tichet_receptie/${viewingDetails.cod}`, {
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
                          description: `Tichetul pentru recepția ${viewingDetails.cod} a fost generat și descărcat.`,
                        });
                      } else {
                        toast({
                          title: "Eroare",
                          description: "Nu s-a putut genera tichetul.",
                          variant: "destructive"
                        });
                      }
                    } catch (error) {
                      toast({
                        title: "Eroare",
                        description: "Eroare la generarea tichetului.",
                        variant: "destructive"
                      });
                    }
                  }
                }}
              >
                <Ticket className="w-4 h-4 mr-2" />
                Generează Tichet
              </Button>
            </div>
          </DialogHeader>
          {viewingDetails && (
            <div className="grid gap-3 py-2">
              {/* Row 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">ID</Label>
                  <p className="text-sm font-medium">{viewingDetails.id}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Data</Label>
                  <p className="text-sm font-medium">{viewingDetails.data}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cod</Label>
                  <p className="text-sm font-medium">{viewingDetails.cod}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Furnizor</Label>
                  <p className="text-sm font-medium">{viewingDetails.furnizor}</p>
                </div>
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Material</Label>
                  <p className="text-sm font-medium">{viewingDetails.material}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nr. Aviz Prov.</Label>
                  <p className="text-sm font-medium">{viewingDetails.nr_aviz_provizoriu || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nr. Aviz Intr.</Label>
                  <p className="text-sm font-medium">{viewingDetails.nr_aviz_intrare || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nr. Factură</Label>
                  <p className="text-sm font-medium">{viewingDetails.nr_factura || "-"}</p>
                </div>
              </div>
              {/* Row 3 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Nr. Tichet</Label>
                  <p className="text-sm font-medium">{viewingDetails.nr_tichet || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nume Șofer</Label>
                  <p className="text-sm font-medium">{viewingDetails.nume_sofer}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Nr. Înmatr.</Label>
                  <p className="text-sm font-medium">{viewingDetails.nr_inmatriculare}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tip Mașină</Label>
                  <p className="text-sm font-medium">{viewingDetails.tip_masina}</p>
                </div>
              </div>
              {/* Row 4 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Cant. Livrată</Label>
                  <p className="text-sm font-medium">{viewingDetails.cantitate_livrata}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cant. Recepț.</Label>
                  <p className="text-sm font-medium">{viewingDetails.cantitate_receptionata}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tara</Label>
                  <p className="text-sm font-medium">{viewingDetails.tara}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Masa Net</Label>
                  <p className="text-sm font-medium">{viewingDetails.masa_net}</p>
                </div>
              </div>
              {/* Row 5 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Diferență</Label>
                  <p className="text-sm font-medium">{viewingDetails.diferenta}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Umiditate</Label>
                  <p className="text-sm font-medium">{viewingDetails.umiditate}%</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Preț Material</Label>
                  <p className="text-sm font-medium">{viewingDetails.pret_material_total}</p>
                </div>
              </div>
              {/* Row 6 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Preț Transport</Label>
                  <p className="text-sm font-medium">{viewingDetails.pret_transport_total}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Preț Total</Label>
                  <p className="text-sm font-medium">{viewingDetails.pret_total}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs text-muted-foreground">Observații</Label>
                  <p className="text-sm font-medium">{viewingDetails.observatii || "-"}</p>
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
              Ești sigur că vrei să ștergi recepția cu codul {deleting?.cod}? Această acțiune nu poate fi anulată.
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
}
