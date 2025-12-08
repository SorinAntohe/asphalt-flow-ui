import { useState, useMemo } from "react";
import { Wrench, Plus, Download, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { exportToCSV } from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";

interface Mentenanta {
  id: number;
  cod: string;
  denumire: string;
  serie: string;
  producator: string;
  oreFunctionare: number;
  oreUltimaRevizie: number;
  dataUrmatoareRevizie: string;
  servisare: boolean;
  cost: number | null;
}

const mockMentenanta: Mentenanta[] = [
  {
    id: 1,
    cod: "EXC-001",
    denumire: "Excavator Komatsu PC210",
    serie: "KOM2024-1234",
    producator: "Komatsu",
    oreFunctionare: 2450,
    oreUltimaRevizie: 2200,
    dataUrmatoareRevizie: "15/01/2026",
    servisare: true,
    cost: 2500,
  },
  {
    id: 2,
    cod: "MIX-001",
    denumire: "Centrală asfalt Ammann 240t/h",
    serie: "AMM2023-5678",
    producator: "Ammann",
    oreFunctionare: 5200,
    oreUltimaRevizie: 5000,
    dataUrmatoareRevizie: "01/02/2026",
    servisare: false,
    cost: null,
  },
  {
    id: 3,
    cod: "CAM-003",
    denumire: "Camion MAN TGS 8x4",
    serie: "MAN2022-9012",
    producator: "MAN",
    oreFunctionare: 12500,
    oreUltimaRevizie: 12000,
    dataUrmatoareRevizie: "20/12/2025",
    servisare: true,
    cost: 3800,
  },
  {
    id: 4,
    cod: "FIN-001",
    denumire: "Finișer Vogele Super 1800",
    serie: "VOG2024-3456",
    producator: "Vogele",
    oreFunctionare: 890,
    oreUltimaRevizie: 750,
    dataUrmatoareRevizie: "10/03/2026",
    servisare: false,
    cost: null,
  },
  {
    id: 5,
    cod: "COM-001",
    denumire: "Compactor Bomag BW219",
    serie: "BOM2023-7890",
    producator: "Bomag",
    oreFunctionare: 1650,
    oreUltimaRevizie: 1500,
    dataUrmatoareRevizie: "05/01/2026",
    servisare: true,
    cost: 1200,
  },
];

const PlanMentenanta = () => {
  const [data, setData] = useState<Mentenanta[]>(mockMentenanta);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Mentenanta | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    cod: "",
    denumire: "",
    serie: "",
    producator: "",
    oreFunctionare: "",
    oreUltimaRevizie: "",
    dataUrmatoareRevizie: "",
    servisare: false,
    cost: "",
  });

  const handleExport = () => {
    const exportData = data.map(item => ({
      cod: item.cod,
      denumire: item.denumire,
      serie: item.serie,
      producator: item.producator,
      ore_functionare: item.oreFunctionare,
      ore_ultima_revizie: item.oreUltimaRevizie,
      data_urmatoare_revizie: item.dataUrmatoareRevizie,
      servisare: item.servisare ? "Da" : "Nu",
      cost: item.cost ?? "",
    }));

    const columns = [
      { key: "cod" as const, label: "Cod" },
      { key: "denumire" as const, label: "Denumire" },
      { key: "serie" as const, label: "Serie" },
      { key: "producator" as const, label: "Producător" },
      { key: "ore_functionare" as const, label: "Ore Funcționare" },
      { key: "ore_ultima_revizie" as const, label: "Ore Ultimă Revizie" },
      { key: "data_urmatoare_revizie" as const, label: "Data Următoare Revizie" },
      { key: "servisare" as const, label: "Servisare" },
      { key: "cost" as const, label: "Cost" },
    ];

    exportToCSV(exportData, "plan_mentenanta", columns);
  };

  const resetForm = () => {
    setFormData({
      cod: "",
      denumire: "",
      serie: "",
      producator: "",
      oreFunctionare: "",
      oreUltimaRevizie: "",
      dataUrmatoareRevizie: "",
      servisare: false,
      cost: "",
    });
  };

  const handleAddSubmit = () => {
    const newItem: Mentenanta = {
      id: Math.max(...data.map(d => d.id)) + 1,
      cod: formData.cod,
      denumire: formData.denumire,
      serie: formData.serie,
      producator: formData.producator,
      oreFunctionare: Number(formData.oreFunctionare),
      oreUltimaRevizie: Number(formData.oreUltimaRevizie),
      dataUrmatoareRevizie: formData.dataUrmatoareRevizie,
      servisare: formData.servisare,
      cost: formData.servisare ? Number(formData.cost) : null,
    };
    setData(prev => [...prev, newItem]);
    setIsAddDialogOpen(false);
    resetForm();
    toast({ title: "Succes", description: "Înregistrare adăugată cu succes." });
  };

  const handleOpenEdit = (item: Mentenanta) => {
    setSelectedItem(item);
    setFormData({
      cod: item.cod,
      denumire: item.denumire,
      serie: item.serie,
      producator: item.producator,
      oreFunctionare: String(item.oreFunctionare),
      oreUltimaRevizie: String(item.oreUltimaRevizie),
      dataUrmatoareRevizie: item.dataUrmatoareRevizie,
      servisare: item.servisare,
      cost: item.cost !== null ? String(item.cost) : "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (!selectedItem) return;
    setData(prev =>
      prev.map(item =>
        item.id === selectedItem.id
          ? {
              ...item,
              cod: formData.cod,
              denumire: formData.denumire,
              serie: formData.serie,
              producator: formData.producator,
              oreFunctionare: Number(formData.oreFunctionare),
              oreUltimaRevizie: Number(formData.oreUltimaRevizie),
              dataUrmatoareRevizie: formData.dataUrmatoareRevizie,
              servisare: formData.servisare,
              cost: formData.servisare ? Number(formData.cost) : null,
            }
          : item
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
    toast({ title: "Succes", description: "Înregistrare actualizată cu succes." });
  };

  const handleOpenDelete = (item: Mentenanta) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    setData(prev => prev.filter(item => item.id !== selectedItem.id));
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    toast({ title: "Succes", description: "Înregistrare ștearsă cu succes." });
  };

  const renderForm = () => (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="cod">Cod</Label>
          <Input
            id="cod"
            value={formData.cod}
            onChange={e => setFormData(prev => ({ ...prev, cod: e.target.value }))}
            placeholder="ex: EXC-001"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="denumire">Denumire</Label>
          <Input
            id="denumire"
            value={formData.denumire}
            onChange={e => setFormData(prev => ({ ...prev, denumire: e.target.value }))}
            placeholder="ex: Excavator Komatsu PC210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="serie">Serie</Label>
          <Input
            id="serie"
            value={formData.serie}
            onChange={e => setFormData(prev => ({ ...prev, serie: e.target.value }))}
            placeholder="ex: KOM2024-1234"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="producator">Producător</Label>
          <Input
            id="producator"
            value={formData.producator}
            onChange={e => setFormData(prev => ({ ...prev, producator: e.target.value }))}
            placeholder="ex: Komatsu"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="oreFunctionare">Ore Funcționare</Label>
          <Input
            id="oreFunctionare"
            type="number"
            value={formData.oreFunctionare}
            onChange={e => setFormData(prev => ({ ...prev, oreFunctionare: e.target.value }))}
            placeholder="ex: 2450"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="oreUltimaRevizie">Ore Ultimă Revizie</Label>
          <Input
            id="oreUltimaRevizie"
            type="number"
            value={formData.oreUltimaRevizie}
            onChange={e => setFormData(prev => ({ ...prev, oreUltimaRevizie: e.target.value }))}
            placeholder="ex: 2200"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dataUrmatoareRevizie">Data Următoare Revizie</Label>
        <Input
          id="dataUrmatoareRevizie"
          value={formData.dataUrmatoareRevizie}
          onChange={e => setFormData(prev => ({ ...prev, dataUrmatoareRevizie: e.target.value }))}
          placeholder="ex: 15/01/2026"
        />
      </div>

      <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
        <div className="grid gap-1">
          <Label htmlFor="servisare">Servisare</Label>
          <p className="text-sm text-muted-foreground">Activează dacă echipamentul necesită servisare</p>
        </div>
        <Switch
          id="servisare"
          checked={formData.servisare}
          onCheckedChange={checked => setFormData(prev => ({ ...prev, servisare: checked }))}
        />
      </div>

      {formData.servisare && (
        <div className="grid gap-2">
          <Label htmlFor="cost">Cost Servisare (RON)</Label>
          <Input
            id="cost"
            type="number"
            value={formData.cost}
            onChange={e => setFormData(prev => ({ ...prev, cost: e.target.value }))}
            placeholder="ex: 2500"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Wrench className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Plan Mentenanță</h1>
            <p className="text-muted-foreground">Gestionare mentenanță echipamente și flotă</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={data.length === 0} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Empty State / Content Placeholder */}
      <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-lg">
        <Wrench className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">Plan Mentenanță</h3>
        <p className="text-muted-foreground mt-1">Funcționalitate în dezvoltare</p>
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Înregistrare</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleAddSubmit}>Adaugă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-lg" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Editează Înregistrare</DialogTitle>
          </DialogHeader>
          {renderForm()}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Anulează</Button>
            <Button onClick={handleEditSubmit}>Salvează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmare ștergere</AlertDialogTitle>
            <AlertDialogDescription>
              Ești sigur că vrei să ștergi înregistrarea "{selectedItem?.cod}"? Această acțiune nu poate fi anulată.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Șterge
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanMentenanta;
