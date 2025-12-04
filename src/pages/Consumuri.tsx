import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, X, Eye, Download, Upload, FileText, FileSpreadsheet, File, Camera, Image as ImageIcon } from "lucide-react";
import { exportToCSV } from "@/lib/exportUtils";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types
interface ContorCurent {
  id: number;
  data: string;
  index_vechi: number;
  index_nou: number;
  consum_kw: number;
  pret: number;
  tip_consum: string;
}

interface ContorCTL {
  id: number;
  data: string;
  index_vechi_tur: number;
  index_nou_tur: number;
  retur_exces_vechi: number;
  retur_exces_nou: number;
  consum_l: number;
  consum_to: number;
}

interface Consum {
  id: number;
  data: string;
  produs: string;
  cantitate: number;
  "04_nat": number;
  "04_conc": number;
  "04_cribluri": number;
  "48_conc": number;
  "48_cribluri": number;
  "816_conc": number;
  "816_cribluri": number;
  "16224_conc": number;
  "16224_cribluri": number;
  "16315_conc": number;
  "16315_cribluri": number;
  filler: number;
  bitum: number;
  acid_clorhidric: number;
  emulgator: number;
  sare: number;
  apa: number;
  topcel_technocel: number;
  consum_curent: number;
  consum_ctl: number;
}

// Filter Header Component
const FilterHeader = ({ 
  label, 
  filterValue, 
  onFilterChange, 
  sortDirection, 
  onSort 
}: { 
  label: string; 
  filterValue: string; 
  onFilterChange: (value: string) => void; 
  sortDirection: 'asc' | 'desc' | null; 
  onSort: (direction: 'asc' | 'desc') => void;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 px-2 hover:bg-muted/50 font-medium text-xs gap-1">
          {label}
          {sortDirection === 'asc' ? (
            <ArrowUp className="h-3 w-3 text-primary" />
          ) : sortDirection === 'desc' ? (
            <ArrowDown className="h-3 w-3 text-primary" />
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
          {filterValue && <span className="ml-1 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 bg-popover border shadow-md z-50" align="start">
        <div className="space-y-2">
          <Input
            placeholder={`Filtrează ${label.toLowerCase()}...`}
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-7 text-xs"
          />
          <div className="flex gap-1">
            <Button
              variant={sortDirection === 'asc' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onSort('asc')}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Cresc.
            </Button>
            <Button
              variant={sortDirection === 'desc' ? 'default' : 'outline'}
              size="sm"
              className="flex-1 h-7 text-xs"
              onClick={() => onSort('desc')}
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              Descresc.
            </Button>
          </div>
          {(filterValue || sortDirection) && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs"
              onClick={() => {
                onFilterChange('');
                onSort('asc');
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Resetează
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

const Consumuri = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("contor-curent");

  // Contor Curent state
  const [contorCurentItemsPerPage, setContorCurentItemsPerPage] = useState(10);
  const [contorCurentCurrentPage, setContorCurentCurrentPage] = useState(1);
  const [contorCurentFilters, setContorCurentFilters] = useState<Record<string, string>>({});
  const [contorCurentSort, setContorCurentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [contorCurentData, setContorCurentData] = useState<ContorCurent[]>([]);
  const [isLoadingContorCurent, setIsLoadingContorCurent] = useState(true);
  const [selectedContorCurent, setSelectedContorCurent] = useState<ContorCurent | null>(null);
  const [isContorCurentDetailsOpen, setIsContorCurentDetailsOpen] = useState(false);
  const [isContorCurentFormOpen, setIsContorCurentFormOpen] = useState(false);
  const [isContorCurentDeleteOpen, setIsContorCurentDeleteOpen] = useState(false);
  const [contorCurentFormData, setContorCurentFormData] = useState<Partial<ContorCurent>>({});
  const [isEditingContorCurent, setIsEditingContorCurent] = useState(false);
  const [contorCurentImage, setContorCurentImage] = useState<File | null>(null);
  const [contorCurentImagePreview, setContorCurentImagePreview] = useState<string | null>(null);
  const contorCurentInputRef = useRef<HTMLInputElement>(null);

  // Contor CTL state
  const [contorCTLItemsPerPage, setContorCTLItemsPerPage] = useState(10);
  const [contorCTLCurrentPage, setContorCTLCurrentPage] = useState(1);
  const [contorCTLFilters, setContorCTLFilters] = useState<Record<string, string>>({});
  const [contorCTLSort, setContorCTLSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [contorCTLData, setContorCTLData] = useState<ContorCTL[]>([]);
  const [isLoadingContorCTL, setIsLoadingContorCTL] = useState(true);
  const [selectedContorCTL, setSelectedContorCTL] = useState<ContorCTL | null>(null);
  const [isContorCTLDetailsOpen, setIsContorCTLDetailsOpen] = useState(false);
  const [isContorCTLFormOpen, setIsContorCTLFormOpen] = useState(false);
  const [isContorCTLDeleteOpen, setIsContorCTLDeleteOpen] = useState(false);
  const [contorCTLFormData, setContorCTLFormData] = useState<Partial<ContorCTL>>({});
  const [isEditingContorCTL, setIsEditingContorCTL] = useState(false);
  const [contorCTLImage, setContorCTLImage] = useState<File | null>(null);
  const [contorCTLImagePreview, setContorCTLImagePreview] = useState<string | null>(null);
  const contorCTLInputRef = useRef<HTMLInputElement>(null);

  // Consumuri state
  const [consumuriItemsPerPage, setConsumuriItemsPerPage] = useState(10);
  const [consumuriCurrentPage, setConsumuriCurrentPage] = useState(1);
  const [consumuriFilters, setConsumuriFilters] = useState<Record<string, string>>({});
  const [consumuriSort, setConsumuriSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [consumuriData, setConsumuriData] = useState<Consum[]>([]);
  const [selectedConsum, setSelectedConsum] = useState<Consum | null>(null);
  const [isConsumDetailsOpen, setIsConsumDetailsOpen] = useState(false);
  const [isConsumFormOpen, setIsConsumFormOpen] = useState(false);
  const [isConsumDeleteOpen, setIsConsumDeleteOpen] = useState(false);
  const [consumFormData, setConsumFormData] = useState<Partial<Consum>>({});
  const [isEditingConsum, setIsEditingConsum] = useState(false);
  
  // Import dialog state
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

  // Fetch Contor Curent data
  const fetchContorCurent = async () => {
    setIsLoadingContorCurent(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contori/returneaza/curent`);
      if (!response.ok) throw new Error('Failed to fetch contor curent data');
      const data = await response.json();
      setContorCurentData(data);
    } catch (error) {
      console.error('Error fetching contor curent:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele pentru Contor Curent",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContorCurent(false);
    }
  };

  useEffect(() => {
    fetchContorCurent();
  }, [toast]);

  // Fetch Contor CTL data
  const fetchContorCTL = async () => {
    setIsLoadingContorCTL(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contori/returneaza/ctl`);
      if (!response.ok) throw new Error('Failed to fetch contor CTL data');
      const data = await response.json();
      setContorCTLData(data);
    } catch (error) {
      console.error('Error fetching contor CTL:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele pentru Contor CTL",
        variant: "destructive",
      });
    } finally {
      setIsLoadingContorCTL(false);
    }
  };

  useEffect(() => {
    fetchContorCTL();
  }, [toast]);

  // Generic filter and sort functions
  const filterAndSortData = <T extends Record<string, any>>(
    data: T[],
    filters: Record<string, string>,
    sort: { field: string; direction: 'asc' | 'desc' } | null
  ): T[] => {
    let result = [...data];

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter((item) =>
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Apply sort
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sort.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  };

  // Contor Curent handlers
  const handleContorCurentFilterChange = (field: string, value: string) => {
    setContorCurentFilters((prev) => ({ ...prev, [field]: value }));
    setContorCurentCurrentPage(1);
  };

  const handleContorCurentSort = (field: string, direction: 'asc' | 'desc') => {
    setContorCurentSort({ field, direction });
  };

  const handleOpenContorCurentAdd = () => {
    // Get the last index_nou from the table
    const lastIndexNou = contorCurentData.length > 0 
      ? contorCurentData[contorCurentData.length - 1].index_nou 
      : 0;
    
    setContorCurentFormData({
      index_vechi: lastIndexNou,
      tip_consum: 'activ'
    });
    setIsEditingContorCurent(false);
    setContorCurentImage(null);
    setContorCurentImagePreview(null);
    setIsContorCurentFormOpen(true);
  };

  const handleOpenContorCurentEdit = (item: ContorCurent) => {
    // Calculate unit price from total price for display
    const pretUnitar = item.consum_kw !== 0 ? item.pret / item.consum_kw : 0;
    
    setContorCurentFormData({
      ...item,
      pret: pretUnitar // Override with unit price for form display
    });
    setIsEditingContorCurent(true);
    setIsContorCurentFormOpen(true);
    setIsContorCurentDetailsOpen(false);
  };

  const handleContorCurentRowClick = (item: ContorCurent) => {
    setSelectedContorCurent(item);
    setIsContorCurentDetailsOpen(true);
  };

  const handleContorCurentSave = async () => {
    // Validate image for add mode
    if (!isEditingContorCurent && !contorCurentImage) {
      toast({
        title: "Eroare",
        description: "Vă rugăm să încărcați o poză a contorului",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditingContorCurent && contorCurentFormData.id) {
        // Edit mode
        const payload = {
          tabel: "contor_curent",
          id: contorCurentFormData.id,
          update: {
            index_vechi: contorCurentFormData.index_vechi || 0,
            index_nou: contorCurentFormData.index_nou || 0,
            consum_kw: contorCurentFormData.consum_kw || 0,
            pret: (contorCurentFormData.pret || 0) * (contorCurentFormData.consum_kw || 0),
            tip_consum: contorCurentFormData.tip_consum || 'activ'
          }
        };

        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to edit contor curent');

        toast({
          title: "Success",
          description: "Contorul a fost editat cu succes",
        });
      } else {
        // Add mode
        const payload = {
          index_vechi: contorCurentFormData.index_vechi || 0,
          index_nou: contorCurentFormData.index_nou || 0,
          consum_kw: contorCurentFormData.consum_kw || 0,
          pret: (contorCurentFormData.pret || 0) * (contorCurentFormData.consum_kw || 0),
          tip_consum: contorCurentFormData.tip_consum || 'activ'
        };

        const response = await fetch(`${API_BASE_URL}/contori/adauga/curent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to add contor curent');

        toast({
          title: "Success",
          description: "Contorul a fost adăugat cu succes",
        });
      }

      setIsContorCurentFormOpen(false);
      fetchContorCurent();
    } catch (error) {
      console.error('Error saving contor curent:', error);
      toast({
        title: "Eroare",
        description: `Nu s-a putut ${isEditingContorCurent ? 'edita' : 'adăuga'} contorul`,
        variant: "destructive",
      });
    }
  };

  const handleContorCurentDelete = async () => {
    if (!selectedContorCurent) return;

    try {
      const payload = {
        tabel: "contor_curent",
        id: selectedContorCurent.id
      };

      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to delete contor curent');

      toast({
        title: "Success",
        description: "Contorul a fost șters cu succes",
      });

      setIsContorCurentDeleteOpen(false);
      fetchContorCurent();
    } catch (error) {
      console.error('Error deleting contor curent:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge contorul",
        variant: "destructive",
      });
    }
  };

  // Contor CTL handlers
  const handleContorCTLFilterChange = (field: string, value: string) => {
    setContorCTLFilters((prev) => ({ ...prev, [field]: value }));
    setContorCTLCurrentPage(1);
  };

  const handleContorCTLSort = (field: string, direction: 'asc' | 'desc') => {
    setContorCTLSort({ field, direction });
  };

  const handleOpenContorCTLAdd = () => {
    // Get the last index_nou_tur and retur_exces_nou from the table
    const lastIndexNouTur = contorCTLData.length > 0 
      ? contorCTLData[contorCTLData.length - 1].index_nou_tur 
      : 0;
    const lastReturExcesNou = contorCTLData.length > 0 
      ? contorCTLData[contorCTLData.length - 1].retur_exces_nou 
      : 0;
    
    setContorCTLFormData({
      index_vechi_tur: lastIndexNouTur,
      retur_exces_vechi: lastReturExcesNou
    });
    setIsEditingContorCTL(false);
    setContorCTLImage(null);
    setContorCTLImagePreview(null);
    setIsContorCTLFormOpen(true);
  };

  const handleOpenContorCTLEdit = (item: ContorCTL) => {
    setContorCTLFormData(item);
    setIsEditingContorCTL(true);
    setIsContorCTLFormOpen(true);
    setIsContorCTLDetailsOpen(false);
  };

  const handleContorCTLRowClick = (item: ContorCTL) => {
    setSelectedContorCTL(item);
    setIsContorCTLDetailsOpen(true);
  };

  const handleContorCTLSave = async () => {
    // Validate image for add mode
    if (!isEditingContorCTL && !contorCTLImage) {
      toast({
        title: "Eroare",
        description: "Vă rugăm să încărcați o poză a contorului",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditingContorCTL && contorCTLFormData.id) {
        // Edit mode
        const payload = {
          tabel: "contor_ctl",
          id: contorCTLFormData.id,
          update: {
            index_vechi_tur: contorCTLFormData.index_vechi_tur || 0,
            index_nou_tur: contorCTLFormData.index_nou_tur || 0,
            retur_exces_vechi: contorCTLFormData.retur_exces_vechi || 0,
            retur_exces_nou: contorCTLFormData.retur_exces_nou || 0,
            consum_l: contorCTLFormData.consum_l || 0,
            consum_to: contorCTLFormData.consum_to || 0
          }
        };

        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to edit contor CTL');

        toast({
          title: "Success",
          description: "Contorul CTL a fost editat cu succes",
        });
      } else {
        // Add mode
        const payload = {
          index_vechi_tur: contorCTLFormData.index_vechi_tur || 0,
          index_nou_tur: contorCTLFormData.index_nou_tur || 0,
          retur_exces_vechi: contorCTLFormData.retur_exces_vechi || 0,
          retur_exces_nou: contorCTLFormData.retur_exces_nou || 0,
          consum_l: contorCTLFormData.consum_l || 0,
          consum_to: contorCTLFormData.consum_to || 0
        };

        const response = await fetch(`${API_BASE_URL}/contori/adauga/ctl`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error('Failed to add contor CTL');

        toast({
          title: "Success",
          description: "Contorul CTL a fost adăugat cu succes",
        });
      }

      setIsContorCTLFormOpen(false);
      fetchContorCTL();
    } catch (error) {
      console.error('Error saving contor CTL:', error);
      toast({
        title: "Eroare",
        description: `Nu s-a putut ${isEditingContorCTL ? 'edita' : 'adăuga'} contorul CTL`,
        variant: "destructive",
      });
    }
  };

  const handleContorCTLDelete = async () => {
    if (!selectedContorCTL) return;

    try {
      const payload = {
        tabel: "contor_ctl",
        id: selectedContorCTL.id
      };

      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to delete contor CTL');

      toast({
        title: "Success",
        description: "Contorul CTL a fost șters cu succes",
      });

      setIsContorCTLDeleteOpen(false);
      fetchContorCTL();
    } catch (error) {
      console.error('Error deleting contor CTL:', error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge contorul CTL",
        variant: "destructive",
      });
    }
  };

  // Consumuri handlers
  const handleConsumuriFilterChange = (field: string, value: string) => {
    setConsumuriFilters((prev) => ({ ...prev, [field]: value }));
    setConsumuriCurrentPage(1);
  };

  const handleConsumuriSort = (field: string, direction: 'asc' | 'desc') => {
    setConsumuriSort({ field, direction });
  };

  const handleOpenConsumAdd = () => {
    setConsumFormData({});
    setIsEditingConsum(false);
    setIsConsumFormOpen(true);
  };

  const handleOpenConsumEdit = (item: Consum) => {
    setConsumFormData(item);
    setIsEditingConsum(true);
    setIsConsumFormOpen(true);
    setIsConsumDetailsOpen(false);
  };

  const handleConsumSave = async () => {
    try {
      if (isEditingConsum && consumFormData.id) {
        // Edit mode - use universal edit endpoint
        const updatePayload = {
          produs: consumFormData.produs || '',
          cantitate: consumFormData.cantitate || 0,
          "04_nat": consumFormData["04_nat"] || 0,
          "04_conc": consumFormData["04_conc"] || 0,
          "04_cribluri": consumFormData["04_cribluri"] || 0,
          "48_conc": consumFormData["48_conc"] || 0,
          "48_cribluri": consumFormData["48_cribluri"] || 0,
          "816_conc": consumFormData["816_conc"] || 0,
          "816_cribluri": consumFormData["816_cribluri"] || 0,
          "16224_conc": consumFormData["16224_conc"] || 0,
          "16224_cribluri": consumFormData["16224_cribluri"] || 0,
          "16315_conc": consumFormData["16315_conc"] || 0,
          "16315_cribluri": consumFormData["16315_cribluri"] || 0,
          filler: consumFormData.filler || 0,
          bitum: consumFormData.bitum || 0,
          acid_clorhidric: consumFormData.acid_clorhidric || 0,
          emulgator: consumFormData.emulgator || 0,
          sare: consumFormData.sare || 0,
          apa: consumFormData.apa || 0,
          topcel_technocel: consumFormData.topcel_technocel || 0,
          consum_curent: consumFormData.consum_curent || 0,
          consum_ctl: consumFormData.consum_ctl || 0
        };

        const response = await fetch(`${API_BASE_URL}/editeaza`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tabel: "consumuri_materie_prima",
            id: consumFormData.id,
            update: updatePayload
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Eroare la editarea consumului');
        }

        toast({
          title: "Succes",
          description: "Consum editat cu succes"
        });
      } else {
        // Add mode - use specialized endpoint
        const payload = {
          consumuri: {
            produs: consumFormData.produs || '',
            cantitate: consumFormData.cantitate || 0,
            "04_nat": consumFormData["04_nat"] || 0,
            "04_conc": consumFormData["04_conc"] || 0,
            "04_cribluri": consumFormData["04_cribluri"] || 0,
            "48_conc": consumFormData["48_conc"] || 0,
            "48_cribluri": consumFormData["48_cribluri"] || 0,
            "816_conc": consumFormData["816_conc"] || 0,
            "816_cribluri": consumFormData["816_cribluri"] || 0,
            "16224_conc": consumFormData["16224_conc"] || 0,
            "16224_cribluri": consumFormData["16224_cribluri"] || 0,
            "16315_conc": consumFormData["16315_conc"] || 0,
            "16315_cribluri": consumFormData["16315_cribluri"] || 0,
            filler: consumFormData.filler || 0,
            bitum: consumFormData.bitum || 0,
            acid_clorhidric: consumFormData.acid_clorhidric || 0,
            emulgator: consumFormData.emulgator || 0,
            sare: consumFormData.sare || 0,
            apa: consumFormData.apa || 0,
            topcel_technocel: consumFormData.topcel_technocel || 0,
            consum_curent: consumFormData.consum_curent || 0,
            consum_ctl: consumFormData.consum_ctl || 0,
          },
          req: {
            id_consum: consumFormData.id || 0,
            col_to_material_map: {
              "04_nat": "0/4 Nat",
              "04_conc": "0/4 Conc",
              "04_cribluri": "0/4 Cribluri",
              "48_conc": "4/8 Conc",
              "48_cribluri": "4/8 Cribluri",
              "816_conc": "8/16 Conc",
              "816_cribluri": "8/16 Cribluri",
              "16224_conc": "16/22.4 Conc",
              "16224_cribluri": "16/22.4 Cribluri",
              "16315_conc": "16/31.5 Conc",
              "16315_cribluri": "16/31.5 Cribluri",
              filler: "Filler",
              bitum: "Bitum",
              acid_clorhidric: "Acid Clorhidric",
              emulgator: "Emulgator",
              sare: "Sare",
              apa: "Apa",
              topcel_technocel: "Topcel/Technocel"
            }
          }
        };

        console.log('Payload being sent:', JSON.stringify(payload, null, 2));

        const response = await fetch(`${API_BASE_URL}/consumuri/adauga/materie_prima`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Backend error response:', errorData);
          throw new Error(JSON.stringify(errorData) || 'Eroare la salvarea consumului');
        }

        toast({
          title: "Succes",
          description: "Consum adăugat cu succes"
        });
      }

      setIsConsumFormOpen(false);
      fetchConsumuriData();
    } catch (error) {
      console.error('Error saving consum:', error);
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "Eroare la salvarea consumului",
        variant: "destructive"
      });
    }
  };

  const handleConsumRowClick = (item: Consum) => {
    setSelectedConsum(item);
    setIsConsumDetailsOpen(true);
  };

  // Fetch Consumuri data
  const fetchConsumuriData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/consumuri/returneaza/materie_prima`);
      if (!response.ok) throw new Error('Failed to fetch consumuri data');
      const data = await response.json();
      setConsumuriData(data);
    } catch (error) {
      console.error('Error fetching consumuri:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele de consumuri",
        variant: "destructive"
      });
    }
  };

  const handleConsumDelete = async () => {
    if (!selectedConsum) return;

    try {
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tabel: "consumuri_materie_prima",
          id: selectedConsum.id
        })
      });

      if (!response.ok) throw new Error('Failed to delete consum');

      toast({
        title: "Succes",
        description: "Consum șters cu succes"
      });

      setIsConsumDeleteOpen(false);
      fetchConsumuriData();
    } catch (error) {
      console.error('Error deleting consum:', error);
      toast({
        title: "Eroare",
        description: "Eroare la ștergerea consumului",
        variant: "destructive"
      });
    }
  };

  // Import handlers
  const handleImportFileChange = (file: File | null) => {
    setImportFile(file);
    if (file) {
      // Create preview URL for supported file types
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const url = URL.createObjectURL(file);
        setFilePreviewUrl(url);
      } else {
        setFilePreviewUrl(null);
      }
    } else {
      setFilePreviewUrl(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImportFileChange(files[0]);
    }
  };

  const handleImportConfirm = async () => {
    if (!importFile) return;
    
    try {
      // TODO: Implement actual file upload to backend
      toast({
        title: "Succes",
        description: `Fișierul "${importFile.name}" a fost încărcat cu succes`,
      });
      setIsImportDialogOpen(false);
      setImportFile(null);
      setFilePreviewUrl(null);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la încărcarea fișierului",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.includes('spreadsheet') || type.includes('excel') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      return <FileSpreadsheet className="h-16 w-16 text-green-500" />;
    } else if (type === 'application/pdf' || file.name.endsWith('.pdf')) {
      return <FileText className="h-16 w-16 text-red-500" />;
    }
    return <File className="h-16 w-16 text-muted-foreground" />;
  };

  useEffect(() => {
    fetchConsumuriData();
  }, []);

  // Filtered and paginated data
  const filteredContorCurent = filterAndSortData(contorCurentData, contorCurentFilters, contorCurentSort);
  const contorCurentTotalPages = Math.ceil(filteredContorCurent.length / contorCurentItemsPerPage);
  const paginatedContorCurent = filteredContorCurent.slice(
    (contorCurentCurrentPage - 1) * contorCurentItemsPerPage,
    contorCurentCurrentPage * contorCurentItemsPerPage
  );

  const filteredContorCTL = filterAndSortData(contorCTLData, contorCTLFilters, contorCTLSort);
  const contorCTLTotalPages = Math.ceil(filteredContorCTL.length / contorCTLItemsPerPage);
  const paginatedContorCTL = filteredContorCTL.slice(
    (contorCTLCurrentPage - 1) * contorCTLItemsPerPage,
    contorCTLCurrentPage * contorCTLItemsPerPage
  );

  const filteredConsumuri = filterAndSortData(consumuriData, consumuriFilters, consumuriSort);
  const consumuriTotalPages = Math.ceil(filteredConsumuri.length / consumuriItemsPerPage);
  const paginatedConsumuri = filteredConsumuri.slice(
    (consumuriCurrentPage - 1) * consumuriItemsPerPage,
    consumuriCurrentPage * consumuriItemsPerPage
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Consumuri</h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base hidden sm:block">
            Monitorizare contoare și consumuri
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-3 mb-4">
          <TabsList className="flex flex-wrap h-auto p-1 gap-1 w-full">
            <TabsTrigger value="contor-curent" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">Contor Curent</TabsTrigger>
            <TabsTrigger value="contor-ctl" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">Contor CTL</TabsTrigger>
            <TabsTrigger value="consumuri" className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 flex-1 sm:flex-none">Consumuri Materiale</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (activeTab === 'contor-ctl') {
                  exportToCSV(filterAndSortData(contorCTLData, contorCTLFilters, contorCTLSort), 'contor_ctl', [
                    { key: 'id', label: 'ID' },
                    { key: 'data', label: 'Data' },
                    { key: 'index_vechi_tur', label: 'Index Vechi Tur' },
                    { key: 'index_nou_tur', label: 'Index Nou Tur' },
                    { key: 'retur_exces_vechi', label: 'Retur Exces Vechi' },
                    { key: 'retur_exces_nou', label: 'Retur Exces Nou' },
                    { key: 'consum_l', label: 'Consum (L)' },
                    { key: 'consum_to', label: 'Consum (TO)' }
                  ]);
                } else if (activeTab === 'consumuri') {
                  exportToCSV(filterAndSortData(consumuriData, consumuriFilters, consumuriSort), 'consumuri_materiale', [
                    { key: 'id', label: 'ID' },
                    { key: 'data', label: 'Data' },
                    { key: 'produs', label: 'Produs' },
                    { key: 'cantitate', label: 'Cantitate' }
                  ]);
                } else {
                  exportToCSV(filterAndSortData(contorCurentData, contorCurentFilters, contorCurentSort), 'contor_curent', [
                    { key: 'id', label: 'Nr Crt' },
                    { key: 'data', label: 'Data' },
                    { key: 'tip_consum', label: 'Tip Consum' },
                    { key: 'index_vechi', label: 'Index Vechi' },
                    { key: 'index_nou', label: 'Index Nou' },
                    { key: 'consum_kw', label: 'Consum kW' },
                    { key: 'pret', label: 'Preț' }
                  ]);
                }
              }}
            >
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button size="sm" onClick={() => {
              if (activeTab === 'contor-ctl') {
                handleOpenContorCTLAdd();
              } else if (activeTab === 'consumuri') {
                handleOpenConsumAdd();
              } else {
                handleOpenContorCurentAdd();
              }
            }}>
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Adaugă</span>
            </Button>
          </div>
        </div>

        {/* Contor Curent Tab */}
        <TabsContent value="contor-curent">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Contor Curent</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
                  <Select
                    value={contorCurentItemsPerPage.toString()}
                    onValueChange={(value) => {
                      setContorCurentItemsPerPage(Number(value));
                      setContorCurentCurrentPage(1);
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10">
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Nr Crt"
                          filterValue={contorCurentFilters['id'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('id', value)}
                          sortDirection={contorCurentSort?.field === 'id' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('id', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Data"
                          filterValue={contorCurentFilters['data'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('data', value)}
                          sortDirection={contorCurentSort?.field === 'data' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('data', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Tip Consum"
                          filterValue={contorCurentFilters['tip_consum'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('tip_consum', value)}
                          sortDirection={contorCurentSort?.field === 'tip_consum' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('tip_consum', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Index Vechi"
                          filterValue={contorCurentFilters['index_vechi'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('index_vechi', value)}
                          sortDirection={contorCurentSort?.field === 'index_vechi' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('index_vechi', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Index Nou"
                          filterValue={contorCurentFilters['index_nou'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('index_nou', value)}
                          sortDirection={contorCurentSort?.field === 'index_nou' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('index_nou', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Consum (kW)"
                          filterValue={contorCurentFilters['consum_kw'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('consum_kw', value)}
                          sortDirection={contorCurentSort?.field === 'consum_kw' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('consum_kw', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Preț"
                          filterValue={contorCurentFilters['pret'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('pret', value)}
                          sortDirection={contorCurentSort?.field === 'pret' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('pret', dir)}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContorCurent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Nu există înregistrări
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedContorCurent.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="h-10 cursor-pointer hover:bg-muted/50"
                          onClick={() => handleContorCurentRowClick(item)}
                        >
                          <TableCell className="py-1 text-xs">{item.id}</TableCell>
                          <TableCell className="py-1 text-xs">{item.data}</TableCell>
                          <TableCell className="py-1 text-xs capitalize">{item.tip_consum || '-'}</TableCell>
                          <TableCell className="py-1 text-xs">{item.index_vechi}</TableCell>
                          <TableCell className="py-1 text-xs">{item.index_nou}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_kw}</TableCell>
                          <TableCell className="py-1 text-xs">{item.pret}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {contorCurentTotalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <span className="text-sm text-muted-foreground">
                    Afișare {filteredContorCurent.length === 0 ? 0 : (contorCurentCurrentPage - 1) * contorCurentItemsPerPage + 1}-
                    {Math.min(contorCurentCurrentPage * contorCurentItemsPerPage, filteredContorCurent.length)} din {filteredContorCurent.length}
                  </span>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setContorCurentCurrentPage(Math.max(1, contorCurentCurrentPage - 1))}
                          className={contorCurentCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: contorCurentTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setContorCurentCurrentPage(page)}
                            isActive={contorCurentCurrentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setContorCurentCurrentPage(Math.min(contorCurentTotalPages, contorCurentCurrentPage + 1))}
                          className={contorCurentCurrentPage === contorCurentTotalPages || contorCurentTotalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contor CTL Tab */}
        <TabsContent value="contor-ctl">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Contor CTL</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
                  <Select
                    value={contorCTLItemsPerPage.toString()}
                    onValueChange={(value) => {
                      setContorCTLItemsPerPage(Number(value));
                      setContorCTLCurrentPage(1);
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10">
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="ID"
                          filterValue={contorCTLFilters['id'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('id', value)}
                          sortDirection={contorCTLSort?.field === 'id' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('id', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Data"
                          filterValue={contorCTLFilters['data'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('data', value)}
                          sortDirection={contorCTLSort?.field === 'data' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('data', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Index Vechi Tur"
                          filterValue={contorCTLFilters['index_vechi_tur'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('index_vechi_tur', value)}
                          sortDirection={contorCTLSort?.field === 'index_vechi_tur' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('index_vechi_tur', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Index Nou Tur"
                          filterValue={contorCTLFilters['index_nou_tur'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('index_nou_tur', value)}
                          sortDirection={contorCTLSort?.field === 'index_nou_tur' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('index_nou_tur', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Retur Exces Vechi"
                          filterValue={contorCTLFilters['retur_exces_vechi'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('retur_exces_vechi', value)}
                          sortDirection={contorCTLSort?.field === 'retur_exces_vechi' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('retur_exces_vechi', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Retur Exces Nou"
                          filterValue={contorCTLFilters['retur_exces_nou'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('retur_exces_nou', value)}
                          sortDirection={contorCTLSort?.field === 'retur_exces_nou' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('retur_exces_nou', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Consum (L)"
                          filterValue={contorCTLFilters['consum_l'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('consum_l', value)}
                          sortDirection={contorCTLSort?.field === 'consum_l' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('consum_l', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Consum (TO)"
                          filterValue={contorCTLFilters['consum_to'] || ''}
                          onFilterChange={(value) => handleContorCTLFilterChange('consum_to', value)}
                          sortDirection={contorCTLSort?.field === 'consum_to' ? contorCTLSort.direction : null}
                          onSort={(dir) => handleContorCTLSort('consum_to', dir)}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContorCTL.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          Nu există înregistrări
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedContorCTL.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="h-10 cursor-pointer hover:bg-muted/50"
                          onClick={() => handleContorCTLRowClick(item)}
                        >
                          <TableCell className="py-1 text-xs">{item.id}</TableCell>
                          <TableCell className="py-1 text-xs">{item.data}</TableCell>
                          <TableCell className="py-1 text-xs">{item.index_vechi_tur}</TableCell>
                          <TableCell className="py-1 text-xs">{item.index_nou_tur}</TableCell>
                          <TableCell className="py-1 text-xs">{item.retur_exces_vechi}</TableCell>
                          <TableCell className="py-1 text-xs">{item.retur_exces_nou}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_l}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_to}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {contorCTLTotalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <span className="text-sm text-muted-foreground">
                    Afișare {filteredContorCTL.length === 0 ? 0 : (contorCTLCurrentPage - 1) * contorCTLItemsPerPage + 1}-
                    {Math.min(contorCTLCurrentPage * contorCTLItemsPerPage, filteredContorCTL.length)} din {filteredContorCTL.length}
                  </span>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setContorCTLCurrentPage(Math.max(1, contorCTLCurrentPage - 1))}
                          className={contorCTLCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: contorCTLTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setContorCTLCurrentPage(page)}
                            isActive={contorCTLCurrentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setContorCTLCurrentPage(Math.min(contorCTLTotalPages, contorCTLCurrentPage + 1))}
                          className={contorCTLCurrentPage === contorCTLTotalPages || contorCTLTotalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumuri Tab */}
        <TabsContent value="consumuri">
          <Card>
            <CardHeader className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-base sm:text-lg">Consumuri Materiale</CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Label className="text-xs sm:text-sm whitespace-nowrap">Per pagină:</Label>
                  <Select
                    value={consumuriItemsPerPage.toString()}
                    onValueChange={(value) => {
                      setConsumuriItemsPerPage(Number(value));
                      setConsumuriCurrentPage(1);
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-6">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="h-10">
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="ID"
                          filterValue={consumuriFilters['id'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('id', value)}
                          sortDirection={consumuriSort?.field === 'id' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('id', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Data"
                          filterValue={consumuriFilters['data'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('data', value)}
                          sortDirection={consumuriSort?.field === 'data' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('data', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Produs"
                          filterValue={consumuriFilters['produs'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('produs', value)}
                          sortDirection={consumuriSort?.field === 'produs' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('produs', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Cantitate"
                          filterValue={consumuriFilters['cantitate'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('cantitate', value)}
                          sortDirection={consumuriSort?.field === 'cantitate' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('cantitate', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="0/4 NAT"
                          filterValue={consumuriFilters['04_nat'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('04_nat', value)}
                          sortDirection={consumuriSort?.field === '04_nat' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('04_nat', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="0/4 CONC"
                          filterValue={consumuriFilters['04_conc'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('04_conc', value)}
                          sortDirection={consumuriSort?.field === '04_conc' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('04_conc', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="0/4 CRIBLURI"
                          filterValue={consumuriFilters['04_cribluri'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('04_cribluri', value)}
                          sortDirection={consumuriSort?.field === '04_cribluri' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('04_cribluri', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="4/8 CONC"
                          filterValue={consumuriFilters['48_conc'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('48_conc', value)}
                          sortDirection={consumuriSort?.field === '48_conc' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('48_conc', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="4/8 CRIBLURI"
                          filterValue={consumuriFilters['48_cribluri'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('48_cribluri', value)}
                          sortDirection={consumuriSort?.field === '48_cribluri' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('48_cribluri', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="8/16 CONC"
                          filterValue={consumuriFilters['816_conc'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('816_conc', value)}
                          sortDirection={consumuriSort?.field === '816_conc' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('816_conc', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="8/16 CRIBLURI"
                          filterValue={consumuriFilters['816_cribluri'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('816_cribluri', value)}
                          sortDirection={consumuriSort?.field === '816_cribluri' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('816_cribluri', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="16/22.4 CONC"
                          filterValue={consumuriFilters['16224_conc'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('16224_conc', value)}
                          sortDirection={consumuriSort?.field === '16224_conc' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('16224_conc', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="16/22.4 CRIBLURI"
                          filterValue={consumuriFilters['16224_cribluri'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('16224_cribluri', value)}
                          sortDirection={consumuriSort?.field === '16224_cribluri' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('16224_cribluri', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="16/31.5 CONC"
                          filterValue={consumuriFilters['16315_conc'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('16315_conc', value)}
                          sortDirection={consumuriSort?.field === '16315_conc' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('16315_conc', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="16/31.5 CRIBLURI"
                          filterValue={consumuriFilters['16315_cribluri'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('16315_cribluri', value)}
                          sortDirection={consumuriSort?.field === '16315_cribluri' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('16315_cribluri', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Filler"
                          filterValue={consumuriFilters['filler'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('filler', value)}
                          sortDirection={consumuriSort?.field === 'filler' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('filler', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Bitum"
                          filterValue={consumuriFilters['bitum'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('bitum', value)}
                          sortDirection={consumuriSort?.field === 'bitum' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('bitum', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Acid Clorhidric"
                          filterValue={consumuriFilters['acid_clorhidric'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('acid_clorhidric', value)}
                          sortDirection={consumuriSort?.field === 'acid_clorhidric' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('acid_clorhidric', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Emulgator"
                          filterValue={consumuriFilters['emulgator'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('emulgator', value)}
                          sortDirection={consumuriSort?.field === 'emulgator' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('emulgator', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Sare"
                          filterValue={consumuriFilters['sare'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('sare', value)}
                          sortDirection={consumuriSort?.field === 'sare' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('sare', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Apă"
                          filterValue={consumuriFilters['apa'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('apa', value)}
                          sortDirection={consumuriSort?.field === 'apa' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('apa', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Topcel/Technocel"
                          filterValue={consumuriFilters['topcel_technocel'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('topcel_technocel', value)}
                          sortDirection={consumuriSort?.field === 'topcel_technocel' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('topcel_technocel', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Consum Curent"
                          filterValue={consumuriFilters['consum_curent'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('consum_curent', value)}
                          sortDirection={consumuriSort?.field === 'consum_curent' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('consum_curent', dir)}
                        />
                      </TableHead>
                      <TableHead className="text-xs">
                        <FilterHeader
                          label="Consum CTL"
                          filterValue={consumuriFilters['consum_ctl'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('consum_ctl', value)}
                          sortDirection={consumuriSort?.field === 'consum_ctl' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('consum_ctl', dir)}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedConsumuri.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={24} className="text-center py-8 text-muted-foreground">
                          Nu există înregistrări
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedConsumuri.map((item) => (
                        <TableRow 
                          key={item.id} 
                          className="h-10 cursor-pointer hover:bg-muted/50"
                          onClick={() => handleConsumRowClick(item)}
                        >
                          <TableCell className="py-1 text-xs">{item.id}</TableCell>
                          <TableCell className="py-1 text-xs">{item.data}</TableCell>
                          <TableCell className="py-1 text-xs">{item.produs}</TableCell>
                          <TableCell className="py-1 text-xs">{item.cantitate}</TableCell>
                          <TableCell className="py-1 text-xs">{item["04_nat"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["04_conc"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["04_cribluri"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["48_conc"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["48_cribluri"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["816_conc"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["816_cribluri"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["16224_conc"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["16224_cribluri"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["16315_conc"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item["16315_cribluri"]}</TableCell>
                          <TableCell className="py-1 text-xs">{item.filler}</TableCell>
                          <TableCell className="py-1 text-xs">{item.bitum}</TableCell>
                          <TableCell className="py-1 text-xs">{item.acid_clorhidric}</TableCell>
                          <TableCell className="py-1 text-xs">{item.emulgator}</TableCell>
                          <TableCell className="py-1 text-xs">{item.sare}</TableCell>
                          <TableCell className="py-1 text-xs">{item.apa}</TableCell>
                          <TableCell className="py-1 text-xs">{item.topcel_technocel}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_curent}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_ctl}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {consumuriTotalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <span className="text-sm text-muted-foreground">
                    Afișare {filteredConsumuri.length === 0 ? 0 : (consumuriCurrentPage - 1) * consumuriItemsPerPage + 1}-
                    {Math.min(consumuriCurrentPage * consumuriItemsPerPage, filteredConsumuri.length)} din {filteredConsumuri.length}
                  </span>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setConsumuriCurrentPage(Math.max(1, consumuriCurrentPage - 1))}
                          className={consumuriCurrentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: consumuriTotalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setConsumuriCurrentPage(page)}
                            isActive={consumuriCurrentPage === page}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setConsumuriCurrentPage(Math.min(consumuriTotalPages, consumuriCurrentPage + 1))}
                          className={consumuriCurrentPage === consumuriTotalPages || consumuriTotalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contor Curent Details Dialog */}
      <Dialog open={isContorCurentDetailsOpen} onOpenChange={setIsContorCurentDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalii Contor Curent
            </DialogTitle>
          </DialogHeader>
          {selectedContorCurent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Nr Crt</Label>
                  <p className="font-medium">{selectedContorCurent.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Data</Label>
                  <p className="font-medium">{selectedContorCurent.data}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Tip Consum</Label>
                  <p className="font-medium capitalize">{selectedContorCurent.tip_consum || '-'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Index Vechi</Label>
                  <p className="font-medium">{selectedContorCurent.index_vechi}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Index Nou</Label>
                  <p className="font-medium">{selectedContorCurent.index_nou}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Consum (kW)</Label>
                  <p className="font-medium">{selectedContorCurent.consum_kw}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Preț</Label>
                  <p className="font-medium">{selectedContorCurent.pret}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => selectedContorCurent && handleOpenContorCurentEdit(selectedContorCurent)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setIsContorCurentDeleteOpen(true); setIsContorCurentDetailsOpen(false); }}>
              <Trash2 className="h-4 w-4 mr-1" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contor Curent Form Dialog */}
      <Dialog open={isContorCurentFormOpen} onOpenChange={setIsContorCurentFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditingContorCurent ? 'Editează Contor Curent' : 'Adaugă Contor Curent'}</DialogTitle>
            <DialogDescription>
              {isEditingContorCurent ? 'Modifică datele contorului' : 'Completează datele pentru noul contor'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Form */}
            <div className="flex-1 space-y-4">
              {/* Image Upload - Only for Add mode */}
              {!isEditingContorCurent && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Poză Contor <span className="text-destructive">*</span>
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      contorCurentImagePreview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => contorCurentInputRef.current?.click()}
                  >
                    <input
                      ref={contorCurentInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setContorCurentImage(file);
                          const url = URL.createObjectURL(file);
                          setContorCurentImagePreview(url);
                        }
                      }}
                    />
                    {contorCurentImagePreview ? (
                      <div className="space-y-2">
                        <img 
                          src={contorCurentImagePreview} 
                          alt="Preview" 
                          className="max-h-32 mx-auto rounded-lg object-contain"
                        />
                        <p className="text-xs text-muted-foreground">{contorCurentImage?.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContorCurentImage(null);
                            setContorCurentImagePreview(null);
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Șterge
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="flex justify-center gap-2">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Fotografiați sau încărcați poza contorului</p>
                        <p className="text-xs text-muted-foreground">Apăsați pentru a selecta sau a face o poză</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    OCR-ul va autocompleta datele ulterior (momentan doar upload)
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Tip Consum</Label>
                  <p className="text-xs text-muted-foreground">
                    {contorCurentFormData.tip_consum === 'activ' ? 'Consum activ' : 'Consum pasiv'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${contorCurentFormData.tip_consum === 'pasiv' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Pasiv</span>
                  <Switch
                    checked={contorCurentFormData.tip_consum === 'activ'}
                    onCheckedChange={(checked) => {
                      setContorCurentFormData({
                        ...contorCurentFormData,
                        tip_consum: checked ? 'activ' : 'pasiv'
                      });
                    }}
                  />
                  <span className={`text-xs ${contorCurentFormData.tip_consum === 'activ' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>Activ</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Index Vechi</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCurentFormData.index_vechi || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Index Nou</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCurentFormData.index_nou || ''}
                  onChange={(e) => {
                    const indexNou = Number(e.target.value);
                    const indexVechi = contorCurentFormData.index_vechi || 0;
                    const consum = (indexNou - indexVechi) * 200;
                    setContorCurentFormData({ 
                      ...contorCurentFormData, 
                      index_nou: indexNou,
                      consum_kw: consum
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Consum (kW)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCurentFormData.consum_kw || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Preț</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCurentFormData.pret || ''}
                  onChange={(e) => {
                    setContorCurentFormData({ 
                      ...contorCurentFormData, 
                      pret: Number(e.target.value)
                    });
                  }}
                />
              </div>
            </div>

            {/* Right side - Summary */}
            <div className="lg:w-56 shrink-0">
              <Card className="h-full">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Raport Curent</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Astăzi</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înreg.</p>
                        <p className="font-semibold text-lg">
                          {contorCurentData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Consum</p>
                        <p className="font-semibold text-lg">
                          {contorCurentData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.consum_kw || 0), 0).toFixed(0)}
                          <span className="text-xs font-normal ml-1">kW</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Luna aceasta</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înreg.</p>
                        <p className="font-semibold text-lg">
                          {contorCurentData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Consum</p>
                        <p className="font-semibold text-lg">
                          {(contorCurentData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.consum_kw || 0), 0) / 1000).toFixed(1)}
                          <span className="text-xs font-normal ml-1">MWh</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Cost Lunar</p>
                    <div className="bg-primary/10 rounded p-2 text-center">
                      <p className="font-semibold text-lg text-primary">
                        {contorCurentData.filter(c => {
                          const today = new Date();
                          const [, month, year] = c.data.split('/');
                          return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                 year === String(today.getFullYear());
                        }).reduce((sum, c) => sum + (c.pret || 0), 0).toLocaleString()}
                        <span className="text-xs font-normal ml-1">RON</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContorCurentFormOpen(false)}>Anulează</Button>
            <Button onClick={handleContorCurentSave}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contor Curent Delete Dialog */}
      <AlertDialog open={isContorCurentDeleteOpen} onOpenChange={setIsContorCurentDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această înregistrare? Acțiunea nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleContorCurentDelete}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contor CTL Details Dialog */}
      <Dialog open={isContorCTLDetailsOpen} onOpenChange={setIsContorCTLDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalii Contor CTL
            </DialogTitle>
          </DialogHeader>
          {selectedContorCTL && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">ID</Label>
                  <p className="font-medium">{selectedContorCTL.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Data</Label>
                  <p className="font-medium">{selectedContorCTL.data}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Index Vechi Tur</Label>
                  <p className="font-medium">{selectedContorCTL.index_vechi_tur}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Index Nou Tur</Label>
                  <p className="font-medium">{selectedContorCTL.index_nou_tur}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Retur Exces Vechi</Label>
                  <p className="font-medium">{selectedContorCTL.retur_exces_vechi}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Retur Exces Nou</Label>
                  <p className="font-medium">{selectedContorCTL.retur_exces_nou}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Consum (L)</Label>
                  <p className="font-medium">{selectedContorCTL.consum_l}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Consum (TO)</Label>
                  <p className="font-medium">{selectedContorCTL.consum_to}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => selectedContorCTL && handleOpenContorCTLEdit(selectedContorCTL)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setIsContorCTLDeleteOpen(true); setIsContorCTLDetailsOpen(false); }}>
              <Trash2 className="h-4 w-4 mr-1" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contor CTL Form Dialog */}
      <Dialog open={isContorCTLFormOpen} onOpenChange={setIsContorCTLFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditingContorCTL ? 'Editează Contor CTL' : 'Adaugă Contor CTL'}</DialogTitle>
            <DialogDescription>
              {isEditingContorCTL ? 'Modifică datele contorului' : 'Completează datele pentru noul contor'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Form */}
            <div className="flex-1 space-y-4">
              {/* Image Upload - Only for Add mode */}
              {!isEditingContorCTL && (
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Poză Contor CTL <span className="text-destructive">*</span>
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${
                      contorCTLImagePreview ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                    onClick={() => contorCTLInputRef.current?.click()}
                  >
                    <input
                      ref={contorCTLInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setContorCTLImage(file);
                          const url = URL.createObjectURL(file);
                          setContorCTLImagePreview(url);
                        }
                      }}
                    />
                    {contorCTLImagePreview ? (
                      <div className="space-y-2">
                        <img 
                          src={contorCTLImagePreview} 
                          alt="Preview" 
                          className="max-h-32 mx-auto rounded-lg object-contain"
                        />
                        <p className="text-xs text-muted-foreground">{contorCTLImage?.name}</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setContorCTLImage(null);
                            setContorCTLImagePreview(null);
                          }}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Șterge
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <div className="flex justify-center gap-2">
                          <Camera className="h-8 w-8 text-muted-foreground" />
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Fotografiați sau încărcați poza contorului</p>
                        <p className="text-xs text-muted-foreground">Apăsați pentru a selecta sau a face o poză</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    OCR-ul va autocompleta datele ulterior (momentan doar upload)
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Index Vechi Tur</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.index_vechi_tur || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Index Nou Tur</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.index_nou_tur || ''}
                  onChange={(e) => {
                    const indexNouTur = Number(e.target.value);
                    const indexVechiTur = contorCTLFormData.index_vechi_tur || 0;
                    const returExcesNou = contorCTLFormData.retur_exces_nou || 0;
                    const returExcesVechi = contorCTLFormData.retur_exces_vechi || 0;
                    const consumL = (indexNouTur - indexVechiTur) - (returExcesNou - returExcesVechi);
                    const consumTo = consumL * 0.85;
                    setContorCTLFormData({ 
                      ...contorCTLFormData, 
                      index_nou_tur: indexNouTur,
                      consum_l: consumL,
                      consum_to: consumTo
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Retur Exces Vechi</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.retur_exces_vechi || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Retur Exces Nou</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.retur_exces_nou || ''}
                  onChange={(e) => {
                    const returExcesNou = Number(e.target.value);
                    const returExcesVechi = contorCTLFormData.retur_exces_vechi || 0;
                    const indexNouTur = contorCTLFormData.index_nou_tur || 0;
                    const indexVechiTur = contorCTLFormData.index_vechi_tur || 0;
                    const consumL = (indexNouTur - indexVechiTur) - (returExcesNou - returExcesVechi);
                    const consumTo = consumL * 0.85;
                    setContorCTLFormData({ 
                      ...contorCTLFormData, 
                      retur_exces_nou: returExcesNou,
                      consum_l: consumL,
                      consum_to: consumTo
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Consum (L)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.consum_l || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Consum (TO)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={contorCTLFormData.consum_to || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            {/* Right side - Summary */}
            <div className="lg:w-56 shrink-0">
              <Card className="h-full">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Raport CTL</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Astăzi</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înreg.</p>
                        <p className="font-semibold text-lg">
                          {contorCTLData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Consum</p>
                        <p className="font-semibold text-lg">
                          {contorCTLData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.consum_l || 0), 0).toFixed(0)}
                          <span className="text-xs font-normal ml-1">L</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Luna aceasta</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înreg.</p>
                        <p className="font-semibold text-lg">
                          {contorCTLData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Consum</p>
                        <p className="font-semibold text-lg">
                          {(contorCTLData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.consum_l || 0), 0) / 1000).toFixed(1)}
                          <span className="text-xs font-normal ml-1">kL</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Consum TO Lunar</p>
                    <div className="bg-primary/10 rounded p-2 text-center">
                      <p className="font-semibold text-lg text-primary">
                        {contorCTLData.filter(c => {
                          const today = new Date();
                          const [, month, year] = c.data.split('/');
                          return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                 year === String(today.getFullYear());
                        }).reduce((sum, c) => sum + (c.consum_to || 0), 0).toFixed(1)}
                        <span className="text-xs font-normal ml-1">TO</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContorCTLFormOpen(false)}>Anulează</Button>
            <Button onClick={handleContorCTLSave}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contor CTL Delete Dialog */}
      <AlertDialog open={isContorCTLDeleteOpen} onOpenChange={setIsContorCTLDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această înregistrare? Acțiunea nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleContorCTLDelete}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Consum Details Dialog */}
      <Dialog open={isConsumDetailsOpen} onOpenChange={setIsConsumDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalii Consum Materie Prima
            </DialogTitle>
          </DialogHeader>
          {selectedConsum && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">ID</Label>
                  <p className="font-medium">{selectedConsum.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Data</Label>
                  <p className="font-medium">{selectedConsum.data}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Produs</Label>
                  <p className="font-medium">{selectedConsum.produs}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Cantitate</Label>
                  <p className="font-medium">{selectedConsum.cantitate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">0/4 NAT</Label>
                  <p className="font-medium">{selectedConsum["04_nat"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">0/4 CONC</Label>
                  <p className="font-medium">{selectedConsum["04_conc"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">0/4 CRIBLURI</Label>
                  <p className="font-medium">{selectedConsum["04_cribluri"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">4/8 CONC</Label>
                  <p className="font-medium">{selectedConsum["48_conc"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">4/8 CRIBLURI</Label>
                  <p className="font-medium">{selectedConsum["48_cribluri"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">8/16 CONC</Label>
                  <p className="font-medium">{selectedConsum["816_conc"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">8/16 CRIBLURI</Label>
                  <p className="font-medium">{selectedConsum["816_cribluri"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">16/22.4 CONC</Label>
                  <p className="font-medium">{selectedConsum["16224_conc"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">16/22.4 CRIBLURI</Label>
                  <p className="font-medium">{selectedConsum["16224_cribluri"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">16/31.5 CONC</Label>
                  <p className="font-medium">{selectedConsum["16315_conc"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">16/31.5 CRIBLURI</Label>
                  <p className="font-medium">{selectedConsum["16315_cribluri"]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Filler</Label>
                  <p className="font-medium">{selectedConsum.filler}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Bitum</Label>
                  <p className="font-medium">{selectedConsum.bitum}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Acid Clorhidric</Label>
                  <p className="font-medium">{selectedConsum.acid_clorhidric}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Emulgator</Label>
                  <p className="font-medium">{selectedConsum.emulgator}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Sare</Label>
                  <p className="font-medium">{selectedConsum.sare}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Apă</Label>
                  <p className="font-medium">{selectedConsum.apa}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Topcel/Technocel</Label>
                  <p className="font-medium">{selectedConsum.topcel_technocel}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Consum Curent</Label>
                  <p className="font-medium">{selectedConsum.consum_curent}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Consum CTL</Label>
                  <p className="font-medium">{selectedConsum.consum_ctl}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => selectedConsum && handleOpenConsumEdit(selectedConsum)}>
              <Pencil className="h-4 w-4 mr-1" />
              Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { setIsConsumDeleteOpen(true); setIsConsumDetailsOpen(false); }}>
              <Trash2 className="h-4 w-4 mr-1" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consum Form Dialog */}
      <Dialog open={isConsumFormOpen} onOpenChange={setIsConsumFormOpen}>
        <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2 pr-8">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-base">{isEditingConsum ? 'Editează Consum' : 'Adaugă Consum'}</DialogTitle>
              {!isEditingConsum && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setIsImportDialogOpen(true)}
                  className="h-8"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Import
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left side - Form inputs */}
            <div className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Produs</Label>
              <Input
                className="h-8 text-sm"
                value={consumFormData.produs || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, produs: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Cantitate</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.cantitate || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, cantitate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">0/4 NAT</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["04_nat"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_nat": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">0/4 CONC</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["04_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">0/4 CRIBLURI</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["04_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">4/8 CONC</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["48_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "48_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">4/8 CRIBLURI</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["48_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "48_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">8/16 CONC</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["816_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "816_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">8/16 CRIBLURI</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["816_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "816_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">16/22.4 CONC</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["16224_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16224_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">16/22.4 CRIBLURI</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["16224_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16224_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">16/31.5 CONC</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["16315_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16315_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">16/31.5 CRIBLURI</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData["16315_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16315_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Filler</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.filler || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, filler: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bitum</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.bitum || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, bitum: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Acid Clorhidric</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.acid_clorhidric || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, acid_clorhidric: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Emulgator</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.emulgator || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, emulgator: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Sare</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.sare || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, sare: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Apă</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.apa || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, apa: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Topcel/Technocel</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.topcel_technocel || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, topcel_technocel: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Consum Curent</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.consum_curent || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, consum_curent: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Consum CTL</Label>
              <Input
                className="h-8 text-sm"
                type="number"
                step="0.01"
                value={consumFormData.consum_ctl || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, consum_ctl: Number(e.target.value) })}
              />
              </div>
            </div>
            </div>

            {/* Right side - Consumption Summary */}
            <div className="lg:w-64 shrink-0">
              <Card className="h-full">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm">Raport Consum</CardTitle>
                </CardHeader>
                <CardContent className="py-2 px-4 space-y-4">
                  {/* Daily Summary */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Astăzi</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înregistrări</p>
                        <p className="font-semibold text-lg">
                          {consumuriData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Cantitate</p>
                        <p className="font-semibold text-lg">
                          {consumuriData.filter(c => {
                            const today = new Date();
                            const [day, month, year] = c.data.split('/');
                            return day === String(today.getDate()).padStart(2, '0') &&
                                   month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.cantitate || 0), 0).toFixed(0)}
                          <span className="text-xs font-normal ml-1">t</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Summary */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Luna aceasta</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Înregistrări</p>
                        <p className="font-semibold text-lg">
                          {consumuriData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).length}
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded p-2">
                        <p className="text-muted-foreground">Cantitate</p>
                        <p className="font-semibold text-lg">
                          {consumuriData.filter(c => {
                            const today = new Date();
                            const [, month, year] = c.data.split('/');
                            return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                   year === String(today.getFullYear());
                          }).reduce((sum, c) => sum + (c.cantitate || 0), 0).toFixed(0)}
                          <span className="text-xs font-normal ml-1">t</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Top Materials */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Top Materiale (Lunar)</p>
                    <div className="space-y-1 text-xs">
                      {(() => {
                        const monthData = consumuriData.filter(c => {
                          const today = new Date();
                          const [, month, year] = c.data.split('/');
                          return month === String(today.getMonth() + 1).padStart(2, '0') &&
                                 year === String(today.getFullYear());
                        });
                        const bitumTotal = monthData.reduce((sum, c) => sum + (c.bitum || 0), 0);
                        const fillerTotal = monthData.reduce((sum, c) => sum + (c.filler || 0), 0);
                        const apaTotal = monthData.reduce((sum, c) => sum + (c.apa || 0), 0);
                        return (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bitum</span>
                              <span className="font-medium">{bitumTotal.toFixed(1)} t</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Filler</span>
                              <span className="font-medium">{fillerTotal.toFixed(1)} t</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Apă</span>
                              <span className="font-medium">{apaTotal.toFixed(1)} t</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsConsumFormOpen(false)}>Anulează</Button>
            <Button size="sm" onClick={handleConsumSave}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={(open) => {
        setIsImportDialogOpen(open);
        if (!open) {
          setImportFile(null);
          setFilePreviewUrl(null);
        }
      }}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Consumuri Materiale
            </DialogTitle>
            <DialogDescription>
              Selectează sau trage un fișier pentru a importa datele de consum
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[300px]">
            {/* Left side - Drop zone */}
            <div 
              className={`
                flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg
                transition-all duration-200 cursor-pointer
                ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                ${importFile ? 'bg-muted/30' : ''}
              `}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('import-file-input')?.click()}
            >
              <input
                id="import-file-input"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv,.pdf"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleImportFileChange(files[0]);
                  }
                }}
              />
              
              {importFile ? (
                <div className="text-center space-y-3">
                  {getFileIcon(importFile)}
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{importFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(importFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImportFileChange(null);
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Schimbă fișier
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div className="space-y-1">
                    <p className="font-medium text-sm">Trage fișierul aici</p>
                    <p className="text-xs text-muted-foreground">sau click pentru a selecta</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formate acceptate: XLSX, XLS, CSV, PDF
                  </p>
                </div>
              )}
            </div>
            
            {/* Right side - Preview */}
            <div className="flex flex-col border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-3 py-2 border-b">
                <span className="text-sm font-medium">Previzualizare</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 min-h-[250px] bg-muted/20">
                {importFile ? (
                  filePreviewUrl && importFile.type === 'application/pdf' ? (
                    <iframe 
                      src={filePreviewUrl} 
                      className="w-full h-full min-h-[250px] rounded"
                      title="PDF Preview"
                    />
                  ) : filePreviewUrl && importFile.type.startsWith('image/') ? (
                    <img 
                      src={filePreviewUrl} 
                      alt="File preview" 
                      className="max-w-full max-h-[250px] object-contain rounded"
                    />
                  ) : (
                    <div className="text-center space-y-3">
                      {getFileIcon(importFile)}
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{importFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Previzualizare indisponibilă pentru acest tip de fișier
                        </p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Selectează un fișier pentru previzualizare</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setIsImportDialogOpen(false);
              setImportFile(null);
              setFilePreviewUrl(null);
            }}>
              Anulează
            </Button>
            <Button onClick={handleImportConfirm} disabled={!importFile}>
              <Upload className="h-4 w-4 mr-1" />
              Importă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Consum Delete Dialog */}
      <AlertDialog open={isConsumDeleteOpen} onOpenChange={setIsConsumDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sigur doriți să ștergeți această înregistrare? Acțiunea nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleConsumDelete}
            >
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Consumuri;
