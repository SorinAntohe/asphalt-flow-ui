import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Check, Loader2 } from "lucide-react";

interface ManualWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weightType: 'TARA' | 'BRUT';
  onConfirm: (weight: number, observatii?: string) => void;
  isLoading?: boolean;
  isStep2?: boolean;
}

export function ManualWeightDialog({ open, onOpenChange, weightType, onConfirm, isLoading, isStep2 }: ManualWeightDialogProps) {
  const [value, setValue] = useState("");
  const [observatii, setObservatii] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      setError("Introduceți o greutate validă (> 0 kg)");
      return;
    }

    onConfirm(numValue, isStep2 ? observatii : undefined);
    handleClose();
  };

  const handleClose = () => {
    setValue("");
    setObservatii("");
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
            Introduceți greutatea în kilograme
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <Label className="text-sm text-muted-foreground">Greutate (kg)</Label>
            <Input
              type="number"
              placeholder="0"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              className="mt-2 text-2xl font-mono h-14 text-center"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && value) {
                  handleConfirm();
                }
              }}
            />
          </div>

          {isStep2 && (
            <div className="mb-4">
              <Label className="text-sm text-muted-foreground">Observații</Label>
              <Textarea
                placeholder="Observații opționale..."
                value={observatii}
                onChange={(e) => setObservatii(e.target.value)}
                className="mt-2 min-h-[80px]"
              />
            </div>
          )}

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
          <Button 
            onClick={handleConfirm} 
            className="flex-1" 
            disabled={!value || isLoading}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Se salvează...</>
            ) : (
              <><Check className="h-4 w-4 mr-2" /> Confirmă</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
