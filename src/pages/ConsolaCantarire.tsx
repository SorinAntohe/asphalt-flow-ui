import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Scale, Truck, Package, Plus } from "lucide-react";
import { SessionCard } from "./cantar/components/SessionCard";
import { ActiveWeighPanel } from "./cantar/components/ActiveWeighPanel";
import { RowPickerDialog } from "./cantar/components/RowPickerDialog";
import { NewWeighingDialog } from "./cantar/components/NewWeighingDialog";
import { WeighSession, EligibleRow, Direction } from "./cantar/types";
import { toast } from "@/hooks/use-toast";

export default function ConsolaCantarire() {
  const [selectedPlant, setSelectedPlant] = useState("1");
  
  const [queue1, setQueue1] = useState<WeighSession[]>([]);
  const [queue2, setQueue2] = useState<WeighSession[]>([]);
  const [activeSession, setActiveSession] = useState<WeighSession | null>(null);
  const [nrAuto, setNrAuto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowPickerOpen, setRowPickerOpen] = useState(false);
  const [eligibleRows, setEligibleRows] = useState<EligibleRow[]>([]);
  const [pendingSessionData, setPendingSessionData] = useState<Partial<WeighSession> | null>(null);
  const [newWeighingDialogOpen, setNewWeighingDialogOpen] = useState(false);

  // Check if there's an existing session for this nr auto
  const existingSession = useMemo(() => {
    const nrAutoStr = Array.isArray(nrAuto) ? nrAuto[0] || '' : nrAuto || '';
    const normalized = nrAutoStr.toUpperCase().replace(/\s+/g, ' ').trim();
    return [...queue1, ...queue2].find(s => {
      const sessionNrAuto = Array.isArray(s.nrAuto) ? s.nrAuto[0] || '' : s.nrAuto || '';
      return sessionNrAuto === normalized;
    });
  }, [nrAuto, queue1, queue2]);

  const handleCallNext = () => {
    if (queue1.length > 0) {
      const next = queue1[0];
      setActiveSession(next);
      setNrAuto(next.nrAuto);
      setQueue1(prev => prev.slice(1));
      toast({
        title: "Sesiune activată",
        description: `${next.direction === 'INBOUND' ? 'Recepție' : 'Livrare'} - ${next.nrAuto}`
      });
    }
  };

  const handleSessionClick = (session: WeighSession) => {
    console.log('handleSessionClick called with session:', session);
    if (!session) {
      console.error('Session is null/undefined');
      return;
    }
    setActiveSession(session);
    setNrAuto(session.nrAuto || '');
  };

  const handleStartSession = async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    if (existingSession) {
      // Resume existing session
      setActiveSession(existingSession);
      toast({
        title: "Sesiune reluată",
        description: `Ați reluat sesiunea ${existingSession.sessionCode}`
      });
    }
    
    setIsLoading(false);
  };

  const handleRowSelect = (rowId: string) => {
    if (pendingSessionData) {
      const newSession: WeighSession = {
        id: `new-${Date.now()}`,
        sessionCode: `SC-${String(Date.now()).slice(-3)}`,
        direction: pendingSessionData.direction!,
        poNo: pendingSessionData.direction === 'INBOUND' ? `PO-2024-${String(Date.now()).slice(-3)}` : undefined,
        orderNo: pendingSessionData.direction === 'OUTBOUND' ? `ORD-2024-${String(Date.now()).slice(-3)}` : undefined,
        rowId: rowId,
        nrAuto: pendingSessionData.nrAuto!,
        step: '1/2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Current User",
        plantId: pendingSessionData.plantId!,
        financeApproved: true,
      };
      setActiveSession(newSession);
      setPendingSessionData(null);
      toast({
        title: "Sesiune creată",
        description: `Rândul ${rowId} atașat la sesiunea ${newSession.sessionCode}`
      });
    }
  };

  const handleNewWeighingCreated = (sessionData: { 
    direction: Direction; 
    orderNo?: string; 
    poNo?: string; 
    rowId: string; 
    nrAuto: string; 
    sofer: string;
    nrAvizProvizoriu?: string;
    nrAvizIntrare?: string;
    nrFactura?: string;
    procentUmiditate?: number;
    temperatura?: number;
  }) => {
    console.log('handleNewWeighingCreated called with:', sessionData);
    
    const newSession: WeighSession = {
      id: `new-${Date.now()}`,
      sessionCode: `SC-${String(Date.now()).slice(-3)}`,
      direction: sessionData.direction,
      poNo: sessionData.poNo || '',
      orderNo: sessionData.orderNo || '',
      rowId: sessionData.rowId || '',
      nrAuto: sessionData.nrAuto || '',
      step: '1/2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: sessionData.sofer || '',
      plantId: selectedPlant,
      financeApproved: true,
      // Inbound-specific
      nrAvizProvizoriu: sessionData.nrAvizProvizoriu,
      nrAvizIntrare: sessionData.nrAvizIntrare,
      nrFactura: sessionData.nrFactura,
      procentUmiditate: sessionData.procentUmiditate,
      // Outbound-specific
      temperatura: sessionData.temperatura,
    };
    
    console.log('New session created:', newSession);
    
    // Adaugă doar în coadă, nu setează ca sesiune activă
    setQueue1(prev => [...prev, newSession]);
    
    toast({
      title: "Cântărire adăugată în coadă",
      description: `${sessionData.nrAuto || 'N/A'} - ${sessionData.sofer || 'N/A'}`
    });
  };

  const handleWeightEntered = async (type: 'TARA' | 'BRUT', value: number, observatii?: string): Promise<boolean> => {
    if (!activeSession) return false;

    const updatedSession = { ...activeSession };
    if (type === 'TARA') {
      updatedSession.tara = value;
    } else {
      updatedSession.masaBrut = value;
    }

    // Calculate NET if both values exist
    if (updatedSession.tara && updatedSession.masaBrut) {
      updatedSession.masaNet = updatedSession.masaBrut - updatedSession.tara;
      
      // Validate: GROSS must be > TARE
      if (updatedSession.masaNet < 0) {
        toast({
          title: "Eroare logică greutate",
          description: "BRUT trebuie să fie mai mare decât TARA.",
          variant: "destructive"
        });
        return false;
      }
    }

    // For INBOUND (Recepție): After TARA is entered (step 2/2), call API to save reception
    if (updatedSession.direction === 'INBOUND' && type === 'TARA' && updatedSession.masaBrut && updatedSession.tara) {
      const cod = updatedSession.poNo || '';
      const nrAuto = Array.isArray(updatedSession.nrAuto) ? updatedSession.nrAuto[0] : (updatedSession.nrAuto || '');
      const sofer = Array.isArray(updatedSession.createdBy) ? updatedSession.createdBy[0] : (updatedSession.createdBy || '');
      const brut = updatedSession.masaBrut;
      const tara = updatedSession.tara;
      const umiditate = updatedSession.procentUmiditate ?? 0;
      const nrAvizProvizoriu = updatedSession.nrAvizProvizoriu || '';
      const nrAvizIntrare = updatedSession.nrAvizIntrare || '';
      const nrFactura = updatedSession.nrFactura || '';
      const obs = observatii || '';
      
      try {
        const response = await fetch(
          `http://192.168.1.23:8002/gestionare/cantar/adauga/receptie/${encodeURIComponent(cod)}/${encodeURIComponent(sofer)}/${encodeURIComponent(nrAuto)}/${brut}/${tara}/${umiditate}/${encodeURIComponent(nrAvizProvizoriu)}/${encodeURIComponent(nrAvizIntrare)}/${encodeURIComponent(nrFactura)}/${encodeURIComponent(obs)}`,
          { method: 'POST' }
        );
        
        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Recepție salvată",
            description: `Recepția pentru ${cod} a fost înregistrată cu succes.`
          });
        } else {
          toast({
            title: "Eroare",
            description: result.error || "Nu s-a putut salva recepția.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Eroare la salvarea recepției:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut salva recepția. Verificați conexiunea.",
          variant: "destructive"
        });
      }
    }

    // For OUTBOUND (Livrare): After BRUT is entered (step 2/2), call API to save delivery
    if (updatedSession.direction === 'OUTBOUND' && type === 'BRUT' && updatedSession.masaBrut && updatedSession.tara) {
      const cod = updatedSession.orderNo || '';
      const nrAuto = Array.isArray(updatedSession.nrAuto) ? updatedSession.nrAuto[0] : (updatedSession.nrAuto || '');
      const sofer = Array.isArray(updatedSession.createdBy) ? updatedSession.createdBy[0] : (updatedSession.createdBy || '');
      const temperatura = updatedSession.temperatura ?? 0;
      const masaBrut = updatedSession.masaBrut;
      const tara = updatedSession.tara;
      const obs = observatii || '';
      
      try {
        const response = await fetch(
          `http://192.168.1.23:8002/gestionare/cantar/adauga/livrare/${encodeURIComponent(cod)}/${encodeURIComponent(nrAuto)}/${encodeURIComponent(sofer)}/${temperatura}/${masaBrut}/${tara}/${encodeURIComponent(obs)}`,
          { method: 'POST' }
        );
        
        const result = await response.json();
        
        if (result.success) {
          toast({
            title: "Livrare salvată",
            description: `Livrarea pentru ${cod} a fost înregistrată cu succes.`
          });
        } else {
          toast({
            title: "Eroare",
            description: result.error || "Nu s-a putut salva livrarea.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Eroare la salvarea livrării:', error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut salva livrarea. Verificați conexiunea.",
          variant: "destructive"
        });
      }
    }

    updatedSession.updatedAt = new Date().toISOString();

    // Move to step 2/2 queue and clear active panel
    if (activeSession.step === '1/2') {
      updatedSession.step = '2/2';
      // Remove from queue1 if present
      setQueue1(prev => prev.filter(s => s.id !== activeSession.id));
      // Add to queue2
      setQueue2(prev => [...prev, updatedSession]);
      // Clear active session so operator can pick next
      setActiveSession(null);
      setNrAuto("");
      toast({
        title: "Mutat în coadă pas 2/2",
        description: `${updatedSession.nrAuto} a fost mutat în coada pentru a doua cântărire.`
      });
    } else {
      setActiveSession(updatedSession);
    }
    
    return true;
  };

  const handleSessionCompleted = (sessionId: string) => {
    // Remove from queue2
    setQueue2(prev => prev.filter(s => s.id !== sessionId));
    // Clear active session
    setActiveSession(null);
    setNrAuto("");
    toast({
      title: "Cântărire finalizată",
      description: "Sesiunea a fost finalizată și eliminată din coadă."
    });
  };


  return (
    <>
      <div className="flex flex-col min-h-[calc(100vh-120px)] lg:h-[calc(100vh-120px)]">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Scale className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Consolă Cântărire</h1>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            {/* New Weighing Button */}
            <Button onClick={() => setNewWeighingDialogOpen(true)} className="w-full sm:w-auto h-11">
              <Plus className="h-4 w-4 mr-2" />
              Adaugă în coadă
            </Button>

          </div>
        </div>

        <Separator className="mb-4" />

        {/* 3-Column Layout - Stacked on mobile, side-by-side on larger screens */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-0 overflow-auto lg:overflow-hidden pb-4 lg:pb-0">
          {/* Column A - Queue 1 (Step 1/2) */}
          <Card className="flex flex-col min-h-[300px] lg:min-h-0">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500" />
                  Coadă Pas 1/2
                </CardTitle>
                <Badge variant="outline" className="text-xs">{queue1.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2 sm:p-3">
              <ScrollArea className="h-full max-h-[250px] lg:max-h-none">
                {queue1.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
                    <Truck className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Nu sunt camioane în așteptare
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {queue1.map(session => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isActive={activeSession?.id === session.id}
                        onClick={() => handleSessionClick(session)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Column B - Active Weigh Panel */}
          <ActiveWeighPanel
            session={activeSession}
            nrAuto={nrAuto}
            onNrAutoChange={setNrAuto}
            onStartSession={handleStartSession}
            onWeightEntered={handleWeightEntered}
            onSessionCompleted={handleSessionCompleted}
            isLoading={isLoading}
            hasExistingSession={!!existingSession}
          />

          {/* Column C - Queue 2 (Step 2/2) */}
          <Card className="flex flex-col min-h-[300px] lg:min-h-0">
            <CardHeader className="pb-2 px-3 sm:px-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Coadă Pas 2/2
                </CardTitle>
                <Badge variant="outline" className="text-xs">{queue2.length}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-2 sm:p-3">
              <ScrollArea className="h-full max-h-[250px] lg:max-h-none">
                {queue2.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
                    <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/30 mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Nu sunt camioane pentru a doua cântărire
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {queue2.map(session => (
                      <SessionCard
                        key={session.id}
                        session={session}
                        isActive={activeSession?.id === session.id}
                        onClick={() => handleSessionClick(session)}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row Picker Dialog */}
      <RowPickerDialog
        open={rowPickerOpen}
        onOpenChange={setRowPickerOpen}
        rows={eligibleRows}
        onSelect={handleRowSelect}
        orderOrPo={pendingSessionData?.direction === 'INBOUND' ? 'PO-2024-XXX' : 'ORD-2024-XXX'}
        isInbound={pendingSessionData?.direction === 'INBOUND'}
      />

      {/* New Weighing Dialog */}
      <NewWeighingDialog
        open={newWeighingDialogOpen}
        onOpenChange={setNewWeighingDialogOpen}
        onSessionCreated={handleNewWeighingCreated}
      />
    </>
  );
}
