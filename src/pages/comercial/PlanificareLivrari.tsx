import { CalendarDays } from "lucide-react";

const PlanificareLivrari = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Planificare Livrări & Dispecerizare</h1>
          <p className="text-muted-foreground">Programare și alocare resurse pentru livrări</p>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <CalendarDays className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include un slot board cu drag-and-drop pentru planificarea 
          livrărilor, alocare șoferi/camioane și gestionare conflicte.
        </p>
      </div>
    </div>
  );
};

export default PlanificareLivrari;
