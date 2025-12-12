import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, Truck, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const MentenantaFlotaSection = () => {
  const echipamente = [
    { nume: "Stație Asfalt #1", status: "operațional", oreRamase: 120 },
    { nume: "Stație Asfalt #2", status: "mentenanță", oreRamase: 0 },
    { nume: "Cântar Pod", status: "operațional", oreRamase: 450 },
  ];

  const flota = {
    total: 12,
    disponibile: 8,
    inCursa: 3,
    inMentenanta: 1,
  };

  const interventiiPlanificate = [
    { echipament: "Stație Asfalt #2", tip: "Revizie generală", data: "15.01.2025" },
    { echipament: "Camion B-45-XYZ", tip: "Schimb ulei", data: "18.01.2025" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Status Echipamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {echipamente.map((eq, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {eq.status === "operațional" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="font-medium text-sm">{eq.nume}</span>
                </div>
                <Badge 
                  variant={eq.status === "operațional" ? "outline" : "secondary"}
                  className="text-xs"
                >
                  {eq.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Status Flotă
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{flota.total}</p>
              <p className="text-xs text-muted-foreground">Total vehicule</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{flota.disponibile}</p>
              <p className="text-xs text-muted-foreground">Disponibile</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{flota.inCursa}</p>
              <p className="text-xs text-muted-foreground">În cursă</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-500/10">
              <p className="text-2xl font-bold text-yellow-600">{flota.inMentenanta}</p>
              <p className="text-xs text-muted-foreground">Mentenanță</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Intervenții Planificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {interventiiPlanificate.map((interventie, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <p className="font-medium text-sm">{interventie.echipament}</p>
                <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                  <span>{interventie.tip}</span>
                  <span>{interventie.data}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MentenantaFlotaSection;
