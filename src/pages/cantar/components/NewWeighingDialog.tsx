import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Package, Truck, Plus, FileText, Thermometer, Droplets } from "lucide-react";
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
    rowId: string;
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
  
  // Inbound-specific fields
  const [nrAvizProvizoriu, setNrAvizProvizoriu] = useState("");
  const [nrAvizIntrare, setNrAvizIntrare] = useState("");
  const [nrFactura, setNrFactura] = useState("");
  const [procentUmiditate, setProcentUmiditate] = useState("");
  
  // Outbound-specific fields
  const [temperatura, setTemperatura] = useState("");
  
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
    const order = orders.find(o => o.cod === selectedOrder);
    if (!vehicle || !sofer || !order) return;

    setIsSaving(true);
    
    // Create session data
    const sessionData = {
      direction,
      ...(direction === 'INBOUND' 
        ? { poNo: selectedOrder }
        : { orderNo: selectedOrder }
      ),
      rowId: order.id.toString(),
      nrAuto: vehicle.nr_auto,
      sofer: sofer.nume_sofer
    };

    onSessionCreated(sessionData);
    
    // Reset form
    setSelectedOrder("");
    setSelectedVehicle("");
    setSelectedSofer("");
    setNrAvizProvizoriu("");
    setNrAvizIntrare("");
    setNrFactura("");
    setProcentUmiditate("");
    setTemperatura("");
    setDirection("INBOUND");
    setIsSaving(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedOrder("");
    setSelectedVehicle("");
    setSelectedSofer("");
    setNrAvizProvizoriu("");
    setNrAvizIntrare("");
    setNrFactura("");
    setProcentUmiditate("");
    setTemperatura("");
    setDirection("INBOUND");
    onOpenChange(false);
  };

  const orders = direction === 'INBOUND' ? comenziMateriePrima : comenziProdusFinit;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-hidden p-0" hideCloseButton>
        <DialogHeader className="px-5 pt-4 pb-3 border-b">
          <DialogTitle className="text-lg">Cântărire Nouă</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ScrollArea className="max-h-[calc(90vh-140px)]">
            <div className="px-5 py-4 space-y-5">
              {/* Direction Selection */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tip Operațiune</Label>
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
                      className="flex items-center gap-3 rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium block">Recepție</span>
                        <span className="text-xs text-muted-foreground">Intrare materiale</span>
                      </div>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="OUTBOUND" id="outbound" className="peer sr-only" />
                    <Label
                      htmlFor="outbound"
                      className="flex items-center gap-3 rounded-lg border-2 border-muted bg-card p-3 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Truck className="h-5 w-5 text-amber-500" />
                      </div>
                      <div>
                        <span className="font-medium block">Livrare</span>
                        <span className="text-xs text-muted-foreground">Ieșire produse</span>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order & Transport Section */}
              <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Detalii Comandă & Transport
                </h4>
                
                {/* Order Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="order" className="text-xs">Comandă</Label>
                  <FilterableSelect
                    id="order"
                    value={selectedOrder}
                    onValueChange={setSelectedOrder}
                    options={orders.map((order) => ({
                      value: order.cod,
                      label: direction === 'INBOUND' 
                        ? `${order.cod} - ${(order as ComandaMateriePrima).furnizor} - ${(order as ComandaMateriePrima).material}`
                        : `${order.cod} - ${(order as ComandaProdusFinit).client} - ${(order as ComandaProdusFinit).produs}`
                    }))}
                    placeholder="Selectează comanda"
                    searchPlaceholder="Caută comandă..."
                    emptyText="Nu există comenzi"
                  />
                </div>

                {/* Vehicle Selection */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vehicle" className="text-xs">Nr. Înmatriculare</Label>
                    <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-[10px] text-primary hover:text-primary/80">
                      <Link to="/liste?tab=autoturisme&action=add">
                        <Plus className="h-3 w-3 mr-0.5" />
                        Adaugă
                      </Link>
                    </Button>
                  </div>
                  <FilterableSelect
                    id="vehicle"
                    value={selectedVehicle}
                    onValueChange={setSelectedVehicle}
                    options={autoturisme.map((auto) => ({
                      value: auto.id.toString(),
                      label: `${auto.nr_auto} - ${auto.tip_masina} · ${auto.sarcina_max}t`
                    }))}
                    placeholder="Selectează autoturismul"
                    searchPlaceholder="Caută autoturism..."
                    emptyText="Nu există autoturisme"
                  />
                </div>

                {/* Driver Selection */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sofer" className="text-xs">Șofer</Label>
                    <Button variant="ghost" size="sm" asChild className="h-auto p-0 text-[10px] text-primary hover:text-primary/80">
                      <Link to="/liste?tab=soferi&action=add">
                        <Plus className="h-3 w-3 mr-0.5" />
                        Adaugă
                      </Link>
                    </Button>
                  </div>
                  <FilterableSelect
                    id="sofer"
                    value={selectedSofer}
                    onValueChange={setSelectedSofer}
                    options={soferi.map((sofer) => ({
                      value: sofer.id.toString(),
                      label: sofer.nume_sofer
                    }))}
                    placeholder="Selectează șoferul"
                    searchPlaceholder="Caută șofer..."
                    emptyText="Nu există șoferi"
                  />
                </div>
              </div>

              {/* Inbound-specific fields */}
              {direction === 'INBOUND' && (
                <div className="space-y-4 rounded-lg border bg-blue-500/5 p-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Package className="h-4 w-4 text-blue-500" />
                    Detalii Recepție
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="nrAvizProvizoriu" className="text-xs">Nr. Aviz Provizoriu</Label>
                      <Input
                        id="nrAvizProvizoriu"
                        value={nrAvizProvizoriu}
                        onChange={(e) => setNrAvizProvizoriu(e.target.value)}
                        placeholder="Aviz provizoriu"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="nrAvizIntrare" className="text-xs">Nr. Aviz Intrare</Label>
                      <Input
                        id="nrAvizIntrare"
                        value={nrAvizIntrare}
                        onChange={(e) => setNrAvizIntrare(e.target.value)}
                        placeholder="Aviz intrare"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="nrFactura" className="text-xs">Nr. Factură</Label>
                      <Input
                        id="nrFactura"
                        value={nrFactura}
                        onChange={(e) => setNrFactura(e.target.value)}
                        placeholder="Nr. factură"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="procentUmiditate" className="text-xs flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        Umiditate (%)
                      </Label>
                      <Input
                        id="procentUmiditate"
                        type="number"
                        value={procentUmiditate}
                        onChange={(e) => setProcentUmiditate(e.target.value)}
                        placeholder="0"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Outbound-specific fields */}
              {direction === 'OUTBOUND' && (
                <div className="space-y-4 rounded-lg border bg-amber-500/5 p-4">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Truck className="h-4 w-4 text-amber-500" />
                    Detalii Livrare
                  </h4>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="temperatura" className="text-xs flex items-center gap-1">
                      <Thermometer className="h-3 w-3" />
                      Temperatură (°C)
                    </Label>
                    <Input
                      id="temperatura"
                      type="number"
                      value={temperatura}
                      onChange={(e) => setTemperatura(e.target.value)}
                      placeholder="Introduceți temperatura"
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        <DialogFooter className="px-5 py-3 border-t flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} size="sm" className="w-full sm:w-auto">
            Anulează
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || isSaving || !selectedOrder || !selectedVehicle || !selectedSofer}
            size="sm"
            className="w-full sm:w-auto"
          >
            {isSaving ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Se creează...</>
            ) : (
              'Adaugă în Coadă'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
