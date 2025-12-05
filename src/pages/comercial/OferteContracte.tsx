import { useState, useMemo, useRef, useEffect } from "react";
import { FileCheck, Plus, Download, Copy, Mail, FileText, Pencil, Trash2, X, CalendarIcon, Upload, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
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

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTableColumnHeader, DataTablePagination, DataTableEmpty } from "@/components/ui/data-table";
import { format, addDays } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Types
interface ProdusItem {
  produs: string;
  pret: number;
  cantitate?: number;
}

interface TransportPricing {
  tipTransport: "fara_transport" | "inclus" | "inchiriere" | "tona_km";
  pretInchiriere?: number;
  pretTonaKm?: number;
}

const transportOptions = [
  { value: "fara_transport", label: "Fără transport" },
  { value: "inclus", label: "Inclus în preț" },
  { value: "inchiriere", label: "Preț chirie transport" },
  { value: "tona_km", label: "Preț tonă/km" },
] as const;

interface Oferta {
  id: number;
  nr: string;
  client: string;
  proiect: string;
  produs: string; // Pentru afișare în tabel (primul produs sau "Multiple")
  pret: number; // Pentru afișare în tabel (suma totală)
  produse: ProdusItem[];
  transport: TransportPricing;
  valabilitate: string;
  termenPlata: string;
  status: "In curs de aprobare" | "Aprobata" | "Respinsa";
  tip: "oferta";
  dataCreare: string;
  conditiiComerciale: string;
  observatii: string;
}

interface Contract {
  id: number;
  nr: string;
  client: string;
  proiect: string;
  produs: string;
  pret: number;
  produse: ProdusItem[];
  transport: TransportPricing;
  valabilitate: string;
  termenPlata: string;
  status: "In curs de aprobare" | "Aprobata" | "Respinsa";
  tip: "contract";
  dataCreare: string;
  conditiiComerciale: string;
  observatii: string;
  indexareCombustibil: string;
}

type Item = Oferta | Contract;

// Initial empty data
const initialOferte: Oferta[] = [];

const initialContracte: Contract[] = [];

const statusColors: Record<string, string> = {
  "In curs de aprobare": "bg-amber-500/20 text-amber-600 dark:text-amber-400",
  "Aprobata": "bg-green-500/20 text-green-600 dark:text-green-400",
  "Respinsa": "bg-red-500/20 text-red-600 dark:text-red-400",
};

const statusOptions = ["In curs de aprobare", "Aprobata", "Respinsa"] as const;

const OferteContracte = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"oferte" | "contracte">("oferte");
  
  // Data state
  const [oferte, setOferte] = useState<Oferta[]>(initialOferte);
  const [contracte, setContracte] = useState<Contract[]>(initialContracte);
  const [isLoadingOferte, setIsLoadingOferte] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch oferte from API
  const fetchOferte = async () => {
    setIsLoadingOferte(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/returneaza/oferte`);
      if (!response.ok) throw new Error("Eroare la încărcarea ofertelor");
      const data = await response.json();
      
      // Map API data to Oferta type
      const mappedOferte: Oferta[] = data.map((item: any, index: number) => {
        // Parse tip_transport to our format
        let tipTransport: "fara_transport" | "inclus" | "inchiriere" | "tona_km" = "inclus";
        if (item.tip_transport === "fara_transport" || item.tip_transport === "Fără transport") {
          tipTransport = "fara_transport";
        } else if (item.tip_transport === "inclus" || item.tip_transport === "Inclus în preț") {
          tipTransport = "inclus";
        } else if (item.tip_transport === "inchiriere" || item.tip_transport === "chirie" || item.tip_transport === "Preț chirie transport") {
          tipTransport = "inchiriere";
        } else if (item.tip_transport === "tona_km" || item.tip_transport === "tonă/km" || item.tip_transport === "Preț tonă/km") {
          tipTransport = "tona_km";
        }
        
        // Parse produse and preturi_produse from comma-separated strings
        const produseNames = item.produse ? item.produse.split(",").map((p: string) => p.trim()) : [];
        const preturiProduse = item.preturi_produse ? item.preturi_produse.split(",").map((p: string) => parseFloat(p.trim()) || 0) : [];
        
        // Build produse array with prices
        const produseArray = produseNames.map((name: string, i: number) => ({
          produs: name,
          pret: preturiProduse[i] || 0
        }));
        
        // Calculate total: sum of product prices + transport price
        const sumaProduse = preturiProduse.reduce((sum: number, p: number) => sum + p, 0);
        const pretTransportValue = parseFloat(item.pret_transport) || 0;
        const totalPret = sumaProduse + pretTransportValue;
        
        return {
          id: item.id || index + 1,
          nr: item.cod_oferta || `OF-${index + 1}`,
          client: item.client || "",
          proiect: item.proiect_santier || "",
          produs: item.produse || "",
          pret: totalPret,
          produse: produseArray.length > 0 ? produseArray : [{ produs: "", pret: 0 }],
          transport: { 
            tipTransport,
            ...(tipTransport === "inchiriere" && { pretInchiriere: pretTransportValue }),
            ...(tipTransport === "tona_km" && { pretTonaKm: pretTransportValue }),
          },
          valabilitate: item.valabilitate || "",
          termenPlata: `${item.termen_de_plata || 0} zile`,
          status: (item.status as "In curs de aprobare" | "Aprobata" | "Respinsa") || "In curs de aprobare",
          tip: "oferta" as const,
          dataCreare: item.data || "",
          conditiiComerciale: "",
          observatii: item.observatii || "",
        };
      });
      
      setOferte(mappedOferte);
    } catch (error) {
      console.error("Error fetching oferte:", error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca ofertele.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOferte(false);
    }
  };
  
  const [isLoadingContracte, setIsLoadingContracte] = useState(false);
  
  const fetchContracte = async () => {
    setIsLoadingContracte(true);
    try {
      const response = await fetch(`${API_BASE_URL}/comercial/returneaza/contracte`);
      if (!response.ok) throw new Error("Eroare la încărcarea contractelor");
      const data = await response.json();
      console.log("API contracte response:", data);
      
      const contracteArray = Array.isArray(data) ? data : (data.data || data.items || []);
      
      const mappedContracte: Contract[] = contracteArray.map((item: any) => {
        const produseStr = item.produse || "";
        const preturiStr = item.preturi_produse || "";
        const produseArr = produseStr.split(",").map((p: string) => p.trim()).filter(Boolean);
        const preturiArr = preturiStr.split(",").map((p: string) => parseFloat(p.trim()) || 0);
        
        const produseList: ProdusItem[] = produseArr.map((produs: string, idx: number) => ({
          produs,
          pret: preturiArr[idx] || 0
        }));
        
        const totalPret = produseList.reduce((sum, p) => sum + p.pret, 0);
        
        let tipTransport: TransportPricing["tipTransport"] = "inclus";
        if (item.tip_transport === "Fără transport") tipTransport = "fara_transport";
        else if (item.tip_transport === "Inclus în preț") tipTransport = "inclus";
        else if (item.tip_transport === "Preț chirie transport") tipTransport = "inchiriere";
        else if (item.tip_transport === "Preț tonă/km") tipTransport = "tona_km";
        
        const pretTransportVal = parseFloat(item.pret_transport) || 0;
        
        return {
          id: item.id,
          nr: item.cod || `CTR-${item.id}`,
          client: item.client || "",
          proiect: item.proiect_santier || "",
          produs: produseList.map(p => p.produs).join(", "),
          pret: totalPret,
          produse: produseList,
          transport: {
            tipTransport,
            pretInchiriere: tipTransport === "inchiriere" ? pretTransportVal : 0,
            pretTonaKm: tipTransport === "tona_km" ? pretTransportVal : 0,
          },
          valabilitate: item.valabilitate || "",
          termenPlata: item.termen_de_plata ? `${item.termen_de_plata} zile` : "30 zile",
          status: (item.status === "Aprobata" || item.status === "Respinsa") ? item.status : "In curs de aprobare",
          tip: "contract" as const,
          dataCreare: item.data || "",
          conditiiComerciale: "",
          observatii: item.observatii || "",
          indexareCombustibil: item.indexare_combustibil || "",
        };
      });
      
      setContracte(mappedContracte);
    } catch (error) {
      console.error("Error fetching contracte:", error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca contractele.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContracte(false);
    }
  };
  
  // Clients and Products lists from API
  const [clientsList, setClientsList] = useState<string[]>([]);
  const [produseFiniteList, setProduseFiniteList] = useState<string[]>([]);
  
  const fetchClienti = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/returneaza_clienti`);
      if (!response.ok) throw new Error("Eroare la încărcarea clienților");
      const data = await response.json();
      console.log("API clienti response:", data);
      // Handle both array and wrapped response formats
      const clientsArray = Array.isArray(data) ? data : (data.data || data.items || []);
      const clientNames = clientsArray.map((item: any) => item.nume || "").filter(Boolean);
      console.log("Extracted client names:", clientNames);
      setClientsList(clientNames);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };
  
  const fetchProduseFinite = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/returneaza_produse_finite`);
      if (!response.ok) throw new Error("Eroare la încărcarea produselor");
      const data = await response.json();
      console.log("API produse response:", data);
      // Handle both array and wrapped response formats
      const produseArray = Array.isArray(data) ? data : (data.data || data.items || []);
      const productNames = produseArray.map((item: any) => item.produs || "").filter(Boolean);
      console.log("Extracted product names:", productNames);
      setProduseFiniteList(productNames);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  useEffect(() => {
    fetchOferte();
    fetchContracte();
    fetchClienti();
    fetchProduseFinite();
  }, []);
  
  // Pagination
  const [ofertePage, setOfertePage] = useState(1);
  const [contractePage, setContractePage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Dialog states
  const [viewingDetails, setViewingDetails] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState<Item | null>(null);
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    client: "",
    proiect: "",
    produse: [{ produs: "", pret: 0 }] as ProdusItem[],
    transport: { tipTransport: "inclus" as TransportPricing["tipTransport"], pretInchiriere: 0, pretTonaKm: 0 },
    valabilitate: "",
    termenPlata: "30 zile",
    observatii: "",
    indexareCombustibil: "",
    garantie: { biletOrdin: null as File | null, procesVerbal: null as File | null },
    avansPlata: 0,
    status: "In curs de aprobare" as "In curs de aprobare" | "Aprobata" | "Respinsa",
  });
  
  // File input refs
  const biletOrdinRef = useRef<HTMLInputElement>(null);
  const procesVerbalRef = useRef<HTMLInputElement>(null);
  
  // File upload state
  const [isUploadingBiletOrdin, setIsUploadingBiletOrdin] = useState(false);
  const [biletOrdinUploadUrl, setBiletOrdinUploadUrl] = useState<string | null>(null);
  const [isUploadingProcesVerbal, setIsUploadingProcesVerbal] = useState(false);
  const [procesVerbalUploadUrl, setProcesVerbalUploadUrl] = useState<string | null>(null);
  
  // Upload file to API
  const handleBiletOrdinUpload = async (file: File) => {
    setIsUploadingBiletOrdin(true);
    setBiletOrdinUploadUrl(null);
    
    const prefix = editing ? editing.tip : activeTab === "oferte" ? "oferte" : "contracte";
    
    try {
      const formData = new FormData();
      formData.append("folder", `${prefix}/bilete_ordin_cec`);
      formData.append("file", file);
      formData.append("return_physical_path", "false");
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBiletOrdinUploadUrl(data.public_url);
        toast({
          title: "Fișier încărcat cu succes",
          description: "Documentul a fost încărcat pe server.",
        });
      } else {
        toast({
          title: "Eroare la încărcare",
          description: data.detail || "A apărut o eroare la încărcarea fișierului",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Eroare la încărcare",
        description: "Nu s-a putut conecta la server",
        variant: "destructive",
      });
    } finally {
      setIsUploadingBiletOrdin(false);
    }
  };
  
  const handleProcesVerbalUpload = async (file: File) => {
    setIsUploadingProcesVerbal(true);
    setProcesVerbalUploadUrl(null);
    
    const prefix = editing ? editing.tip : activeTab === "oferte" ? "oferte" : "contracte";
    
    try {
      const formData = new FormData();
      formData.append("folder", `${prefix}/procese_verbale_predare_primire`);
      formData.append("file", file);
      formData.append("return_physical_path", "false");
      
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProcesVerbalUploadUrl(data.public_url);
        toast({
          title: "Fișier încărcat cu succes",
          description: "Documentul a fost încărcat pe server.",
        });
      } else {
        toast({
          title: "Eroare la încărcare",
          description: data.detail || "A apărut o eroare la încărcarea fișierului",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Eroare la încărcare",
        description: "Nu s-a putut conecta la server",
        variant: "destructive",
      });
    } finally {
      setIsUploadingProcesVerbal(false);
    }
  };
  
  // Column filters
  const [oferteFilters, setOferteFilters] = useState<Record<string, string>>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  const [contracteFilters, setContracteFilters] = useState<Record<string, string>>({
    nr: "", client: "", proiect: "", produs: "", pret: "", valabilitate: "", termenPlata: "", status: ""
  });
  
  // Sorting
  const [oferteSort, setOferteSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [contracteSort, setContracteSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  // Get unique values for dropdowns - combine API data with existing data
  const clients = useMemo(() => {
    console.log("Computing clients - clientsList:", clientsList);
    const existingClients = [...oferte, ...contracte].map(item => item.client);
    const allClients = [...new Set([...clientsList, ...existingClients])];
    const result = allClients.filter(Boolean);
    console.log("Final clients array:", result);
    return result;
  }, [oferte, contracte, clientsList]);

  const produse = useMemo(() => {
    console.log("Computing produse - produseFiniteList:", produseFiniteList);
    const existingProduse = [...oferte, ...contracte].map(item => item.produs);
    const allProduse = [...new Set([...produseFiniteList, ...existingProduse])];
    const result = allProduse.filter(Boolean);
    console.log("Final produse array:", result);
    return result;
  }, [oferte, contracte, produseFiniteList]);

  // Filter and sort oferte
  const filteredOferte = useMemo(() => {
    return oferte
      .filter(item => {
        return (
          item.nr.toLowerCase().includes(oferteFilters.nr.toLowerCase()) &&
          item.client.toLowerCase().includes(oferteFilters.client.toLowerCase()) &&
          item.proiect.toLowerCase().includes(oferteFilters.proiect.toLowerCase()) &&
          item.produs.toLowerCase().includes(oferteFilters.produs.toLowerCase()) &&
          item.pret.toString().includes(oferteFilters.pret) &&
          item.valabilitate.toLowerCase().includes(oferteFilters.valabilitate.toLowerCase()) &&
          item.termenPlata.toLowerCase().includes(oferteFilters.termenPlata.toLowerCase()) &&
          (oferteFilters.status === "" || item.status === oferteFilters.status)
        );
      })
      .sort((a, b) => {
        if (!oferteSort) return 0;
        const aVal = a[oferteSort.key as keyof Oferta];
        const bVal = b[oferteSort.key as keyof Oferta];
        if (aVal < bVal) return oferteSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return oferteSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [oferte, oferteFilters, oferteSort]);

  // Filter and sort contracte
  const filteredContracte = useMemo(() => {
    return contracte
      .filter(item => {
        return (
          item.nr.toLowerCase().includes(contracteFilters.nr.toLowerCase()) &&
          item.client.toLowerCase().includes(contracteFilters.client.toLowerCase()) &&
          item.proiect.toLowerCase().includes(contracteFilters.proiect.toLowerCase()) &&
          item.produs.toLowerCase().includes(contracteFilters.produs.toLowerCase()) &&
          item.pret.toString().includes(contracteFilters.pret) &&
          item.valabilitate.toLowerCase().includes(contracteFilters.valabilitate.toLowerCase()) &&
          item.termenPlata.toLowerCase().includes(contracteFilters.termenPlata.toLowerCase()) &&
          (contracteFilters.status === "" || item.status === contracteFilters.status)
        );
      })
      .sort((a, b) => {
        if (!contracteSort) return 0;
        const aVal = a[contracteSort.key as keyof Contract];
        const bVal = b[contracteSort.key as keyof Contract];
        if (aVal < bVal) return contracteSort.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return contracteSort.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [contracte, contracteFilters, contracteSort]);

  // Pagination calculations
  const oferteTotalPages = Math.ceil(filteredOferte.length / itemsPerPage);
  const contracteTotalPages = Math.ceil(filteredContracte.length / itemsPerPage);
  const paginatedOferte = filteredOferte.slice((ofertePage - 1) * itemsPerPage, ofertePage * itemsPerPage);
  const paginatedContracte = filteredContracte.slice((contractePage - 1) * itemsPerPage, contractePage * itemsPerPage);

  const handleExport = () => {
    if (activeTab === "oferte") {
      const columns = [
        { key: "nr" as const, label: "Nr." },
        { key: "dataCreare" as const, label: "Data Creare" },
        { key: "client" as const, label: "Client" },
        { key: "proiect" as const, label: "Proiect/Șantier" },
        { key: "produse" as const, label: "Produse", transform: (val: ProdusItem[]) => val?.map(p => `${p.produs}: ${p.pret} RON`).join("; ") || "" },
        { key: "pret" as const, label: "Preț Total" },
        { key: "transport" as const, label: "Transport", transform: (val: TransportPricing) => {
          if (!val) return "-";
          if (val.tipTransport === "fara_transport") return "Fără transport";
          if (val.tipTransport === "inclus") return "Inclus în preț";
          if (val.tipTransport === "inchiriere") return `Chirie: ${val.pretInchiriere} RON`;
          if (val.tipTransport === "tona_km") return `${val.pretTonaKm} RON/tonă/km`;
          return "-";
        }},
        { key: "valabilitate" as const, label: "Valabilitate" },
        { key: "termenPlata" as const, label: "Termen Plată" },
        { key: "status" as const, label: "Status" },
        { key: "observatii" as const, label: "Observații" },
      ];
      exportToCSV(filteredOferte, `oferte_${new Date().toISOString().split('T')[0]}`, columns);
    } else {
      const columns = [
        { key: "nr" as const, label: "Nr." },
        { key: "dataCreare" as const, label: "Data Creare" },
        { key: "client" as const, label: "Client" },
        { key: "proiect" as const, label: "Proiect/Șantier" },
        { key: "produse" as const, label: "Produse", transform: (val: ProdusItem[]) => val?.map(p => `${p.produs}: ${p.pret} RON`).join("; ") || "" },
        { key: "pret" as const, label: "Preț Total" },
        { key: "transport" as const, label: "Transport", transform: (val: TransportPricing) => {
          if (!val) return "-";
          if (val.tipTransport === "fara_transport") return "Fără transport";
          if (val.tipTransport === "inclus") return "Inclus în preț";
          if (val.tipTransport === "inchiriere") return `Chirie: ${val.pretInchiriere} RON`;
          if (val.tipTransport === "tona_km") return `${val.pretTonaKm} RON/tonă/km`;
          return "-";
        }},
        { key: "valabilitate" as const, label: "Valabilitate" },
        { key: "termenPlata" as const, label: "Termen Plată" },
        { key: "indexareCombustibil" as const, label: "Indexare Combustibil" },
        { key: "status" as const, label: "Status" },
        { key: "observatii" as const, label: "Observații" },
      ];
      exportToCSV(filteredContracte, `contracte_${new Date().toISOString().split('T')[0]}`, columns);
    }
    toast({ title: "Export realizat", description: `Fișierul ${activeTab}.csv a fost descărcat.` });
  };

  const handleOpenAdd = () => {
    setEditing(null);
    setBiletOrdinUploadUrl(null);
    setProcesVerbalUploadUrl(null);
    setForm({
      client: "",
      proiect: "",
      produse: [{ produs: "", pret: 0 }],
      transport: { tipTransport: "inclus", pretInchiriere: 0, pretTonaKm: 0 },
      valabilitate: "",
      termenPlata: "30 zile",
      observatii: "",
      indexareCombustibil: "",
      garantie: { biletOrdin: null, procesVerbal: null },
      avansPlata: 0,
      status: "In curs de aprobare",
    });
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (item: Item) => {
    setEditing(item);
    setBiletOrdinUploadUrl(null);
    setProcesVerbalUploadUrl(null);
    const itemTransport = item.transport || { tipTransport: "inclus" as const };
    setForm({
      client: item.client,
      proiect: item.proiect,
      produse: item.produse && item.produse.length > 0 ? item.produse : [{ produs: item.produs, pret: item.pret }],
      transport: { 
        tipTransport: itemTransport.tipTransport, 
        pretInchiriere: itemTransport.pretInchiriere || 0,
        pretTonaKm: itemTransport.pretTonaKm || 0 
      },
      valabilitate: item.valabilitate,
      termenPlata: item.termenPlata,
      observatii: item.observatii,
      indexareCombustibil: item.tip === "contract" ? (item as Contract).indexareCombustibil : "",
      garantie: { biletOrdin: null, procesVerbal: null },
      avansPlata: 0,
      status: item.status,
    });
    setOpenAddEdit(true);
  };

  const handleAddProdus = () => {
    setForm(prev => ({
      ...prev,
      produse: [...prev.produse, { produs: "", pret: 0 }]
    }));
  };

  const handleRemoveProdus = (index: number) => {
    if (form.produse.length > 1) {
      setForm(prev => ({
        ...prev,
        produse: prev.produse.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProdusChange = (index: number, field: keyof ProdusItem, value: string | number) => {
    setForm(prev => ({
      ...prev,
      produse: prev.produse.map((p, i) => i === index ? { ...p, [field]: value } : p)
    }));
  };

  const handleSave = async () => {
    const validProduse = form.produse.filter(p => p.produs);
    if (!form.client || validProduse.length === 0) {
      toast({ title: "Eroare", description: "Completează câmpurile obligatorii (client și cel puțin un produs).", variant: "destructive" });
      return;
    }

    const currentDate = new Date().toLocaleDateString('ro-RO');
    const sumaProduse = validProduse.reduce((sum, p) => sum + p.pret, 0);
    const pretTransportValue = form.transport.tipTransport === "tona_km" 
      ? (form.transport.pretTonaKm || 0)
      : form.transport.tipTransport === "inchiriere"
      ? (form.transport.pretInchiriere || 0)
      : 0;
    const totalPret = sumaProduse + pretTransportValue;
    const produsDisplay = validProduse.length === 1 ? validProduse[0].produs : "Multiple";
    const transport: TransportPricing = {
      tipTransport: form.transport.tipTransport,
      ...(form.transport.tipTransport === "inchiriere" && { pretInchiriere: form.transport.pretInchiriere }),
      ...(form.transport.tipTransport === "tona_km" && { pretTonaKm: form.transport.pretTonaKm }),
    };

    if (editing) {
      if (editing.tip === "oferta") {
        // Call API to edit oferta
        setIsSaving(true);
        try {
          const produseList = validProduse.map(p => p.produs).join(", ");
          const preturiProduse = validProduse.map(p => String(p.pret)).join(", ");
          
          let tipTransport = "Inclus în preț";
          if (form.transport.tipTransport === "fara_transport") {
            tipTransport = "Fără transport";
          } else if (form.transport.tipTransport === "inclus") {
            tipTransport = "Inclus în preț";
          } else if (form.transport.tipTransport === "inchiriere") {
            tipTransport = "Preț chirie transport";
          } else if (form.transport.tipTransport === "tona_km") {
            tipTransport = "Preț tonă/km";
          }
          
          const pretTransport = form.transport.tipTransport === "tona_km" 
            ? String(form.transport.pretTonaKm || 0)
            : form.transport.tipTransport === "inchiriere"
            ? String(form.transport.pretInchiriere || 0)
            : "0";
          
          const termenPlataNumber = parseFloat(form.termenPlata.replace(/[^0-9]/g, '')) || 0;
          
          const payload = {
            tabel: "lista_oferte",
            id: editing.id,
            update: {
              client: form.client,
              proiect_santier: form.proiect,
              produse: produseList,
              preturi_produse: preturiProduse,
              tip_transport: tipTransport,
              pret_transport: pretTransport,
              valabilitate: form.valabilitate,
              termen_de_plata: termenPlataNumber,
              avans_de_plata: form.avansPlata || 0,
              observatii: form.observatii || "",
              status: form.status,
              ...(biletOrdinUploadUrl && { locatie_bilet_ordin_cec: biletOrdinUploadUrl }),
              ...(procesVerbalUploadUrl && { locatie_proces_verbal_predare_primire: procesVerbalUploadUrl }),
            }
          };
          
          console.log("Sending edit oferta payload:", payload);
          
          const response = await fetch(`${API_BASE_URL}/editeaza`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) throw new Error("Eroare la editarea ofertei");
          
          toast({ title: "Succes", description: "Oferta a fost actualizată." });
          fetchOferte();
          setOpenAddEdit(false);
        } catch (error) {
          console.error("Error editing oferta:", error);
          toast({ 
            title: "Eroare", 
            description: "Nu s-a putut edita oferta.", 
            variant: "destructive" 
          });
          return;
        } finally {
          setIsSaving(false);
        }
      } else {
        // Call API to edit contract
        setIsSaving(true);
        try {
          const produseList = validProduse.map(p => p.produs).join(", ");
          const preturiProduse = validProduse.map(p => String(p.pret)).join(", ");
          
          let tipTransport = "Inclus în preț";
          if (form.transport.tipTransport === "fara_transport") {
            tipTransport = "Fără transport";
          } else if (form.transport.tipTransport === "inclus") {
            tipTransport = "Inclus în preț";
          } else if (form.transport.tipTransport === "inchiriere") {
            tipTransport = "Preț chirie transport";
          } else if (form.transport.tipTransport === "tona_km") {
            tipTransport = "Preț tonă/km";
          }
          
          const pretTransport = form.transport.tipTransport === "tona_km" 
            ? String(form.transport.pretTonaKm || 0)
            : form.transport.tipTransport === "inchiriere"
            ? String(form.transport.pretInchiriere || 0)
            : "0";
          
          const termenPlataNumber = parseFloat(form.termenPlata.replace(/[^0-9]/g, '')) || 0;
          
          const payload = {
            tabel: "lista_contracte",
            id: editing.id,
            update: {
              client: form.client,
              proiect_santier: form.proiect,
              produse: produseList,
              preturi_produse: preturiProduse,
              tip_transport: tipTransport,
              pret_transport: pretTransport,
              valabilitate: form.valabilitate,
              termen_de_plata: termenPlataNumber,
              avans_de_plata: form.avansPlata || 0,
              observatii: form.observatii || "",
              status: form.status,
              indexare_combustibil: form.indexareCombustibil || "",
              ...(biletOrdinUploadUrl && { locatie_bilet_ordin_cec: biletOrdinUploadUrl }),
              ...(procesVerbalUploadUrl && { locatie_proces_verbal_predare_primire: procesVerbalUploadUrl }),
            }
          };
          
          console.log("Sending edit contract payload:", payload);
          
          const response = await fetch(`${API_BASE_URL}/editeaza`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) throw new Error("Eroare la editarea contractului");
          
          toast({ title: "Succes", description: "Contractul a fost actualizat." });
          fetchContracte();
          setOpenAddEdit(false);
        } catch (error) {
          console.error("Error editing contract:", error);
          toast({ 
            title: "Eroare", 
            description: "Nu s-a putut edita contractul.", 
            variant: "destructive" 
          });
          return;
        } finally {
          setIsSaving(false);
        }
      }
    } else {
      if (activeTab === "oferte") {
        // Call API for each product
        setIsSaving(true);
        try {
          let tipTransport = "inclus";
          if (form.transport.tipTransport === "fara_transport") {
            tipTransport = "Fără transport";
          } else if (form.transport.tipTransport === "inclus") {
            tipTransport = "Inclus în preț";
          } else if (form.transport.tipTransport === "inchiriere") {
            tipTransport = "Preț chirie transport";
          } else if (form.transport.tipTransport === "tona_km") {
            tipTransport = "Preț tonă/km";
          }
          
          const pretTransport = form.transport.tipTransport === "tona_km" 
            ? String(form.transport.pretTonaKm || 0)
            : form.transport.tipTransport === "inchiriere"
            ? String(form.transport.pretInchiriere || 0)
            : "0";
          
          const termenPlataNumber = parseFloat(form.termenPlata.replace(/[^0-9]/g, '')) || 0;
          
          const basePayload = {
            client: form.client,
            proiect_santier: form.proiect,
            tip_transport: tipTransport,
            pret_transport: pretTransport,
            valabilitate: form.valabilitate,
            termen_de_plata: termenPlataNumber,
            avans_de_plata: form.avansPlata || 0,
            observatii: form.observatii || "",
            status: "In curs de aprobare",
            locatie_bilet_ordin_cec: biletOrdinUploadUrl || "",
            locatie_proces_verbal_predare_primire: procesVerbalUploadUrl || "",
          };
          
          // First call without cod_oferta to get the generated code
          const firstProduct = validProduse[0];
          const firstPayload = {
            ...basePayload,
            produse: firstProduct.produs,
            preturi_produse: String(firstProduct.pret),
          };
          
          const firstResponse = await fetch(`${API_BASE_URL}/comercial/adauga/oferta`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(firstPayload),
          });
          
          const firstResult = await firstResponse.json();
          const codOferta = firstResult.cod_oferta;
          
          // For remaining products, use the same cod_oferta
          for (let i = 1; i < validProduse.length; i++) {
            const produs = validProduse[i];
            const payload = {
              ...basePayload,
              cod_oferta: codOferta,
              produse: produs.produs,
              preturi_produse: String(produs.pret),
            };
            
            await fetch(`${API_BASE_URL}/comercial/adauga/oferta`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
          
          toast({ title: "Succes", description: "Oferta a fost adăugată." });
          fetchOferte();
          setOpenAddEdit(false);
        } catch (error) {
          console.error("Error saving oferta:", error);
          toast({ title: "Eroare", description: "Nu s-a putut salva oferta.", variant: "destructive" });
          return;
        } finally {
          setIsSaving(false);
        }
      } else {
        // Call API to add contract
        setIsSaving(true);
        try {
          let tipTransport = "Inclus în preț";
          if (form.transport.tipTransport === "fara_transport") {
            tipTransport = "Fără transport";
          } else if (form.transport.tipTransport === "inclus") {
            tipTransport = "Inclus în preț";
          } else if (form.transport.tipTransport === "inchiriere") {
            tipTransport = "Preț chirie transport";
          } else if (form.transport.tipTransport === "tona_km") {
            tipTransport = "Preț tonă/km";
          }
          
          const pretTransport = form.transport.tipTransport === "tona_km" 
            ? String(form.transport.pretTonaKm || 0)
            : form.transport.tipTransport === "inchiriere"
            ? String(form.transport.pretInchiriere || 0)
            : "0";
          
          const termenPlataNumber = parseFloat(form.termenPlata.replace(/[^0-9]/g, '')) || 0;
          
          const basePayload = {
            client: form.client,
            proiect_santier: form.proiect,
            tip_transport: tipTransport,
            pret_transport: pretTransport,
            valabilitate: form.valabilitate,
            termen_de_plata: termenPlataNumber,
            avans_de_plata: form.avansPlata || 0,
            observatii: form.observatii || "",
            status: "In curs de aprobare",
            indexare_combustibil: form.indexareCombustibil || "",
            locatie_bilet_ordin_cec: biletOrdinUploadUrl || "",
            locatie_proces_verbal_predare_primire: procesVerbalUploadUrl || "",
          };
          
          // First call without cod_contract to get the generated code
          const firstProduct = validProduse[0];
          const firstPayload = {
            ...basePayload,
            produse: firstProduct.produs,
            preturi_produse: String(firstProduct.pret),
          };
          
          console.log("Sending first contract payload:", firstPayload);
          
          const firstResponse = await fetch(`${API_BASE_URL}/comercial/adauga/contract`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(firstPayload),
          });
          
          if (!firstResponse.ok) throw new Error("Eroare la salvarea contractului");
          
          const firstResult = await firstResponse.json();
          const codContract = firstResult.cod_contract;
          
          // For remaining products, use the same cod_contract
          for (let i = 1; i < validProduse.length; i++) {
            const produs = validProduse[i];
            const payload = {
              ...basePayload,
              cod_contract: codContract,
              produse: produs.produs,
              preturi_produse: String(produs.pret),
            };
            
            await fetch(`${API_BASE_URL}/comercial/adauga/contract`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
          }
          
          toast({ title: "Succes", description: "Contractul a fost adăugat." });
          fetchContracte();
          setOpenAddEdit(false);
        } catch (error) {
          console.error("Error saving contract:", error);
          toast({ 
            title: "Eroare", 
            description: "Nu s-a putut salva contractul.", 
            variant: "destructive" 
          });
          return;
        } finally {
          setIsSaving(false);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    
    if (deleting.tip === "oferta") {
      try {
        const payload = {
          tabel: "lista_oferte",
          id: deleting.id
        };
        
        console.log("Sending delete oferta payload:", payload);
        
        const response = await fetch(`${API_BASE_URL}/sterge`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error("Eroare la ștergerea ofertei");
        
        toast({ title: "Succes", description: "Oferta a fost ștearsă." });
        fetchOferte();
      } catch (error) {
        console.error("Error deleting oferta:", error);
        toast({ 
          title: "Eroare", 
          description: "Nu s-a putut șterge oferta.", 
          variant: "destructive" 
        });
      }
    } else {
      try {
        const payload = {
          tabel: "lista_contracte",
          id: deleting.id
        };
        
        console.log("Sending delete contract payload:", payload);
        
        const response = await fetch(`${API_BASE_URL}/sterge`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) throw new Error("Eroare la ștergerea contractului");
        
        toast({ title: "Succes", description: "Contractul a fost șters." });
        fetchContracte();
      } catch (error) {
        console.error("Error deleting contract:", error);
        toast({ 
          title: "Eroare", 
          description: "Nu s-a putut șterge contractul.", 
          variant: "destructive" 
        });
      }
    }
    
    setDeleting(null);
  };

  const handleStatusChange = (item: Item, newStatus: "In curs de aprobare" | "Aprobata" | "Respinsa") => {
    if (item.tip === "oferta") {
      setOferte(prev => prev.map(o => o.id === item.id ? { ...o, status: newStatus } : o));
    } else {
      setContracte(prev => prev.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
    }
    // Update viewingDetails if open
    if (viewingDetails && viewingDetails.id === item.id && viewingDetails.tip === item.tip) {
      setViewingDetails({ ...viewingDetails, status: newStatus });
    }
    toast({ title: "Status actualizat", description: `Statusul a fost schimbat în "${newStatus}".` });
  };

  const handleDuplicate = () => {
    if (!viewingDetails) return;
    
    const currentDate = new Date().toLocaleDateString('ro-RO');
    
    if (viewingDetails.tip === "oferta") {
      const sourceOferta = viewingDetails as Oferta;
      const newOferta: Oferta = {
        ...sourceOferta,
        id: Math.max(...oferte.map(o => o.id), 0) + 1,
        nr: `OF-2024-${String(oferte.length + 1).padStart(3, '0')}`,
        status: "In curs de aprobare",
        dataCreare: currentDate,
        produse: [...sourceOferta.produse],
        transport: { ...sourceOferta.transport },
      };
      setOferte(prev => [...prev, newOferta]);
    } else {
      const sourceContract = viewingDetails as Contract;
      const newContract: Contract = {
        ...sourceContract,
        id: Math.max(...contracte.map(c => c.id), 0) + 1,
        nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
        status: "In curs de aprobare",
        dataCreare: currentDate,
        produse: [...sourceContract.produse],
        transport: { ...sourceContract.transport },
      };
      setContracte(prev => [...prev, newContract]);
    }
    
    toast({ title: "Duplicat creat", description: `${viewingDetails.tip === "oferta" ? "Oferta" : "Contractul"} ${viewingDetails.nr} a fost duplicat.` });
    setViewingDetails(null);
  };

  const handleSendEmail = () => {
    if (viewingDetails) {
      toast({ title: "Email trimis", description: `${viewingDetails.tip === "oferta" ? "Oferta" : "Contractul"} ${viewingDetails.nr} a fost trimis pe email.` });
    }
  };

  const handleGenerateContract = () => {
    if (viewingDetails && viewingDetails.tip === "oferta") {
      const oferta = viewingDetails as Oferta;
      const newContract: Contract = {
        id: Math.max(...contracte.map(c => c.id), 0) + 1,
        nr: `CTR-2024-${String(contracte.length + 1).padStart(3, '0')}`,
        client: oferta.client,
        proiect: oferta.proiect,
        produs: oferta.produs,
        pret: oferta.pret,
        produse: [...oferta.produse],
        transport: { ...oferta.transport },
        valabilitate: oferta.valabilitate,
        termenPlata: oferta.termenPlata,
        status: "In curs de aprobare",
        tip: "contract",
        dataCreare: new Date().toLocaleDateString('ro-RO'),
        conditiiComerciale: oferta.conditiiComerciale,
        observatii: `Generat din oferta ${oferta.nr}`,
        indexareCombustibil: "",
      };
      setContracte(prev => [...prev, newContract]);
      toast({ title: "Contract generat", description: `Contractul ${newContract.nr} a fost generat din oferta ${oferta.nr}.` });
      setViewingDetails(null);
      setActiveTab("contracte");
    }
  };
  
  const getTransportLabel = (transport: TransportPricing) => {
    switch (transport.tipTransport) {
      case "fara_transport": return "Fără transport";
      case "inclus": return "Inclus în preț";
      case "inchiriere": return `Preț chirie: ${transport.pretInchiriere?.toLocaleString()} RON`;
      case "tona_km": return `${transport.pretTonaKm?.toFixed(2)} RON/tonă·km`;
      default: return "-";
    }
  };

  // Render table with unified components
  const renderTable = (
    data: Item[],
    filters: Record<string, string>,
    setFilters: React.Dispatch<React.SetStateAction<Record<string, string>>>,
    sort: { key: string; direction: "asc" | "desc" } | null,
    setSort: React.Dispatch<React.SetStateAction<{ key: string; direction: "asc" | "desc" } | null>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    totalItems: number,
    totalPages: number
  ) => (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Nr."
                  sortKey="nr"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.nr}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, nr: val })); setPage(1); }}
                  filterPlaceholder="Caută nr..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Client"
                  sortKey="client"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.client}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, client: val })); setPage(1); }}
                  filterPlaceholder="Caută client..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Proiect/Șantier"
                  sortKey="proiect"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.proiect}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, proiect: val })); setPage(1); }}
                  filterPlaceholder="Caută proiect..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Produs"
                  sortKey="produs"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.produs}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, produs: val })); setPage(1); }}
                  filterPlaceholder="Caută produs..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Preț"
                  sortKey="pret"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.pret}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, pret: val })); setPage(1); }}
                  filterPlaceholder="Caută preț..."
                  sortAscLabel="Cresc."
                  sortDescLabel="Descresc."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Valabilitate"
                  sortKey="valabilitate"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.valabilitate}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, valabilitate: val })); setPage(1); }}
                  filterPlaceholder="Caută dată..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Termen de plată"
                  sortKey="termenPlata"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.termenPlata}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, termenPlata: val })); setPage(1); }}
                  filterPlaceholder="Caută termen..."
                />
              </TableHead>
              <TableHead className="h-10">
                <DataTableColumnHeader
                  title="Status"
                  sortKey="status"
                  currentSort={sort}
                  onSort={(key, dir) => setSort({ key, direction: dir })}
                  filterValue={filters.status}
                  onFilterChange={(val) => { setFilters(f => ({ ...f, status: val })); setPage(1); }}
                  filterPlaceholder="Caută status..."
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="animate-fade-in">
            {data.length === 0 ? (
              <DataTableEmpty colSpan={8} message="Nu există înregistrări care să corespundă filtrelor." />
            ) : (
              data.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-muted/50 h-10"
                  onClick={() => setViewingDetails(item)}
                >
                  <TableCell className="py-1 text-xs font-medium">{item.nr}</TableCell>
                  <TableCell className="py-1 text-xs">{item.client}</TableCell>
                  <TableCell className="py-1 text-xs">{item.proiect}</TableCell>
                  <TableCell className="py-1 text-xs">{item.produs}</TableCell>
                  <TableCell className="py-1 text-xs text-right">{item.pret > 0 ? `${item.pret.toLocaleString()} RON` : "-"}</TableCell>
                  <TableCell className="py-1 text-xs">{item.valabilitate}</TableCell>
                  <TableCell className="py-1 text-xs">{item.termenPlata}</TableCell>
                  <TableCell className="py-1 text-xs">
                    <Badge className={statusColors[item.status]}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <DataTablePagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setPage}
        onItemsPerPageChange={(val) => { setItemsPerPage(val); setPage(1); }}
      />
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oferte & Contracte</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare oferte comerciale și contracte cu clienți
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={(activeTab === "oferte" ? filteredOferte : filteredContracte).length === 0}
          >
            <Download className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button onClick={handleOpenAdd} size="sm">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">{activeTab === "oferte" ? "Ofertă Nouă" : "Contract Nou"}</span>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "oferte" | "contracte")}>
        <TabsList>
          <TabsTrigger value="oferte">Oferte</TabsTrigger>
          <TabsTrigger value="contracte">Contracte</TabsTrigger>
        </TabsList>

        <TabsContent value="oferte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">Lista Oferte</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Toate ofertele comerciale trimise clienților
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {renderTable(
                paginatedOferte,
                oferteFilters,
                setOferteFilters,
                oferteSort,
                setOferteSort,
                ofertePage,
                setOfertePage,
                filteredOferte.length,
                oferteTotalPages
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracte" className="mt-4">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base sm:text-lg">Lista Contracte</CardTitle>
                  <CardDescription className="hidden sm:block">
                    Toate contractele active și arhivate
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              {renderTable(
                paginatedContracte,
                contracteFilters,
                setContracteFilters,
                contracteSort,
                setContracteSort,
                contractePage,
                setContractePage,
                filteredContracte.length,
                contracteTotalPages
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
                <DialogTitle>
                  Detalii {viewingDetails?.tip === "oferta" ? "Ofertă" : "Contract"} - {viewingDetails?.nr}
                </DialogTitle>
                <DialogDescription>
                  Informații complete
                </DialogDescription>
              </div>
              {viewingDetails && (
                <Badge className={cn(statusColors[viewingDetails.status], "px-2 py-0.5")}>{viewingDetails.status}</Badge>
              )}
            </div>
          </DialogHeader>
          
          {viewingDetails && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm border rounded-lg p-3 bg-muted/30">
                <div><span className="text-muted-foreground">Client:</span> <span className="font-medium">{viewingDetails.client}</span></div>
                <div><span className="text-muted-foreground">Proiect:</span> <span className="font-medium">{viewingDetails.proiect}</span></div>
                <div><span className="text-muted-foreground">Valabilitate:</span> <span className="font-medium">{viewingDetails.valabilitate}</span></div>
                <div><span className="text-muted-foreground">Termen plată:</span> <span className="font-medium">{viewingDetails.termenPlata}</span></div>
                <div><span className="text-muted-foreground">Data creare:</span> <span className="font-medium">{viewingDetails.dataCreare}</span></div>
                <div><span className="text-muted-foreground">Transport:</span> <span className="font-medium">{viewingDetails.transport ? getTransportLabel(viewingDetails.transport) : "-"}</span></div>
                {viewingDetails.tip === "contract" && (
                  <div className="col-span-2"><span className="text-muted-foreground">Indexare:</span> <span className="font-medium">{(viewingDetails as Contract).indexareCombustibil || "-"}</span></div>
                )}
              </div>

              {/* Products List */}
              {viewingDetails.produse && viewingDetails.produse.length > 0 && (
                <div className="border rounded-lg p-3">
                  <p className="text-muted-foreground text-sm mb-2">Produse:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {viewingDetails.produse.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/50 rounded px-3 py-2 text-sm">
                        <span className="font-medium">{p.produs}</span>
                        <span>{p.pret.toLocaleString()} RON</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-2 pt-2 border-t">
                    <span className="text-sm"><span className="text-muted-foreground">Total:</span> <span className="font-semibold">{viewingDetails.pret.toLocaleString()} RON</span></span>
                  </div>
                </div>
              )}
              
              {(viewingDetails.conditiiComerciale || viewingDetails.observatii) && (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {viewingDetails.conditiiComerciale && (
                    <div className="border rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Condiții comerciale:</p>
                      <p>{viewingDetails.conditiiComerciale}</p>
                    </div>
                  )}
                  {viewingDetails.observatii && (
                    <div className="border rounded-lg p-3">
                      <p className="text-muted-foreground mb-1">Observații:</p>
                      <p>{viewingDetails.observatii}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex-wrap gap-1 pt-2">
            <Button variant="outline" size="sm" onClick={handleDuplicate}>
              <Copy className="w-4 h-4 mr-1" />Duplichează
            </Button>
            <Button variant="outline" size="sm" onClick={handleSendEmail}>
              <Mail className="w-4 h-4 mr-1" />Trimite pe email
            </Button>
            {viewingDetails?.tip === "oferta" && viewingDetails?.status === "Aprobata" && (
              <Button variant="outline" size="sm" onClick={handleGenerateContract}>
                <FileText className="w-4 h-4 mr-1" />Generează contract
              </Button>
            )}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing 
                ? `Editează ${editing.tip === "oferta" ? "Ofertă" : "Contract"}` 
                : `Adaugă ${activeTab === "oferte" ? "Ofertă" : "Contract"} ${activeTab === "oferte" ? "Nouă" : "Nou"}`
              }
            </DialogTitle>
            <DialogDescription>Completează informațiile necesare.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Client *</Label>
                <Select value={form.client} onValueChange={(v) => setForm({ ...form, client: v })}>
                  <SelectTrigger><SelectValue placeholder="Selectează client" /></SelectTrigger>
                  <SelectContent className="z-[200] pointer-events-auto">
                    {clients.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Proiect/Șantier</Label>
                <Input placeholder="Denumire proiect" value={form.proiect} onChange={(e) => setForm({ ...form, proiect: e.target.value })} />
              </div>
            </div>

            {/* Multiple Products Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Produse *</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddProdus}>
                  <Plus className="w-4 h-4 mr-1" />Adaugă produs
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {form.produse.map((item, index) => (
                  <div key={index} className="flex gap-2 items-end p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">Produs</Label>
                      <Select value={item.produs} onValueChange={(v) => handleProdusChange(index, "produs", v)}>
                        <SelectTrigger className="h-9"><SelectValue placeholder="Selectează" /></SelectTrigger>
                        <SelectContent className="z-[200] pointer-events-auto">
                          {produse.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-28 space-y-1">
                      <Label className="text-xs">Preț (RON)</Label>
                      <Input 
                        type="number" 
                        className="h-9"
                        value={item.pret} 
                        onChange={(e) => handleProdusChange(index, "pret", Number(e.target.value))} 
                      />
                    </div>
                    {form.produse.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveProdus(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Transport Pricing Section */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <Label className="text-base font-medium">Preț Transport</Label>
              <Select 
                value={form.transport.tipTransport} 
                onValueChange={(v: TransportPricing["tipTransport"]) => setForm({
                  ...form,
                  transport: {
                    ...form.transport,
                    tipTransport: v,
                    pretInchiriere: v === "inchiriere" ? form.transport.pretInchiriere : 0,
                    pretTonaKm: v === "tona_km" ? form.transport.pretTonaKm : 0
                  }
                })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selectează tip transport" />
                </SelectTrigger>
                <SelectContent className="z-[200] pointer-events-auto">
                  {transportOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {form.transport.tipTransport === "inchiriere" && (
                <div className="space-y-1 mt-2">
                  <Label className="text-xs">Preț chirie transport (RON)</Label>
                  <Input 
                    type="number" 
                    className="h-9"
                    placeholder="ex: 1500"
                    value={form.transport.pretInchiriere || ""} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      transport: { 
                        ...form.transport, 
                        pretInchiriere: Number(e.target.value)
                      } 
                    })} 
                  />
                </div>
              )}
              
              {form.transport.tipTransport === "tona_km" && (
                <div className="space-y-1 mt-2">
                  <Label className="text-xs">Preț tonă/km (RON)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    className="h-9"
                    placeholder="ex: 0.85"
                    value={form.transport.pretTonaKm || ""} 
                    onChange={(e) => setForm({ 
                      ...form, 
                      transport: { 
                        ...form.transport, 
                        pretTonaKm: Number(e.target.value)
                      } 
                    })} 
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Valabilitate (max 30 zile)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12",
                        !form.valabilitate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.valabilitate || "Selectează data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[100]" align="start">
                    <Calendar
                      mode="single"
                      selected={form.valabilitate ? (() => {
                        const parts = form.valabilitate.split('/');
                        if (parts.length === 3) {
                          return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                        }
                        return undefined;
                      })() : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setForm({ ...form, valabilitate: format(date, 'dd/MM/yyyy') });
                        }
                      }}
                      disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                      initialFocus
                      locale={ro}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Termen plată (zile)</Label>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="ex: 30"
                  value={form.termenPlata.replace(' zile', '')} 
                  onChange={(e) => setForm({ ...form, termenPlata: e.target.value ? `${e.target.value} zile` : '' })} 
                />
              </div>
            </div>
            {editing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v: "In curs de aprobare" | "Aprobata" | "Respinsa") => setForm({ ...form, status: v })}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Selectează status" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] pointer-events-auto">
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        <Badge className={cn(statusColors[status], "px-2 py-0.5")}>{status}</Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {editing?.tip === "contract" && (
              <div className="space-y-2">
                <Label>Indexare combustibil</Label>
                <Input placeholder="ex: Ajustare trimestrială +/- 5%" value={form.indexareCombustibil} onChange={(e) => setForm({ ...form, indexareCombustibil: e.target.value })} />
              </div>
            )}

            {/* Garanție Section */}
            <div className="space-y-3 p-3 border rounded-lg bg-muted/30">
              <Label className="text-base font-medium">Garanție</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Bilet de ordin / Cec (document scanat)</Label>
                  <input
                    type="file"
                    ref={biletOrdinRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, garantie: { ...form.garantie, biletOrdin: file } });
                      if (file) {
                        handleBiletOrdinUpload(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-start"
                    onClick={() => biletOrdinRef.current?.click()}
                    disabled={isUploadingBiletOrdin}
                  >
                    {isUploadingBiletOrdin ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Se încarcă...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {form.garantie.biletOrdin ? form.garantie.biletOrdin.name : "Încarcă document"}
                      </>
                    )}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Proces verbal predare-primire (document scanat)</Label>
                  <input
                    type="file"
                    ref={procesVerbalRef}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setForm({ ...form, garantie: { ...form.garantie, procesVerbal: file } });
                      if (file) {
                        handleProcesVerbalUpload(file);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 justify-start"
                    onClick={() => procesVerbalRef.current?.click()}
                    disabled={isUploadingProcesVerbal}
                  >
                    {isUploadingProcesVerbal ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Se încarcă...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {form.garantie.procesVerbal ? form.garantie.procesVerbal.name : "Încarcă document"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Avans de plată */}
            <div className="space-y-2">
              <Label>Avans de plată (RON)</Label>
              <Input 
                type="number" 
                min="0"
                placeholder="ex: 5000"
                value={form.avansPlata || ""} 
                onChange={(e) => setForm({ ...form, avansPlata: Number(e.target.value) })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Observații</Label>
              <Textarea placeholder="Observații suplimentare..." value={form.observatii} onChange={(e) => setForm({ ...form, observatii: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)} disabled={isSaving}>Anulează</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editing ? "Salvează" : "Adaugă"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleting} onOpenChange={() => setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare Ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi {deleting?.tip === "oferta" ? "oferta" : "contractul"} {deleting?.nr}? Această acțiune nu poate fi anulată.
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

export default OferteContracte;
