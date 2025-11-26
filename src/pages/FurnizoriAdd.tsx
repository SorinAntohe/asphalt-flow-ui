import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const FurnizoriAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    denumire: "",
    sediu: "",
    cui: "",
    nrReg: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.denumire || !formData.sediu || !formData.cui || !formData.nrReg) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: "Furnizorul a fost adăugat cu succes"
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
          <h1 className="text-3xl font-bold tracking-tight">Adaugă Furnizor</h1>
          <p className="text-muted-foreground mt-2">
            Completați formularul pentru a adăuga un furnizor nou
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Furnizor</CardTitle>
          <CardDescription>
            Introduceți informațiile despre furnizorul nou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="denumire">Denumire *</Label>
                <Input
                  id="denumire"
                  placeholder="Ex: Agregat SRL"
                  value={formData.denumire}
                  onChange={(e) => setFormData({ ...formData, denumire: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sediu">Sediu *</Label>
                <Input
                  id="sediu"
                  placeholder="Ex: Ploiești"
                  value={formData.sediu}
                  onChange={(e) => setFormData({ ...formData, sediu: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="cui">CUI *</Label>
                <Input
                  id="cui"
                  placeholder="Ex: RO11111111"
                  value={formData.cui}
                  onChange={(e) => setFormData({ ...formData, cui: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nrReg">Nr. REG *</Label>
                <Input
                  id="nrReg"
                  placeholder="Ex: J29/1111/2017"
                  value={formData.nrReg}
                  onChange={(e) => setFormData({ ...formData, nrReg: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/liste")}>
                Anulează
              </Button>
              <Button type="submit">
                Adaugă Furnizor
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FurnizoriAdd;
