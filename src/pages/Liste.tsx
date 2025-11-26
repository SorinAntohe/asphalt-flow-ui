import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Liste = () => {
  const { toast } = useToast();
  const [autoturismePerPage, setAutoturismePerPage] = useState(10);
  const [soferiPerPage, setSoferiPerPage] = useState(10);
  const [materiiPrimePerPage, setMateriiPrimePerPage] = useState(10);
  const [produseFinitePerPage, setProduseFinitePerPage] = useState(10);
  const [clientiPerPage, setClientiPerPage] = useState(10);
  const [furnizoriPerPage, setFurnizoriPerPage] = useState(10);
  
  const [autoturismePage, setAutoturismePage] = useState(1);
  const [soferiPage, setSoferiPage] = useState(1);
  const [materiiPrimePage, setMateriiPrimePage] = useState(1);
  const [produseFinitePage, setProduseFinitePage] = useState(1);
  const [clientiPage, setClientiPage] = useState(1);
  const [furnizoriPage, setFurnizoriPage] = useState(1);

  // Filters
  const [autoturismeFilters, setAutoturismeFilters] = useState({ id: "", tipMasina: "", nrAuto: "", sarcinaMax: "", tipTransport: "" });
  const [soferiFilters, setSoferiFilters] = useState({ id: "", nume: "", ci: "" });
  const [materiiPrimeFilters, setMateriiPrimeFilters] = useState({ id: "", denumire: "" });
  const [produseFiniteFilters, setProduseFiniteFilters] = useState({ id: "", denumire: "" });
  const [clientiFilters, setClientiFilters] = useState({ id: "", denumire: "", sediu: "", cui: "", nrReg: "" });
  const [furnizoriFilters, setFurnizoriFilters] = useState({ id: "", denumire: "", sediu: "", cui: "", nrReg: "" });

  // Sorting
  const [autoturismeSort, setAutoturismeSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [soferiSort, setSoferiSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [materiiPrimeSort, setMateriiPrimeSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [produseFiniteSort, setProduseFiniteSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [clientiSort, setClientiSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [furnizoriSort, setFurnizoriSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });

  // Dialog states
  const [autoturismeDialog, setAutoturismeDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });
  const [soferiDialog, setSoferiDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });
  const [materiiPrimeDialog, setMateriiPrimeDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });
  const [produseFiniteDialog, setProduseFiniteDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });
  const [clientiDialog, setClientiDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });
  const [furnizoriDialog, setFurnizoriDialog] = useState<{ open: boolean; mode: 'add' | 'edit'; data?: any }>({ open: false, mode: 'add' });

  // Delete dialog states
  const [autoturismeDeleteDialog, setAutoturismeDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [soferiDeleteDialog, setSoferiDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [materiiPrimeDeleteDialog, setMateriiPrimeDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [produseFiniteDeleteDialog, setProduseFiniteDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [clientiDeleteDialog, setClientiDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });
  const [furnizoriDeleteDialog, setFurnizoriDeleteDialog] = useState<{ open: boolean; id?: number }>({ open: false });

  // Form data states
  const [autoturismeFormData, setAutoturismeFormData] = useState({ tipMasina: "", nrAuto: "", sarcinaMax: "", tipTransport: "" });
  const [soferiFormData, setSoferiFormData] = useState({ numeSofer: "", ci: "" });
  const [materiiPrimeFormData, setMateriiPrimeFormData] = useState({ denumire: "" });
  const [produseFiniteFormData, setProduseFiniteFormData] = useState({ denumire: "" });
  const [clientiFormData, setClientiFormData] = useState({ denumire: "", sediu: "", cui: "", nrReg: "" });
  const [furnizoriFormData, setFurnizoriFormData] = useState({ denumire: "", sediu: "", cui: "", nrReg: "" });
  
  const materiiPrimeList = [
    "0/4 NAT", "0/4 CONC", "0/4 CRIBLURI", "4/8 CONC", "4/8 CRIBLURI", "4/8 NAT",
    "8/16 CONC", "8/16 CRIBLURI", "16/22.4 CONC", "16/22.4 CRIBLURI",
    "16/31.5 CRIBLURI", "16/31.5 CONC", "CTL", "BITUM 50/70", "BITUM 70/100",
    "FILLER CALCAR", "FILLER CIMENT", "CURENT ELECTRIC", "MOTORINA", "APA",
    "ACID CLORHIDRIC", "EMULGATOR CATIONIC", "EMULGATOR ANIONIC", "SARE DE DRUM",
    "CELULOZA TOPCEL", "CELULOZA TECHNOCEL", "ADITIV ADEZIUNE", "POLIMER SBS",
    "FIBRĂ CELULOZICĂ", "NISIP SILICOS"
  ];
  const autoturisme: any[] = [];
  const soferi: any[] = [];
  const materiiPrime: any[] = [];
  const produseFinite: any[] = [];
  const clienti: any[] = [];
  const furnizori: any[] = [];

  // Pagination helpers
  const getPaginatedData = (data: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number, itemsPerPage: number) => Math.ceil(dataLength / itemsPerPage);

  // Sort helper
  const sortData = (data: any[], field: string, direction: 'asc' | 'desc' | null) => {
    if (!field || !direction) return data;
    return [...data].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  };

  // Filter helpers
  const filterAutoturisme = autoturisme.filter(item => 
    item.id.toString().includes(autoturismeFilters.id) &&
    item.tipMasina.toLowerCase().includes(autoturismeFilters.tipMasina.toLowerCase()) &&
    item.nrAuto.toLowerCase().includes(autoturismeFilters.nrAuto.toLowerCase()) &&
    item.sarcinaMax.toLowerCase().includes(autoturismeFilters.sarcinaMax.toLowerCase()) &&
    item.tipTransport.toLowerCase().includes(autoturismeFilters.tipTransport.toLowerCase())
  );

  const filterSoferi = soferi.filter(item =>
    item.id.toString().includes(soferiFilters.id) &&
    item.nume.toLowerCase().includes(soferiFilters.nume.toLowerCase()) &&
    item.ci.toLowerCase().includes(soferiFilters.ci.toLowerCase())
  );

  const filterMateriiPrime = materiiPrime.filter(item =>
    item.id.toString().includes(materiiPrimeFilters.id) &&
    item.denumire.toLowerCase().includes(materiiPrimeFilters.denumire.toLowerCase())
  );

  const filterProduseFinite = produseFinite.filter(item =>
    item.id.toString().includes(produseFiniteFilters.id) &&
    item.denumire.toLowerCase().includes(produseFiniteFilters.denumire.toLowerCase())
  );

  const filterClienti = clienti.filter(item =>
    item.id.toString().includes(clientiFilters.id) &&
    item.denumire.toLowerCase().includes(clientiFilters.denumire.toLowerCase()) &&
    item.sediu.toLowerCase().includes(clientiFilters.sediu.toLowerCase()) &&
    item.cui.toLowerCase().includes(clientiFilters.cui.toLowerCase()) &&
    item.nrReg.toLowerCase().includes(clientiFilters.nrReg.toLowerCase())
  );

  const filterFurnizori = furnizori.filter(item =>
    item.id.toString().includes(furnizoriFilters.id) &&
    item.denumire.toLowerCase().includes(furnizoriFilters.denumire.toLowerCase()) &&
    item.sediu.toLowerCase().includes(furnizoriFilters.sediu.toLowerCase()) &&
    item.cui.toLowerCase().includes(furnizoriFilters.cui.toLowerCase()) &&
    item.nrReg.toLowerCase().includes(furnizoriFilters.nrReg.toLowerCase())
  );

  const sortedAutoturisme = sortData(filterAutoturisme, autoturismeSort.field, autoturismeSort.direction);
  const sortedSoferi = sortData(filterSoferi, soferiSort.field, soferiSort.direction);
  const sortedMateriiPrime = sortData(filterMateriiPrime, materiiPrimeSort.field, materiiPrimeSort.direction);
  const sortedProduseFinite = sortData(filterProduseFinite, produseFiniteSort.field, produseFiniteSort.direction);
  const sortedClienti = sortData(filterClienti, clientiSort.field, clientiSort.direction);
  const sortedFurnizori = sortData(filterFurnizori, furnizoriSort.field, furnizoriSort.direction);

  const paginatedAutoturisme = getPaginatedData(sortedAutoturisme, autoturismePage, autoturismePerPage);
  const paginatedSoferi = getPaginatedData(sortedSoferi, soferiPage, soferiPerPage);
  const paginatedMateriiPrime = getPaginatedData(sortedMateriiPrime, materiiPrimePage, materiiPrimePerPage);
  const paginatedProduseFinite = getPaginatedData(sortedProduseFinite, produseFinitePage, produseFinitePerPage);
  const paginatedClienti = getPaginatedData(sortedClienti, clientiPage, clientiPerPage);
  const paginatedFurnizori = getPaginatedData(sortedFurnizori, furnizoriPage, furnizoriPerPage);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liste</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare nomenclatoare și registre
          </p>
        </div>
      </div>

      <Tabs defaultValue="autoturisme" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="autoturisme">Autoturisme</TabsTrigger>
          <TabsTrigger value="soferi">Șoferi</TabsTrigger>
          <TabsTrigger value="materii">Materii Prime</TabsTrigger>
          <TabsTrigger value="produse">Produse Finite</TabsTrigger>
          <TabsTrigger value="clienti">Clienți</TabsTrigger>
          <TabsTrigger value="furnizori">Furnizori</TabsTrigger>
        </TabsList>

        <TabsContent value="autoturisme">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Autoturisme</CardTitle>
                  <CardDescription>
                    Parcul auto disponibil pentru transport
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setAutoturismeFormData({ tipMasina: "", nrAuto: "", sarcinaMax: "", tipTransport: "" });
                  setAutoturismeDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Autoturism
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={autoturismePerPage.toString()} onValueChange={(value) => { setAutoturismePerPage(Number(value)); setAutoturismePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {autoturismeSort.field === 'id' ? (autoturismeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={autoturismeFilters.id} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, id: e.target.value}); setAutoturismePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Tip Mașină</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {autoturismeSort.field === 'tipMasina' ? (autoturismeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută tip..." value={autoturismeFilters.tipMasina} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, tipMasina: e.target.value}); setAutoturismePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'tipMasina', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'tipMasina', direction: 'desc' })}>
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
                        <span>Nr. Auto</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {autoturismeSort.field === 'nrAuto' ? (autoturismeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută număr..." value={autoturismeFilters.nrAuto} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, nrAuto: e.target.value}); setAutoturismePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'nrAuto', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'nrAuto', direction: 'desc' })}>
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
                        <span>Sarcină Max</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {autoturismeSort.field === 'sarcinaMax' ? (autoturismeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută sarcină..." value={autoturismeFilters.sarcinaMax} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, sarcinaMax: e.target.value}); setAutoturismePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'sarcinaMax', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'sarcinaMax', direction: 'desc' })}>
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
                        <span>Tip Transport</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {autoturismeSort.field === 'tipTransport' ? (autoturismeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută tip..." value={autoturismeFilters.tipTransport} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, tipTransport: e.target.value}); setAutoturismePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'tipTransport', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setAutoturismeSort({ field: 'tipTransport', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedAutoturisme.map(auto => <TableRow key={auto.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{auto.id}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.tipMasina}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.nrAuto}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.sarcinaMax}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.tipTransport}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setAutoturismeFormData({ tipMasina: auto.tipMasina, nrAuto: auto.nrAuto, sarcinaMax: auto.sarcinaMax, tipTransport: auto.tipTransport });
                            setAutoturismeDialog({ open: true, mode: 'edit', data: auto });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setAutoturismeDeleteDialog({ open: true, id: auto.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedAutoturisme.length, autoturismePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setAutoturismePage(p => Math.max(1, p - 1))}
                        className={autoturismePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedAutoturisme.length, autoturismePerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setAutoturismePage(page)}
                          isActive={autoturismePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setAutoturismePage(p => Math.min(getTotalPages(sortedAutoturisme.length, autoturismePerPage), p + 1))}
                        className={autoturismePage === getTotalPages(sortedAutoturisme.length, autoturismePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

           <Dialog open={autoturismeDialog.open} onOpenChange={(open) => setAutoturismeDialog({ ...autoturismeDialog, open })}>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>{autoturismeDialog.mode === 'add' ? 'Adaugă Autoturism' : 'Editează Autoturism'}</DialogTitle>
                 <DialogDescription>
                   {autoturismeDialog.mode === 'add' ? 'Completați formularul pentru a adăuga un autoturism nou.' : 'Modificați detaliile autoturismului.'}
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="tipMasina">Tip Mașină *</Label>
                    <Select 
                      value={autoturismeFormData.tipMasina} 
                      onValueChange={(value) => {
                        const sarcinaMap: Record<string, string> = {
                          "Articulata": "40t",
                          "8X4": "30t",
                          "4X2": "12t"
                        };
                        setAutoturismeFormData({ 
                          ...autoturismeFormData, 
                          tipMasina: value,
                          sarcinaMax: sarcinaMap[value] || ""
                        });
                      }}
                    >
                      <SelectTrigger id="tipMasina">
                        <SelectValue placeholder="Selectează tip mașină" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Articulata">Articulata</SelectItem>
                        <SelectItem value="8X4">8X4</SelectItem>
                        <SelectItem value="4X2">4X2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="nrAuto">Număr Auto *</Label>
                    <Input
                      id="nrAuto"
                      placeholder="Ex: B-123-ABC"
                      value={autoturismeFormData.nrAuto}
                      onChange={(e) => setAutoturismeFormData({ ...autoturismeFormData, nrAuto: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sarcinaMax">Sarcină Maximă *</Label>
                    <Input
                      id="sarcinaMax"
                      placeholder="Se completează automat"
                      value={autoturismeFormData.sarcinaMax}
                      disabled
                    />
                  </div>
                 <div className="grid gap-2">
                   <Label htmlFor="tipTransport">Tip Transport *</Label>
                   <Select value={autoturismeFormData.tipTransport} onValueChange={(value) => setAutoturismeFormData({ ...autoturismeFormData, tipTransport: value })}>
                     <SelectTrigger id="tipTransport">
                       <SelectValue placeholder="Selectează tip transport" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Propriu">Propriu</SelectItem>
                       <SelectItem value="Inchiriat">Închiriat</SelectItem>
                       <SelectItem value="Extern">Extern</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setAutoturismeDialog({ ...autoturismeDialog, open: false })}>
                   Anulează
                 </Button>
                 <Button onClick={() => {
                   toast({
                     title: "Succes",
                     description: `Autoturismul a fost ${autoturismeDialog.mode === 'add' ? 'adăugat' : 'actualizat'} cu succes`
                   });
                   setAutoturismeDialog({ ...autoturismeDialog, open: false });
                 }}>
                   {autoturismeDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           <AlertDialog open={autoturismeDeleteDialog.open} onOpenChange={(open) => setAutoturismeDeleteDialog({ ...autoturismeDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți acest autoturism? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Autoturismul a fost șters cu succes"
                   });
                   setAutoturismeDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>

        <TabsContent value="soferi">
          <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Șoferi</CardTitle>
                  <CardDescription>
                    Personal autorizat pentru conducere
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setSoferiFormData({ numeSofer: "", ci: "" });
                  setSoferiDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Șofer
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={soferiPerPage.toString()} onValueChange={(value) => { setSoferiPerPage(Number(value)); setSoferiPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {soferiSort.field === 'id' ? (soferiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={soferiFilters.id} onChange={(e) => { setSoferiFilters({...soferiFilters, id: e.target.value}); setSoferiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Nume Șofer</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {soferiSort.field === 'nume' ? (soferiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută nume..." value={soferiFilters.nume} onChange={(e) => { setSoferiFilters({...soferiFilters, nume: e.target.value}); setSoferiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'nume', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'nume', direction: 'desc' })}>
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
                        <span>C.I.</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {soferiSort.field === 'ci' ? (soferiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută C.I...." value={soferiFilters.ci} onChange={(e) => { setSoferiFilters({...soferiFilters, ci: e.target.value}); setSoferiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'ci', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSoferiSort({ field: 'ci', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedSoferi.map(sofer => <TableRow key={sofer.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{sofer.id}</TableCell>
                      <TableCell className="py-1 text-xs">{sofer.nume}</TableCell>
                      <TableCell className="py-1 text-xs">{sofer.ci}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setSoferiFormData({ numeSofer: sofer.nume, ci: sofer.ci });
                            setSoferiDialog({ open: true, mode: 'edit', data: sofer });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setSoferiDeleteDialog({ open: true, id: sofer.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedSoferi.length, soferiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSoferiPage(p => Math.max(1, p - 1))}
                        className={soferiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedSoferi.length, soferiPerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setSoferiPage(page)}
                          isActive={soferiPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setSoferiPage(p => Math.min(getTotalPages(sortedSoferi.length, soferiPerPage), p + 1))}
                        className={soferiPage === getTotalPages(sortedSoferi.length, soferiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

           <Dialog open={soferiDialog.open} onOpenChange={(open) => setSoferiDialog({ ...soferiDialog, open })}>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>{soferiDialog.mode === 'add' ? 'Adaugă Șofer' : 'Editează Șofer'}</DialogTitle>
                 <DialogDescription>
                   {soferiDialog.mode === 'add' ? 'Completați formularul pentru a adăuga un șofer nou.' : 'Modificați detaliile șoferului.'}
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="numeSofer">Nume Șofer *</Label>
                   <Input
                     id="numeSofer"
                     placeholder="Ex: Ion Popescu"
                     value={soferiFormData.numeSofer}
                     onChange={(e) => setSoferiFormData({ ...soferiFormData, numeSofer: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="ci">C.I. *</Label>
                   <Input
                     id="ci"
                     placeholder="Ex: AB123456"
                     value={soferiFormData.ci}
                     onChange={(e) => setSoferiFormData({ ...soferiFormData, ci: e.target.value })}
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setSoferiDialog({ ...soferiDialog, open: false })}>
                   Anulează
                 </Button>
                 <Button onClick={() => {
                   toast({
                     title: "Succes",
                     description: `Șoferul a fost ${soferiDialog.mode === 'add' ? 'adăugat' : 'actualizat'} cu succes`
                   });
                   setSoferiDialog({ ...soferiDialog, open: false });
                 }}>
                   {soferiDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           <AlertDialog open={soferiDeleteDialog.open} onOpenChange={(open) => setSoferiDeleteDialog({ ...soferiDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți acest șofer? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Șoferul a fost șters cu succes"
                   });
                   setSoferiDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>

         <TabsContent value="materii">
           <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Materii Prime</CardTitle>
                  <CardDescription>
                    Materii prime utilizate în producție
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setMateriiPrimeFormData({ denumire: "" });
                  setMateriiPrimeDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Materie Primă
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={materiiPrimePerPage.toString()} onValueChange={(value) => { setMateriiPrimePerPage(Number(value)); setMateriiPrimePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {materiiPrimeSort.field === 'id' ? (materiiPrimeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={materiiPrimeFilters.id} onChange={(e) => { setMateriiPrimeFilters({...materiiPrimeFilters, id: e.target.value}); setMateriiPrimePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setMateriiPrimeSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setMateriiPrimeSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Denumire</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {materiiPrimeSort.field === 'denumire' ? (materiiPrimeSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută denumire..." value={materiiPrimeFilters.denumire} onChange={(e) => { setMateriiPrimeFilters({...materiiPrimeFilters, denumire: e.target.value}); setMateriiPrimePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setMateriiPrimeSort({ field: 'denumire', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setMateriiPrimeSort({ field: 'denumire', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedMateriiPrime.map(materie => <TableRow key={materie.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{materie.id}</TableCell>
                      <TableCell className="py-1 text-xs">{materie.denumire}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setMateriiPrimeFormData({ denumire: materie.denumire });
                            setMateriiPrimeDialog({ open: true, mode: 'edit', data: materie });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setMateriiPrimeDeleteDialog({ open: true, id: materie.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedMateriiPrime.length, materiiPrimePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setMateriiPrimePage(p => Math.max(1, p - 1))}
                        className={materiiPrimePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedMateriiPrime.length, materiiPrimePerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setMateriiPrimePage(page)}
                          isActive={materiiPrimePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setMateriiPrimePage(p => Math.min(getTotalPages(sortedMateriiPrime.length, materiiPrimePerPage), p + 1))}
                        className={materiiPrimePage === getTotalPages(sortedMateriiPrime.length, materiiPrimePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

            <Dialog open={materiiPrimeDialog.open} onOpenChange={(open) => setMateriiPrimeDialog({ ...materiiPrimeDialog, open })}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{materiiPrimeDialog.mode === 'add' ? 'Adaugă Materie Primă' : 'Editează Materie Primă'}</DialogTitle>
                  <DialogDescription>
                    {materiiPrimeDialog.mode === 'add' ? 'Completați formularul pentru a adăuga o materie primă nouă.' : 'Modificați denumirea materiei prime.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="denumire">Denumire *</Label>
                    <Input
                      id="denumire"
                      placeholder="Ex: 0/4 NAT, BITUM 50/70, CTL"
                      value={materiiPrimeFormData.denumire}
                      onChange={(e) => setMateriiPrimeFormData({ denumire: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setMateriiPrimeDialog({ ...materiiPrimeDialog, open: false })}>
                    Anulează
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Succes",
                      description: `Materia primă a fost ${materiiPrimeDialog.mode === 'add' ? 'adăugată' : 'actualizată'} cu succes`
                    });
                    setMateriiPrimeDialog({ ...materiiPrimeDialog, open: false });
                  }}>
                    {materiiPrimeDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

           <AlertDialog open={materiiPrimeDeleteDialog.open} onOpenChange={(open) => setMateriiPrimeDeleteDialog({ ...materiiPrimeDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți această materie primă? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Materia primă a fost ștearsă cu succes"
                   });
                   setMateriiPrimeDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>

         <TabsContent value="produse">
           <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Produse Finite</CardTitle>
                  <CardDescription>
                    Produse finite disponibile pentru livrare
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setProduseFiniteFormData({ denumire: "" });
                  setProduseFiniteDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Produs
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={produseFinitePerPage.toString()} onValueChange={(value) => { setProduseFinitePerPage(Number(value)); setProduseFinitePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {produseFiniteSort.field === 'id' ? (produseFiniteSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={produseFiniteFilters.id} onChange={(e) => { setProduseFiniteFilters({...produseFiniteFilters, id: e.target.value}); setProduseFinitePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setProduseFiniteSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setProduseFiniteSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Denumire</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {produseFiniteSort.field === 'denumire' ? (produseFiniteSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută denumire..." value={produseFiniteFilters.denumire} onChange={(e) => { setProduseFiniteFilters({...produseFiniteFilters, denumire: e.target.value}); setProduseFinitePage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setProduseFiniteSort({ field: 'denumire', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setProduseFiniteSort({ field: 'denumire', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedProduseFinite.map(produs => <TableRow key={produs.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{produs.id}</TableCell>
                      <TableCell className="py-1 text-xs">{produs.denumire}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setProduseFiniteFormData({ denumire: produs.denumire });
                            setProduseFiniteDialog({ open: true, mode: 'edit', data: produs });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setProduseFiniteDeleteDialog({ open: true, id: produs.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedProduseFinite.length, produseFinitePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setProduseFinitePage(p => Math.max(1, p - 1))}
                        className={produseFinitePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedProduseFinite.length, produseFinitePerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setProduseFinitePage(page)}
                          isActive={produseFinitePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setProduseFinitePage(p => Math.min(getTotalPages(sortedProduseFinite.length, produseFinitePerPage), p + 1))}
                        className={produseFinitePage === getTotalPages(sortedProduseFinite.length, produseFinitePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

           <Dialog open={produseFiniteDialog.open} onOpenChange={(open) => setProduseFiniteDialog({ ...produseFiniteDialog, open })}>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>{produseFiniteDialog.mode === 'add' ? 'Adaugă Produs Finit' : 'Editează Produs Finit'}</DialogTitle>
                 <DialogDescription>
                   {produseFiniteDialog.mode === 'add' ? 'Completați formularul pentru a adăuga un produs finit nou.' : 'Modificați detaliile produsului finit.'}
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="denumire">Denumire *</Label>
                   <Input
                     id="denumire"
                     placeholder="Ex: Asfalt tip A"
                     value={produseFiniteFormData.denumire}
                     onChange={(e) => setProduseFiniteFormData({ denumire: e.target.value })}
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setProduseFiniteDialog({ ...produseFiniteDialog, open: false })}>
                   Anulează
                 </Button>
                 <Button onClick={() => {
                   toast({
                     title: "Succes",
                     description: `Produsul finit a fost ${produseFiniteDialog.mode === 'add' ? 'adăugat' : 'actualizat'} cu succes`
                   });
                   setProduseFiniteDialog({ ...produseFiniteDialog, open: false });
                 }}>
                   {produseFiniteDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           <AlertDialog open={produseFiniteDeleteDialog.open} onOpenChange={(open) => setProduseFiniteDeleteDialog({ ...produseFiniteDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți acest produs finit? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Produsul finit a fost șters cu succes"
                   });
                   setProduseFiniteDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>

         <TabsContent value="clienti">
           <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Clienți</CardTitle>
                  <CardDescription>
                    Clienți activi și parteneri comerciali
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setClientiFormData({ denumire: "", sediu: "", cui: "", nrReg: "" });
                  setClientiDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Client
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={clientiPerPage.toString()} onValueChange={(value) => { setClientiPerPage(Number(value)); setClientiPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {clientiSort.field === 'id' ? (clientiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={clientiFilters.id} onChange={(e) => { setClientiFilters({...clientiFilters, id: e.target.value}); setClientiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Denumire</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {clientiSort.field === 'denumire' ? (clientiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută denumire..." value={clientiFilters.denumire} onChange={(e) => { setClientiFilters({...clientiFilters, denumire: e.target.value}); setClientiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'denumire', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'denumire', direction: 'desc' })}>
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
                        <span>Sediu</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {clientiSort.field === 'sediu' ? (clientiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută sediu..." value={clientiFilters.sediu} onChange={(e) => { setClientiFilters({...clientiFilters, sediu: e.target.value}); setClientiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'sediu', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'sediu', direction: 'desc' })}>
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
                        <span>CUI</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {clientiSort.field === 'cui' ? (clientiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută CUI..." value={clientiFilters.cui} onChange={(e) => { setClientiFilters({...clientiFilters, cui: e.target.value}); setClientiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'cui', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'cui', direction: 'desc' })}>
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
                        <span>Nr. REG</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {clientiSort.field === 'nrReg' ? (clientiSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută Nr. REG..." value={clientiFilters.nrReg} onChange={(e) => { setClientiFilters({...clientiFilters, nrReg: e.target.value}); setClientiPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'nrReg', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setClientiSort({ field: 'nrReg', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedClienti.map(client => <TableRow key={client.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{client.id}</TableCell>
                      <TableCell className="py-1 text-xs">{client.denumire}</TableCell>
                      <TableCell className="py-1 text-xs">{client.sediu}</TableCell>
                      <TableCell className="py-1 text-xs">{client.cui}</TableCell>
                      <TableCell className="py-1 text-xs">{client.nrReg}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setClientiFormData({ denumire: client.denumire, sediu: client.sediu, cui: client.cui, nrReg: client.nrReg });
                            setClientiDialog({ open: true, mode: 'edit', data: client });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setClientiDeleteDialog({ open: true, id: client.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedClienti.length, clientiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setClientiPage(p => Math.max(1, p - 1))}
                        className={clientiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedClienti.length, clientiPerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setClientiPage(page)}
                          isActive={clientiPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setClientiPage(p => Math.min(getTotalPages(sortedClienti.length, clientiPerPage), p + 1))}
                        className={clientiPage === getTotalPages(sortedClienti.length, clientiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

           <Dialog open={clientiDialog.open} onOpenChange={(open) => setClientiDialog({ ...clientiDialog, open })}>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>{clientiDialog.mode === 'add' ? 'Adaugă Client' : 'Editează Client'}</DialogTitle>
                 <DialogDescription>
                   {clientiDialog.mode === 'add' ? 'Completați formularul pentru a adăuga un client nou.' : 'Modificați detaliile clientului.'}
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="denumire">Denumire *</Label>
                   <Input
                     id="denumire"
                     placeholder="Ex: Construct Pro SRL"
                     value={clientiFormData.denumire}
                     onChange={(e) => setClientiFormData({ ...clientiFormData, denumire: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="sediu">Sediu *</Label>
                   <Input
                     id="sediu"
                     placeholder="Ex: București"
                     value={clientiFormData.sediu}
                     onChange={(e) => setClientiFormData({ ...clientiFormData, sediu: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="cui">CUI *</Label>
                   <Input
                     id="cui"
                     placeholder="Ex: RO12345678"
                     value={clientiFormData.cui}
                     onChange={(e) => setClientiFormData({ ...clientiFormData, cui: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="nrReg">Nr. REG *</Label>
                   <Input
                     id="nrReg"
                     placeholder="Ex: J40/1234/2020"
                     value={clientiFormData.nrReg}
                     onChange={(e) => setClientiFormData({ ...clientiFormData, nrReg: e.target.value })}
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setClientiDialog({ ...clientiDialog, open: false })}>
                   Anulează
                 </Button>
                 <Button onClick={() => {
                   toast({
                     title: "Succes",
                     description: `Clientul a fost ${clientiDialog.mode === 'add' ? 'adăugat' : 'actualizat'} cu succes`
                   });
                   setClientiDialog({ ...clientiDialog, open: false });
                 }}>
                   {clientiDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           <AlertDialog open={clientiDeleteDialog.open} onOpenChange={(open) => setClientiDeleteDialog({ ...clientiDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți acest client? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Clientul a fost șters cu succes"
                   });
                   setClientiDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>

         <TabsContent value="furnizori">
           <Card>
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lista Furnizori</CardTitle>
                  <CardDescription>
                    Furnizori de materii prime și materiale
                  </CardDescription>
                </div>
                <Button className="gap-2" onClick={() => {
                  setFurnizoriFormData({ denumire: "", sediu: "", cui: "", nrReg: "" });
                  setFurnizoriDialog({ open: true, mode: 'add' });
                }}>
                  <Plus className="w-4 h-4" />
                  Adaugă Furnizor
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={furnizoriPerPage.toString()} onValueChange={(value) => { setFurnizoriPerPage(Number(value)); setFurnizoriPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <span>ID</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {furnizoriSort.field === 'id' ? (furnizoriSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută ID..." value={furnizoriFilters.id} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, id: e.target.value}); setFurnizoriPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'id', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'id', direction: 'desc' })}>
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
                        <span>Denumire</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {furnizoriSort.field === 'denumire' ? (furnizoriSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută denumire..." value={furnizoriFilters.denumire} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, denumire: e.target.value}); setFurnizoriPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'denumire', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'denumire', direction: 'desc' })}>
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
                        <span>Sediu</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {furnizoriSort.field === 'sediu' ? (furnizoriSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută sediu..." value={furnizoriFilters.sediu} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, sediu: e.target.value}); setFurnizoriPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'sediu', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'sediu', direction: 'desc' })}>
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
                        <span>CUI</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {furnizoriSort.field === 'cui' ? (furnizoriSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută CUI..." value={furnizoriFilters.cui} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, cui: e.target.value}); setFurnizoriPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'cui', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'cui', direction: 'desc' })}>
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
                        <span>Nr. REG</span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              {furnizoriSort.field === 'nrReg' ? (furnizoriSort.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută Nr. REG..." value={furnizoriFilters.nrReg} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, nrReg: e.target.value}); setFurnizoriPage(1); }} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'nrReg', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setFurnizoriSort({ field: 'nrReg', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
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
                  {paginatedFurnizori.map(furnizor => <TableRow key={furnizor.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{furnizor.id}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.denumire}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.sediu}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.cui}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.nrReg}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs" onClick={() => {
                            setFurnizoriFormData({ denumire: furnizor.denumire, sediu: furnizor.sediu, cui: furnizor.cui, nrReg: furnizor.nrReg });
                            setFurnizoriDialog({ open: true, mode: 'edit', data: furnizor });
                          }}>
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs" onClick={() => setFurnizoriDeleteDialog({ open: true, id: furnizor.id })}>
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(sortedFurnizori.length, furnizoriPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setFurnizoriPage(p => Math.max(1, p - 1))}
                        className={furnizoriPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(sortedFurnizori.length, furnizoriPerPage) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setFurnizoriPage(page)}
                          isActive={furnizoriPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setFurnizoriPage(p => Math.min(getTotalPages(sortedFurnizori.length, furnizoriPerPage), p + 1))}
                        className={furnizoriPage === getTotalPages(sortedFurnizori.length, furnizoriPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
             </CardContent>
           </Card>

           <Dialog open={furnizoriDialog.open} onOpenChange={(open) => setFurnizoriDialog({ ...furnizoriDialog, open })}>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>{furnizoriDialog.mode === 'add' ? 'Adaugă Furnizor' : 'Editează Furnizor'}</DialogTitle>
                 <DialogDescription>
                   {furnizoriDialog.mode === 'add' ? 'Completați formularul pentru a adăuga un furnizor nou.' : 'Modificați detaliile furnizorului.'}
                 </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="denumire">Denumire *</Label>
                   <Input
                     id="denumire"
                     placeholder="Ex: Agregat SRL"
                     value={furnizoriFormData.denumire}
                     onChange={(e) => setFurnizoriFormData({ ...furnizoriFormData, denumire: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="sediu">Sediu *</Label>
                   <Input
                     id="sediu"
                     placeholder="Ex: Ploiești"
                     value={furnizoriFormData.sediu}
                     onChange={(e) => setFurnizoriFormData({ ...furnizoriFormData, sediu: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="cui">CUI *</Label>
                   <Input
                     id="cui"
                     placeholder="Ex: RO11111111"
                     value={furnizoriFormData.cui}
                     onChange={(e) => setFurnizoriFormData({ ...furnizoriFormData, cui: e.target.value })}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="nrReg">Nr. REG *</Label>
                   <Input
                     id="nrReg"
                     placeholder="Ex: J29/1111/2017"
                     value={furnizoriFormData.nrReg}
                     onChange={(e) => setFurnizoriFormData({ ...furnizoriFormData, nrReg: e.target.value })}
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button variant="outline" onClick={() => setFurnizoriDialog({ ...furnizoriDialog, open: false })}>
                   Anulează
                 </Button>
                 <Button onClick={() => {
                   toast({
                     title: "Succes",
                     description: `Furnizorul a fost ${furnizoriDialog.mode === 'add' ? 'adăugat' : 'actualizat'} cu succes`
                   });
                   setFurnizoriDialog({ ...furnizoriDialog, open: false });
                 }}>
                   {furnizoriDialog.mode === 'add' ? 'Adaugă' : 'Salvează'}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>

           <AlertDialog open={furnizoriDeleteDialog.open} onOpenChange={(open) => setFurnizoriDeleteDialog({ ...furnizoriDeleteDialog, open })}>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
                 <AlertDialogDescription>
                   Sigur doriți să ștergeți acest furnizor? Această acțiune nu poate fi anulată.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Anulează</AlertDialogCancel>
                 <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                   toast({
                     title: "Succes",
                     description: "Furnizorul a fost șters cu succes"
                   });
                   setFurnizoriDeleteDialog({ open: false });
                 }}>
                   Șterge
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
         </TabsContent>
       </Tabs>
     </div>
 );
};
export default Liste;