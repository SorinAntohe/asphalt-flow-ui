import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react";

const ConcurentaPreturiSection = () => {
  const preturiComparative = [
    { produs: "BA 16", pretNostru: 320, pretMediu: 335, diferenta: -4.5 },
    { produs: "BAD 22.4", pretNostru: 295, pretMediu: 310, diferenta: -4.8 },
    { produs: "MASF 8", pretNostru: 380, pretMediu: 375, diferenta: 1.3 },
    { produs: "BSC", pretNostru: 185, pretMediu: 190, diferenta: -2.6 },
  ];

  const marjeProduse = [
    { produs: "BA 16", marja: 18.5 },
    { produs: "BAD 22.4", marja: 22.1 },
    { produs: "MASF 8", marja: 15.8 },
    { produs: "BSC", marja: 12.3 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Prețuri vs Concurență
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {preturiComparative.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">{item.produs}</p>
                  <p className="text-xs text-muted-foreground">
                    Noi: {item.pretNostru} lei/t • Piață: {item.pretMediu} lei/t
                  </p>
                </div>
                <Badge 
                  variant={item.diferenta < 0 ? "outline" : "secondary"}
                  className={`text-xs ${item.diferenta < 0 ? "text-green-600 border-green-600" : "text-destructive border-destructive"}`}
                >
                  {item.diferenta < 0 ? <TrendingDown className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1" />}
                  {item.diferenta > 0 ? "+" : ""}{item.diferenta}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Marje pe Produse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marjeProduse.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.produs}</span>
                  <span className={`font-bold ${item.marja >= 18 ? "text-green-600" : item.marja >= 15 ? "text-yellow-600" : "text-destructive"}`}>
                    {item.marja}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${item.marja >= 18 ? "bg-green-500" : item.marja >= 15 ? "bg-yellow-500" : "bg-destructive"}`}
                    style={{ width: `${Math.min(item.marja * 4, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConcurentaPreturiSection;
