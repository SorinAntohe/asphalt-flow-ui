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
    // Inbound-specific
    nrAvizProvizoriu?: string;
    nrAvizIntrare?: string;
    nrFactura?: string;
    procentUmiditate?: number;
    // Outbound-specific
    temperatura?: number;
  }) => void;
}

// Simple string arrays from new API endpoints

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
  
  // Data - simple string arrays from API
  const [coduriComandaMaterial, setCoduriComandaMaterial] = useState<string[]>([]);
  const [coduriComandaProdusFinit, setCoduriComandaProdusFinit] = useState<string[]>([]);
  const [numeSoferi, setNumeSoferi] = useState<string[]>([]);
  const [nrInmatriculare, setNrInmatriculare] = useState<string[]>([]);

  // Fetch data on open
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [coduriMaterialRes, coduriProdusRes, soferiRes, nrAutoRes] = await Promise.all([
        fetch(`${API_BASE_URL}/gestionare/cantar/returneaza/coduri_comanda_material`),
        fetch(`${API_BASE_URL}/gestionare/cantar/returneaza/coduri_comanda_produs_finit`),
        fetch(`${API_BASE_URL}/gestionare/cantar/returneaza/nume_soferi`),
        fetch(`${API_BASE_URL}/gestionare/cantar/returneaza/nr_inmatriculare`)
      ]);

      if (coduriMaterialRes.ok) {
        const data = await coduriMaterialRes.json();
        setCoduriComandaMaterial(Array.isArray(data) ? data : []);
      }
      if (coduriProdusRes.ok) {
        const data = await coduriProdusRes.json();
        setCoduriComandaProdusFinit(Array.isArray(data) ? data : []);
      }
      if (soferiRes.ok) {
        const data = await soferiRes.json();
        setNumeSoferi(Array.isArray(data) ? data : []);
      }
      if (nrAutoRes.ok) {
        const data = await nrAutoRes.json();
        setNrInmatriculare(Array.isArray(data) ? data : []);
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

    setIsSaving(true);
    
    // Ensure values are strings, not arrays
    const orderValue = Array.isArray(selectedOrder) ? selectedOrder[0] : selectedOrder;
    const vehicleValue = Array.isArray(selectedVehicle) ? selectedVehicle[0] : selectedVehicle;
    const soferValue = Array.isArray(selectedSofer) ? selectedSofer[0] : selectedSofer;
    
    // Create session data
    const sessionData = {
      direction,
      ...(direction === 'INBOUND' 
        ? { 
            poNo: orderValue,
            nrAvizProvizoriu: nrAvizProvizoriu || undefined,
            nrAvizIntrare: nrAvizIntrare || undefined,
            nrFactura: nrFactura || undefined,
            procentUmiditate: procentUmiditate ? parseFloat(procentUmiditate) : undefined
          }
        : { 
            orderNo: orderValue,
            temperatura: temperatura ? parseFloat(temperatura) : undefined
          }
      ),
      rowId: orderValue,
      nrAuto: vehicleValue,
      sofer: soferValue
    };

    console.log('Sending session data:', sessionData);
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
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-all"
                    >
                      <Package className="mb-2 h-6 w-6" />
                      <span className="font-medium">Recepție</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="OUTBOUND" id="outbound" className="peer sr-only" />
                    <Label
                      htmlFor="outbound"
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent/50 hover:border-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer transition-all"
                    >
                      <Truck className="mb-2 h-6 w-6" />
                      <span className="font-medium">Livrare</span>
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
                  <Label htmlFor="order" className="text-xs">
                    {direction === 'INBOUND' ? 'Cod Comandă Material' : 'Cod Comandă Produs Finit'}
                  </Label>
                  <FilterableSelect
                    id="order"
                    value={selectedOrder}
                    onValueChange={setSelectedOrder}
                    options={(direction === 'INBOUND' ? coduriComandaMaterial : coduriComandaProdusFinit).map((cod) => ({
                      value: cod,
                      label: cod
                    }))}
                    placeholder="Selectează codul comenzii"
                    searchPlaceholder="Caută cod comandă..."
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
                    options={nrInmatriculare.map((nr) => ({
                      value: nr,
                      label: nr
                    }))}
                    placeholder="Selectează nr. înmatriculare"
                    searchPlaceholder="Caută nr. înmatriculare..."
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
                    options={numeSoferi.map((nume) => ({
                      value: nume,
                      label: nume
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
