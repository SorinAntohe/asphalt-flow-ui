import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { CalendarClock, Plus, Download, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { exportToCSV } from "@/lib/exportUtils";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface Pontaj {
  id: number;
  data: string;
  angajat_id: number;
  nume_angajat: string;
  prezenta: string;
  ora_start: string;
  ora_sfarsit: string;
  pauza_masa: number;
  total_ore: number;
}

interface Angajat {
  id: number;
  nume: string;
}

const PREZENTA_OPTIONS = [
  "Prezent",
  "Concediu Odihna",
  "Suspendat",
  "Liber platit",
  "Concediu fara plata",
  "Concediu medical"
];

type SortDirection = "asc" | "desc" | null;

export default function Pontaj() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pontaje, setPontaje] = useState<Pontaj[]>([]);
  const [angajati, setAngajati] = useState<Angajat[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewingDetails, setViewingDetails] = useState<Pontaj | null>(null);
  const [editingPontaj, setEditingPontaj] = useState<Pontaj | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    angajat_id: "",
    prezenta: "Prezent",
    ora_start: "08:00",
    ora_sfarsit: "17:00",
    pauza_masa: 60
  });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAngajati = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/liste/returneaza/angajati`);
        if (response.ok) {
          const data = await response.json();
          setAngajati(data);
        }
      } catch (error) {
        console.error("Error fetching angajati:", error);
      }
    };
    fetchAngajati();
  }, []);

  useEffect(() => {
    fetchPontaje();
  }, [selectedDate]);

  const fetchPontaje = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, "dd/MM/yyyy");
      const response = await fetch(`${API_BASE_URL}/pontaj/returneaza/${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setPontaje(data);
      } else {
        setPontaje([]);
      }
    } catch (error) {
      console.error("Error fetching pontaje:", error);
      setPontaje([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalHours = (oraStart: string, oraSfarsit: string, pauzaMasa: number): number => {
    if (!oraStart || !oraSfarsit) return 0;
    const [startH, startM] = oraStart.split(":").map(Number);
    const [endH, endM] = oraSfarsit.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    const totalMinutes = endMinutes - startMinutes - pauzaMasa;
    return Math.max(0, Math.round((totalMinutes / 60) * 100) / 100);
  };

  const totalOreCalculate = useMemo(() => {
    return calculateTotalHours(formData.ora_start, formData.ora_sfarsit, formData.pauza_masa);
  }, [formData.ora_start, formData.ora_sfarsit, formData.pauza_masa]);

  const filteredAndSortedData = useMemo(() => {
    let result = [...pontaje];
    Object.entries(filters).forEach(([column, filterValue]) => {
      if (filterValue) {
        result = result.filter((item) => {
          const value = item[column as keyof Pontaj];
          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }
    });
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn as keyof Pontaj];
        const bValue = b[sortColumn as keyof Pontaj];
        if (typeof aValue === "number" && typeof bValue === "number") {
          return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
        }
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    return result;
  }, [pontaje, filters, sortColumn, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") setSortDirection("desc");
      else { setSortColumn(null); setSortDirection(null); }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-3 w-3" />;
    if (sortDirection === "asc") return <ArrowUp className="h-3 w-3" />;
    return <ArrowDown className="h-3 w-3" />;
  };

  const resetForm = () => {
    setFormData({ angajat_id: "", prezenta: "Prezent", ora_start: "08:00", ora_sfarsit: "17:00", pauza_masa: 60 });
  };

  const handleAdd = async () => {
    if (!formData.angajat_id) {
      toast({ title: "Eroare", description: "Selectați un angajat.", variant: "destructive" });
      return;
    }
    try {
      const payload = {
        data: format(selectedDate, "dd/MM/yyyy"),
        angajat_id: parseInt(formData.angajat_id),
        prezenta: formData.prezenta,
        ora_start: formData.ora_start,
        ora_sfarsit: formData.ora_sfarsit,
        pauza_masa: formData.pauza_masa,
        total_ore: totalOreCalculate
      };
      const response = await fetch(`${API_BASE_URL}/pontaj/adauga`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast({ title: "Succes", description: "Pontaj adăugat cu succes." });
        setIsAddDialogOpen(false);
        resetForm();
        fetchPontaje();
      } else {
        toast({ title: "Eroare", description: "Nu s-a putut adăuga pontajul.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Eroare", description: "Eroare la adăugarea pontajului.", variant: "destructive" });
    }
  };

  const handleEdit = async () => {
    if (!editingPontaj) return;
    try {
      const payload = {
        tabel: "pontaj",
        id: editingPontaj.id,
        update: {
          angajat_id: parseInt(formData.angajat_id),
          prezenta: formData.prezenta,
          ora_start: formData.ora_start,
          ora_sfarsit: formData.ora_sfarsit,
          pauza_masa: formData.pauza_masa,
          total_ore: totalOreCalculate
        }
      };
      const response = await fetch(`${API_BASE_URL}/editeaza`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        toast({ title: "Succes", description: "Pontaj actualizat cu succes." });
        setIsEditDialogOpen(false);
        setEditingPontaj(null);
        resetForm();
        fetchPontaje();
      } else {
        toast({ title: "Eroare", description: "Nu s-a putut actualiza pontajul.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Eroare", description: "Eroare la actualizarea pontajului.", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const response = await fetch(`${API_BASE_URL}/sterge`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tabel: "pontaj", id: deletingId })
      });
      if (response.ok) {
        toast({ title: "Succes", description: "Pontaj șters cu succes." });
        setIsDeleteDialogOpen(false);
        setDeletingId(null);
        setViewingDetails(null);
        fetchPontaje();
      } else {
        toast({ title: "Eroare", description: "Nu s-a putut șterge pontajul.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Eroare", description: "Eroare la ștergerea pontajului.", variant: "destructive" });
    }
  };

  const openEditDialog = (pontaj: Pontaj) => {
    setEditingPontaj(pontaj);
    setFormData({
      angajat_id: String(pontaj.angajat_id),
      prezenta: pontaj.prezenta,
      ora_start: pontaj.ora_start,
      ora_sfarsit: pontaj.ora_sfarsit,
      pauza_masa: pontaj.pauza_masa
    });
    setIsEditDialogOpen(true);
  };

  const handleExport = () => {
    if (filteredAndSortedData.length === 0) {
      toast({ title: "Atenție", description: "Nu există date pentru export.", variant: "destructive" });
      return;
    }
    const exportColumns = [
      { key: "id" as const, label: "ID" },
      { key: "nume_angajat" as const, label: "Nume Angajat" },
      { key: "prezenta" as const, label: "Prezență" },
      { key: "ora_start" as const, label: "Ora Start" },
      { key: "ora_sfarsit" as const, label: "Ora Sfârșit" },
      { key: "pauza_masa" as const, label: "Pauză Masă (min)" },
      { key: "total_ore" as const, label: "Total Ore" }
    ];
    exportToCSV(filteredAndSortedData, `pontaj_${format(selectedDate, "dd-MM-yyyy")}`, exportColumns);
    toast({ title: "Succes", description: "Fișierul CSV a fost descărcat." });
  };

  const angajatiOptions = angajati.map(a => ({ value: String(a.id), label: a.nume }));

  const columns = [
    { key: "nume_angajat", label: "Angajat" },
    { key: "prezenta", label: "Prezență" },
    { key: "ora_start", label: "Start" },
    { key: "ora_sfarsit", label: "Sfârșit" },
    { key: "pauza_masa", label: "Pauză" },
    { key: "total_ore", label: "Total Ore" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <CalendarClock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Pontaj</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4">
        {/* Left - Calendar Card */}
        <Card className="h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Selectează Data</CardTitle>
            <CardDescription>Vizualizează pontajul</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto"
              locale={ro}
            />
          </CardContent>
        </Card>

        {/* Right - Table Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Evidența Pontajului</CardTitle>
                <CardDescription>
                  {format(selectedDate, "EEEE, d MMMM yyyy", { locale: ro })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredAndSortedData.length === 0}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-8">Se încarcă...</p>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader className="[&_tr]:border-0">
                      <TableRow className="border-0">
                        {columns.map((col) => (
                          <TableHead key={col.key} className="text-xs">
                            <div className="flex items-center gap-1">
                              <span>{col.label}</span>
                              <Popover open={activeFilterColumn === col.key} onOpenChange={(open) => setActiveFilterColumn(open ? col.key : null)}>
                                <PopoverTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-5 w-5 p-0 hover:bg-accent">
                                    <Filter className="h-3 w-3" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-48 p-2" align="start">
                                  <div className="space-y-2">
                                    <Input
                                      placeholder="Filtrare..."
                                      value={filters[col.key] || ""}
                                      onChange={(e) => setFilters({ ...filters, [col.key]: e.target.value })}
                                      className="h-8 text-sm"
                                    />
                                    <Button variant="outline" size="sm" className="h-7 text-xs w-full" onClick={() => { handleSort(col.key); setActiveFilterColumn(null); }}>
                                      {getSortIcon(col.key)}
                                      <span className="ml-1">Sort</span>
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                      <TableRow className="border-0">
                          <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8">
                            Nu există înregistrări pentru această dată.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((pontaj) => (
                          <TableRow key={pontaj.id} className="cursor-pointer hover:bg-muted/50 border-0" onClick={() => setViewingDetails(pontaj)}>
                            <TableCell className="text-sm">{pontaj.nume_angajat}</TableCell>
                            <TableCell className="text-sm">{pontaj.prezenta}</TableCell>
                            <TableCell className="text-sm">{pontaj.ora_start}</TableCell>
                            <TableCell className="text-sm">{pontaj.ora_sfarsit}</TableCell>
                            <TableCell className="text-sm">{pontaj.pauza_masa} min</TableCell>
                            <TableCell className="text-sm">{pontaj.total_ore}h</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredAndSortedData.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Afișează</span>
                      <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                        <SelectTrigger className="w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-sm text-muted-foreground">pe pagină</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        Anterior
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {currentPage} / {Math.max(1, totalPages)}
                      </span>
                      <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                        Următor
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adaugă Pontaj</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Angajat</Label>
              <FilterableSelect
                value={formData.angajat_id}
                onValueChange={(v) => setFormData({ ...formData, angajat_id: v })}
                options={angajatiOptions}
                placeholder="Selectează angajat"
                searchPlaceholder="Caută angajat..."
              />
            </div>
            <div className="space-y-2">
              <Label>Prezență</Label>
              <Select value={formData.prezenta} onValueChange={(v) => setFormData({ ...formData, prezenta: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREZENTA_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ora Start</Label>
                <Input type="time" value={formData.ora_start} onChange={(e) => setFormData({ ...formData, ora_start: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ora Sfârșit</Label>
                <Input type="time" value={formData.ora_sfarsit} onChange={(e) => setFormData({ ...formData, ora_sfarsit: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pauză Masă (minute)</Label>
              <Input type="number" value={formData.pauza_masa} onChange={(e) => setFormData({ ...formData, pauza_masa: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Total Ore Lucrate</Label>
              <Input value={totalOreCalculate} disabled className="bg-muted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleAdd}>Adaugă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editează Pontaj</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Angajat</Label>
              <FilterableSelect
                value={formData.angajat_id}
                onValueChange={(v) => setFormData({ ...formData, angajat_id: v })}
                options={angajatiOptions}
                placeholder="Selectează angajat"
                searchPlaceholder="Caută angajat..."
              />
            </div>
            <div className="space-y-2">
              <Label>Prezență</Label>
              <Select value={formData.prezenta} onValueChange={(v) => setFormData({ ...formData, prezenta: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PREZENTA_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ora Start</Label>
                <Input type="time" value={formData.ora_start} onChange={(e) => setFormData({ ...formData, ora_start: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ora Sfârșit</Label>
                <Input type="time" value={formData.ora_sfarsit} onChange={(e) => setFormData({ ...formData, ora_sfarsit: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pauză Masă (minute)</Label>
              <Input type="number" value={formData.pauza_masa} onChange={(e) => setFormData({ ...formData, pauza_masa: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-2">
              <Label>Total Ore Lucrate</Label>
              <Input value={totalOreCalculate} disabled className="bg-muted" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEdit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalii Pontaj</DialogTitle>
          </DialogHeader>
          {viewingDetails && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <Label className="text-muted-foreground text-xs">ID</Label>
                <p className="font-medium">{viewingDetails.id}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Angajat</Label>
                <p className="font-medium">{viewingDetails.nume_angajat}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Prezență</Label>
                <p className="font-medium">{viewingDetails.prezenta}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Data</Label>
                <p className="font-medium">{viewingDetails.data}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Ora Start</Label>
                <p className="font-medium">{viewingDetails.ora_start}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Ora Sfârșit</Label>
                <p className="font-medium">{viewingDetails.ora_sfarsit}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Pauză Masă</Label>
                <p className="font-medium">{viewingDetails.pauza_masa} min</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Total Ore</Label>
                <p className="font-medium">{viewingDetails.total_ore} ore</p>
              </div>
            </div>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { if (viewingDetails) openEditDialog(viewingDetails); setViewingDetails(null); }}>
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { if (viewingDetails) { setDeletingId(viewingDetails.id); setIsDeleteDialogOpen(true); } }}>
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Sunteți sigur că doriți să ștergeți acest pontaj? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
