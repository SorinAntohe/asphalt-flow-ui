import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Scale, Lock } from "lucide-react";
import { EligibleRow } from "../types";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RowPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rows: EligibleRow[];
  onSelect: (rowId: string) => void;
  orderOrPo: string;
  isInbound: boolean;
}

export function RowPickerDialog({ open, onOpenChange, rows, onSelect, orderOrPo, isInbound }: RowPickerDialogProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Selectează rândul pentru cântărire</DialogTitle>
          <DialogDescription>
            {isInbound ? 'PO' : 'Comanda'}: <span className="font-medium">{orderOrPo}</span> — 
            Există mai multe rânduri eligibile. Selectați rândul corect.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Produs</TableHead>
                <TableHead className="text-right">Cantitate</TableHead>
                <TableHead>Nr. Auto</TableHead>
                <TableHead>Stare Greutăți</TableHead>
                <TableHead className="w-20">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow 
                  key={row.id}
                  className={cn(
                    "cursor-pointer transition-colors",
                    selectedId === row.id && "bg-primary/10",
                    row.isOnScale && "opacity-60 cursor-not-allowed"
                  )}
                  onClick={() => !row.isOnScale && setSelectedId(row.id)}
                >
                  <TableCell>
                    {selectedId === row.id && !row.isOnScale && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{row.produs}</TableCell>
                  <TableCell className="text-right">{row.cantitate.toLocaleString('ro-RO')} kg</TableCell>
                  <TableCell className="font-mono text-sm">{row.nrAuto || '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Badge variant={row.hasTara ? "success" : "outline"} className="text-xs">
                        TARA {row.hasTara ? '✓' : '—'}
                      </Badge>
                      <Badge variant={row.hasBrut ? "success" : "outline"} className="text-xs">
                        BRUT {row.hasBrut ? '✓' : '—'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {row.isOnScale ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="destructive" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Blocat
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Pe cântar: {row.onScaleSessionCode}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        <Scale className="h-3 w-3 mr-1" />
                        Disponibil
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            <Check className="h-4 w-4 mr-2" />
            Selectează
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
