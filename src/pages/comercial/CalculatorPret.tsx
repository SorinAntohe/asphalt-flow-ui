import { useState, useEffect, useMemo } from "react";
import { Calculator, Plus, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { Separator } from "@/components/ui/separator";
import { API_BASE_URL } from "@/lib/api";

interface ProdusFinit {
  id: number;
  denumire: string;
}

interface ProdusSelectat {
  id: string;
  produs_id: string;
  denumire: string;
  cantitate: number;
  pret_unitar: number;
  pret_transport: number;
}

const CalculatorPret = () => {
  const [produseFinite, setProduseFinite] = useState<ProdusFinit[]>([]);
  const [produseSelectate, setProduseSelectate] = useState<ProdusSelectat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch produse finite
  useEffect(() => {
    const fetchProduse = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/liste/returneaza/produse_finite`);
        if (response.ok) {
          const data = await response.json();
          setProduseFinite(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduse();
  }, []);

  const produseOptions = useMemo(() => 
    produseFinite.map(p => ({ value: p.id.toString(), label: p.denumire })),
    [produseFinite]
  );

  const addProdus = () => {
    setProduseSelectate(prev => [...prev, {
      id: crypto.randomUUID(),
      produs_id: "",
      denumire: "",
      cantitate: 0,
      pret_unitar: 0,
      pret_transport: 0,
    }]);
  };

  const removeProdus = (id: string) => {
    setProduseSelectate(prev => prev.filter(p => p.id !== id));
  };

  const updateProdus = (id: string, field: keyof ProdusSelectat, value: string | number) => {
    setProduseSelectate(prev => prev.map(p => {
      if (p.id === id) {
        if (field === "produs_id") {
          const selected = produseFinite.find(pf => pf.id.toString() === value);
          return { ...p, produs_id: value as string, denumire: selected?.denumire || "" };
        }
        return { ...p, [field]: value };
      }
      return p;
    }));
  };

  // Calculate totals
  const totals = useMemo(() => {
    let totalProduse = 0;
    let totalTransport = 0;
    let totalCantitate = 0;

    produseSelectate.forEach(p => {
      const subtotalProdus = p.cantitate * p.pret_unitar;
      const subtotalTransport = p.cantitate * p.pret_transport;
      totalProduse += subtotalProdus;
      totalTransport += subtotalTransport;
      totalCantitate += p.cantitate;
    });

    return {
      totalProduse,
      totalTransport,
      totalCantitate,
      totalGeneral: totalProduse + totalTransport,
    };
  }, [produseSelectate]);

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Calculator className="h-7 w-7 text-primary" />
            Calculator Preț
          </h1>
          <p className="text-muted-foreground mt-1">
            Calculează prețul total pentru produse finite
          </p>
        </div>
        <Button onClick={addProdus} className="gap-2">
          <Plus className="h-4 w-4" />
          Adaugă Produs
        </Button>
      </div>

      {/* Products List */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produse Selectate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {produseSelectate.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Niciun produs adăugat</p>
              <p className="text-sm">Apasă "Adaugă Produs" pentru a începe calculul</p>
            </div>
          ) : (
            <div className="space-y-4">
              {produseSelectate.map((produs, index) => (
                <div key={produs.id} className="p-4 border border-border rounded-lg bg-muted/30">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      Produs #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProdus(produs.id)}
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Label>Produs</Label>
                      <FilterableSelect
                        value={produs.produs_id}
                        onValueChange={(value) => updateProdus(produs.id, "produs_id", value)}
                        options={produseOptions}
                        placeholder="Selectează produs..."
                        searchPlaceholder="Caută produs..."
                      />
                    </div>
                    
                    <div>
                      <Label>Cantitate (tone)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={produs.cantitate || ""}
                        onChange={(e) => updateProdus(produs.id, "cantitate", parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    
                    <div>
                      <Label>Preț Unitar (RON/tonă)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={produs.pret_unitar || ""}
                        onChange={(e) => updateProdus(produs.id, "pret_unitar", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div>
                      <Label>Preț Transport (RON/tonă)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={produs.pret_transport || ""}
                        onChange={(e) => updateProdus(produs.id, "pret_transport", parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Row subtotal */}
                  <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subtotal Produs: </span>
                      <span className="font-medium">{formatCurrency(produs.cantitate * produs.pret_unitar)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Subtotal Transport: </span>
                      <span className="font-medium">{formatCurrency(produs.cantitate * produs.pret_transport)}</span>
                    </div>
                    <div className="ml-auto">
                      <span className="text-muted-foreground">Total Rând: </span>
                      <span className="font-semibold text-primary">
                        {formatCurrency(produs.cantitate * (produs.pret_unitar + produs.pret_transport))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Totals Summary */}
      {produseSelectate.length > 0 && (
        <Card variant="elevated" className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Sumar Calcul
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Cantitate Totală</p>
                <p className="text-2xl font-bold">{totals.totalCantitate.toFixed(2)} tone</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Produse</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalProduse)}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Total Transport</p>
                <p className="text-2xl font-bold">{formatCurrency(totals.totalTransport)}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Total General</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totals.totalGeneral)}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setProduseSelectate([])}
              >
                Resetează
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CalculatorPret;
