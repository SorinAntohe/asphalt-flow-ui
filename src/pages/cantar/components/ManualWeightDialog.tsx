import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check } from "lucide-react";

interface ManualWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weightType: 'TARA' | 'BRUT';
  onConfirm: (weight: number) => void;
  isLoading?: boolean;
}

export function ManualWeightDialog({ open, onOpenChange, weightType, onConfirm, isLoading }: ManualWeightDialogProps) {
  const [value, setValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState("");

  const handleNext = () => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      setError("Introduceți o greutate validă (> 0 kg)");
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = () => {
    const numValue = parseFloat(value);
    const numConfirm = parseFloat(confirmValue);
    
    if (!confirmValue || isNaN(numConfirm) || numConfirm <= 0) {
      setError("Confirmați greutatea");
      return;
    }

    const diff = Math.abs(numValue - numConfirm);
    if (diff > 10) {
      setError(`Diferență > 10 kg între valori (${diff} kg). Verificați!`);
      return;
    }

    onConfirm(numValue);
    handleClose();
  };

  const handleClose = () => {
    setValue("");
    setConfirmValue("");
    setStep('enter');
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Introdu {weightType === 'TARA' ? 'TARA' : 'MASA BRUT'}
          </DialogTitle>
          <DialogDescription>
            {step === 'enter' 
              ? 'Introduceți greutatea în kilograme' 
              : 'Confirmați greutatea introducând-o din nou'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <Label className="text-sm text-muted-foreground">
              {step === 'enter' ? 'Greutate (kg)' : 'Confirmare greutate (kg)'}
            </Label>
            <Input
              type="number"
              placeholder="0"
              value={step === 'enter' ? value : confirmValue}
              onChange={(e) => {
                if (step === 'enter') {
                  setValue(e.target.value);
                } else {
                  setConfirmValue(e.target.value);
                }
                setError("");
              }}
              className="mt-2 text-2xl font-mono h-14 text-center"
              autoFocus
            />
            {step === 'confirm' && (
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Valoare inițială: <span className="font-mono font-medium">{value} kg</span>
              </p>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 text-destructive rounded-lg text-sm">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Anulează
          </Button>
          {step === 'enter' ? (
            <Button onClick={handleNext} className="flex-1" disabled={!value}>
              Continuă
            </Button>
          ) : (
            <Button 
              onClick={handleConfirm} 
              className="flex-1" 
              disabled={!confirmValue || isLoading}
            >
              <Check className="h-4 w-4 mr-2" />
              Confirmă
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
