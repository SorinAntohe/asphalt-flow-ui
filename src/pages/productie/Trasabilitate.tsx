import { GitBranch } from "lucide-react";

const Trasabilitate = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GitBranch className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Trasabilitate</h1>
          <p className="text-muted-foreground">Urmărire genealogică lot → produs → client</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <GitBranch className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include căutare lot cu grafic genealogic, 
          lista "where-used" și export impact clienți.
        </p>
      </div>
    </div>
  );
};

export default Trasabilitate;
