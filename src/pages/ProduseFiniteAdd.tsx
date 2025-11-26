import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ProduseFiniteAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [denumire, setDenumire] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!denumire) {
      toast({
        title: "Eroare",
        description: "Denumirea este obligatorie",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: "Produsul finit a fost adăugat cu succes"
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
          <h1 className="text-3xl font-bold tracking-tight">Adaugă Produs Finit</h1>
          <p className="text-muted-foreground mt-2">
            Completați formularul pentru a adăuga un produs finit nou
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Produs Finit</CardTitle>
          <CardDescription>
            Introduceți informațiile despre produsul finit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="denumire">Denumire *</Label>
                <Input
                  id="denumire"
                  placeholder="Ex: Asfalt tip A"
                  value={denumire}
                  onChange={(e) => setDenumire(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/liste")}>
                Anulează
              </Button>
              <Button type="submit">
                Adaugă Produs Finit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProduseFiniteAdd;
