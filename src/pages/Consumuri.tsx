import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, X, Eye } from "lucide-react";
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
  pret_total: number;
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
  tip_material: string;
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
        <Button variant="ghost" className="h-8 p-0 hover:bg-transparent font-medium text-xs">
          {label}
          {sortDirection === 'asc' && <ArrowUp className="ml-1 h-3 w-3" />}
          {sortDirection === 'desc' && <ArrowDown className="ml-1 h-3 w-3" />}
          {filterValue && <span className="ml-1 h-2 w-2 rounded-full bg-primary" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2" align="start">
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
  // Contor Curent state
  const [contorCurentItemsPerPage, setContorCurentItemsPerPage] = useState(10);
  const [contorCurentCurrentPage, setContorCurentCurrentPage] = useState(1);
  const [contorCurentFilters, setContorCurentFilters] = useState<Record<string, string>>({});
  const [contorCurentSort, setContorCurentSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [contorCurentData] = useState<ContorCurent[]>([]);
  const [selectedContorCurent, setSelectedContorCurent] = useState<ContorCurent | null>(null);
  const [isContorCurentDetailsOpen, setIsContorCurentDetailsOpen] = useState(false);
  const [isContorCurentFormOpen, setIsContorCurentFormOpen] = useState(false);
  const [isContorCurentDeleteOpen, setIsContorCurentDeleteOpen] = useState(false);
  const [contorCurentFormData, setContorCurentFormData] = useState<Partial<ContorCurent>>({});
  const [isEditingContorCurent, setIsEditingContorCurent] = useState(false);

  // Contor CTL state
  const [contorCTLItemsPerPage, setContorCTLItemsPerPage] = useState(10);
  const [contorCTLCurrentPage, setContorCTLCurrentPage] = useState(1);
  const [contorCTLFilters, setContorCTLFilters] = useState<Record<string, string>>({});
  const [contorCTLSort, setContorCTLSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [contorCTLData] = useState<ContorCTL[]>([]);
  const [selectedContorCTL, setSelectedContorCTL] = useState<ContorCTL | null>(null);
  const [isContorCTLDetailsOpen, setIsContorCTLDetailsOpen] = useState(false);
  const [isContorCTLFormOpen, setIsContorCTLFormOpen] = useState(false);
  const [isContorCTLDeleteOpen, setIsContorCTLDeleteOpen] = useState(false);
  const [contorCTLFormData, setContorCTLFormData] = useState<Partial<ContorCTL>>({});
  const [isEditingContorCTL, setIsEditingContorCTL] = useState(false);

  // Consumuri state
  const [consumuriItemsPerPage, setConsumuriItemsPerPage] = useState(10);
  const [consumuriCurrentPage, setConsumuriCurrentPage] = useState(1);
  const [consumuriFilters, setConsumuriFilters] = useState<Record<string, string>>({});
  const [consumuriSort, setConsumuriSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);
  const [consumuriData] = useState<Consum[]>([]);
  const [selectedConsum, setSelectedConsum] = useState<Consum | null>(null);
  const [isConsumDetailsOpen, setIsConsumDetailsOpen] = useState(false);
  const [isConsumFormOpen, setIsConsumFormOpen] = useState(false);
  const [isConsumDeleteOpen, setIsConsumDeleteOpen] = useState(false);
  const [consumFormData, setConsumFormData] = useState<Partial<Consum>>({});
  const [isEditingConsum, setIsEditingConsum] = useState(false);

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
    setContorCurentFormData({});
    setIsEditingContorCurent(false);
    setIsContorCurentFormOpen(true);
  };

  const handleOpenContorCurentEdit = (item: ContorCurent) => {
    setContorCurentFormData(item);
    setIsEditingContorCurent(true);
    setIsContorCurentFormOpen(true);
    setIsContorCurentDetailsOpen(false);
  };

  const handleContorCurentRowClick = (item: ContorCurent) => {
    setSelectedContorCurent(item);
    setIsContorCurentDetailsOpen(true);
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
    setContorCTLFormData({});
    setIsEditingContorCTL(false);
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

  const handleConsumRowClick = (item: Consum) => {
    setSelectedConsum(item);
    setIsConsumDetailsOpen(true);
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consumuri</h1>
          <p className="text-muted-foreground mt-2">
            Monitorizare contoare și consumuri
          </p>
        </div>
      </div>

      <Tabs defaultValue="contor-curent" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contor-curent">Contor Curent</TabsTrigger>
          <TabsTrigger value="contor-ctl">Contor CTL</TabsTrigger>
          <TabsTrigger value="consumuri">Consumuri Materiale</TabsTrigger>
        </TabsList>

        {/* Contor Curent Tab */}
        <TabsContent value="contor-curent">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contor Curent</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Înregistrări per pagină:</Label>
                    <Select
                      value={contorCurentItemsPerPage.toString()}
                      onValueChange={(value) => {
                        setContorCurentItemsPerPage(Number(value));
                        setContorCurentCurrentPage(1);
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
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="gap-1" onClick={handleOpenContorCurentAdd}>
                    <Plus className="h-4 w-4" />
                    Adaugă
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
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
                          label="Preț Total"
                          filterValue={contorCurentFilters['pret_total'] || ''}
                          onFilterChange={(value) => handleContorCurentFilterChange('pret_total', value)}
                          sortDirection={contorCurentSort?.field === 'pret_total' ? contorCurentSort.direction : null}
                          onSort={(dir) => handleContorCurentSort('pret_total', dir)}
                        />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContorCurent.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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
                          <TableCell className="py-1 text-xs">{item.index_vechi}</TableCell>
                          <TableCell className="py-1 text-xs">{item.index_nou}</TableCell>
                          <TableCell className="py-1 text-xs">{item.consum_kw}</TableCell>
                          <TableCell className="py-1 text-xs">{item.pret_total}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contor CTL Tab */}
        <TabsContent value="contor-ctl">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contor CTL</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Înregistrări per pagină:</Label>
                    <Select
                      value={contorCTLItemsPerPage.toString()}
                      onValueChange={(value) => {
                        setContorCTLItemsPerPage(Number(value));
                        setContorCTLCurrentPage(1);
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
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="gap-1" onClick={handleOpenContorCTLAdd}>
                    <Plus className="h-4 w-4" />
                    Adaugă
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consumuri Tab */}
        <TabsContent value="consumuri">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Consumuri Materiale</CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Înregistrări per pagină:</Label>
                    <Select
                      value={consumuriItemsPerPage.toString()}
                      onValueChange={(value) => {
                        setConsumuriItemsPerPage(Number(value));
                        setConsumuriCurrentPage(1);
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
                      </SelectContent>
                    </Select>
                  </div>
                  <Button size="sm" className="gap-1" onClick={handleOpenConsumAdd}>
                    <Plus className="h-4 w-4" />
                    Adaugă
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
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
                          label="Tip Material"
                          filterValue={consumuriFilters['tip_material'] || ''}
                          onFilterChange={(value) => handleConsumuriFilterChange('tip_material', value)}
                          sortDirection={consumuriSort?.field === 'tip_material' ? consumuriSort.direction : null}
                          onSort={(dir) => handleConsumuriSort('tip_material', dir)}
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
                          <TableCell className="py-1 text-xs">{item.tip_material}</TableCell>
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
                  <Label className="text-muted-foreground text-xs">Preț Total</Label>
                  <p className="font-medium">{selectedContorCurent.pret_total}</p>
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingContorCurent ? 'Editează Contor Curent' : 'Adaugă Contor Curent'}</DialogTitle>
            <DialogDescription>
              {isEditingContorCurent ? 'Modifică datele contorului' : 'Completează datele pentru noul contor'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Index Vechi</Label>
              <Input
                type="number"
                value={contorCurentFormData.index_vechi || ''}
                onChange={(e) => setContorCurentFormData({ ...contorCurentFormData, index_vechi: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Index Nou</Label>
              <Input
                type="number"
                value={contorCurentFormData.index_nou || ''}
                onChange={(e) => setContorCurentFormData({ ...contorCurentFormData, index_nou: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consum (kW)</Label>
              <Input
                type="number"
                value={contorCurentFormData.consum_kw || ''}
                onChange={(e) => setContorCurentFormData({ ...contorCurentFormData, consum_kw: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Preț Total</Label>
              <Input
                type="number"
                value={contorCurentFormData.pret_total || ''}
                onChange={(e) => setContorCurentFormData({ ...contorCurentFormData, pret_total: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContorCurentFormOpen(false)}>Anulează</Button>
            <Button onClick={() => setIsContorCurentFormOpen(false)}>Salvează</Button>
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
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditingContorCTL ? 'Editează Contor CTL' : 'Adaugă Contor CTL'}</DialogTitle>
            <DialogDescription>
              {isEditingContorCTL ? 'Modifică datele contorului' : 'Completează datele pentru noul contor'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Index Vechi Tur</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.index_vechi_tur || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, index_vechi_tur: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Index Nou Tur</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.index_nou_tur || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, index_nou_tur: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Retur Exces Vechi</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.retur_exces_vechi || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, retur_exces_vechi: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Retur Exces Nou</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.retur_exces_nou || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, retur_exces_nou: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consum (L)</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.consum_l || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, consum_l: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consum (TO)</Label>
              <Input
                type="number"
                step="0.01"
                value={contorCTLFormData.consum_to || ''}
                onChange={(e) => setContorCTLFormData({ ...contorCTLFormData, consum_to: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContorCTLFormOpen(false)}>Anulează</Button>
            <Button onClick={() => setIsContorCTLFormOpen(false)}>Salvează</Button>
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
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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
                  <Label className="text-muted-foreground text-xs">Tip Material</Label>
                  <p className="font-medium">{selectedConsum.tip_material}</p>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditingConsum ? 'Editează Consum' : 'Adaugă Consum'}</DialogTitle>
            <DialogDescription>
              {isEditingConsum ? 'Modifică datele consumului' : 'Completează datele pentru noul consum'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tip Material</Label>
              <Input
                value={consumFormData.tip_material || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, tip_material: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cantitate</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.cantitate || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, cantitate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>0/4 NAT</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["04_nat"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_nat": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>0/4 CONC</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["04_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>0/4 CRIBLURI</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["04_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "04_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>4/8 CONC</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["48_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "48_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>4/8 CRIBLURI</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["48_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "48_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>8/16 CONC</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["816_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "816_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>8/16 CRIBLURI</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["816_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "816_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>16/22.4 CONC</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["16224_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16224_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>16/22.4 CRIBLURI</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["16224_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16224_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>16/31.5 CONC</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["16315_conc"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16315_conc": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>16/31.5 CRIBLURI</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData["16315_cribluri"] || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, "16315_cribluri": Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Filler</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.filler || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, filler: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bitum</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.bitum || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, bitum: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Acid Clorhidric</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.acid_clorhidric || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, acid_clorhidric: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Emulgator</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.emulgator || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, emulgator: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sare</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.sare || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, sare: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Apă</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.apa || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, apa: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Topcel/Technocel</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.topcel_technocel || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, topcel_technocel: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consum Curent</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.consum_curent || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, consum_curent: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Consum CTL</Label>
              <Input
                type="number"
                step="0.01"
                value={consumFormData.consum_ctl || ''}
                onChange={(e) => setConsumFormData({ ...consumFormData, consum_ctl: Number(e.target.value) })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConsumFormOpen(false)}>Anulează</Button>
            <Button onClick={() => setIsConsumFormOpen(false)}>Salvează</Button>
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
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Consumuri;
