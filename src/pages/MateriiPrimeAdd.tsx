import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const materiiPrimeList = [
  "0/4 NAT", "0/4 CONC", "0/4 CRIBLURI", "4/8 CONC", "4/8 CRIBLURI", "4/8 NAT",
  "8/16 CONC", "8/16 CRIBLURI", "16/22.4 CONC", "16/22.4 CRIBLURI",
  "16/31.5 CRIBLURI", "16/31.5 CONC", "CTL", "BITUM 50/70", "BITUM 70/100",
  "FILLER CALCAR", "FILLER CIMENT", "CURENT ELECTRIC", "MOTORINA", "APA",
  "ACID CLORHIDRIC", "EMULGATOR CATIONIC", "EMULGATOR ANIONIC", "SARE DE DRUM",
  "CELULOZA TOPCEL", "CELULOZA TECHNOCEL", "ADITIV ADEZIUNE", "POLIMER SBS",
  "FIBRĂ CELULOZICĂ", "NISIP SILICOS"
];

const MateriiPrimeAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [denumire, setDenumire] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!denumire) {
      toast({
        title: "Eroare",
        description: "Selectați o materie primă",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: "Materia primă a fost adăugată cu succes"
    });
    navigate("/liste");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/liste")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adaugă Materie Primă</h1>
          <p className="text-muted-foreground mt-2">
            Selectați materia primă din lista disponibilă
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Materie Primă</CardTitle>
          <CardDescription>
            Selectați tipul de materie primă
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="denumire">Denumire *</Label>
                <Select value={denumire} onValueChange={setDenumire}>
                  <SelectTrigger id="denumire">
                    <SelectValue placeholder="Selectează materie primă" />
                  </SelectTrigger>
                  <SelectContent>
                    {materiiPrimeList.map(mp => (
                      <SelectItem key={mp} value={mp}>{mp}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/liste")}>
                Anulează
              </Button>
              <Button type="submit">
                Adaugă Materie Primă
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MateriiPrimeAdd;
