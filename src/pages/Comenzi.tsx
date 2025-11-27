import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { z } from "zod";

interface Furnizor {
  id: number;
  nume: string;
  adresa: string;
  cui: string;
  nr_reg: string;
}

interface Client {
  id: number;
  nume: string;
  adresa: string;
  cui: string;
  nr_reg: string;
}

interface Material {
  materiale_prime: string;
}

interface Produs {
  produs: string;
}

interface ComandaMateriePrima {
  id: number;
  cod: string;
  data: string;
  furnizor: string;
  material: string;
  unitate_masura: string;
  cantitate: number;
  punct_descarcare: string | null;
  pret_fara_tva: number;
  pret_transport: number | null;
  observatii: string;
}

interface ComandaProdusFinal {
  id: number;
  cod: string;
  data: string;
  client: string;
  produs: string;
  unitate_masura: string;
  cantitate: number;
  punct_descarcare: string | null;
  pret_fara_tva: number;
  pret_transport: number | null;
  observatii: string;
}

const comandaMPSchema = z.object({
  furnizor: z.string().trim().min(1, "Furnizorul este obligatoriu").max(255),
  material: z.string().trim().min(1, "Materialul este obligatoriu").max(255),
  unitate_masura: z.string().trim().min(1, "Unitatea de măsură este obligatorie").max(50),
  cantitate: z.number().min(0, "Cantitatea trebuie să fie pozitivă"),
  punct_descarcare: z.string().trim().max(255).optional(),
  pret_fara_tva: z.number().min(0, "Prețul trebuie să fie pozitiv"),
  pret_transport: z.number().min(0, "Prețul transport trebuie să fie pozitiv").optional(),
  observatii: z.string().trim().max(1000).optional()
});

const comandaPFSchema = z.object({
  client: z.string().trim().min(1, "Clientul este obligatoriu").max(255),
  produs: z.string().trim().min(1, "Produsul este obligatoriu").max(255),
  unitate_masura: z.string().trim().min(1, "Unitatea de măsură este obligatorie").max(50),
  cantitate: z.number().min(0, "Cantitatea trebuie să fie pozitivă"),
  punct_descarcare: z.string().trim().max(255).optional(),
  pret_fara_tva: z.number().min(0, "Prețul trebuie să fie pozitiv"),
  pret_transport: z.number().min(0, "Prețul transport trebuie să fie pozitiv").optional(),
  observatii: z.string().trim().max(1000).optional()
});

export default function Comenzi() {
  const { toast } = useToast();
  const [comenziMateriePrima, setComenziMateriePrima] = useState<ComandaMateriePrima[]>([]);
  const [loadingMP, setLoadingMP] = useState(false);
  const [comenziProduseFinite, setComenziProduseFinite] = useState<ComandaProdusFinal[]>([]);
  const [loadingPF, setLoadingPF] = useState(false);
  const [furnizori, setFurnizori] = useState<Furnizor[]>([]);
  const [loadingFurnizori, setLoadingFurnizori] = useState(true);
  const [clienti, setClienti] = useState<Client[]>([]);
  const [loadingClienti, setLoadingClienti] = useState(true);
  const [materiale, setMateriale] = useState<Material[]>([]);
  const [loadingMateriale, setLoadingMateriale] = useState(true);
  const [produse, setProduse] = useState<Produs[]>([]);
  const [loadingProduse, setLoadingProduse] = useState(true);
  
  // Pagination
  const [itemsPerPageMP, setItemsPerPageMP] = useState(10);
  const [currentPageMP, setCurrentPageMP] = useState(1);
  const [itemsPerPagePF, setItemsPerPagePF] = useState(10);
  const [currentPagePF, setCurrentPagePF] = useState(1);
  
  // Dialog states for MP
  const [openAddEditMP, setOpenAddEditMP] = useState(false);
  const [editingMP, setEditingMP] = useState<ComandaMateriePrima | null>(null);
  const [deletingMP, setDeletingMP] = useState<ComandaMateriePrima | null>(null);
  const [viewingDetailsMP, setViewingDetailsMP] = useState<ComandaMateriePrima | null>(null);
  
  // Dialog states for PF
  const [openAddEditPF, setOpenAddEditPF] = useState(false);
  const [editingPF, setEditingPF] = useState<ComandaProdusFinal | null>(null);
  const [deletingPF, setDeletingPF] = useState<ComandaProdusFinal | null>(null);
  const [viewingDetailsPF, setViewingDetailsPF] = useState<ComandaProdusFinal | null>(null);
  
  // Form states for MP
  const [formMP, setFormMP] = useState({
    furnizor: "",
    material: "",
    unitate_masura: "",
    cantitate: 0,
    punct_descarcare: "",
    pret_fara_tva: 0,
    pret_transport: 0,
    observatii: ""
  });
  const [formErrorsMP, setFormErrorsMP] = useState<Record<string, string>>({});
  
  // Form states for PF
  const [formPF, setFormPF] = useState({
    client: "",
    produs: "",
    unitate_masura: "",
    cantitate: 0,
    punct_descarcare: "",
    pret_fara_tva: 0,
    pret_transport: 0,
    observatii: ""
  });
  const [formErrorsPF, setFormErrorsPF] = useState<Record<string, string>>({});

  const fetchFurnizori = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza_furnizori/material');
      const data = await response.json();
      setFurnizori(data);
    } catch (error) {
      console.error('Error fetching furnizori:', error);
    }
    setLoadingFurnizori(false);
  };

  const fetchClienti = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza_clienti/produs');
      const data = await response.json();
      setClienti(data);
    } catch (error) {
      console.error('Error fetching clienti:', error);
    }
    setLoadingClienti(false);
  };

  const fetchMateriale = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza_materiale/material');
      const data = await response.json();
      setMateriale(data);
    } catch (error) {
      console.error('Error fetching materiale:', error);
    }
    setLoadingMateriale(false);
  };

  const fetchProduse = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza_produse/produs');
      const data = await response.json();
      setProduse(data);
    } catch (error) {
      console.error('Error fetching produse:', error);
    }
    setLoadingProduse(false);
  };

  const fetchComenziMP = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza/material');
      const data = await response.json();
      setComenziMateriePrima(data);
    } catch (error) {
      console.error('Error fetching comenzi MP:', error);
    }
    setLoadingMP(false);
  };

  const fetchComenziPF = async () => {
    try {
      const response = await fetch('http://192.168.15.4:8002/comenzi/returneaza/produs');
      const data = await response.json();
      setComenziProduseFinite(data);
    } catch (error) {
      console.error('Error fetching comenzi PF:', error);
    }
    setLoadingPF(false);
  };
  
  useEffect(() => {
    fetchFurnizori();
    fetchClienti();
    fetchMateriale();
    fetchProduse();
    fetchComenziMP();
    fetchComenziPF();
  }, []);
  
  // Add/Edit handlers for MP
  const handleOpenAddMP = () => {
    setEditingMP(null);
    setFormMP({
      furnizor: "",
      material: "",
      unitate_masura: "",
      cantitate: 0,
      punct_descarcare: "",
      pret_fara_tva: 0,
      pret_transport: 0,
      observatii: ""
    });
    setFormErrorsMP({});
    setOpenAddEditMP(true);
  };
  
  const handleOpenEditMP = (comanda: ComandaMateriePrima) => {
    setEditingMP(comanda);
    setFormMP({
      furnizor: comanda.furnizor,
      material: comanda.material,
      unitate_masura: comanda.unitate_masura,
      cantitate: comanda.cantitate,
      punct_descarcare: comanda.punct_descarcare || "",
      pret_fara_tva: comanda.pret_fara_tva,
      pret_transport: comanda.pret_transport || 0,
      observatii: comanda.observatii
    });
    setFormErrorsMP({});
    setOpenAddEditMP(true);
  };
  
  const handleSaveMP = async () => {
    try {
      // Validate
      const validatedData = comandaMPSchema.parse({
        ...formMP,
        punct_descarcare: formMP.punct_descarcare || undefined,
        pret_transport: formMP.pret_transport || undefined,
        observatii: formMP.observatii || undefined
      });
      
      setFormErrorsMP({});
      
      if (editingMP) {
        // Edit
        const response = await fetch('http://192.168.15.4:8002/editeaza', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "comenzi_material",
            id: editingMP.id,
            update: validatedData
          })
        });
        
        if (!response.ok) throw new Error('Failed to update comanda');
        
        toast({
          title: "Succes",
          description: "Comanda a fost actualizată cu succes"
        });
      } else {
        // Add
        const response = await fetch('http://192.168.15.4:8002/comenzi/adauga/material', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData)
        });
        
        if (!response.ok) throw new Error('Failed to add comanda');
        
        toast({
          title: "Succes",
          description: "Comanda a fost adăugată cu succes"
        });
      }
      
      setOpenAddEditMP(false);
      fetchComenziMP();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrorsMP(errors);
      } else {
        toast({
          title: "Eroare",
          description: `Nu s-a putut salva comanda: ${error}`,
          variant: "destructive"
        });
      }
    }
  };
  
  const handleDeleteMP = async () => {
    if (!deletingMP) return;
    
    try {
      const response = await fetch('http://192.168.15.4:8002/sterge', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "comenzi_material",
          id: deletingMP.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to delete comanda');
      
      toast({
        title: "Succes",
        description: "Comanda a fost ștearsă cu succes"
      });
      
      setDeletingMP(null);
      fetchComenziMP();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge comanda",
        variant: "destructive"
      });
    }
  };

  // Add/Edit handlers for PF
  const handleOpenAddPF = () => {
    setEditingPF(null);
    setFormPF({
      client: "",
      produs: "",
      unitate_masura: "",
      cantitate: 0,
      punct_descarcare: "",
      pret_fara_tva: 0,
      pret_transport: 0,
      observatii: ""
    });
    setFormErrorsPF({});
    setOpenAddEditPF(true);
  };
  
  const handleOpenEditPF = (comanda: ComandaProdusFinal) => {
    setEditingPF(comanda);
    setFormPF({
      client: comanda.client,
      produs: comanda.produs,
      unitate_masura: comanda.unitate_masura,
      cantitate: comanda.cantitate,
      punct_descarcare: comanda.punct_descarcare || "",
      pret_fara_tva: comanda.pret_fara_tva,
      pret_transport: comanda.pret_transport || 0,
      observatii: comanda.observatii
    });
    setFormErrorsPF({});
    setOpenAddEditPF(true);
  };
  
  const handleSavePF = async () => {
    try {
      // Validate
      const validatedData = comandaPFSchema.parse({
        ...formPF,
        punct_descarcare: formPF.punct_descarcare || undefined,
        pret_transport: formPF.pret_transport || undefined,
        observatii: formPF.observatii || undefined
      });
      
      setFormErrorsPF({});
      
      if (editingPF) {
        // Edit
        const response = await fetch('http://192.168.15.4:8002/editeaza', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "comenzi_produs_finit",
            id: editingPF.id,
            update: validatedData
          })
        });
        
        if (!response.ok) throw new Error('Failed to update comanda');
        
        toast({
          title: "Succes",
          description: "Comanda a fost actualizată cu succes"
        });
      } else {
        // Add
        const response = await fetch('http://192.168.15.4:8002/comenzi/adauga/produs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData)
        });
        
        if (!response.ok) throw new Error('Failed to add comanda');
        
        toast({
          title: "Succes",
          description: "Comanda a fost adăugată cu succes"
        });
      }
      
      setOpenAddEditPF(false);
      fetchComenziPF();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrorsPF(errors);
      } else {
        toast({
          title: "Eroare",
          description: `Nu s-a putut salva comanda: ${error}`,
          variant: "destructive"
        });
      }
    }
  };
  
  const handleDeletePF = async () => {
    if (!deletingPF) return;
    
    try {
      const response = await fetch('http://192.168.15.4:8002/sterge', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "comenzi_produs_finit",
          id: deletingPF.id
        })
      });
      
      if (!response.ok) throw new Error('Failed to delete comanda');
      
      toast({
        title: "Succes",
        description: "Comanda a fost ștearsă cu succes"
      });
      
      setDeletingPF(null);
      fetchComenziPF();
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge comanda",
        variant: "destructive"
      });
    }
  };

  // Filters for Materie Prima
  const [filtersMP, setFiltersMP] = useState({
    id: "", cod: "", data: "", furnizor: "", material: "", cantitate: "", pret_fara_tva: ""
  });

  // Sort for Materie Prima
  const [sortMP, setSortMP] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  // Filtering and sorting for MP
  const filteredAndSortedMP = comenziMateriePrima
    .filter((item) => {
      return (
        item.id.toString().includes(filtersMP.id) &&
        item.cod.toLowerCase().includes(filtersMP.cod.toLowerCase()) &&
        item.data.toLowerCase().includes(filtersMP.data.toLowerCase()) &&
        item.furnizor.toLowerCase().includes(filtersMP.furnizor.toLowerCase()) &&
        item.material.toLowerCase().includes(filtersMP.material.toLowerCase()) &&
        item.cantitate.toString().includes(filtersMP.cantitate) &&
        item.pret_fara_tva.toString().includes(filtersMP.pret_fara_tva)
      );
    })
    .sort((a, b) => {
      if (!sortMP.field || !sortMP.direction) return 0;
      const aVal = a[sortMP.field as keyof ComandaMateriePrima];
      const bVal = b[sortMP.field as keyof ComandaMateriePrima];
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortMP.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sortMP.direction === 'asc' ? -1 : 1;
      if (aVal < bVal) return sortMP.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortMP.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination for MP
  const totalPagesMP = Math.ceil(filteredAndSortedMP.length / itemsPerPageMP);
  const startIndexMP = (currentPageMP - 1) * itemsPerPageMP;
  const endIndexMP = startIndexMP + itemsPerPageMP;
  const paginatedDataMP = filteredAndSortedMP.slice(startIndexMP, endIndexMP);

  // Reset to page 1 when MP filters change
  useEffect(() => {
    setCurrentPageMP(1);
  }, [filtersMP]);

  // Filters for Produs Finit
  const [filtersPF, setFiltersPF] = useState({
    id: "", cod: "", data: "", client: "", produs: "", cantitate: "", punct_descarcare: "", pret_fara_tva: ""
  });

  // Sort for Produs Finit
  const [sortPF, setSortPF] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  // Filtering and sorting for PF
  const filteredAndSortedPF = comenziProduseFinite
    .filter((item) => {
      return (
        item.id.toString().includes(filtersPF.id) &&
        item.cod.toLowerCase().includes(filtersPF.cod.toLowerCase()) &&
        item.data.toLowerCase().includes(filtersPF.data.toLowerCase()) &&
        item.client.toLowerCase().includes(filtersPF.client.toLowerCase()) &&
        item.produs.toLowerCase().includes(filtersPF.produs.toLowerCase()) &&
        item.cantitate.toString().includes(filtersPF.cantitate) &&
        (item.punct_descarcare || "").toLowerCase().includes(filtersPF.punct_descarcare.toLowerCase()) &&
        item.pret_fara_tva.toString().includes(filtersPF.pret_fara_tva)
      );
    })
    .sort((a, b) => {
      if (!sortPF.field || !sortPF.direction) return 0;
      const aVal = a[sortPF.field as keyof ComandaProdusFinal];
      const bVal = b[sortPF.field as keyof ComandaProdusFinal];
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortPF.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sortPF.direction === 'asc' ? -1 : 1;
      if (aVal < bVal) return sortPF.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortPF.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Pagination for PF
  const totalPagesPF = Math.ceil(filteredAndSortedPF.length / itemsPerPagePF);
  const startIndexPF = (currentPagePF - 1) * itemsPerPagePF;
  const endIndexPF = startIndexPF + itemsPerPagePF;
  const paginatedDataPF = filteredAndSortedPF.slice(startIndexPF, endIndexPF);

  // Reset to page 1 when PF filters change
  useEffect(() => {
    setCurrentPagePF(1);
  }, [filtersPF]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Comenzi</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Gestionează comenzile de materii prime și produse finite
        </p>
      </div>

      <Tabs defaultValue="materie-prima" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materie-prima">Materie Prima</TabsTrigger>
          <TabsTrigger value="produse-finite">Produs Finit</TabsTrigger>
        </TabsList>

        <TabsContent value="materie-prima">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Comenzi Materie Primă</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Înregistrări per pagină:</Label>
                  <Select
                    value={itemsPerPageMP.toString()}
                    onValueChange={(value) => {
                      setItemsPerPageMP(Number(value));
                      setCurrentPageMP(1);
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
                <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenAddMP}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă Comandă
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>ID</span>
                              {sortMP.field === 'id' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={filtersMP.id} onChange={(e) => setFiltersMP({...filtersMP, id: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'id', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cod</span>
                              {sortMP.field === 'cod' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cod..." value={filtersMP.cod} onChange={(e) => setFiltersMP({...filtersMP, cod: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cod', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cod', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Data</span>
                              {sortMP.field === 'data' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută data..." value={filtersMP.data} onChange={(e) => setFiltersMP({...filtersMP, data: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'data', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'data', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Furnizor</span>
                              {sortMP.field === 'furnizor' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută furnizor..." value={filtersMP.furnizor} onChange={(e) => setFiltersMP({...filtersMP, furnizor: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'furnizor', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'furnizor', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Material</span>
                              {sortMP.field === 'material' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută material..." value={filtersMP.material} onChange={(e) => setFiltersMP({...filtersMP, material: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'material', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'material', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cantitate</span>
                              {sortMP.field === 'cantitate' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cantitate..." value={filtersMP.cantitate} onChange={(e) => setFiltersMP({...filtersMP, cantitate: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cantitate', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cantitate', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț fără TVA</span>
                              {sortMP.field === 'pret_fara_tva' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersMP.pret_fara_tva} onChange={(e) => setFiltersMP({...filtersMP, pret_fara_tva: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_fara_tva', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_fara_tva', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody key={`mp-page-${currentPageMP}`} className="animate-fade-in">
                  {loadingMP ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedDataMP.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                        Nu există comenzi disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDataMP.map((comanda) => (
                      <TableRow 
                        key={comanda.id} 
                        className="h-10 cursor-pointer hover:bg-muted/50"
                        onClick={() => setViewingDetailsMP(comanda)}
                      >
                        <TableCell className="py-1 text-xs">{comanda.id}</TableCell>
                        <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.furnizor}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.material}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                      </TableRow>
                    ))
                  )}
                 </TableBody>
              </Table>
            </CardContent>
            
            {/* Pagination Controls MP */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Afișare {startIndexMP + 1}-{Math.min(endIndexMP, filteredAndSortedMP.length)} din {filteredAndSortedMP.length}
                </span>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPageMP(Math.max(1, currentPageMP - 1))}
                      className={currentPageMP === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPagesMP }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPageMP(page)}
                        isActive={currentPageMP === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPageMP(Math.min(totalPagesMP, currentPageMP + 1))}
                      className={currentPageMP === totalPagesMP ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="produse-finite">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Comenzi Produse Finite</CardTitle>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Înregistrări per pagină:</Label>
                  <Select
                    value={itemsPerPagePF.toString()}
                    onValueChange={(value) => {
                      setItemsPerPagePF(Number(value));
                      setCurrentPagePF(1);
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
                <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenAddPF}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adaugă Comandă
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>ID</span>
                              {sortPF.field === 'id' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={filtersPF.id} onChange={(e) => setFiltersPF({...filtersPF, id: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'id', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cod</span>
                              {sortPF.field === 'cod' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cod..." value={filtersPF.cod} onChange={(e) => setFiltersPF({...filtersPF, cod: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cod', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cod', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Data</span>
                              {sortPF.field === 'data' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută data..." value={filtersPF.data} onChange={(e) => setFiltersPF({...filtersPF, data: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'data', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'data', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Client</span>
                              {sortPF.field === 'client' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută client..." value={filtersPF.client} onChange={(e) => setFiltersPF({...filtersPF, client: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'client', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'client', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Produs</span>
                              {sortPF.field === 'produs' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută produs..." value={filtersPF.produs} onChange={(e) => setFiltersPF({...filtersPF, produs: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'produs', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'produs', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cantitate</span>
                              {sortPF.field === 'cantitate' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cantitate..." value={filtersPF.cantitate} onChange={(e) => setFiltersPF({...filtersPF, cantitate: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cantitate', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cantitate', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Punct Descărcare</span>
                              {sortPF.field === 'punct_descarcare' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută punct..." value={filtersPF.punct_descarcare} onChange={(e) => setFiltersPF({...filtersPF, punct_descarcare: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'punct_descarcare', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'punct_descarcare', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț fără TVA</span>
                              {sortPF.field === 'pret_fara_tva' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersPF.pret_fara_tva} onChange={(e) => setFiltersPF({...filtersPF, pret_fara_tva: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_fara_tva', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_fara_tva', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody key={`pf-page-${currentPagePF}`} className="animate-fade-in">
                  {loadingPF ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedDataPF.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        Nu există comenzi disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedDataPF.map((comanda) => (
                      <TableRow 
                        key={comanda.id} 
                        className="h-10 cursor-pointer hover:bg-muted/50"
                        onClick={() => setViewingDetailsPF(comanda)}
                      >
                        <TableCell className="py-1 text-xs">{comanda.id}</TableCell>
                        <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.client}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.produs}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.punct_descarcare || "-"}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* Pagination Controls PF */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Afișare {startIndexPF + 1}-{Math.min(endIndexPF, filteredAndSortedPF.length)} din {filteredAndSortedPF.length}
                </span>
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPagePF(Math.max(1, currentPagePF - 1))}
                      className={currentPagePF === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPagesPF }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPagePF(page)}
                        isActive={currentPagePF === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPagePF(Math.min(totalPagesPF, currentPagePF + 1))}
                      className={currentPagePF === totalPagesPF ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Dialog for Materie Prima */}
      <Dialog open={openAddEditMP} onOpenChange={setOpenAddEditMP}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingMP ? "Editează Comanda" : "Adaugă Comandă Nouă"}</DialogTitle>
            <DialogDescription>
              {editingMP ? "Modifică detaliile comenzii de materie primă" : "Completează detaliile pentru noua comandă de materie primă"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="furnizor">Furnizor *</Label>
              <Select
                value={formMP.furnizor}
                onValueChange={(value) => setFormMP({ ...formMP, furnizor: value })}
              >
                <SelectTrigger className={formErrorsMP.furnizor ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selectează furnizor" />
                </SelectTrigger>
                <SelectContent>
                  {loadingFurnizori ? (
                    <SelectItem value="loading" disabled>Se încarcă...</SelectItem>
                  ) : furnizori.length === 0 ? (
                    <SelectItem value="empty" disabled>Fără furnizori</SelectItem>
                  ) : (
                    furnizori.map((furnizor) => (
                      <SelectItem key={furnizor.id} value={furnizor.nume}>
                        {furnizor.nume}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formErrorsMP.furnizor && <p className="text-sm text-destructive">{formErrorsMP.furnizor}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="material">Material *</Label>
              <Select
                value={formMP.material}
                onValueChange={(value) => setFormMP({ ...formMP, material: value })}
              >
                <SelectTrigger className={formErrorsMP.material ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selectează material" />
                </SelectTrigger>
                <SelectContent>
                  {loadingMateriale ? (
                    <SelectItem value="loading" disabled>Se încarcă...</SelectItem>
                  ) : materiale.length === 0 ? (
                    <SelectItem value="empty" disabled>Fără materiale</SelectItem>
                  ) : (
                    materiale.map((material, index) => (
                      <SelectItem key={index} value={material.materiale_prime}>
                        {material.materiale_prime}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formErrorsMP.material && <p className="text-sm text-destructive">{formErrorsMP.material}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unitate_masura">Unitate Măsură *</Label>
                <Input
                  id="unitate_masura"
                  value={formMP.unitate_masura}
                  onChange={(e) => setFormMP({ ...formMP, unitate_masura: e.target.value })}
                  className={formErrorsMP.unitate_masura ? "border-destructive" : ""}
                />
                {formErrorsMP.unitate_masura && <p className="text-sm text-destructive">{formErrorsMP.unitate_masura}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantitate">Cantitate *</Label>
                <Input
                  id="cantitate"
                  type="number"
                  value={formMP.cantitate}
                  onChange={(e) => setFormMP({ ...formMP, cantitate: parseFloat(e.target.value) || 0 })}
                  className={formErrorsMP.cantitate ? "border-destructive" : ""}
                />
                {formErrorsMP.cantitate && <p className="text-sm text-destructive">{formErrorsMP.cantitate}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="punct_descarcare">Punct Descărcare</Label>
              <Input
                id="punct_descarcare"
                value={formMP.punct_descarcare}
                onChange={(e) => setFormMP({ ...formMP, punct_descarcare: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pret_fara_tva">Preț fără TVA *</Label>
                <Input
                  id="pret_fara_tva"
                  type="number"
                  step="0.01"
                  value={formMP.pret_fara_tva}
                  onChange={(e) => setFormMP({ ...formMP, pret_fara_tva: parseFloat(e.target.value) || 0 })}
                  className={formErrorsMP.pret_fara_tva ? "border-destructive" : ""}
                />
                {formErrorsMP.pret_fara_tva && <p className="text-sm text-destructive">{formErrorsMP.pret_fara_tva}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_transport">Preț Transport</Label>
                <Input
                  id="pret_transport"
                  type="number"
                  step="0.01"
                  value={formMP.pret_transport}
                  onChange={(e) => setFormMP({ ...formMP, pret_transport: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observatii">Observații</Label>
              <Textarea
                id="observatii"
                value={formMP.observatii}
                onChange={(e) => setFormMP({ ...formMP, observatii: e.target.value })}
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEditMP(false)}>
              Anulează
            </Button>
            <Button onClick={handleSaveMP}>
              {editingMP ? "Salvează Modificările" : "Adaugă Comanda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog for Materie Prima */}
      <Dialog open={!!viewingDetailsMP} onOpenChange={() => setViewingDetailsMP(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Comandă Materie Primă</DialogTitle>
            <DialogDescription>
              Informații complete despre comanda {viewingDetailsMP?.cod}
            </DialogDescription>
          </DialogHeader>
          {viewingDetailsMP && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">{viewingDetailsMP.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cod</Label>
                  <p className="font-medium">{viewingDetailsMP.cod}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">{viewingDetailsMP.data}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Furnizor</Label>
                  <p className="font-medium">{viewingDetailsMP.furnizor}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Material</Label>
                  <p className="font-medium">{viewingDetailsMP.material}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Unitate Măsură</Label>
                  <p className="font-medium">{viewingDetailsMP.unitate_masura}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cantitate</Label>
                  <p className="font-medium">{viewingDetailsMP.cantitate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Punct Descărcare</Label>
                  <p className="font-medium">{viewingDetailsMP.punct_descarcare || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț fără TVA</Label>
                  <p className="font-medium">{viewingDetailsMP.pret_fara_tva}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Transport</Label>
                  <p className="font-medium">{viewingDetailsMP.pret_transport || "-"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Observații</Label>
                <p className="font-medium">{viewingDetailsMP.observatii || "-"}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewingDetailsMP(null)}>
              Închide
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (viewingDetailsMP) {
                  handleOpenEditMP(viewingDetailsMP);
                  setViewingDetailsMP(null);
                }
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button 
              variant="destructive"
              className="bg-red-700 hover:bg-red-600"
              onClick={() => {
                if (viewingDetailsMP) {
                  setDeletingMP(viewingDetailsMP);
                  setViewingDetailsMP(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog for Materie Prima */}
      <AlertDialog open={!!deletingMP} onOpenChange={() => setDeletingMP(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi comanda {deletingMP?.cod}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMP} className="bg-red-700 hover:bg-red-600">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Dialog for Produs Finit */}
      <Dialog open={openAddEditPF} onOpenChange={setOpenAddEditPF}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPF ? "Editează Comanda" : "Adaugă Comandă Nouă"}</DialogTitle>
            <DialogDescription>
              {editingPF ? "Modifică detaliile comenzii de produs finit" : "Completează detaliile pentru noua comandă de produs finit"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formPF.client}
                onValueChange={(value) => setFormPF({ ...formPF, client: value })}
              >
                <SelectTrigger className={formErrorsPF.client ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selectează client" />
                </SelectTrigger>
                <SelectContent>
                  {loadingClienti ? (
                    <SelectItem value="loading" disabled>Se încarcă...</SelectItem>
                  ) : clienti.length === 0 ? (
                    <SelectItem value="empty" disabled>Fără clienți</SelectItem>
                  ) : (
                    clienti.map((client) => (
                      <SelectItem key={client.id} value={client.nume}>
                        {client.nume}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formErrorsPF.client && <p className="text-sm text-destructive">{formErrorsPF.client}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="produs">Produs *</Label>
              <Select
                value={formPF.produs}
                onValueChange={(value) => setFormPF({ ...formPF, produs: value })}
              >
                <SelectTrigger className={formErrorsPF.produs ? "border-destructive" : ""}>
                  <SelectValue placeholder="Selectează produs" />
                </SelectTrigger>
                <SelectContent>
                  {loadingProduse ? (
                    <SelectItem value="loading" disabled>Se încarcă...</SelectItem>
                  ) : produse.length === 0 ? (
                    <SelectItem value="empty" disabled>Fără produse</SelectItem>
                  ) : (
                    produse.map((produs, index) => (
                      <SelectItem key={index} value={produs.produs}>
                        {produs.produs}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {formErrorsPF.produs && <p className="text-sm text-destructive">{formErrorsPF.produs}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="unitate_masura_pf">Unitate Măsură *</Label>
                <Input
                  id="unitate_masura_pf"
                  value={formPF.unitate_masura}
                  onChange={(e) => setFormPF({ ...formPF, unitate_masura: e.target.value })}
                  className={formErrorsPF.unitate_masura ? "border-destructive" : ""}
                />
                {formErrorsPF.unitate_masura && <p className="text-sm text-destructive">{formErrorsPF.unitate_masura}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cantitate_pf">Cantitate *</Label>
                <Input
                  id="cantitate_pf"
                  type="number"
                  value={formPF.cantitate}
                  onChange={(e) => setFormPF({ ...formPF, cantitate: parseFloat(e.target.value) || 0 })}
                  className={formErrorsPF.cantitate ? "border-destructive" : ""}
                />
                {formErrorsPF.cantitate && <p className="text-sm text-destructive">{formErrorsPF.cantitate}</p>}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="punct_descarcare_pf">Punct Descărcare</Label>
              <Input
                id="punct_descarcare_pf"
                value={formPF.punct_descarcare}
                onChange={(e) => setFormPF({ ...formPF, punct_descarcare: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="pret_fara_tva_pf">Preț fără TVA *</Label>
                <Input
                  id="pret_fara_tva_pf"
                  type="number"
                  step="0.01"
                  value={formPF.pret_fara_tva}
                  onChange={(e) => setFormPF({ ...formPF, pret_fara_tva: parseFloat(e.target.value) || 0 })}
                  className={formErrorsPF.pret_fara_tva ? "border-destructive" : ""}
                />
                {formErrorsPF.pret_fara_tva && <p className="text-sm text-destructive">{formErrorsPF.pret_fara_tva}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pret_transport_pf">Preț Transport</Label>
                <Input
                  id="pret_transport_pf"
                  type="number"
                  step="0.01"
                  value={formPF.pret_transport}
                  onChange={(e) => setFormPF({ ...formPF, pret_transport: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observatii_pf">Observații</Label>
              <Textarea
                id="observatii_pf"
                value={formPF.observatii}
                onChange={(e) => setFormPF({ ...formPF, observatii: e.target.value })}
                rows={3}
                maxLength={1000}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEditPF(false)}>
              Anulează
            </Button>
            <Button onClick={handleSavePF}>
              {editingPF ? "Salvează Modificările" : "Adaugă Comanda"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog for Produs Finit */}
      <Dialog open={!!viewingDetailsPF} onOpenChange={() => setViewingDetailsPF(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalii Comandă Produs Finit</DialogTitle>
            <DialogDescription>
              Informații complete despre comanda {viewingDetailsPF?.cod}
            </DialogDescription>
          </DialogHeader>
          {viewingDetailsPF && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">ID</Label>
                  <p className="font-medium">{viewingDetailsPF.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cod</Label>
                  <p className="font-medium">{viewingDetailsPF.cod}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Data</Label>
                  <p className="font-medium">{viewingDetailsPF.data}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Client</Label>
                  <p className="font-medium">{viewingDetailsPF.client}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Produs</Label>
                  <p className="font-medium">{viewingDetailsPF.produs}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Unitate Măsură</Label>
                  <p className="font-medium">{viewingDetailsPF.unitate_masura}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cantitate</Label>
                  <p className="font-medium">{viewingDetailsPF.cantitate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Punct Descărcare</Label>
                  <p className="font-medium">{viewingDetailsPF.punct_descarcare || "-"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț fără TVA</Label>
                  <p className="font-medium">{viewingDetailsPF.pret_fara_tva}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Preț Transport</Label>
                  <p className="font-medium">{viewingDetailsPF.pret_transport || "-"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground">Observații</Label>
                <p className="font-medium">{viewingDetailsPF.observatii || "-"}</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewingDetailsPF(null)}>
              Închide
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                if (viewingDetailsPF) {
                  handleOpenEditPF(viewingDetailsPF);
                  setViewingDetailsPF(null);
                }
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button 
              variant="destructive"
              className="bg-red-700 hover:bg-red-600"
              onClick={() => {
                if (viewingDetailsPF) {
                  setDeletingPF(viewingDetailsPF);
                  setViewingDetailsPF(null);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog for Produs Finit */}
      <AlertDialog open={!!deletingPF} onOpenChange={() => setDeletingPF(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi comanda {deletingPF?.cod}? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePF} className="bg-red-700 hover:bg-red-600">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
