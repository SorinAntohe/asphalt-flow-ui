import { ClipboardCheck } from "lucide-react";

const OrdineProductie = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ordine de Producție</h1>
          <p className="text-muted-foreground">Planificare și urmărire ordine de producție</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <ClipboardCheck className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include vederi Listă, Kanban și Calendar pentru ordine, 
          cu wizard de lansare și gestionare stocuri.
        </p>
      </div>
    </div>
  );
};

export default OrdineProductie;
