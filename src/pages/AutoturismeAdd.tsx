import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AutoturismeAdd = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tipMasina: "",
    nrAuto: "",
    sarcinaMax: "",
    tipTransport: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipMasina || !formData.nrAuto || !formData.sarcinaMax || !formData.tipTransport) {
      toast({
        title: "Eroare",
        description: "Toate câmpurile sunt obligatorii",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Succes",
      description: "Autoturismul a fost adăugat cu succes"
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
          <h1 className="text-3xl font-bold tracking-tight">Adaugă Autoturism</h1>
          <p className="text-muted-foreground mt-2">
            Completați formularul pentru a adăuga un autoturism nou
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalii Autoturism</CardTitle>
          <CardDescription>
            Introduceți informațiile despre autoturismul nou
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tipMasina">Tip Mașină *</Label>
                <Input
                  id="tipMasina"
                  placeholder="Ex: Camion cisternă"
                  value={formData.tipMasina}
                  onChange={(e) => setFormData({ ...formData, tipMasina: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="nrAuto">Număr Auto *</Label>
                <Input
                  id="nrAuto"
                  placeholder="Ex: B-123-ABC"
                  value={formData.nrAuto}
                  onChange={(e) => setFormData({ ...formData, nrAuto: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sarcinaMax">Sarcină Maximă *</Label>
                <Input
                  id="sarcinaMax"
                  placeholder="Ex: 25t"
                  value={formData.sarcinaMax}
                  onChange={(e) => setFormData({ ...formData, sarcinaMax: e.target.value })}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipTransport">Tip Transport *</Label>
                <Select value={formData.tipTransport} onValueChange={(value) => setFormData({ ...formData, tipTransport: value })}>
                  <SelectTrigger id="tipTransport">
                    <SelectValue placeholder="Selectează tip transport" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Propriu">Propriu</SelectItem>
                    <SelectItem value="Inchiriat">Închiriat</SelectItem>
                    <SelectItem value="Extern">Extern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => navigate("/liste")}>
                Anulează
              </Button>
              <Button type="submit">
                Adaugă Autoturism
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoturismeAdd;
