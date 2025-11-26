import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const SoferiAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    numeSofer: "",
    ci: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numeSofer || !formData.ci) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: "Șoferul a fost adăugat cu succes"
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
          <h1 className="text-3xl font-bold tracking-tight">Adaugă Șofer</h1>
          <p className="text-muted-foreground mt-2">
            Completați formularul pentru a adăuga un șofer nou
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Șofer</CardTitle>
          <CardDescription>
            Introduceți informațiile despre șoferul nou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="numeSofer">Nume Șofer *</Label>
                <Input
                  id="numeSofer"
                  placeholder="Ex: Ion Popescu"
                  value={formData.numeSofer}
                  onChange={(e) => setFormData({ ...formData, numeSofer: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="ci">C.I. *</Label>
                <Input
                  id="ci"
                  placeholder="Ex: AB123456"
                  value={formData.ci}
                  onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/liste")}>
                Anulează
              </Button>
              <Button type="submit">
                Adaugă Șofer
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SoferiAdd;
