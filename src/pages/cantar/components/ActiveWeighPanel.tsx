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
  onWeightEntered: (type: 'TARA' | 'BRUT', value: number) => void;
  isLoading?: boolean;
  hasExistingSession?: boolean;
}

export function ActiveWeighPanel({ 
  session, 
  nrAuto, 
  onNrAutoChange, 
  onStartSession, 
  onWeightEntered,
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

  const handleWeightConfirm = async (weight: number) => {
    setIsSaving(true);
    try {
      await onWeightEntered(weightType, weight);
      toast({
        title: "Greutate salvată",
        description: `${weightType} de ${weight} kg a fost înregistrată cu succes.`
      });
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
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Pe Cântar
          </CardTitle>
          {session && (
            <Badge variant={isInbound ? "info" : "warning"} className="text-sm">
              {isInbound ? (
                <><Package className="h-3 w-3 mr-1" /> Recepție</>
              ) : (
                <><Truck className="h-3 w-3 mr-1" /> Livrare</>
              )}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Nr. Auto Input */}
        <div className="space-y-2">
          <Label htmlFor="nr-auto">Nr. Auto *</Label>
          <Input
            id="nr-auto"
            placeholder="Nr. înmatriculare"
            value={nrAuto}
            onChange={handleNrAutoChange}
            className="font-mono text-lg"
          />
        </div>

        {/* Start/Continue Session Button */}
        {!session && (
          <Button 
            onClick={onStartSession} 
            disabled={!nrAutoValid || isLoading}
            className="w-full h-12"
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Se procesează...</>
            ) : hasExistingSession ? (
              <><ArrowRight className="h-4 w-4 mr-2" /> Continuă sesiunea</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Start sesiune</>
            )}
          </Button>
        )}

        {/* Active Session Display */}
        {session && (
          <>
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {isInbound ? 'PO' : 'Comandă'}
                </span>
                <span className="font-medium">
                  {isInbound ? session.poNo : session.orderNo}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Row ID</span>
                <span className="font-mono text-sm">{session.rowId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Session Code</span>
                <Badge variant="premium" className="font-mono">
                  {session.sessionCode}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Step</span>
                <Badge variant="outline">{session.step}</Badge>
              </div>
            </div>

            <Separator />

            {/* Weight Entry Button */}
            {nextWeightType && (
              <Button 
                size="lg" 
                className="w-full h-16 text-lg"
                onClick={() => handleOpenWeightDialog(nextWeightType)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Se salvează...</>
                ) : (
                  <><Scale className="h-5 w-5 mr-2" /> Introdu {nextWeightType}</>
                )}
              </Button>
            )}

            {/* Weight Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">TARA</p>
                <p className="text-lg font-mono font-medium">
                  {session.tara ? `${session.tara.toLocaleString('ro-RO')} kg` : '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">BRUT</p>
                <p className="text-lg font-mono font-medium">
                  {session.masaBrut ? `${session.masaBrut.toLocaleString('ro-RO')} kg` : '—'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">NET</p>
                <p className="text-2xl font-mono font-bold text-primary">
                  {masaNet !== null ? `${masaNet.toLocaleString('ro-RO')} kg` : '—'}
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

            {/* Footer Info */}
            <div className="mt-auto pt-4 border-t space-y-2">
              <p className="text-xs text-muted-foreground">
                Creat de {session.createdBy} la {new Date(session.createdAt).toLocaleString('ro-RO')}
              </p>
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Deschide rândul în listă
              </Button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!session && !nrAuto && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Introduceți Nr. Auto pentru a începe</p>
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
      />
    </Card>
  );
}
