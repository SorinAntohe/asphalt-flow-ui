import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const ContabilitateRapoarte = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Contabilitate & Rapoarte</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Rapoarte Contabile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Această pagină va conține rapoartele contabile și situațiile financiare.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContabilitateRapoarte;
