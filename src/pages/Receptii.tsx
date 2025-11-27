import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ArrowUpDown } from "lucide-react";
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
  nume_sofer: string;
  nr_inmatriculare: string;
  tip_masina: string;
  cantitate_livrata: number;
  cantitate_receptionata: number;
  diferenta: number;
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
  nume_sofer: z.string().trim().min(1, "Numele șoferului este obligatoriu").max(100),
  nr_inmatriculare: z.string().trim().min(1, "Numărul de înmatriculare este obligatoriu").max(10),
  tip_masina: z.string().trim().min(1, "Tipul mașinii este obligatoriu").max(20),
  cantitate_livrata: z.number().min(0, "Cantitatea livrată trebuie să fie pozitivă"),
  cantitate_receptionata: z.number().min(0, "Cantitatea recepționată trebuie să fie pozitivă"),
  diferenta: z.number(),
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
    nume_sofer: "",
    nr_inmatriculare: "",
    tip_masina: "",
    cantitate_livrata: 0,
    cantitate_receptionata: 0,
    diferenta: 0,
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
    nume_sofer: "",
    nr_inmatriculare: "",
    tip_masina: "",
    cantitate_livrata: "",
    cantitate_receptionata: "",
    diferenta: "",
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
      setReceptii(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching receptii:', error);
      setReceptii([]);
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

  // Calculate diferenta when cantitate_receptionata changes
  useEffect(() => {
    const diferenta = form.cantitate_livrata - form.cantitate_receptionata;
    setForm(prev => ({ ...prev, diferenta }));
  }, [form.cantitate_receptionata]);

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
      nume_sofer: "",
      nr_inmatriculare: "",
      tip_masina: "",
      cantitate_livrata: 0,
      cantitate_receptionata: 0,
      diferenta: 0,
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
    setForm({
      data: receptie.data,
      cod: receptie.cod,
      furnizor: receptie.furnizor,
      material: receptie.material,
      nr_aviz_provizoriu: receptie.nr_aviz_provizoriu || "",
      nr_aviz_intrare: receptie.nr_aviz_intrare || "",
      nr_factura: receptie.nr_factura || "",
      nume_sofer: receptie.nume_sofer,
      nr_inmatriculare: receptie.nr_inmatriculare,
      tip_masina: receptie.tip_masina,
      cantitate_livrata: receptie.cantitate_livrata,
      cantitate_receptionata: receptie.cantitate_receptionata,
      diferenta: receptie.diferenta,
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
        const response = await fetch(`${API_BASE_URL}/receptii/editeaza/material/${form.cod}/${form.cantitate_receptionata}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "receptii_materiale",
            id: editing.id,
            update: validatedData
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
          diferenta: form.diferenta,
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
        (item.nume_sofer || "").toLowerCase().includes(filters.nume_sofer.toLowerCase()) &&
        (item.nr_inmatriculare || "").toLowerCase().includes(filters.nr_inmatriculare.toLowerCase()) &&
        (item.tip_masina || "").toLowerCase().includes(filters.tip_masina.toLowerCase()) &&
        (item.cantitate_livrata?.toString() || "").includes(filters.cantitate_livrata) &&
        (item.cantitate_receptionata?.toString() || "").includes(filters.cantitate_receptionata) &&
        (item.diferenta?.toString() || "").includes(filters.diferenta) &&
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recepții Materiale</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare recepții materii prime
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" />
          Recepție Nouă
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lista Recepții</CardTitle>
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
                  <FilterHeader field="furnizor" label="Furnizor" />
                  <FilterHeader field="material" label="Material" />
                  <FilterHeader field="nr_aviz_provizoriu" label="Nr. Aviz Provizoriu" />
                  <FilterHeader field="nr_aviz_intrare" label="Nr. Aviz Intrare" />
                  <FilterHeader field="nume_sofer" label="Nume Șofer" />
                  <FilterHeader field="nr_inmatriculare" label="Nr. Înmatriculare" />
                  <FilterHeader field="tip_masina" label="Tip Mașină" />
                  <FilterHeader field="cantitate_livrata" label="Cant. Livrată" />
                  <FilterHeader field="cantitate_receptionata" label="Cant. Recepționată" />
                  <FilterHeader field="diferenta" label="Diferență" />
                  <FilterHeader field="pret_material_total" label="Preț Material" />
                  <FilterHeader field="pret_transport_total" label="Preț Transport" />
                  <FilterHeader field="pret_total" label="Preț Total" />
                  <FilterHeader field="observatii" label="Observații" />
                  <FilterHeader field="nr_factura" label="Nr. Factură" />
                </TableRow>
              </TableHeader>
              <TableBody key={`receptii-page-${currentPage}`} className="animate-fade-in">
                {loading ? (
                  <TableRow className="h-10">
                    <TableCell colSpan={18} className="text-center py-1 text-xs">
                      Se încarcă...
                    </TableCell>
                  </TableRow>
                ) : paginatedData.length === 0 ? (
                  <TableRow className="h-10">
                    <TableCell colSpan={18} className="text-center py-1 text-xs">
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
                      <TableCell className="py-1 text-xs">{receptie.diferenta}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_material_total}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_transport_total}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.pret_total}</TableCell>
                      <TableCell className="py-1 text-xs max-w-xs truncate">{receptie.observatii || "-"}</TableCell>
                      <TableCell className="py-1 text-xs">{receptie.nr_factura || "-"}</TableCell>
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
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openAddEdit} onOpenChange={setOpenAddEdit}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editează Recepția" : "Adaugă Recepție Nouă"}</DialogTitle>
            <DialogDescription>
              {editing ? "Modifică detaliile recepției" : "Completează detaliile pentru noua recepție"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {editing && (
                <div className="grid gap-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={form.data}
                    disabled
                    className="bg-muted"
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="cod">Cod *</Label>
                <FilterableSelect
                  id="cod"
                  value={form.cod}
                  onValueChange={(value) => setForm({ ...form, cod: value })}
                  options={availableCodes.map(code => ({ value: code, label: code }))}
                  placeholder="Selectează cod"
                  searchPlaceholder="Caută cod..."
                  className={formErrors.cod ? "border-destructive" : ""}
                />
                {formErrors.cod && <p className="text-sm text-destructive">{formErrors.cod}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="furnizor">Furnizor *</Label>
                <Input
                  id="furnizor"
                  value={form.furnizor}
                  disabled
                  className="bg-muted"
                />
                {formErrors.furnizor && <p className="text-sm text-destructive">{formErrors.furnizor}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="material">Material *</Label>
                <Input
                  id="material"
                  value={form.material}
                  disabled
                  className="bg-muted"
                />
                {formErrors.material && <p className="text-sm text-destructive">{formErrors.material}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nr_aviz_provizoriu">Nr. Aviz Provizoriu</Label>
                <Input
                  id="nr_aviz_provizoriu"
                  value={form.nr_aviz_provizoriu}
                  onChange={(e) => setForm({ ...form, nr_aviz_provizoriu: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nr_aviz_intrare">Nr. Aviz Intrare</Label>
                <Input
                  id="nr_aviz_intrare"
                  value={form.nr_aviz_intrare}
                  onChange={(e) => setForm({ ...form, nr_aviz_intrare: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nr_factura">Nr. Factură</Label>
              <Input
                id="nr_factura"
                value={form.nr_factura}
                onChange={(e) => setForm({ ...form, nr_factura: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nume_sofer">Nume Șofer *</Label>
                <FilterableSelect
                  id="nume_sofer"
                  value={form.nume_sofer}
                  onValueChange={(value) => setForm({ ...form, nume_sofer: value })}
                  options={availableDrivers.map(driver => ({ value: driver, label: driver }))}
                  placeholder="Selectează șofer"
                  searchPlaceholder="Caută șofer..."
                  className={formErrors.nume_sofer ? "border-destructive" : ""}
                />
                {formErrors.nume_sofer && <p className="text-sm text-destructive">{formErrors.nume_sofer}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nr_inmatriculare">Nr. Înmatriculare *</Label>
                <FilterableSelect
                  id="nr_inmatriculare"
                  value={form.nr_inmatriculare}
                  onValueChange={(value) => setForm({ ...form, nr_inmatriculare: value })}
                  options={availableRegistrationNumbers.map(regNum => ({ value: regNum, label: regNum }))}
                  placeholder="Selectează nr. înmatriculare"
                  searchPlaceholder="Caută nr. înmatriculare..."
                  className={formErrors.nr_inmatriculare ? "border-destructive" : ""}
                />
                {formErrors.nr_inmatriculare && <p className="text-sm text-destructive">{formErrors.nr_inmatriculare}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tip_masina">Tip Mașină *</Label>
              <Input
                id="tip_masina"
                value={form.tip_masina}
                disabled
                className="bg-muted"
              />
              {formErrors.tip_masina && <p className="text-sm text-destructive">{formErrors.tip_masina}</p>}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="cantitate_livrata">Cantitate Livrată *</Label>
                <Input
                  id="cantitate_livrata"
                  type="number"
                  step="0.01"
                  value={form.cantitate_livrata}
                  disabled
                  className="bg-muted"
                />
                {formErrors.cantitate_livrata && <p className="text-sm text-destructive">{formErrors.cantitate_livrata}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantitate_receptionata">Cantitate Recepționată *</Label>
                <Input
                  id="cantitate_receptionata"
                  type="number"
                  step="0.01"
                  value={form.cantitate_receptionata}
                  onChange={(e) => setForm({ ...form, cantitate_receptionata: parseFloat(e.target.value) || 0 })}
                  className={formErrors.cantitate_receptionata ? "border-destructive" : ""}
                />
                {formErrors.cantitate_receptionata && <p className="text-sm text-destructive">{formErrors.cantitate_receptionata}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="diferenta">Diferență</Label>
                <Input
                  id="diferenta"
                  type="number"
                  step="0.01"
                  value={form.diferenta}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pret_material_total">Preț Material Total *</Label>
                <Input
                  id="pret_material_total"
                  type="number"
                  step="0.01"
                  value={form.pret_material_total}
                  disabled
                  className="bg-muted"
                />
                {formErrors.pret_material_total && <p className="text-sm text-destructive">{formErrors.pret_material_total}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_transport_total">Preț Transport Total *</Label>
                <Input
                  id="pret_transport_total"
                  type="number"
                  step="0.01"
                  value={form.pret_transport_total}
                  disabled
                  className="bg-muted"
                />
                {formErrors.pret_transport_total && <p className="text-sm text-destructive">{formErrors.pret_transport_total}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_total">Preț Total *</Label>
                <Input
                  id="pret_total"
                  type="number"
                  step="0.01"
                  value={form.pret_total}
                  disabled
                  className="bg-muted"
                />
                {formErrors.pret_total && <p className="text-sm text-destructive">{formErrors.pret_total}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observatii">Observații</Label>
              <Textarea
                id="observatii"
                value={form.observatii}
                onChange={(e) => setForm({ ...form, observatii: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)}>
              Anulează
            </Button>
            <Button onClick={handleSave}>
              {editing ? "Salvează Modificările" : "Adaugă Recepția"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details View Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Recepție - Cod: {viewingDetails?.cod}</DialogTitle>
            <DialogDescription>
              Informații complete despre recepție
            </DialogDescription>
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
                  <p className="font-medium">{viewingDetails.data}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cod</Label>
                  <p className="font-medium">{viewingDetails.cod}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Aviz Provizoriu</Label>
                  <p className="font-medium">{viewingDetails.nr_aviz_provizoriu || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Aviz Intrare</Label>
                  <p className="font-medium">{viewingDetails.nr_aviz_intrare || "-"}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Factură</Label>
                  <p className="font-medium">{viewingDetails.nr_factura || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nume Șofer</Label>
                  <p className="font-medium">{viewingDetails.nume_sofer}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Nr. Înmatriculare</Label>
                  <p className="font-medium">{viewingDetails.nr_inmatriculare}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tip Mașină</Label>
                  <p className="font-medium">{viewingDetails.tip_masina}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cantitate Livrată</Label>
                  <p className="font-medium">{viewingDetails.cantitate_livrata}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cantitate Recepționată</Label>
                  <p className="font-medium">{viewingDetails.cantitate_receptionata}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Diferență</Label>
                  <p className="font-medium">{viewingDetails.diferenta}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Material Total</Label>
                  <p className="font-medium">{viewingDetails.pret_material_total}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Transport Total</Label>
                  <p className="font-medium">{viewingDetails.pret_transport_total}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Total</Label>
                  <p className="font-medium">{viewingDetails.pret_total}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Observații</Label>
                <p className="font-medium">{viewingDetails.observatii || "-"}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Nr. Factură</Label>
                <p className="font-medium">{viewingDetails.nr_factura || "-"}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewingDetails(null)}>
              Închide
            </Button>
            <Button 
              variant="outline"
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
