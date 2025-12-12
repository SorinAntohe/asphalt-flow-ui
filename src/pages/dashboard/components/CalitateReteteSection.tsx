import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, FileText, Beaker } from "lucide-react";

const CalitateReteteSection = () => {
  const calitateStats = {
    conforme: 25,
    neconforme: 2,
    inAsteptare: 3,
    rataConformitate: 92.6,
  };

  const ultimeleVerificari = [
    { lot: "LOT-2024-0145", produs: "BA 16", verdict: "Conform", temperatura: "165°C", marshall: "8.5" },
    { lot: "LOT-2024-0144", produs: "BAD 22.4", verdict: "Conform", temperatura: "162°C", marshall: "8.2" },
    { lot: "LOT-2024-0143", produs: "MASF 8", verdict: "Neconform", temperatura: "158°C", marshall: "7.1" },
  ];

  const reteteActive = [
    { cod: "R-BA16-V3", denumire: "BA 16 Standard", utilizari: 45 },
    { cod: "R-BAD22-V2", denumire: "BAD 22.4 Premium", utilizari: 32 },
    { cod: "R-MASF8-V1", denumire: "MASF 8 Autostrăzi", utilizari: 18 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Control Calitate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 rounded-lg bg-green-500/10">
              <p className="text-xl font-bold text-green-600">{calitateStats.conforme}</p>
              <p className="text-xs text-muted-foreground">Conforme</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-destructive/10">
              <p className="text-xl font-bold text-destructive">{calitateStats.neconforme}</p>
              <p className="text-xs text-muted-foreground">Neconforme</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-yellow-500/10">
              <p className="text-xl font-bold text-yellow-600">{calitateStats.inAsteptare}</p>
              <p className="text-xs text-muted-foreground">În așteptare</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-primary/10">
              <p className="text-xl font-bold text-primary">{calitateStats.rataConformitate}%</p>
              <p className="text-xs text-muted-foreground">Rată</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Ultimele verificări</p>
            {ultimeleVerificari.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                <div className="flex items-center gap-2">
                  {item.verdict === "Conform" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="font-medium">{item.lot}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.temperatura}</span>
                  <span>•</span>
                  <span>M: {item.marshall}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Beaker className="h-4 w-4" />
            Rețete Active
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reteteActive.map((reteta, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{reteta.denumire}</p>
                  <p className="text-xs text-muted-foreground">{reteta.cod}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {reteta.utilizari} utilizări
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalitateReteteSection;
