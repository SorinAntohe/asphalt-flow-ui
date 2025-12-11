import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Scale, Truck, Package, AlertTriangle, ExternalLink, Play, ArrowRight, Loader2 } from "lucide-react";
import { WeighSession } from "../types";
import { ManualWeightDialog } from "./ManualWeightDialog";
import { toast } from "@/hooks/use-toast";

interface ActiveWeighPanelProps {
  session: WeighSession | null;
  nrAuto: string;
  onNrAutoChange: (value: string) => void;
  onStartSession: () => void;
  onWeightEntered: (type: 'TARA' | 'BRUT', value: number, observatii?: string) => Promise<boolean>;
  onSessionCompleted?: (sessionId: string) => void;
  isLoading?: boolean;
  hasExistingSession?: boolean;
}

export function ActiveWeighPanel({ 
  session, 
  nrAuto, 
  onNrAutoChange, 
  onStartSession, 
  onWeightEntered,
  onSessionCompleted,
  isLoading,
  hasExistingSession 
}: ActiveWeighPanelProps) {
  const [weightDialogOpen, setWeightDialogOpen] = useState(false);
  const [weightType, setWeightType] = useState<'TARA' | 'BRUT'>('TARA');
  const [isSaving, setIsSaving] = useState(false);

  const handleNrAutoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNrAutoChange(e.target.value);
  };

  const nrAutoValid = nrAuto.trim().length > 0;

  const handleOpenWeightDialog = (type: 'TARA' | 'BRUT') => {
    setWeightType(type);
    setWeightDialogOpen(true);
  };

  const handleWeightConfirm = async (weight: number, observatii?: string) => {
    setIsSaving(true);
    try {
      const success = await onWeightEntered(weightType, weight, observatii);
      if (success) {
        toast({
          title: "Greutate salvată",
          description: `${weightType} de ${weight} kg a fost înregistrată cu succes.`
        });
        
        // If step 2/2 completed successfully, notify parent to remove from queue
        if (session?.step === '2/2' && onSessionCompleted) {
          onSessionCompleted(session.id);
        }
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva greutatea. Încercați din nou.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const isInbound = session?.direction === 'INBOUND';
  
  // Determine which weight to enter based on direction and step
  const getNextWeightType = (): 'TARA' | 'BRUT' | null => {
    if (!session) return null;
    if (isInbound) {
      // INBOUND: 1/2 = GROSS (BRUT), 2/2 = TARE
      if (session.step === '1/2') return 'BRUT';
      return 'TARA';
    } else {
      // OUTBOUND: 1/2 = TARE, 2/2 = GROSS (BRUT)
      if (session.step === '1/2') return 'TARA';
      return 'BRUT';
    }
  };

  const nextWeightType = getNextWeightType();
  const masaNet = session?.masaBrut && session?.tara 
    ? session.masaBrut - session.tara 
    : null;

  

  return (
    <Card className="h-full flex flex-col min-h-[350px] lg:min-h-0 md:col-span-2 lg:col-span-1">
      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Pe Cântar
          </CardTitle>
          {session && (
            <Badge variant={isInbound ? "info" : "warning"} className="text-xs sm:text-sm">
              {isInbound ? (
                <><Package className="h-3 w-3 mr-1" /> Recepție</>
              ) : (
                <><Truck className="h-3 w-3 mr-1" /> Livrare</>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 sm:gap-4 px-3 sm:px-6 pb-4">
        {/* Active Session Display */}
        {session && (
          <>
            <div className="p-3 sm:p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-xs sm:text-sm text-muted-foreground">Comandă</span>
                <span className="font-medium text-sm">
                  {isInbound ? session.poNo : session.orderNo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-muted-foreground">Pas</span>
                <Badge variant="outline" className="text-xs">{session.step}</Badge>
              </div>
            </div>

            <Separator />

            {/* Weight Entry Button */}
            {nextWeightType && (
              <Button 
                size="lg" 
                className="w-full h-12 sm:h-16 text-base sm:text-lg"
                onClick={() => handleOpenWeightDialog(nextWeightType)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-spin" /> Se salvează...</>
                ) : (
                  <><Scale className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Introdu {nextWeightType}</>
                )}
              </Button>
            )}

            {/* Weight Summary */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">TARA</p>
                <p className="text-sm sm:text-lg font-mono font-medium">
                  {session.tara ? `${session.tara.toLocaleString('ro-RO')} kg` : '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">BRUT</p>
                <p className="text-sm sm:text-lg font-mono font-medium">
                  {session.masaBrut ? `${session.masaBrut.toLocaleString('ro-RO')} kg` : '—'}
                </p>
              </div>
            </div>

            {/* Alerts */}
            {!isInbound && !session.financeApproved && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Livrare blocată de FINANCE. Documentul se poate genera din listă după aprobare.
                </AlertDescription>
              </Alert>
            )}

            {session.toleranceExceeded && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Depășește ±{session.tolerancePercent}%. Adaugă un motiv.
                </AlertDescription>
              </Alert>
            )}

          </>
        )}

        {/* Empty State */}
        {!session && (
          <div className="flex-1 flex items-center justify-center min-h-[100px]">
            <div className="text-center text-muted-foreground">
              <Scale className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-30" />
              <p className="text-xs sm:text-sm">Vă rugăm selectați un element din coadă</p>
            </div>
          </div>
        )}
      </CardContent>

      <ManualWeightDialog
        open={weightDialogOpen}
        onOpenChange={setWeightDialogOpen}
        weightType={weightType}
        onConfirm={handleWeightConfirm}
        isLoading={isSaving}
        isStep2={session?.step === '2/2'}
      />
    </Card>
  );
}
