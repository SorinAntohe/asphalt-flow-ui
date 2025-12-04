import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, Truck, Plus } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Direction } from "../types";
import { Link } from "react-router-dom";

interface NewWeighingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSessionCreated: (session: {
    direction: Direction;
    orderNo?: string;
    poNo?: string;
    nrAuto: string;
    sofer: string;
  }) => void;
}

interface ComandaMateriePrima {
  id: number;
  cod: string;
  data: string;
  furnizor: string;
  material: string;
}

interface ComandaProdusFinit {
  id: number;
  cod: string;
  data: string;
  client: string;
  produs: string;
}

interface Autoturism {
  id: number;
  tip_masina: string;
  nr_auto: string;
  sarcina_max: number;
  tip_transport: string;
}

interface Sofer {
  id: number;
  nume_sofer: string;
  ci: string;
}

export function NewWeighingDialog({ open, onOpenChange, onSessionCreated }: NewWeighingDialogProps) {
  const [direction, setDirection] = useState<Direction>("INBOUND");
  const [selectedOrder, setSelectedOrder] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedSofer, setSelectedSofer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data
  const [comenziMateriePrima, setComenziMateriePrima] = useState<ComandaMateriePrima[]>([]);
  const [comenziProdusFinit, setComenziProdusFinit] = useState<ComandaProdusFinit[]>([]);
  const [autoturisme, setAutoturisme] = useState<Autoturism[]>([]);
  const [soferi, setSoferi] = useState<Sofer[]>([]);

  // Fetch data on open
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [comenziMPRes, comenziPFRes, autoturismeRes, soferiRes] = await Promise.all([
        fetch(`${API_BASE_URL}/comenzi/returneaza/comanda_materie_prima`),
        fetch(`${API_BASE_URL}/comenzi/returneaza/comanda_produs_finit`),
        fetch(`${API_BASE_URL}/liste/returneaza/masini`),
        fetch(`${API_BASE_URL}/liste/returneaza/soferi`)
      ]);

      if (comenziMPRes.ok) {
        const data = await comenziMPRes.json();
        setComenziMateriePrima(data);
      }
      if (comenziPFRes.ok) {
        const data = await comenziPFRes.json();
        setComenziProdusFinit(data);
      }
      if (autoturismeRes.ok) {
        const data = await autoturismeRes.json();
        setAutoturisme(data);
      }
      if (soferiRes.ok) {
        const data = await soferiRes.json();
        setSoferi(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca datele. Verificați conexiunea.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedOrder || !selectedVehicle || !selectedSofer) {
      toast({
        title: "Date incomplete",
        description: "Selectați comanda, autoturismul și șoferul.",
        variant: "destructive"
      });
      return;
    }

    const vehicle = autoturisme.find(a => a.id.toString() === selectedVehicle);
    const sofer = soferi.find(s => s.id.toString() === selectedSofer);
    if (!vehicle || !sofer) return;

    setIsSaving(true);
    
    // Create session data
    const sessionData = {
      direction,
      ...(direction === 'INBOUND' 
        ? { poNo: selectedOrder }
        : { orderNo: selectedOrder }
      ),
      nrAuto: vehicle.nr_auto,
      sofer: sofer.nume_sofer
    };

    onSessionCreated(sessionData);
    
    // Reset form
    setSelectedOrder("");
    setSelectedVehicle("");
    setSelectedSofer("");
    setDirection("INBOUND");
    setIsSaving(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedOrder("");
    setSelectedVehicle("");
    setSelectedSofer("");
    setDirection("INBOUND");
    onOpenChange(false);
  };

  const orders = direction === 'INBOUND' ? comenziMateriePrima : comenziProdusFinit;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cântărire Nouă</DialogTitle>
          <DialogDescription>
            Selectați tipul, comanda și autoturismul pentru a începe o sesiune de cântărire.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Direction Selection */}
            <div className="space-y-3">
              <Label>Tip Operațiune</Label>
              <RadioGroup 
                value={direction} 
                onValueChange={(v) => {
                  setDirection(v as Direction);
                  setSelectedOrder("");
                }}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <RadioGroupItem value="INBOUND" id="inbound" className="peer sr-only" />
                  <Label
                    htmlFor="inbound"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-colors"
                  >
                    <Package className="mb-2 h-6 w-6" />
                    <span className="font-medium">Recepție</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="OUTBOUND" id="outbound" className="peer sr-only" />
                  <Label
                    htmlFor="outbound"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-colors"
                  >
                    <Truck className="mb-2 h-6 w-6" />
                    <span className="font-medium">Livrare</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Order Selection */}
            <div className="space-y-2">
              <Label htmlFor="order">Comandă</Label>
              <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează comanda" />
                </SelectTrigger>
                <SelectContent>
                  {orders.length === 0 ? (
                    <SelectItem value="none" disabled>Nu există comenzi</SelectItem>
                  ) : (
                    orders.map((order) => (
                      <SelectItem key={order.id} value={order.cod}>
                        <div className="flex flex-col">
                          <span className="font-medium">{order.cod}</span>
                          <span className="text-xs text-muted-foreground">
                            {direction === 'INBOUND' 
                              ? `${(order as ComandaMateriePrima).furnizor} - ${(order as ComandaMateriePrima).material}`
                              : `${(order as ComandaProdusFinit).client} - ${(order as ComandaProdusFinit).produs}`
                            }
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Vehicle Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="vehicle">Nr. Înmatriculare</Label>
                <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-xs text-primary hover:text-primary/80">
                  <Link to="/liste?tab=autoturisme&action=add">
                    <Plus className="h-3 w-3 mr-1" />
                    Adaugă autoturism
                  </Link>
                </Button>
              </div>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează autoturismul" />
                </SelectTrigger>
                <SelectContent>
                  {autoturisme.length === 0 ? (
                    <SelectItem value="none" disabled>Nu există autoturisme</SelectItem>
                  ) : (
                    autoturisme.map((auto) => (
                      <SelectItem key={auto.id} value={auto.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium">{auto.nr_auto}</span>
                          <span className="text-xs text-muted-foreground">
                            {auto.tip_masina} · {auto.sarcina_max}t
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Driver Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="sofer">Șofer</Label>
                <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-xs text-primary hover:text-primary/80">
                  <Link to="/liste?tab=soferi&action=add">
                    <Plus className="h-3 w-3 mr-1" />
                    Adaugă șofer
                  </Link>
                </Button>
              </div>
              <Select value={selectedSofer} onValueChange={setSelectedSofer}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează șoferul" />
                </SelectTrigger>
                <SelectContent>
                  {soferi.length === 0 ? (
                    <SelectItem value="none" disabled>Nu există șoferi</SelectItem>
                  ) : (
                    soferi.map((sofer) => (
                      <SelectItem key={sofer.id} value={sofer.id.toString()}>
                        <span className="font-medium">{sofer.nume_sofer}</span>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Anulează
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || isSaving || !selectedOrder || !selectedVehicle || !selectedSofer}
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Se creează...</>
            ) : (
              'Începe Cântărirea'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
