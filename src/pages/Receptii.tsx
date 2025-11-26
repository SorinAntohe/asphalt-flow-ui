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
import { z } from "zod";

interface ReceptieMaterial {
  id: number;
  data: string;
  cod: string;
  nr_aviz_provizoriu: string;
  nr_aviz_intrare: string;
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
  data: z.string().trim().min(1, "Data este obligatorie"),
  cod: z.string().trim().min(1, "Codul este obligatoriu").max(10),
  nr_aviz_provizoriu: z.string().trim().max(10).optional(),
  nr_aviz_intrare: z.string().trim().max(10).optional(),
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
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [openAddEdit, setOpenAddEdit] = useState(false);
  const [editing, setEditing] = useState<ReceptieMaterial | null>(null);
  const [deleting, setDeleting] = useState<ReceptieMaterial | null>(null);
  
  // Form state
  const [form, setForm] = useState({
    data: "",
    cod: "",
    nr_aviz_provizoriu: "",
    nr_aviz_intrare: "",
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

  // Filters
  const [filters, setFilters] = useState({
    id: "", data: "", cod: "", nr_aviz_provizoriu: "", nr_aviz_intrare: "",
    nume_sofer: "", nr_inmatriculare: "", tip_masina: "", cantitate_livrata: "",
    cantitate_receptionata: "", diferenta: "", pret_material_total: "",
    pret_total: "", pret_transport_total: "", observatii: ""
  });

  // Sort
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  // Fetch data from API
  const fetchReceptii = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.22:8002/receptii/returneaza/materiale');
      if (!response.ok) {
        throw new Error('Failed to fetch receptii');
      }
      const data = await response.json();
      setReceptii(data);
    } catch (error) {
      console.error('Error fetching receptii:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca recepțiile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReceptii();
  }, []);

  // Calculate diferenta when cantitate values change
  useEffect(() => {
    const diferenta = form.cantitate_livrata - form.cantitate_receptionata;
    setForm(prev => ({ ...prev, diferenta }));
  }, [form.cantitate_livrata, form.cantitate_receptionata]);

  // Add/Edit handlers
  const handleOpenAdd = () => {
    setEditing(null);
    setForm({
      data: "",
      cod: "",
      nr_aviz_provizoriu: "",
      nr_aviz_intrare: "",
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
      nr_aviz_provizoriu: receptie.nr_aviz_provizoriu || "",
      nr_aviz_intrare: receptie.nr_aviz_intrare || "",
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
        // Edit
        const response = await fetch('http://192.168.1.22:8002/editeaza', {
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
        // Add
        const response = await fetch('http://192.168.1.22:8002/receptii/adauga/material', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(validatedData)
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
      const response = await fetch('http://192.168.1.22:8002/sterge', {
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
        item.data.toLowerCase().includes(filters.data.toLowerCase()) &&
        item.cod.toLowerCase().includes(filters.cod.toLowerCase()) &&
        (item.nr_aviz_provizoriu || '').toLowerCase().includes(filters.nr_aviz_provizoriu.toLowerCase()) &&
        (item.nr_aviz_intrare || '').toLowerCase().includes(filters.nr_aviz_intrare.toLowerCase()) &&
        item.nume_sofer.toLowerCase().includes(filters.nume_sofer.toLowerCase()) &&
        item.nr_inmatriculare.toLowerCase().includes(filters.nr_inmatriculare.toLowerCase()) &&
        item.tip_masina.toLowerCase().includes(filters.tip_masina.toLowerCase()) &&
        item.cantitate_livrata.toString().includes(filters.cantitate_livrata) &&
        item.cantitate_receptionata.toString().includes(filters.cantitate_receptionata) &&
        item.diferenta.toString().includes(filters.diferenta) &&
        item.pret_material_total.toString().includes(filters.pret_material_total) &&
        item.pret_total.toString().includes(filters.pret_total) &&
        item.pret_transport_total.toString().includes(filters.pret_transport_total) &&
        (item.observatii || '').toLowerCase().includes(filters.observatii.toLowerCase())
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

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const FilterHeader = ({ field, label }: { field: keyof typeof filters; label: string }) => (
    <TableHead>
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer hover:text-primary">
            <span>{label}</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56">
          <div className="space-y-2">
            <div>
              <Label>Filtrează</Label>
              <Input
                value={filters[field]}
                onChange={(e) => setFilters({ ...filters, [field]: e.target.value })}
                placeholder={`Caută ${label.toLowerCase()}...`}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1"
              >
                Cresc.
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSort(field)}
                className="flex-1"
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
          <CardTitle>Lista Recepții</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <FilterHeader field="id" label="ID" />
                  <FilterHeader field="data" label="Data" />
                  <FilterHeader field="cod" label="Cod" />
                  <FilterHeader field="nr_aviz_provizoriu" label="Nr. Aviz Provizoriu" />
                  <FilterHeader field="nr_aviz_intrare" label="Nr. Aviz Intrare" />
                  <FilterHeader field="nume_sofer" label="Nume Șofer" />
                  <FilterHeader field="nr_inmatriculare" label="Nr. Înmatriculare" />
                  <FilterHeader field="tip_masina" label="Tip Mașină" />
                  <FilterHeader field="cantitate_livrata" label="Cant. Livrată" />
                  <FilterHeader field="cantitate_receptionata" label="Cant. Recepționată" />
                  <FilterHeader field="diferenta" label="Diferență" />
                  <FilterHeader field="pret_material_total" label="Preț Material" />
                  <FilterHeader field="pret_total" label="Preț Total" />
                  <FilterHeader field="pret_transport_total" label="Preț Transport" />
                  <FilterHeader field="observatii" label="Observații" />
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={16} className="text-center py-8">
                      Se încarcă...
                    </TableCell>
                  </TableRow>
                ) : filteredAndSorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={16} className="text-center py-8">
                      Nu există recepții înregistrate
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSorted.map((receptie) => (
                    <TableRow key={receptie.id}>
                      <TableCell>{receptie.id}</TableCell>
                      <TableCell>{receptie.data}</TableCell>
                      <TableCell>{receptie.cod}</TableCell>
                      <TableCell>{receptie.nr_aviz_provizoriu || "-"}</TableCell>
                      <TableCell>{receptie.nr_aviz_intrare || "-"}</TableCell>
                      <TableCell>{receptie.nume_sofer}</TableCell>
                      <TableCell>{receptie.nr_inmatriculare}</TableCell>
                      <TableCell>{receptie.tip_masina}</TableCell>
                      <TableCell>{receptie.cantitate_livrata}</TableCell>
                      <TableCell>{receptie.cantitate_receptionata}</TableCell>
                      <TableCell>{receptie.diferenta}</TableCell>
                      <TableCell>{receptie.pret_material_total}</TableCell>
                      <TableCell>{receptie.pret_total}</TableCell>
                      <TableCell>{receptie.pret_transport_total}</TableCell>
                      <TableCell className="max-w-xs truncate">{receptie.observatii || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(receptie)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleting(receptie)}
                            className="text-red-700 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              <div className="grid gap-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  className={formErrors.data ? "border-destructive" : ""}
                />
                {formErrors.data && <p className="text-sm text-destructive">{formErrors.data}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cod">Cod *</Label>
                <Input
                  id="cod"
                  value={form.cod}
                  onChange={(e) => setForm({ ...form, cod: e.target.value })}
                  className={formErrors.cod ? "border-destructive" : ""}
                />
                {formErrors.cod && <p className="text-sm text-destructive">{formErrors.cod}</p>}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nume_sofer">Nume Șofer *</Label>
                <Input
                  id="nume_sofer"
                  value={form.nume_sofer}
                  onChange={(e) => setForm({ ...form, nume_sofer: e.target.value })}
                  className={formErrors.nume_sofer ? "border-destructive" : ""}
                />
                {formErrors.nume_sofer && <p className="text-sm text-destructive">{formErrors.nume_sofer}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nr_inmatriculare">Nr. Înmatriculare *</Label>
                <Input
                  id="nr_inmatriculare"
                  value={form.nr_inmatriculare}
                  onChange={(e) => setForm({ ...form, nr_inmatriculare: e.target.value })}
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
                onChange={(e) => setForm({ ...form, tip_masina: e.target.value })}
                className={formErrors.tip_masina ? "border-destructive" : ""}
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
                  onChange={(e) => setForm({ ...form, cantitate_livrata: parseFloat(e.target.value) || 0 })}
                  className={formErrors.cantitate_livrata ? "border-destructive" : ""}
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
                  onChange={(e) => setForm({ ...form, pret_material_total: parseFloat(e.target.value) || 0 })}
                  className={formErrors.pret_material_total ? "border-destructive" : ""}
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
                  onChange={(e) => setForm({ ...form, pret_transport_total: parseFloat(e.target.value) || 0 })}
                  className={formErrors.pret_transport_total ? "border-destructive" : ""}
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
                  onChange={(e) => setForm({ ...form, pret_total: parseFloat(e.target.value) || 0 })}
                  className={formErrors.pret_total ? "border-destructive" : ""}
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
