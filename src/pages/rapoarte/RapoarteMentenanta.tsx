import { LineChart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";

const RapoarteMentenanta = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <NavLink to="/rapoarte">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </NavLink>
        <div className="flex items-center gap-3">
          <LineChart className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Rapoarte Mentenanță</h1>
            <p className="text-muted-foreground">MTBF/MTTR, cost per utilaj</p>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <LineChart className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Modul în dezvoltare</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Această secțiune va include rapoarte de mentenanță: MTBF/MTTR, 
          cost per utilaj și ore indisponibilitate.
        </p>
      </div>
    </div>
  );
};

export default RapoarteMentenanta;
