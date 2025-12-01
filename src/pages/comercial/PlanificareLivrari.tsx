import { useState, useMemo, DragEvent } from "react";
import {
  CalendarDays, Truck, Clock, MapPin, User, Phone, MessageSquare,
  Printer, Copy, AlertTriangle, CheckCircle, GripVertical, Info,
  ChevronLeft, ChevronRight, X, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { ro } from "date-fns/locale";

// Types
interface ComandaCoada {
  id: number;
  nr: string;
  client: string;
  produs: string;
  cantitate: number;
  unitateMasura: string;
  punctDescarcare: string;
  prioritate: "Scăzută" | "Normală" | "Ridicată" | "Urgentă";
  eta?: string;
  distanta?: number;
}

interface SlotPlanificat {
  id: number;
  comandaId: number;
  rampaId: string;
  ora: number;
  durata: number; // in hours
  sofer?: string;
  camion?: string;
  confirmat: boolean;
  comanda: ComandaCoada;
}

interface Rampa {
  id: string;
  nume: string;
  tip: "rampa" | "camion";
  disponibil: boolean;
}

// Mock data
const comenziInitiale: ComandaCoada[] = [
  { id: 1, nr: "CMD-001", client: "Construcții Modern SRL", produs: "Asfalt BA16", cantitate: 200, unitateMasura: "tone", punctDescarcare: "Autostrada A3 - km 45", prioritate: "Urgentă", eta: "45 min", distanta: 32 },
  { id: 2, nr: "CMD-002", client: "Drumuri Naționale SA", produs: "Asfalt MASF16", cantitate: 350, unitateMasura: "tone", punctDescarcare: "DN1 - km 120", prioritate: "Ridicată", eta: "1h 15min", distanta: 58 },
  { id: 3, nr: "CMD-003", client: "Primăria Sector 3", produs: "Asfalt BA8", cantitate: 150, unitateMasura: "tone", punctDescarcare: "Bd. Decebal nr. 15", prioritate: "Normală", eta: "25 min", distanta: 15 },
  { id: 4, nr: "CMD-004", client: "Beta Construct SRL", produs: "Emulsie cationică", cantitate: 50, unitateMasura: "tone", punctDescarcare: "Depozit Beta", prioritate: "Scăzută", eta: "55 min", distanta: 42 },
  { id: 5, nr: "CMD-005", client: "Alpha Roads SRL", produs: "Asfalt BA16", cantitate: 280, unitateMasura: "tone", punctDescarcare: "Centura Nord km 5", prioritate: "Normală", eta: "35 min", distanta: 28 },
  { id: 6, nr: "CMD-006", client: "Infrastructură Plus", produs: "Beton C25/30", cantitate: 100, unitateMasura: "mc", punctDescarcare: "Șantier Central", prioritate: "Ridicată", eta: "40 min", distanta: 25 },
];

const rampeInitiale: Rampa[] = [
  { id: "rampa-1", nume: "Rampa 1", tip: "rampa", disponibil: true },
  { id: "rampa-2", nume: "Rampa 2", tip: "rampa", disponibil: true },
  { id: "camion-1", nume: "B-123-ABC", tip: "camion", disponibil: true },
  { id: "camion-2", nume: "B-456-DEF", tip: "camion", disponibil: true },
  { id: "camion-3", nume: "B-789-GHI", tip: "camion", disponibil: false },
];

const soferiDisponibili = [
  { id: 1, nume: "Ion Popescu", telefon: "0722123456" },
  { id: 2, nume: "Gheorghe Ionescu", telefon: "0733234567" },
  { id: 3, nume: "Vasile Marin", telefon: "0744345678" },
  { id: 4, nume: "Andrei Radu", telefon: "0755456789" },
];

const camioaneDisponibile = [
  { id: 1, nr: "B-123-ABC", tip: "Articulata", capacitate: 40 },
  { id: 2, nr: "B-456-DEF", tip: "8X4", capacitate: 30 },
  { id: 3, nr: "B-789-GHI", tip: "4X2", capacitate: 12 },
  { id: 4, nr: "B-321-JKL", tip: "Articulata", capacitate: 40 },
];

const priorityColors: Record<string, string> = {
  "Scăzută": "bg-muted text-muted-foreground",
  "Normală": "bg-blue-500/20 text-blue-600 dark:text-blue-400",
  "Ridicată": "bg-orange-500/20 text-orange-600 dark:text-orange-400",
  "Urgentă": "bg-red-500/20 text-red-600 dark:text-red-400",
};

const ORE_ZI = Array.from({ length: 14 }, (_, i) => i + 6); // 06:00 - 19:00

const PlanificareLivrari = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Data state
  const [comenziCoada, setComenziCoada] = useState<ComandaCoada[]>(comenziInitiale);
  const [sloturiPlanificate, setSloturiPlanificate] = useState<SlotPlanificat[]>([]);
  const [rampe] = useState<Rampa[]>(rampeInitiale);
  
  // Filter state
  const [filterPrioritate, setFilterPrioritate] = useState<string>("all");
  const [filterClient, setFilterClient] = useState<string>("");
  
  // Drag state
  const [draggingComanda, setDraggingComanda] = useState<ComandaCoada | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<{ rampaId: string; ora: number } | null>(null);
  
  // Dialog states
  const [conflictDialog, setConflictDialog] = useState<{ rampaId: string; ora: number; comanda: ComandaCoada } | null>(null);
  const [alocareSoferDialog, setAlocareSoferDialog] = useState<SlotPlanificat | null>(null);
  const [confirmareDialog, setConfirmareDialog] = useState<SlotPlanificat | null>(null);
  const [smsDialog, setSmsDialog] = useState<SlotPlanificat | null>(null);
  const [copyDialog, setCopyDialog] = useState(false);
  
  // Form state for allocation
  const [selectedSofer, setSelectedSofer] = useState<string>("");
  const [selectedCamion, setSelectedCamion] = useState<string>("");

  // Filtered comenzi
  const filteredComenzi = useMemo(() => {
    return comenziCoada.filter(c => {
      const matchesPrioritate = filterPrioritate === "all" || c.prioritate === filterPrioritate;
      const matchesClient = c.client.toLowerCase().includes(filterClient.toLowerCase());
      return matchesPrioritate && matchesClient;
    });
  }, [comenziCoada, filterPrioritate, filterClient]);

  // Check if slot is occupied
  const isSlotOccupied = (rampaId: string, ora: number) => {
    return sloturiPlanificate.some(s => 
      s.rampaId === rampaId && 
      ora >= s.ora && 
      ora < s.ora + s.durata
    );
  };

  // Get slot at position
  const getSlotAt = (rampaId: string, ora: number) => {
    return sloturiPlanificate.find(s => 
      s.rampaId === rampaId && 
      s.ora === ora
    );
  };

  // Drag handlers
  const handleDragStart = (e: DragEvent, comanda: ComandaCoada) => {
    setDraggingComanda(comanda);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent, rampaId: string, ora: number) => {
    e.preventDefault();
    setDragOverSlot({ rampaId, ora });
  };

  const handleDragLeave = () => {
    setDragOverSlot(null);
  };

  const handleDrop = (e: DragEvent, rampaId: string, ora: number) => {
    e.preventDefault();
    setDragOverSlot(null);
    
    if (!draggingComanda) return;
    
    const rampa = rampe.find(r => r.id === rampaId);
    if (!rampa?.disponibil) {
      toast({ title: "Eroare", description: "Această rampă/camion nu este disponibilă.", variant: "destructive" });
      return;
    }

    // Check for conflicts
    if (isSlotOccupied(rampaId, ora)) {
      setConflictDialog({ rampaId, ora, comanda: draggingComanda });
      return;
    }

    // Create new slot
    addSlot(draggingComanda, rampaId, ora);
  };

  const addSlot = (comanda: ComandaCoada, rampaId: string, ora: number) => {
    const newSlot: SlotPlanificat = {
      id: Date.now(),
      comandaId: comanda.id,
      rampaId,
      ora,
      durata: 2, // Default 2 hours
      confirmat: false,
      comanda
    };

    setSloturiPlanificate(prev => [...prev, newSlot]);
    setComenziCoada(prev => prev.filter(c => c.id !== comanda.id));
    setDraggingComanda(null);
    
    toast({ title: "Comandă planificată", description: `${comanda.nr} a fost planificată la ora ${ora}:00` });
  };

  const removeSlot = (slotId: number) => {
    const slot = sloturiPlanificate.find(s => s.id === slotId);
    if (slot) {
      setComenziCoada(prev => [...prev, slot.comanda]);
      setSloturiPlanificate(prev => prev.filter(s => s.id !== slotId));
      toast({ title: "Slot eliminat", description: "Comanda a fost mutată înapoi în coadă." });
    }
  };

  const handleAlocareSofer = () => {
    if (!alocareSoferDialog || !selectedSofer || !selectedCamion) {
      toast({ title: "Eroare", description: "Selectează șoferul și camionul.", variant: "destructive" });
      return;
    }

    setSloturiPlanificate(prev => prev.map(s => 
      s.id === alocareSoferDialog.id 
        ? { ...s, sofer: selectedSofer, camion: selectedCamion }
        : s
    ));

    toast({ title: "Alocare realizată", description: `Șofer ${selectedSofer} și camion ${selectedCamion} alocați.` });
    setAlocareSoferDialog(null);
    setSelectedSofer("");
    setSelectedCamion("");
  };

  const handleConfirmareSlot = () => {
    if (!confirmareDialog) return;

    setSloturiPlanificate(prev => prev.map(s => 
      s.id === confirmareDialog.id 
        ? { ...s, confirmat: true }
        : s
    ));

    toast({ title: "Slot confirmat", description: `Livrarea ${confirmareDialog.comanda.nr} a fost confirmată.` });
    setConfirmareDialog(null);
  };

  const handlePrintDispozitie = (slot: SlotPlanificat) => {
    toast({ title: "Imprimare", description: `Dispoziția de încărcare pentru ${slot.comanda.nr} a fost trimisă la imprimantă.` });
  };

  const handleSendSMS = () => {
    if (!smsDialog) return;
    toast({ title: "SMS trimis", description: `Notificare trimisă șoferului pentru comanda ${smsDialog.comanda.nr}.` });
    setSmsDialog(null);
  };

  const handleCopyPlanMaine = () => {
    const newSloturi = sloturiPlanificate.map(s => ({
      ...s,
      id: Date.now() + Math.random() * 1000,
      confirmat: false
    }));
    
    toast({ 
      title: "Plan copiat", 
      description: `${newSloturi.length} sloturi au fost copiate pentru ${format(addDays(currentDate, 1), "dd MMMM yyyy", { locale: ro })}.` 
    });
    setCopyDialog(false);
  };

  const navigateDate = (days: number) => {
    setCurrentDate(prev => addDays(prev, days));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Planificare Livrări</h1>
          <p className="text-muted-foreground text-sm">
            Drag & drop comenzi pentru planificarea livrărilor
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-md">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {format(currentDate, "EEEE, dd MMMM yyyy", { locale: ro })}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateDate(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCopyDialog(true)}>
            <Copy className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Copiere plan pe mâine</span>
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Left: Coadă comenzi */}
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base">Coadă Comenzi</CardTitle>
            <CardDescription className="text-xs">
              {filteredComenzi.length} comenzi de planificat
            </CardDescription>
            <div className="space-y-2 pt-2">
              <Input
                placeholder="Caută client..."
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="h-8 text-xs"
              />
              <Select value={filterPrioritate} onValueChange={setFilterPrioritate}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Prioritate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate prioritățile</SelectItem>
                  <SelectItem value="Urgentă">Urgentă</SelectItem>
                  <SelectItem value="Ridicată">Ridicată</SelectItem>
                  <SelectItem value="Normală">Normală</SelectItem>
                  <SelectItem value="Scăzută">Scăzută</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-2 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              <div className="space-y-2">
                {filteredComenzi.map((comanda) => (
                  <div
                    key={comanda.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, comanda)}
                    onDragEnd={() => setDraggingComanda(null)}
                    className="p-2 rounded-lg border bg-card hover:bg-muted/50 cursor-grab active:cursor-grabbing transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-sm truncate">{comanda.nr}</span>
                          <Badge className={`text-[10px] px-1.5 py-0 ${priorityColors[comanda.prioritate]}`}>
                            {comanda.prioritate}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{comanda.client}</p>
                        <p className="text-xs truncate">{comanda.produs} - {comanda.cantitate} {comanda.unitateMasura}</p>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {comanda.eta}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ETA: {comanda.eta}</p>
                              <p>Distanță: {comanda.distanta} km</p>
                            </TooltipContent>
                          </Tooltip>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {comanda.distanta} km
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredComenzi.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    Nu sunt comenzi de planificat
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Right: Slot Board */}
        <Card className="lg:col-span-3 flex flex-col overflow-hidden">
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Slot Board - Timeline</CardTitle>
                <CardDescription className="text-xs">
                  {sloturiPlanificate.length} livrări planificate
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                  Disponibil
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-1" />
                  Planificat
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                  Confirmat
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-2 overflow-auto">
            <div className="min-w-[800px]">
              {/* Timeline Header */}
              <div className="flex border-b sticky top-0 bg-background z-10">
                <div className="w-28 flex-shrink-0 p-2 text-xs font-medium text-muted-foreground">
                  Rampă / Camion
                </div>
                {ORE_ZI.map(ora => (
                  <div key={ora} className="flex-1 min-w-[60px] p-2 text-center text-xs font-medium border-l">
                    {ora}:00
                  </div>
                ))}
              </div>

              {/* Rows */}
              {rampe.map(rampa => (
                <div key={rampa.id} className="flex border-b">
                  <div className={`w-28 flex-shrink-0 p-2 text-xs font-medium flex items-center gap-1 ${!rampa.disponibil ? 'bg-muted/50 text-muted-foreground' : ''}`}>
                    {rampa.tip === "camion" ? (
                      <Truck className="h-3 w-3" />
                    ) : (
                      <div className="w-3 h-3 rounded bg-primary/20" />
                    )}
                    <span className="truncate">{rampa.nume}</span>
                    {!rampa.disponibil && (
                      <Badge variant="secondary" className="text-[8px] px-1">Indisponibil</Badge>
                    )}
                  </div>
                  {ORE_ZI.map(ora => {
                    const slot = getSlotAt(rampa.id, ora);
                    const isOccupied = isSlotOccupied(rampa.id, ora);
                    const isDragOver = dragOverSlot?.rampaId === rampa.id && dragOverSlot?.ora === ora;
                    
                    if (slot) {
                      return (
                        <div
                          key={ora}
                          className={`flex-1 min-w-[60px] p-1 border-l ${slot.confirmat ? 'bg-blue-500/20' : 'bg-orange-500/20'}`}
                          style={{ gridColumn: `span ${slot.durata}` }}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-full rounded p-1 text-[10px] cursor-pointer hover:bg-background/50 transition-colors relative group">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium truncate">{slot.comanda.nr}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0"
                                    onClick={() => removeSlot(slot.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="truncate text-muted-foreground">{slot.comanda.client}</p>
                                {slot.sofer && (
                                  <p className="truncate flex items-center gap-1">
                                    <User className="h-2 w-2" />
                                    {slot.sofer}
                                  </p>
                                )}
                                {slot.confirmat && (
                                  <CheckCircle className="h-3 w-3 text-blue-500 absolute bottom-1 right-1" />
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="max-w-xs">
                              <div className="space-y-1 text-xs">
                                <p><strong>{slot.comanda.nr}</strong> - {slot.comanda.client}</p>
                                <p>{slot.comanda.produs} - {slot.comanda.cantitate} {slot.comanda.unitateMasura}</p>
                                <p><MapPin className="h-3 w-3 inline mr-1" />{slot.comanda.punctDescarcare}</p>
                                <p><Clock className="h-3 w-3 inline mr-1" />ETA: {slot.comanda.eta} | {slot.comanda.distanta} km</p>
                                {slot.sofer && <p><User className="h-3 w-3 inline mr-1" />Șofer: {slot.sofer}</p>}
                                {slot.camion && <p><Truck className="h-3 w-3 inline mr-1" />Camion: {slot.camion}</p>}
                                <Separator className="my-1" />
                                <div className="flex flex-wrap gap-1 pt-1">
                                  <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => setAlocareSoferDialog(slot)}>
                                    <User className="h-3 w-3 mr-1" />Alocă
                                  </Button>
                                  {!slot.confirmat && (
                                    <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => setConfirmareDialog(slot)}>
                                      <CheckCircle className="h-3 w-3 mr-1" />Confirmă
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => handlePrintDispozitie(slot)}>
                                    <Printer className="h-3 w-3 mr-1" />Print
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-6 text-[10px]" onClick={() => setSmsDialog(slot)}>
                                    <MessageSquare className="h-3 w-3 mr-1" />SMS
                                  </Button>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      );
                    }

                    // Skip cells that are part of a multi-hour slot
                    if (isOccupied && !slot) {
                      return null;
                    }

                    return (
                      <div
                        key={ora}
                        className={`flex-1 min-w-[60px] border-l transition-colors ${
                          !rampa.disponibil 
                            ? 'bg-muted/30 cursor-not-allowed' 
                            : isDragOver 
                              ? 'bg-primary/20 border-primary border-2' 
                              : 'hover:bg-muted/30'
                        }`}
                        onDragOver={(e) => rampa.disponibil && handleDragOver(e, rampa.id, ora)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => rampa.disponibil && handleDrop(e, rampa.id, ora)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Dialog */}
      <AlertDialog open={!!conflictDialog} onOpenChange={() => setConflictDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Slot Indisponibil
            </AlertDialogTitle>
            <AlertDialogDescription>
              Acest slot este deja ocupat. Dorești să înlocuiești programarea existentă?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (conflictDialog) {
                // Remove existing slot at this position
                setSloturiPlanificate(prev => prev.filter(s => 
                  !(s.rampaId === conflictDialog.rampaId && s.ora === conflictDialog.ora)
                ));
                // Add new slot
                addSlot(conflictDialog.comanda, conflictDialog.rampaId, conflictDialog.ora);
                setConflictDialog(null);
              }
            }}>
              Înlocuiește
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alocare Șofer/Camion Dialog */}
      <Dialog open={!!alocareSoferDialog} onOpenChange={() => setAlocareSoferDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alocă Șofer și Camion</DialogTitle>
            <DialogDescription>
              Comanda: {alocareSoferDialog?.comanda.nr} - {alocareSoferDialog?.comanda.client}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Șofer</Label>
              <Select value={selectedSofer} onValueChange={setSelectedSofer}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează șofer..." />
                </SelectTrigger>
                <SelectContent>
                  {soferiDisponibili.map(s => (
                    <SelectItem key={s.id} value={s.nume}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {s.nume}
                        <span className="text-muted-foreground text-xs">({s.telefon})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Camion</Label>
              <Select value={selectedCamion} onValueChange={setSelectedCamion}>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează camion..." />
                </SelectTrigger>
                <SelectContent>
                  {camioaneDisponibile.map(c => (
                    <SelectItem key={c.id} value={c.nr}>
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        {c.nr}
                        <Badge variant="outline" className="text-[10px]">{c.tip} - {c.capacitate}t</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAlocareSoferDialog(null)}>Anulează</Button>
            <Button onClick={handleAlocareSofer}>Alocă</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmare Dialog */}
      <AlertDialog open={!!confirmareDialog} onOpenChange={() => setConfirmareDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmă Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Confirmă planificarea pentru comanda {confirmareDialog?.comanda.nr}?
              {!confirmareDialog?.sofer && (
                <span className="block mt-2 text-orange-500">
                  <AlertTriangle className="h-4 w-4 inline mr-1" />
                  Atenție: Nu a fost alocat un șofer pentru această livrare.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmareSlot}>Confirmă</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* SMS Dialog */}
      <Dialog open={!!smsDialog} onOpenChange={() => setSmsDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Trimite Notificare</DialogTitle>
            <DialogDescription>
              Trimite SMS/WhatsApp către șoferul alocat pentru {smsDialog?.comanda.nr}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {smsDialog?.sofer ? (
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{smsDialog.sofer}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Mesaj: Livrare programată - {smsDialog.comanda.produs} către {smsDialog.comanda.client}, 
                  {smsDialog.comanda.punctDescarcare}. Ora: {smsDialog.ora}:00
                </p>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                <p>Nu este alocat un șofer pentru această livrare.</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSmsDialog(null)}>Anulează</Button>
            {smsDialog?.sofer && (
              <>
                <Button variant="outline" onClick={handleSendSMS}>
                  <Phone className="h-4 w-4 mr-2" />
                  SMS
                </Button>
                <Button onClick={handleSendSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy Plan Dialog */}
      <AlertDialog open={copyDialog} onOpenChange={setCopyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Copiere Plan pe Mâine</AlertDialogTitle>
            <AlertDialogDescription>
              Se vor copia {sloturiPlanificate.length} sloturi planificate pentru data de {format(addDays(currentDate, 1), "dd MMMM yyyy", { locale: ro })}.
              Sloturile copiate vor fi marcate ca neconfirmate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anulează</AlertDialogCancel>
            <AlertDialogAction onClick={handleCopyPlanMaine}>
              <Copy className="h-4 w-4 mr-2" />
              Copiază
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanificareLivrari;
