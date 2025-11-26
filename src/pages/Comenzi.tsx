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
  const [loadingMP, setLoadingMP] = useState(true);
  const [comenziProduseFinite, setComenziProduseFinite] = useState<ComandaProdusFinal[]>([]);
  const [loadingPF, setLoadingPF] = useState(true);
  const [furnizori, setFurnizori] = useState<Furnizor[]>([]);
  const [loadingFurnizori, setLoadingFurnizori] = useState(true);
  const [clienti, setClienti] = useState<Client[]>([]);
  const [loadingClienti, setLoadingClienti] = useState(true);
  
  // Dialog states for MP
  const [openAddEditMP, setOpenAddEditMP] = useState(false);
  const [editingMP, setEditingMP] = useState<ComandaMateriePrima | null>(null);
  const [deletingMP, setDeletingMP] = useState<ComandaMateriePrima | null>(null);
  
  // Dialog states for PF
  const [openAddEditPF, setOpenAddEditPF] = useState(false);
  const [editingPF, setEditingPF] = useState<ComandaProdusFinal | null>(null);
  const [deletingPF, setDeletingPF] = useState<ComandaProdusFinal | null>(null);
  
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

  // Fetch furnizori from API
  const fetchFurnizori = async () => {
    try {
      setLoadingFurnizori(true);
      const response = await fetch('http://192.168.1.22:8002/comenzi/returneaza_furnizori/material');
      if (!response.ok) {
        throw new Error('Failed to fetch furnizori');
      }
      const data = await response.json();
      setFurnizori(data);
    } catch (error) {
      console.error('Error fetching furnizori:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca furnizorii",
        variant: "destructive"
      });
    } finally {
      setLoadingFurnizori(false);
    }
  };

  // Fetch clienti from API
  const fetchClienti = async () => {
    try {
      setLoadingClienti(true);
      const response = await fetch('http://192.168.1.22:8002/comenzi/returneaza_clienti/produs');
      if (!response.ok) {
        throw new Error('Failed to fetch clienti');
      }
      const data = await response.json();
      setClienti(data);
    } catch (error) {
      console.error('Error fetching clienti:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca clienții",
        variant: "destructive"
      });
    } finally {
      setLoadingClienti(false);
    }
  };

  // Fetch comenzi materie prima from API
  const fetchComenziMP = async () => {
    try {
      setLoadingMP(true);
      const response = await fetch('http://192.168.1.22:8002/comenzi/returneaza/material');
      if (!response.ok) {
        throw new Error('Failed to fetch comenzi materie prima');
      }
      const data = await response.json();
      setComenziMateriePrima(data);
    } catch (error) {
      console.error('Error fetching comenzi materie prima:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca comenzile de materie primă",
        variant: "destructive"
      });
    } finally {
      setLoadingMP(false);
    }
  };
  
  useEffect(() => {
    fetchFurnizori();
    fetchClienti();
    fetchComenziMP();
  }, [toast]);
  
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
        const response = await fetch('http://192.168.1.22:8002/editeaza', {
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
        const response = await fetch('http://192.168.1.22:8002/comenzi/adauga/material', {
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
      const response = await fetch('http://192.168.1.22:8002/sterge', {
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
        const response = await fetch('http://192.168.1.22:8002/editeaza', {
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
        const response = await fetch('http://192.168.1.22:8002/comenzi/adauga/produs', {
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
      const response = await fetch('http://192.168.1.22:8002/sterge', {
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

  // Filters for Produs Finit
  const fetchComenziPF = async () => {
    try {
      setLoadingPF(true);
      const response = await fetch('http://192.168.1.22:8002/comenzi/returneaza/produs');
      if (!response.ok) {
        throw new Error('Failed to fetch comenzi produse finite');
      }
      const data = await response.json();
      setComenziProduseFinite(data);
    } catch (error) {
      console.error('Error fetching comenzi produse finite:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca comenzile de produse finite",
        variant: "destructive"
      });
    } finally {
      setLoadingPF(false);
    }
  };
  
  useEffect(() => {
    fetchComenziMP();
    fetchComenziPF();
  }, [toast]);

  // Filters for Produs Finit
  const [filtersPF, setFiltersPF] = useState({
    id: "", cod: "", data: "", client: "", produs: "", cantitate: "", punct_descarcare: "", pret_fara_tva: ""
  });

  // Sort for Produs Finit
  const [sortPF, setSortPF] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  // Filtering and sorting logic for Materie Prima
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
      
      let aVal: any = a[sortMP.field as keyof ComandaMateriePrima];
      let bVal: any = b[sortMP.field as keyof ComandaMateriePrima];
      
      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortMP.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sortMP.direction === 'asc' ? -1 : 1;
      
      if (aVal < bVal) return sortMP.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortMP.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Filtering and sorting logic for Produs Finit
  const filteredAndSortedPF = comenziProduseFinite
    .filter((item) => {
      return (
        item.id.toString().includes(filtersPF.id) &&
        item.cod.toLowerCase().includes(filtersPF.cod.toLowerCase()) &&
        item.data.toLowerCase().includes(filtersPF.data.toLowerCase()) &&
        item.client.toLowerCase().includes(filtersPF.client.toLowerCase()) &&
        item.produs.toLowerCase().includes(filtersPF.produs.toLowerCase()) &&
        item.cantitate.toString().includes(filtersPF.cantitate) &&
        (item.punct_descarcare || '').toLowerCase().includes(filtersPF.punct_descarcare.toLowerCase()) &&
        item.pret_fara_tva.toString().includes(filtersPF.pret_fara_tva)
      );
    })
    .sort((a, b) => {
      if (!sortPF.field || !sortPF.direction) return 0;
      
      let aVal: any = a[sortPF.field as keyof ComandaProdusFinal];
      let bVal: any = b[sortPF.field as keyof ComandaProdusFinal];
      
      // Handle null values
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return sortPF.direction === 'asc' ? 1 : -1;
      if (bVal === null) return sortPF.direction === 'asc' ? -1 : 1;
      
      if (aVal < bVal) return sortPF.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortPF.direction === 'asc' ? 1 : -1;
      return 0;
    });

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
              <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenAddMP}>
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
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
                    <TableHead className="text-right h-10 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingMP ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedMP.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                        Nu există comenzi disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedMP.map((comanda) => (
                      <TableRow key={comanda.id} className="h-10">
                        <TableCell className="py-1 text-xs">{comanda.id}</TableCell>
                        <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.furnizor}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.material}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => handleOpenEditMP(comanda)}>
                              <Pencil className="w-3 h-3" />
                              Editează
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setDeletingMP(comanda)}>
                              <Trash2 className="w-3 h-3" />
                              Șterge
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produse-finite">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Comenzi Produse Finite</CardTitle>
              <Button size="sm" className="w-full sm:w-auto" onClick={handleOpenAddPF}>
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
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
                    <TableHead className="text-right h-10 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingPF ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedPF.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                        Nu există comenzi disponibile
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedPF.map((comanda) => (
                      <TableRow key={comanda.id} className="h-10">
                        <TableCell className="py-1 text-xs">{comanda.id}</TableCell>
                        <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.client}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.produs}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.punct_descarcare || '-'}</TableCell>
                        <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                        <TableCell className="text-right py-1">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => handleOpenEditPF(comanda)}>
                              <Pencil className="w-3 h-3" />
                              Editează
                            </Button>
                            <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setDeletingPF(comanda)}>
                              <Trash2 className="w-3 h-3" />
                              Șterge
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
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
              <Input
                id="material"
                value={formMP.material}
                onChange={(e) => setFormMP({ ...formMP, material: e.target.value })}
                className={formErrorsMP.material ? "border-destructive" : ""}
              />
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
              <Input
                id="produs"
                value={formPF.produs}
                onChange={(e) => setFormPF({ ...formPF, produs: e.target.value })}
                className={formErrorsPF.produs ? "border-destructive" : ""}
              />
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
