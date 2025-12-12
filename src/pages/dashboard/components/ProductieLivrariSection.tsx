import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Factory, Truck, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const ProductieLivrariSection = () => {
  const productieStats = {
    productieAzi: "2,450 t",
    planAzi: "2,200 t",
    realizare: 111.4,
    loturiProduse: 28,
  };

  const livrariStats = {
    livrariFinalizate: 18,
    livrariInCurs: 5,
    livrariProgramate: 8,
    toneLivrate: "1,850 t",
  };

  const ultimeleLoturi = [
    { cod: "LOT-2024-0145", produs: "BA 16", cantitate: "85 t", status: "finalizat", ora: "10:45" },
    { cod: "LOT-2024-0146", produs: "BAD 22.4", cantitate: "120 t", status: "în producție", ora: "11:20" },
    { cod: "LOT-2024-0147", produs: "MASF 8", cantitate: "45 t", status: "programat", ora: "12:00" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Producție
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{productieStats.productieAzi}</p>
              <p className="text-xs text-muted-foreground">Producție azi</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold">{productieStats.planAzi}</p>
              <p className="text-xs text-muted-foreground">Plan</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
            <span className="text-sm">Realizare vs Plan</span>
            <Badge className="bg-green-600">{productieStats.realizare}%</Badge>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Ultimele loturi</p>
            {ultimeleLoturi.map((lot, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                <div className="flex items-center gap-2">
                  {lot.status === "finalizat" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : lot.status === "în producție" ? (
                    <Clock className="h-4 w-4 text-blue-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  )}
                  <span className="font-medium">{lot.cod}</span>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <span>{lot.produs} • {lot.cantitate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Livrări
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-2xl font-bold text-green-600">{livrariStats.livrariFinalizate}</p>
              <p className="text-xs text-muted-foreground">Finalizate</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-blue-500/10">
              <p className="text-2xl font-bold text-blue-600">{livrariStats.livrariInCurs}</p>
              <p className="text-xs text-muted-foreground">În curs</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 rounded-lg bg-yellow-500/10">
              <p className="text-xl font-bold text-yellow-600">{livrariStats.livrariProgramate}</p>
              <p className="text-xs text-muted-foreground">Programate</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <p className="text-xl font-bold">{livrariStats.toneLivrate}</p>
              <p className="text-xs text-muted-foreground">Tone livrate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductieLivrariSection;
