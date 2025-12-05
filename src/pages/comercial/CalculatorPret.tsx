import { useState, useEffect, useMemo } from "react";
import { Calculator, Plus, Trash2, TrendingUp, TrendingDown, Minus, BarChart3, Users, Zap, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

interface Reteta {
  cod_reteta: string;
  denumire: string;
  tip: string;
}

interface CostBreakdown {
  materiale: { material: string; cantitate: number; pretUnitar: number; total: number }[];
  curent: number;
  costuriIndirecte: {
    manopera: number;
    amortizare: number;
    mentenanta: number;
    administrative: number;
  };
  costTotal: number;
  pretRecomandat: number;
}

interface PretConcurent {
  id: string;
  concurent: string;
  produs: string;
  pret: number;
}

const CalculatorPret = () => {
  // Input parameters state
  const [retete, setRetete] = useState<Reteta[]>([]);
  const [selectedReteta, setSelectedReteta] = useState("");
  const [cantitate, setCantitate] = useState("");
  const [marjaProfit, setMarjaProfit] = useState(15);
  const [loading, setLoading] = useState(false);

  // Calculation result state
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);

  // Competitor prices state
  const [preturiConcurenti, setPreturiConcurenti] = useState<PretConcurent[]>([]);
  const [newConcurent, setNewConcurent] = useState({ concurent: "", produs: "", pret: "" });

  // Fetch retete
  useEffect(() => {
    const fetchRetete = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
        if (response.ok) {
          const data = await response.json();
          setRetete(data);
        }
      } catch (error) {
        console.error("Error fetching retete:", error);
      }
    };
    fetchRetete();
  }, []);

  const retetaOptions = useMemo(() => 
    retete.map(r => ({ 
      value: r.cod_reteta, 
      label: `${r.cod_reteta} - ${r.denumire}` 
    })),
    [retete]
  );

  // Calculate price
  const handleCalculate = () => {
    if (!selectedReteta || !cantitate) {
      toast.error("Selectați o rețetă și introduceți cantitatea");
      return;
    }

    setLoading(true);
    
    // Simulate calculation (in real app, this would be an API call)
    setTimeout(() => {
      const qty = parseFloat(cantitate);
      const marja = marjaProfit / 100;
      
      // Mock cost breakdown based on quantity
      const mockBreakdown: CostBreakdown = {
        materiale: [
          { material: "Bitum 50/70", cantitate: qty * 0.05, pretUnitar: 3500, total: qty * 0.05 * 3500 },
          { material: "Agregat 0/4", cantitate: qty * 0.35, pretUnitar: 45, total: qty * 0.35 * 45 },
          { material: "Agregat 4/8", cantitate: qty * 0.25, pretUnitar: 50, total: qty * 0.25 * 50 },
          { material: "Filler", cantitate: qty * 0.08, pretUnitar: 120, total: qty * 0.08 * 120 },
          { material: "Agregat 8/16", cantitate: qty * 0.27, pretUnitar: 55, total: qty * 0.27 * 55 },
        ],
        curent: qty * 15, // 15 RON/tonă pentru curent
        costuriIndirecte: {
          manopera: qty * 25,
          amortizare: qty * 18,
          mentenanta: qty * 12,
          administrative: qty * 8,
        },
        costTotal: 0,
        pretRecomandat: 0
      };

      const costMateriale = mockBreakdown.materiale.reduce((sum, m) => sum + m.total, 0);
      const costIndirecte = Object.values(mockBreakdown.costuriIndirecte).reduce((sum, c) => sum + c, 0);
      mockBreakdown.costTotal = costMateriale + mockBreakdown.curent + costIndirecte;
      mockBreakdown.pretRecomandat = mockBreakdown.costTotal * (1 + marja);

      setCostBreakdown(mockBreakdown);
      setLoading(false);
      toast.success("Calculul a fost realizat cu succes");
    }, 500);
  };

  // Competitor price stats
  const competitorStats = useMemo(() => {
    if (preturiConcurenti.length === 0) {
      return { mediu: 0, minim: 0, maxim: 0 };
    }
    const preturi = preturiConcurenti.map(p => p.pret);
    return {
      mediu: preturi.reduce((a, b) => a + b, 0) / preturi.length,
      minim: Math.min(...preturi),
      maxim: Math.max(...preturi)
    };
  }, [preturiConcurenti]);

  // Add competitor price
  const handleAddConcurent = () => {
    if (!newConcurent.concurent || !newConcurent.produs || !newConcurent.pret) {
      toast.error("Completați toate câmpurile");
      return;
    }
    setPreturiConcurenti(prev => [...prev, {
      id: crypto.randomUUID(),
      concurent: newConcurent.concurent,
      produs: newConcurent.produs,
      pret: parseFloat(newConcurent.pret)
    }]);
    setNewConcurent({ concurent: "", produs: "", pret: "" });
  };

  // Remove competitor price
  const handleRemoveConcurent = (id: string) => {
    setPreturiConcurenti(prev => prev.filter(p => p.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="h-7 w-7 text-primary" />
          Calculator Preț
        </h1>
        <p className="text-muted-foreground mt-1">
          Calculează prețul recomandat pe baza costurilor și analizează concurența
        </p>
      </div>

      {/* Three Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Parametrii de Intrare */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Package className="h-5 w-5" />
              Parametrii de Intrare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rețetă</Label>
              <FilterableSelect
                value={selectedReteta}
                onValueChange={setSelectedReteta}
                options={retetaOptions}
                placeholder="Selectează rețeta..."
                searchPlaceholder="Caută rețetă..."
              />
            </div>

            <div>
              <Label>Cantitate (tone)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={cantitate}
                onChange={(e) => setCantitate(e.target.value)}
                placeholder="Ex: 100"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Marjă Profit</Label>
                <span className="text-sm font-semibold text-primary">{marjaProfit}%</span>
              </div>
              <Slider
                value={[marjaProfit]}
                onValueChange={(value) => setMarjaProfit(value[0])}
                min={0}
                max={30}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0%</span>
                <span>15%</span>
                <span>30%</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleCalculate}
              disabled={loading || !selectedReteta || !cantitate}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {loading ? "Se calculează..." : "Calculează Preț Recomandat"}
            </Button>
          </CardContent>
        </Card>

        {/* Card 2: Rezultat Calcul */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5" />
              Rezultat Calcul
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!costBreakdown ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Completați parametrii și apăsați "Calculează"</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Preț Recomandat */}
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                  <p className="text-sm text-muted-foreground">Preț Recomandat</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(costBreakdown.pretRecomandat / parseFloat(cantitate))}
                    <span className="text-sm font-normal text-muted-foreground">/tonă</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(costBreakdown.pretRecomandat)}
                  </p>
                </div>

                <Separator />

                {/* Cost Materii Prime */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Cost Materii Prime (FIFO)
                  </h4>
                  <div className="space-y-1 text-sm">
                    {costBreakdown.materiale.map((m, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{m.material}</span>
                        <span>{formatCurrency(m.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Curent */}
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Curent Electric
                  </span>
                  <span>{formatCurrency(costBreakdown.curent)}</span>
                </div>

                <Separator />

                {/* Costuri Indirecte */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Costuri Indirecte</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manoperă</span>
                      <span>{formatCurrency(costBreakdown.costuriIndirecte.manopera)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amortizare echipamente</span>
                      <span>{formatCurrency(costBreakdown.costuriIndirecte.amortizare)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mentenanță</span>
                      <span>{formatCurrency(costBreakdown.costuriIndirecte.mentenanta)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Administrative</span>
                      <span>{formatCurrency(costBreakdown.costuriIndirecte.administrative)}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-semibold">
                  <span>Cost Total Producție</span>
                  <span>{formatCurrency(costBreakdown.costTotal)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Prețuri Concurență */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Prețuri Concurență
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            {preturiConcurenti.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">Preț Mediu</p>
                  <p className="font-semibold text-sm flex items-center justify-center gap-1">
                    <Minus className="h-3 w-3 text-blue-500" />
                    {formatCurrency(competitorStats.mediu)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">Preț Minim</p>
                  <p className="font-semibold text-sm flex items-center justify-center gap-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    {formatCurrency(competitorStats.minim)}
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground">Preț Maxim</p>
                  <p className="font-semibold text-sm flex items-center justify-center gap-1">
                    <TrendingUp className="h-3 w-3 text-red-500" />
                    {formatCurrency(competitorStats.maxim)}
                  </p>
                </div>
              </div>
            )}

            {/* Add form */}
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Concurent"
                  value={newConcurent.concurent}
                  onChange={(e) => setNewConcurent(prev => ({ ...prev, concurent: e.target.value }))}
                />
                <Input
                  placeholder="Produs"
                  value={newConcurent.produs}
                  onChange={(e) => setNewConcurent(prev => ({ ...prev, produs: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Preț"
                  value={newConcurent.pret}
                  onChange={(e) => setNewConcurent(prev => ({ ...prev, pret: e.target.value }))}
                />
              </div>
              <Button variant="outline" size="sm" className="w-full" onClick={handleAddConcurent}>
                <Plus className="h-4 w-4 mr-1" />
                Adaugă Preț Concurent
              </Button>
            </div>

            <Separator />

            {/* Table */}
            {preturiConcurenti.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Niciun preț de concurență adăugat</p>
              </div>
            ) : (
              <div className="max-h-[250px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Concurent</TableHead>
                      <TableHead className="text-xs">Produs</TableHead>
                      <TableHead className="text-xs text-right">Preț</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preturiConcurenti.map((pret) => (
                      <TableRow key={pret.id}>
                        <TableCell className="text-sm py-2">{pret.concurent}</TableCell>
                        <TableCell className="text-sm py-2">{pret.produs}</TableCell>
                        <TableCell className="text-sm py-2 text-right font-medium">
                          {formatCurrency(pret.pret)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveConcurent(pret.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculatorPret;
