import { FlaskConical } from "lucide-react";

const Retete = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FlaskConical className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rețete (Mix Design)</h1>
          <p className="text-muted-foreground">Gestionare rețete de producție pentru asfalt, beton și balast</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <FlaskConical className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include gestionarea rețetelor cu componență, parametri proces, 
          calitate, versiuni și funcții de autocorecție umiditate.
        </p>
      </div>
    </div>
  );
};

export default Retete;
