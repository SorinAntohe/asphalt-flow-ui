import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Check, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleKeyPress = (key: string) => {
    if (step === 'enter') {
      if (key === 'clear') {
        setValue("");
      } else if (key === 'backspace') {
        setValue(v => v.slice(0, -1));
      } else {
        setValue(v => v + key);
      }
    } else {
      if (key === 'clear') {
        setConfirmValue("");
      } else if (key === 'backspace') {
        setConfirmValue(v => v.slice(0, -1));
      } else {
        setConfirmValue(v => v + key);
      }
    }
    setError("");
  };

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

  const numPadKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'];

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
            <div className="mt-1 p-4 bg-muted/50 rounded-lg text-center">
              <span className="text-4xl font-mono font-bold">
                {step === 'enter' ? (value || '0') : (confirmValue || '0')}
              </span>
              <span className="text-2xl text-muted-foreground ml-2">kg</span>
            </div>
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

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2">
            {numPadKeys.map((key) => (
              <Button
                key={key}
                variant="outline"
                size="lg"
                className="h-14 text-xl font-mono"
                onClick={() => handleKeyPress(key)}
              >
                {key}
              </Button>
            ))}
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={() => handleKeyPress('backspace')}
            >
              <Delete className="h-5 w-5" />
            </Button>
          </div>

          <Button
            variant="ghost"
            className="w-full mt-2"
            onClick={() => handleKeyPress('clear')}
          >
            Șterge tot
          </Button>
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
