import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const ParteneriSolduri = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Parteneri & Solduri</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Parteneri și Solduri</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Această pagină va conține informații despre parteneri (clienți și furnizori) și soldurile aferente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParteneriSolduri;
