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

// Mock data

const mockQueue1: WeighSession[] = [
  {
    id: "1",
    sessionCode: "SC-001",
    direction: "INBOUND",
    poNo: "",
    rowId: "REC-101",
    nrAuto: "",
    step: "1/2",
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    plantId: "1",
  },
  {
    id: "2",
    sessionCode: "SC-002",
    direction: "OUTBOUND",
    orderNo: "",
    rowId: "LIV-202",
    nrAuto: "",
    step: "1/2",
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    plantId: "1",
    financeApproved: true,
  },
  {
    id: "3",
    sessionCode: "SC-003",
    direction: "INBOUND",
    poNo: "",
    rowId: "REC-102",
    nrAuto: "",
    step: "1/2",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    plantId: "1",
  },
];

const mockQueue2: WeighSession[] = [
  {
    id: "4",
    sessionCode: "SC-004",
    direction: "OUTBOUND",
    orderNo: "",
    rowId: "LIV-198",
    nrAuto: "",
    step: "2/2",
    tara: 12500,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    plantId: "1",
    financeApproved: true,
  },
  {
    id: "5",
    sessionCode: "SC-005",
    direction: "INBOUND",
    poNo: "",
    rowId: "REC-103",
    nrAuto: "",
    step: "2/2",
    masaBrut: 38000,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "",
    plantId: "1",
  },
];

const mockEligibleRows: EligibleRow[] = [
  { id: "REC-201", produs: "Bitum 50/70", cantitate: 25000, hasTara: false, hasBrut: false, nrAuto: "", isOnScale: false },
  { id: "REC-202", produs: "Filler Calcar", cantitate: 18000, hasTara: true, hasBrut: false, nrAuto: "B 999 ZZZ", isOnScale: true, onScaleSessionCode: "SC-099" },
  { id: "REC-203", produs: "Agregate 0/4", cantitate: 32000, hasTara: false, hasBrut: false, nrAuto: "", isOnScale: false },
];

export default function ConsolaCantarire() {
  const [selectedPlant, setSelectedPlant] = useState("1");
  
  const [queue1, setQueue1] = useState<WeighSession[]>(mockQueue1);
  const [queue2, setQueue2] = useState<WeighSession[]>(mockQueue2);
  const [activeSession, setActiveSession] = useState<WeighSession | null>(null);
  const [nrAuto, setNrAuto] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rowPickerOpen, setRowPickerOpen] = useState(false);
  const [eligibleRows, setEligibleRows] = useState<EligibleRow[]>([]);
  const [pendingSessionData, setPendingSessionData] = useState<Partial<WeighSession> | null>(null);
  const [newWeighingDialogOpen, setNewWeighingDialogOpen] = useState(false);

  // Check if there's an existing session for this nr auto
  const existingSession = useMemo(() => {
    const normalized = nrAuto.toUpperCase().replace(/\s+/g, ' ').trim();
    return [...queue1, ...queue2].find(s => s.nrAuto === normalized);
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
    } else {
      // Check for multiple eligible rows (mock)
      if (Math.random() > 0.5) {
        setEligibleRows(mockEligibleRows);
        setPendingSessionData({
          direction: Math.random() > 0.5 ? 'INBOUND' : 'OUTBOUND',
          nrAuto: nrAuto,
          plantId: selectedPlant,
        });
        setRowPickerOpen(true);
      } else {
        // Create new session directly
        const newSession: WeighSession = {
          id: `new-${Date.now()}`,
          sessionCode: `SC-${String(Date.now()).slice(-3)}`,
          direction: Math.random() > 0.5 ? 'INBOUND' : 'OUTBOUND',
          poNo: `PO-2024-${String(Date.now()).slice(-3)}`,
          orderNo: `ORD-2024-${String(Date.now()).slice(-3)}`,
          rowId: `ROW-${String(Date.now()).slice(-3)}`,
          nrAuto: nrAuto,
          step: '1/2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "Current User",
          plantId: selectedPlant,
          financeApproved: true,
        };
        setActiveSession(newSession);
        toast({
          title: "Sesiune creată",
          description: `Cod sesiune: ${newSession.sessionCode}`
        });
      }
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

  const handleNewWeighingCreated = (sessionData: { direction: Direction; orderNo?: string; poNo?: string; rowId: string; nrAuto: string; sofer: string }) => {
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
    };
    
    console.log('New session created:', newSession);
    
    // Adaugă doar în coadă, nu setează ca sesiune activă
    setQueue1(prev => [...prev, newSession]);
    
    toast({
      title: "Cântărire adăugată în coadă",
      description: `${sessionData.nrAuto || 'N/A'} - ${sessionData.sofer || 'N/A'}`
    });
  };

  const handleWeightEntered = async (type: 'TARA' | 'BRUT', value: number): Promise<boolean> => {
    if (!activeSession) return false;

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));

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
