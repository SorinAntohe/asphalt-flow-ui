import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { TimePicker } from "@/components/ui/time-picker";
import { TableFilterPopover } from "@/components/ui/table-filter-popover";
import { CalendarClock, Plus, Download, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { exportToCSV } from "@/lib/exportUtils";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { cn, toSelectOptions } from "@/lib/utils";

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
  zile_concediu: number;
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
    ora_start: "08:30",
    ora_sfarsit: "17:30",
    pauza_masa: 60
  });

  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchAngajati = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/liste/returneaza/angajati`);
        if (response.ok) {
          const data = await response.json();
          // Handle tuple format if needed
          const processed = Array.isArray(data) ? data.map((item: any) => ({
            id: item.id,
            nume: typeof item.nume === 'string' ? item.nume : (Array.isArray(item.nume) ? item.nume[0] : String(item.nume || ''))
          })) : [];
          setAngajati(processed);
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

  const handleSort = useCallback((column: string) => (direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
  }, []);

  const handleFilterChange = useCallback((column: string) => (value: string) => {
    setFilters(prev => ({ ...prev, [column]: value }));
  }, []);

  const handleResetFilter = useCallback((column: string) => () => {
    setFilters(prev => ({ ...prev, [column]: '' }));
    if (sortColumn === column) {
      setSortColumn(null);
      setSortDirection(null);
    }
  }, [sortColumn]);

  const resetForm = () => {
    setFormData({ angajat_id: "", prezenta: "Prezent", ora_start: "08:30", ora_sfarsit: "17:30", pauza_masa: 60 });
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
      { key: "total_ore" as const, label: "Total Ore" },
      { key: "zile_concediu" as const, label: "Zile Concediu" }
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
    { key: "total_ore", label: "Total Ore" },
    { key: "zile_concediu", label: "Zile Concediu" }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Pontaj</h1>
            <p className="text-sm text-muted-foreground hidden sm:block">Gestionare prezență angajați</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
        {/* Left - Calendar Card */}
        <Card className="h-fit">
          <CardHeader className="pb-2 px-3 sm:px-6">
            <CardTitle className="text-base sm:text-lg">Selectează Data</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Vizualizează pontajul</CardDescription>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pb-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="pointer-events-auto mx-auto"
              locale={ro}
            />
          </CardContent>
        </Card>

        {/* Right - Table Card */}
        <Card>
          <CardHeader className="pb-3 px-3 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">Evidența Pontajului</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {format(selectedDate, "EEEE, d MMMM yyyy", { locale: ro })}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport} disabled={filteredAndSortedData.length === 0}>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Export</span>
                </Button>
                <Button size="sm" onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Adaugă</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:px-6">
            {loading ? (
              <p className="text-muted-foreground text-center py-8 text-sm">Se încarcă...</p>
            ) : (
              <>
                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <Table>
                    <TableHeader className="[&_tr]:border-b bg-muted/30">
                      <TableRow className="border-b hover:bg-transparent">
                        {columns.map((col) => (
                          <TableFilterPopover
                            key={col.key}
                            field={col.key}
                            label={col.label}
                            filterValue={filters[col.key] || ''}
                            onFilterChange={handleFilterChange(col.key)}
                            sortField={sortColumn}
                            sortDirection={sortDirection}
                            onSort={handleSort(col.key)}
                            onReset={handleResetFilter(col.key)}
                          />
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedData.length === 0 ? (
                      <TableRow className="border-0">
                          <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-8 text-sm">
                            Nu există înregistrări pentru această dată.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData.map((pontaj) => (
                          <TableRow key={pontaj.id} className="cursor-pointer hover:bg-muted/50 border-0" onClick={() => setViewingDetails(pontaj)}>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{pontaj.nume_angajat}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">
                              <span className="hidden sm:inline">{pontaj.prezenta}</span>
                              <span className="sm:hidden">{pontaj.prezenta.substring(0, 3)}.</span>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{pontaj.ora_start}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{pontaj.ora_sfarsit}</TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{pontaj.pauza_masa}<span className="hidden sm:inline"> min</span></TableCell>
                            <TableCell className="text-xs sm:text-sm px-2 sm:px-4">{pontaj.total_ore}h</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {filteredAndSortedData.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <span className="text-muted-foreground hidden sm:inline">Afișează</span>
                      <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
                        <SelectTrigger className="w-14 sm:w-16 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 20, 50].map((n) => (
                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-muted-foreground">/pagină</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                        <span className="hidden sm:inline">Anterior</span>
                        <span className="sm:hidden">←</span>
                      </Button>
                      <span className="text-xs sm:text-sm text-muted-foreground min-w-[60px] text-center">
                        {currentPage} / {Math.max(1, totalPages)}
                      </span>
                      <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
                        <span className="hidden sm:inline">Următor</span>
                        <span className="sm:hidden">→</span>
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
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Adaugă Pontaj</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Angajat</Label>
              <FilterableSelect
                value={formData.angajat_id}
                onValueChange={(v) => setFormData({ ...formData, angajat_id: v })}
                options={angajatiOptions}
                placeholder="Selectează angajat"
                searchPlaceholder="Caută angajat..."
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Prezență</Label>
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Ora Start</Label>
                <TimePicker value={formData.ora_start} onChange={(v) => setFormData({ ...formData, ora_start: v })} />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Ora Sfârșit</Label>
                <TimePicker 
                  value={formData.ora_sfarsit} 
                  onChange={(v) => {
                    if (v >= formData.ora_start) {
                      setFormData({ ...formData, ora_sfarsit: v });
                    } else {
                      toast({ title: "Atenție", description: "Ora de sfârșit nu poate fi mai mică decât ora de start.", variant: "destructive" });
                    }
                  }} 
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Pauză Masă (minute)</Label>
              <Input type="number" value={formData.pauza_masa} onChange={(e) => setFormData({ ...formData, pauza_masa: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Total Ore Lucrate</Label>
              <Input value={totalOreCalculate} disabled className="bg-muted" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="w-full sm:w-auto">Anulează</Button>
            <Button onClick={handleAdd} className="w-full sm:w-auto">Adaugă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">Editează Pontaj</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Angajat</Label>
              <FilterableSelect
                value={formData.angajat_id}
                onValueChange={(v) => setFormData({ ...formData, angajat_id: v })}
                options={angajatiOptions}
                placeholder="Selectează angajat"
                searchPlaceholder="Caută angajat..."
              />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Prezență</Label>
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
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Ora Start</Label>
                <TimePicker value={formData.ora_start} onChange={(v) => setFormData({ ...formData, ora_start: v })} />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-sm">Ora Sfârșit</Label>
                <TimePicker 
                  value={formData.ora_sfarsit} 
                  onChange={(v) => {
                    if (v >= formData.ora_start) {
                      setFormData({ ...formData, ora_sfarsit: v });
                    } else {
                      toast({ title: "Atenție", description: "Ora de sfârșit nu poate fi mai mică decât ora de start.", variant: "destructive" });
                    }
                  }} 
                />
              </div>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Pauză Masă (minute)</Label>
              <Input type="number" value={formData.pauza_masa} onChange={(e) => setFormData({ ...formData, pauza_masa: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm">Total Ore Lucrate</Label>
              <Input value={totalOreCalculate} disabled className="bg-muted" />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full sm:w-auto">Anulează</Button>
            <Button onClick={handleEdit} className="w-full sm:w-auto">Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={!!viewingDetails} onOpenChange={() => setViewingDetails(null)}>
        <DialogContent className="w-[95vw] max-w-md max-h-[90vh] overflow-y-auto p-0" hideCloseButton>
          <DialogHeader className="px-5 pt-4 pb-2">
            <DialogTitle className="text-base">Detalii Pontaj</DialogTitle>
          </DialogHeader>
          {viewingDetails && (
            <div className="px-5 py-3 grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">ID</Label>
                <p className="text-sm font-medium">{viewingDetails.id}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Angajat</Label>
                <p className="text-sm font-medium truncate">{viewingDetails.nume_angajat}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Prezență</Label>
                <p className="text-sm font-medium">{viewingDetails.prezenta}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Data</Label>
                <p className="text-sm font-medium">{viewingDetails.data}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ora Start</Label>
                <p className="text-sm font-medium">{viewingDetails.ora_start}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ora Sfârșit</Label>
                <p className="text-sm font-medium">{viewingDetails.ora_sfarsit}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Pauză Masă</Label>
                <p className="text-sm font-medium">{viewingDetails.pauza_masa} min</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total Ore</Label>
                <p className="text-sm font-medium">{viewingDetails.total_ore} ore</p>
              </div>
            </div>
          )}
          <DialogFooter className="px-5 py-3 flex-col sm:flex-row gap-2">
            <Button variant="outline" size="sm" onClick={() => { if (viewingDetails) openEditDialog(viewingDetails); setViewingDetails(null); }} className="w-full sm:w-auto">
              <Pencil className="w-4 h-4 mr-2" />
              Editează
            </Button>
            <Button variant="destructive" size="sm" onClick={() => { if (viewingDetails) { setDeletingId(viewingDetails.id); setIsDeleteDialogOpen(true); } }} className="w-full sm:w-auto">
              <Trash2 className="w-4 h-4 mr-2" />
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Sunteți sigur că doriți să ștergeți acest pontaj? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
