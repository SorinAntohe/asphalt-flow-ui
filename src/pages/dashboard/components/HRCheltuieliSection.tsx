import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Home, Clock, DollarSign } from "lucide-react";

const HRCheltuieliSection = () => {
  const hrStats = {
    totalAngajati: 45,
    prezentiAzi: 42,
    inConcediu: 2,
    absenti: 1,
  };

  const cheltuieliFixe = [
    { categorie: "Salarii", valoare: "125,000 lei", procent: 52 },
    { categorie: "Chirie amplasament", valoare: "18,500 lei", procent: 8 },
    { categorie: "Utilități", valoare: "12,300 lei", procent: 5 },
    { categorie: "Asigurări", valoare: "8,200 lei", procent: 3 },
    { categorie: "Alte cheltuieli", valoare: "15,400 lei", procent: 6 },
  ];

  const pontajSumar = {
    oreNormale: 336,
    oreSuplimentare: 24,
    oreNoapte: 48,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Personal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{hrStats.totalAngajati}</p>
              <p className="text-xs text-muted-foreground">Total angajați</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{hrStats.prezentiAzi}</p>
              <p className="text-xs text-muted-foreground">Prezenți azi</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{hrStats.inConcediu}</p>
              <p className="text-xs text-muted-foreground">În concediu</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-destructive/10">
              <p className="text-2xl font-bold text-destructive">{hrStats.absenti}</p>
              <p className="text-xs text-muted-foreground">Absenți</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Home className="h-4 w-4" />
            Cheltuieli Fixe (lună)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cheltuieliFixe.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.categorie}</span>
                <span className="font-medium">{item.valoare}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex items-center justify-between text-sm font-bold">
              <span>Total</span>
              <span>179,400 lei</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Sumar Pontaj (săptămână)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm">Ore normale</span>
              <span className="font-bold">{pontajSumar.oreNormale} h</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10">
              <span className="text-sm">Ore suplimentare</span>
              <Badge variant="secondary" className="font-bold">{pontajSumar.oreSuplimentare} h</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
              <span className="text-sm">Ore noapte</span>
              <Badge variant="secondary" className="font-bold">{pontajSumar.oreNoapte} h</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HRCheltuieliSection;
