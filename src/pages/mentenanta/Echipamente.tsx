import { Settings } from "lucide-react";

const Echipamente = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Echipamente & Flotă</h1>
          <p className="text-muted-foreground">Gestionare utilaje, vehicule și fișe tehnice</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <Settings className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include gestionarea echipamentelor cu ore funcționare, 
          revizii, status și documente (RCA/ITP).
        </p>
      </div>
    </div>
  );
};

export default Echipamente;
