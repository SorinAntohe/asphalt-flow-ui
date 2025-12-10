import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface ListeClient {
  id: number;
  denumire: string;
  cui: string;
  sediu: string;
  nr_reg?: string;
}

// Add Factura Client Dialog
interface AddFacturaClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFacturaClientDialog = ({ open, onOpenChange }: AddFacturaClientDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nr_factura: "",
    data: "",
    client: "",
    total_fara_tva: "",
    tva: "",
    data_scadenta: "",
  });

  const handleSubmit = () => {
    toast({ title: "Factură adăugată", description: "Factura a fost adăugată cu succes." });
    onOpenChange(false);
    setFormData({ nr_factura: "", data: "", client: "", total_fara_tva: "", tva: "", data_scadenta: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Factură Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nr Factură</Label>
              <Input value={formData.nr_factura} onChange={(e) => setFormData(prev => ({ ...prev, nr_factura: e.target.value }))} placeholder="FC-001" />
            </div>
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={formData.client} onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))} placeholder="Nume client" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total fără TVA (RON)</Label>
              <Input type="number" value={formData.total_fara_tva} onChange={(e) => setFormData(prev => ({ ...prev, total_fara_tva: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>TVA (RON)</Label>
              <Input type="number" value={formData.tva} onChange={(e) => setFormData(prev => ({ ...prev, tva: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Dată scadență</Label>
            <Input type="date" value={formData.data_scadenta} onChange={(e) => setFormData(prev => ({ ...prev, data_scadenta: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Livrare Dialog
interface AddLivrareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLivrareDialog = ({ open, onOpenChange }: AddLivrareDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cod: "",
    nr_aviz: "",
    data: "",
    client: "",
    produs: "",
    cantitate: "",
    valoare_produs: "",
    valoare_transport: "",
  });

  const handleSubmit = () => {
    toast({ title: "Livrare adăugată", description: "Livrarea a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Livrare</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cod</Label>
              <Input value={formData.cod} onChange={(e) => setFormData(prev => ({ ...prev, cod: e.target.value }))} placeholder="LIV-001" />
            </div>
            <div className="space-y-2">
              <Label>Nr Aviz</Label>
              <Input value={formData.nr_aviz} onChange={(e) => setFormData(prev => ({ ...prev, nr_aviz: e.target.value }))} placeholder="AV-001" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Client</Label>
              <Input value={formData.client} onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))} placeholder="Nume client" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Produs</Label>
              <Input value={formData.produs} onChange={(e) => setFormData(prev => ({ ...prev, produs: e.target.value }))} placeholder="BA 16" />
            </div>
            <div className="space-y-2">
              <Label>Cantitate (t)</Label>
              <Input type="number" value={formData.cantitate} onChange={(e) => setFormData(prev => ({ ...prev, cantitate: e.target.value }))} placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Valoare produs (RON)</Label>
              <Input type="number" value={formData.valoare_produs} onChange={(e) => setFormData(prev => ({ ...prev, valoare_produs: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Valoare transport (RON)</Label>
              <Input type="number" value={formData.valoare_transport} onChange={(e) => setFormData(prev => ({ ...prev, valoare_transport: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Incasare Dialog
interface AddIncasareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddIncasareDialog = ({ open, onOpenChange }: AddIncasareDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    data: "",
    client: "",
    tip: "OP",
    suma_totala: "",
  });

  const handleSubmit = () => {
    toast({ title: "Încasare adăugată", description: "Încasarea a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Încasare</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tip plată</Label>
              <Select value={formData.tip} onValueChange={(val) => setFormData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="OP">OP</SelectItem>
                  <SelectItem value="Numerar">Numerar</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="CEC">CEC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={formData.client} onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))} placeholder="Nume client" />
          </div>
          <div className="space-y-2">
            <Label>Sumă totală (RON)</Label>
            <Input type="number" value={formData.suma_totala} onChange={(e) => setFormData(prev => ({ ...prev, suma_totala: e.target.value }))} placeholder="0.00" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Factura Furnizor Dialog
interface AddFacturaFurnizorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFacturaFurnizorDialog = ({ open, onOpenChange }: AddFacturaFurnizorDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nr_factura: "",
    data: "",
    furnizor: "",
    total_fara_tva: "",
    tva: "",
    data_scadenta: "",
  });

  const handleSubmit = () => {
    toast({ title: "Factură adăugată", description: "Factura furnizor a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Factură Furnizor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nr Factură</Label>
              <Input value={formData.nr_factura} onChange={(e) => setFormData(prev => ({ ...prev, nr_factura: e.target.value }))} placeholder="FF-001" />
            </div>
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Furnizor</Label>
            <Input value={formData.furnizor} onChange={(e) => setFormData(prev => ({ ...prev, furnizor: e.target.value }))} placeholder="Nume furnizor" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total fără TVA (RON)</Label>
              <Input type="number" value={formData.total_fara_tva} onChange={(e) => setFormData(prev => ({ ...prev, total_fara_tva: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>TVA (RON)</Label>
              <Input type="number" value={formData.tva} onChange={(e) => setFormData(prev => ({ ...prev, tva: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Dată scadență</Label>
            <Input type="date" value={formData.data_scadenta} onChange={(e) => setFormData(prev => ({ ...prev, data_scadenta: e.target.value }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Receptie Dialog
interface AddReceptieDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddReceptieDialog = ({ open, onOpenChange }: AddReceptieDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cod: "",
    data: "",
    furnizor: "",
    material: "",
    cantitate_receptionata: "",
    pret_material_total: "",
    pret_transport_total: "",
    nr_factura: "",
  });

  const handleSubmit = () => {
    toast({ title: "Recepție adăugată", description: "Recepția a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Recepție</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cod</Label>
              <Input value={formData.cod} onChange={(e) => setFormData(prev => ({ ...prev, cod: e.target.value }))} placeholder="REC-001" />
            </div>
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Furnizor</Label>
              <Input value={formData.furnizor} onChange={(e) => setFormData(prev => ({ ...prev, furnizor: e.target.value }))} placeholder="Nume furnizor" />
            </div>
            <div className="space-y-2">
              <Label>Material</Label>
              <Input value={formData.material} onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))} placeholder="0/4 NAT" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cantitate recepționată (t)</Label>
            <Input type="number" value={formData.cantitate_receptionata} onChange={(e) => setFormData(prev => ({ ...prev, cantitate_receptionata: e.target.value }))} placeholder="0" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Preț material total (RON)</Label>
              <Input type="number" value={formData.pret_material_total} onChange={(e) => setFormData(prev => ({ ...prev, pret_material_total: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Preț transport total (RON)</Label>
              <Input type="number" value={formData.pret_transport_total} onChange={(e) => setFormData(prev => ({ ...prev, pret_transport_total: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nr Factură (opțional)</Label>
            <Input value={formData.nr_factura} onChange={(e) => setFormData(prev => ({ ...prev, nr_factura: e.target.value }))} placeholder="FF-001" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Cont Bancar Dialog
interface AddContBancarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddContBancarDialog = ({ open, onOpenChange }: AddContBancarDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    banca: "",
    iban: "",
    moneda: "RON",
    sold_curent: "",
  });

  const handleSubmit = () => {
    toast({ title: "Cont adăugat", description: "Contul bancar a fost adăugat cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Cont Bancar</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Bancă</Label>
            <Input value={formData.banca} onChange={(e) => setFormData(prev => ({ ...prev, banca: e.target.value }))} placeholder="BCR" />
          </div>
          <div className="space-y-2">
            <Label>IBAN</Label>
            <Input value={formData.iban} onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))} placeholder="RO00XXXX0000000000000000" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Monedă</Label>
              <Select value={formData.moneda} onValueChange={(val) => setFormData(prev => ({ ...prev, moneda: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="RON">RON</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sold curent</Label>
              <Input type="number" value={formData.sold_curent} onChange={(e) => setFormData(prev => ({ ...prev, sold_curent: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Miscare Banca Dialog
interface AddMiscareBancaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddMiscareBancaDialog = ({ open, onOpenChange }: AddMiscareBancaDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    data: "",
    cont_bancar: "",
    tip: "Încasare",
    partener: "",
    suma: "",
    document_asociat: "",
  });

  const handleSubmit = () => {
    toast({ title: "Mișcare adăugată", description: "Mișcarea bancară a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Mișcare Bancă</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={formData.tip} onValueChange={(val) => setFormData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Încasare">Încasare</SelectItem>
                  <SelectItem value="Plată">Plată</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Cont bancar</Label>
            <Input value={formData.cont_bancar} onChange={(e) => setFormData(prev => ({ ...prev, cont_bancar: e.target.value }))} placeholder="BCR RON" />
          </div>
          <div className="space-y-2">
            <Label>Partener</Label>
            <Input value={formData.partener} onChange={(e) => setFormData(prev => ({ ...prev, partener: e.target.value }))} placeholder="Nume partener" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sumă (RON)</Label>
              <Input type="number" value={formData.suma} onChange={(e) => setFormData(prev => ({ ...prev, suma: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Document asociat</Label>
              <Input value={formData.document_asociat} onChange={(e) => setFormData(prev => ({ ...prev, document_asociat: e.target.value }))} placeholder="FC-001" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Registru Casa Dialog
interface AddRegistruCasaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddRegistruCasaDialog = ({ open, onOpenChange }: AddRegistruCasaDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    data: "",
    tip: "Încasare",
    partener: "",
    suma: "",
    document_asociat: "",
  });

  const handleSubmit = () => {
    toast({ title: "Înregistrare adăugată", description: "Înregistrarea casă a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Înregistrare Casă</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Tip</Label>
              <Select value={formData.tip} onValueChange={(val) => setFormData(prev => ({ ...prev, tip: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Încasare">Încasare</SelectItem>
                  <SelectItem value="Plată">Plată</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Partener</Label>
            <Input value={formData.partener} onChange={(e) => setFormData(prev => ({ ...prev, partener: e.target.value }))} placeholder="Nume partener" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sumă (RON)</Label>
              <Input type="number" value={formData.suma} onChange={(e) => setFormData(prev => ({ ...prev, suma: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Document asociat</Label>
              <Input value={formData.document_asociat} onChange={(e) => setFormData(prev => ({ ...prev, document_asociat: e.target.value }))} placeholder="FC-001" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Client Dialog
interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientDialog = ({ open, onOpenChange }: AddClientDialogProps) => {
  const { toast } = useToast();
  const [clientiListe, setClientiListe] = useState<ListeClient[]>([]);
  const [formData, setFormData] = useState({
    nume: "",
    cui: "",
    adresa: "",
    sold_curent: "",
    zile_intarziere_max: "",
  });

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/liste/returneaza/clienti`)
        .then(res => res.json())
        .then(data => setClientiListe(data || []))
        .catch(() => setClientiListe([]));
    }
  }, [open]);

  const handleClientSelect = (clientNume: string) => {
    const selectedClient = clientiListe.find(c => c.denumire === clientNume);
    if (selectedClient) {
      setFormData(prev => ({
        ...prev,
        nume: selectedClient.denumire,
        cui: selectedClient.cui || "",
        adresa: selectedClient.sediu || "",
      }));
    } else {
      setFormData(prev => ({ ...prev, nume: clientNume }));
    }
  };

  const handleSubmit = () => {
    toast({ title: "Client adăugat", description: "Clientul a fost adăugat cu succes." });
    onOpenChange(false);
    setFormData({ nume: "", cui: "", adresa: "", sold_curent: "", zile_intarziere_max: "" });
  };

  const clientOptions = clientiListe.map(c => ({ value: c.denumire, label: c.denumire }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Client</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nume Client</Label>
            <FilterableSelect
              options={clientOptions}
              value={formData.nume}
              onValueChange={handleClientSelect}
              placeholder="Selectează client..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CUI</Label>
              <Input value={formData.cui} readOnly className="bg-muted" placeholder="Autocompletat" />
            </div>
            <div className="space-y-2">
              <Label>Adresă</Label>
              <Input value={formData.adresa} readOnly className="bg-muted" placeholder="Autocompletat" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sold Curent (RON)</Label>
              <Input 
                type="number" 
                value={formData.sold_curent} 
                onChange={(e) => setFormData(prev => ({ ...prev, sold_curent: e.target.value }))} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label>Zile Întârziere Max</Label>
              <Input 
                type="number" 
                value={formData.zile_intarziere_max} 
                onChange={(e) => setFormData(prev => ({ ...prev, zile_intarziere_max: e.target.value }))} 
                placeholder="0" 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Furnizor Dialog
interface AddFurnizorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ListeFurnizor {
  id: number;
  denumire: string;
  cui: string;
  sediu: string;
  nr_reg?: string;
}

export const AddFurnizorDialog = ({ open, onOpenChange }: AddFurnizorDialogProps) => {
  const { toast } = useToast();
  const [furnizoriListe, setFurnizoriListe] = useState<ListeFurnizor[]>([]);
  const [formData, setFormData] = useState({
    nume: "",
    cui: "",
    adresa: "",
    sold_curent: "",
    zile_intarziere_max: "",
  });

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/liste/returneaza/furnizori`)
        .then(res => res.json())
        .then(data => setFurnizoriListe(data || []))
        .catch(() => setFurnizoriListe([]));
    }
  }, [open]);

  const handleFurnizorSelect = (furnizorNume: string) => {
    const selectedFurnizor = furnizoriListe.find(f => f.denumire === furnizorNume);
    if (selectedFurnizor) {
      setFormData(prev => ({
        ...prev,
        nume: selectedFurnizor.denumire,
        cui: selectedFurnizor.cui || "",
        adresa: selectedFurnizor.sediu || "",
      }));
    } else {
      setFormData(prev => ({ ...prev, nume: furnizorNume }));
    }
  };

  const handleSubmit = () => {
    toast({ title: "Furnizor adăugat", description: "Furnizorul a fost adăugat cu succes." });
    onOpenChange(false);
    setFormData({ nume: "", cui: "", adresa: "", sold_curent: "", zile_intarziere_max: "" });
  };

  const furnizorOptions = furnizoriListe.map(f => ({ value: f.denumire, label: f.denumire }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Furnizor</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nume Furnizor</Label>
            <FilterableSelect
              options={furnizorOptions}
              value={formData.nume}
              onValueChange={handleFurnizorSelect}
              placeholder="Selectează furnizor..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>CUI</Label>
              <Input value={formData.cui} readOnly className="bg-muted" placeholder="Autocompletat" />
            </div>
            <div className="space-y-2">
              <Label>Adresă</Label>
              <Input value={formData.adresa} readOnly className="bg-muted" placeholder="Autocompletat" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sold Curent (RON)</Label>
              <Input 
                type="number" 
                value={formData.sold_curent} 
                onChange={(e) => setFormData(prev => ({ ...prev, sold_curent: e.target.value }))} 
                placeholder="0.00" 
              />
            </div>
            <div className="space-y-2">
              <Label>Zile Întârziere Max</Label>
              <Input 
                type="number" 
                value={formData.zile_intarziere_max} 
                onChange={(e) => setFormData(prev => ({ ...prev, zile_intarziere_max: e.target.value }))} 
                placeholder="0" 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Nota Contabila Dialog
interface AddNotaContabilaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddNotaContabilaDialog = ({ open, onOpenChange }: AddNotaContabilaDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    data: "",
    nrNota: "",
    tipJurnal: "Diverse",
    explicatie: "",
  });

  const handleSubmit = () => {
    toast({ title: "Notă adăugată", description: "Nota contabilă a fost adăugată cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Notă Contabilă</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată</Label>
              <Input type="date" value={formData.data} onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Nr Notă</Label>
              <Input value={formData.nrNota} onChange={(e) => setFormData(prev => ({ ...prev, nrNota: e.target.value }))} placeholder="NC-001" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tip Jurnal</Label>
            <Select value={formData.tipJurnal} onValueChange={(val) => setFormData(prev => ({ ...prev, tipJurnal: val }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Vânzări">Vânzări</SelectItem>
                <SelectItem value="Cumpărări">Cumpărări</SelectItem>
                <SelectItem value="Bancă">Bancă</SelectItem>
                <SelectItem value="Casă">Casă</SelectItem>
                <SelectItem value="Diverse">Diverse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Explicație</Label>
            <Input value={formData.explicatie} onChange={(e) => setFormData(prev => ({ ...prev, explicatie: e.target.value }))} placeholder="Descriere operațiune" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Cont Balanta Dialog
interface AddContBalantaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddContBalantaDialog = ({ open, onOpenChange }: AddContBalantaDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    cont: "",
    denumire: "",
    soldInitialDebit: "",
    soldInitialCredit: "",
  });

  const handleSubmit = () => {
    toast({ title: "Cont adăugat", description: "Contul a fost adăugat cu succes." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Cont</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Simbol Cont</Label>
              <Input value={formData.cont} onChange={(e) => setFormData(prev => ({ ...prev, cont: e.target.value }))} placeholder="411" />
            </div>
            <div className="space-y-2">
              <Label>Denumire</Label>
              <Input value={formData.denumire} onChange={(e) => setFormData(prev => ({ ...prev, denumire: e.target.value }))} placeholder="Clienți" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sold Inițial Debit</Label>
              <Input type="number" value={formData.soldInitialDebit} onChange={(e) => setFormData(prev => ({ ...prev, soldInitialDebit: e.target.value }))} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Sold Inițial Credit</Label>
              <Input type="number" value={formData.soldInitialCredit} onChange={(e) => setFormData(prev => ({ ...prev, soldInitialCredit: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Add Scadentar Dialog
interface AddScadentarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddScadentarDialog = ({ open, onOpenChange }: AddScadentarDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tip_partener: "Client",
    nume_partener: "",
    tip_document: "Factură client",
    numar_document: "",
    data_document: "",
    data_scadenta: "",
    suma_restanta: "",
  });

  const handleSubmit = () => {
    toast({ title: "Scadență adăugată", description: "Înregistrarea scadențar a fost adăugată cu succes." });
    onOpenChange(false);
    setFormData({
      tip_partener: "Client",
      nume_partener: "",
      tip_document: "Factură client",
      numar_document: "",
      data_document: "",
      data_scadenta: "",
      suma_restanta: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adaugă Scadență</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tip Partener</Label>
              <Select value={formData.tip_partener} onValueChange={(val) => setFormData(prev => ({ ...prev, tip_partener: val, tip_document: val === "Client" ? "Factură client" : "Factură furnizor" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Client">Client</SelectItem>
                  <SelectItem value="Furnizor">Furnizor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tip Document</Label>
              <Select value={formData.tip_document} onValueChange={(val) => setFormData(prev => ({ ...prev, tip_document: val }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Factură client">Factură client</SelectItem>
                  <SelectItem value="Factură furnizor">Factură furnizor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Nume Partener</Label>
            <Input value={formData.nume_partener} onChange={(e) => setFormData(prev => ({ ...prev, nume_partener: e.target.value }))} placeholder="Nume partener" />
          </div>
          <div className="space-y-2">
            <Label>Număr Document</Label>
            <Input value={formData.numar_document} onChange={(e) => setFormData(prev => ({ ...prev, numar_document: e.target.value }))} placeholder="FC-001" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dată Document</Label>
              <Input type="date" value={formData.data_document} onChange={(e) => setFormData(prev => ({ ...prev, data_document: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Dată Scadență</Label>
              <Input type="date" value={formData.data_scadenta} onChange={(e) => setFormData(prev => ({ ...prev, data_scadenta: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Sumă Restantă (RON)</Label>
            <Input type="number" value={formData.suma_restanta} onChange={(e) => setFormData(prev => ({ ...prev, suma_restanta: e.target.value }))} placeholder="0.00" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Anulează</Button>
          <Button onClick={handleSubmit}>Salvează</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
