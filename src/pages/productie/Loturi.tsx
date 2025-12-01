import { Layers } from "lucide-react";

const Loturi = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Layers className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Loturi & Telemetrie</h1>
          <p className="text-muted-foreground">Gestionare batch-uri și parametri măsurați</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Layers className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include gestionarea loturilor cu parametri QC, 
          verdict calitate și integrare telemetrie.
        </p>
      </div>
    </div>
  );
};

export default Loturi;
