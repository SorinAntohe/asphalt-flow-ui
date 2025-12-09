import { useState, useEffect, useMemo, useRef } from "react";
import { Calculator, Plus, Trash2, TrendingUp, TrendingDown, Minus, BarChart3, Users, Zap, Package, Info, History, CalendarIcon, AlertTriangle, Upload, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilterableSelect } from "@/components/ui/filterable-select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

interface Reteta {
  cod_reteta: string;
  denumire: string;
  tip: string;
}

interface CostBreakdown {
  materiale: { material: string; cantitate: number; pretUnitar: number; total: number }[];
  curentActiv: number;
  consumCTL: number;
  costuriIndirecte: {
    curentPasiv: number;
    salarii: number;
    amortizari: number;
    mentenanta: number;
    chirie: number;
  };
  costTotal: number;
  pretRecomandat: number;
}

interface PretConcurent {
  id: string;
  concurent: string;
  produs: string;
  pret: number;
  data: string;
}

interface PretCalculat {
  id: string;
  data: string;
  codReteta: string;
  denumireReteta: string;
  cantitate: number;
  marjaProfit: number;
  costTotal: number;
  pretRecomandat: number;
  pretPeTona: number;
}

// Mock data for demonstration
const mockRetete: Reteta[] = [
  { cod_reteta: "RET001", denumire: "BA 16 - Beton Asfaltic", tip: "Asfalt" },
  { cod_reteta: "RET002", denumire: "MASF 16 - Mixtura Asfaltica", tip: "Asfalt" },
  { cod_reteta: "RET003", denumire: "AB2 - Asfalt Beton tip 2", tip: "Asfalt" },
  { cod_reteta: "RET004", denumire: "Emulsie C60B4", tip: "Emulsie" },
  { cod_reteta: "RET005", denumire: "BAD 22.4 - Beton Asfaltic Deschis", tip: "Asfalt" },
];

const mockPreturiConcurenti: PretConcurent[] = [
  { id: "1", concurent: "Strabag", produs: "BA 16", pret: 385, data: "05/12/2024" },
  { id: "2", concurent: "Porr", produs: "BA 16", pret: 392, data: "03/12/2024" },
  { id: "3", concurent: "Colas", produs: "BA 16", pret: 378, data: "01/12/2024" },
  { id: "4", concurent: "Eurovia", produs: "MASF 16", pret: 410, data: "28/11/2024" },
  { id: "5", concurent: "Bitumex", produs: "BA 16", pret: 365, data: "25/11/2024" },
];

const mockCostBreakdown: CostBreakdown = {
  materiale: [
    { material: "Bitum 50/70", cantitate: 5, pretUnitar: 3500, total: 17500 },
    { material: "Agregat 0/4", cantitate: 35, pretUnitar: 45, total: 1575 },
    { material: "Agregat 4/8", cantitate: 25, pretUnitar: 50, total: 1250 },
    { material: "Filler", cantitate: 8, pretUnitar: 120, total: 960 },
    { material: "Agregat 8/16", cantitate: 27, pretUnitar: 55, total: 1485 },
  ],
  curentActiv: 1200,
  consumCTL: 800,
  costuriIndirecte: {
    curentPasiv: 300,
    salarii: 2500,
    amortizari: 1800,
    mentenanta: 1200,
    chirie: 600,
  },
  costTotal: 31770,
  pretRecomandat: 36535.5
};

const CalculatorPret = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("calculator");

  // Input parameters state
  const [retete, setRetete] = useState<Reteta[]>(mockRetete);
  const [selectedReteta, setSelectedReteta] = useState("RET001");
  const [cantitate, setCantitate] = useState("100");
  const [marjaProfit, setMarjaProfit] = useState(15);
  const [loading, setLoading] = useState(false);

  // Calculation result state
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(mockCostBreakdown);

  // Saved calculations state
  const [preturiCalculate, setPreturiCalculate] = useState<PretCalculat[]>([]);

  // Competitor prices state
  const [preturiConcurenti, setPreturiConcurenti] = useState<PretConcurent[]>(mockPreturiConcurenti);
  const [newConcurent, setNewConcurent] = useState({ concurent: "", produs: "", pret: "", data: "" });
  
  // Details dialog state
  const [showDetails, setShowDetails] = useState(false);
  const [selectedConcurent, setSelectedConcurent] = useState<PretConcurent | null>(null);
  const [isConcurentDetailOpen, setIsConcurentDetailOpen] = useState(false);
  const [isAddConcurentOpen, setIsAddConcurentOpen] = useState(false);
  
  // Stock shortage dialog state
  const [isStockShortageOpen, setIsStockShortageOpen] = useState(false);
  const [stockShortages, setStockShortages] = useState<{ material: string; necesar: number; stocDisponibil: number; cantitateNecesara: number; pretUnitar: string }[]>([]);
  const [ofertaFile, setOfertaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock available stock data (in real app, this would come from API)
  const mockStocuri: Record<string, number> = {
    "Bitum 50/70": 3,
    "Agregat 0/4": 20,
    "Agregat 4/8": 15,
    "Filler": 5,
    "Agregat 8/16": 18,
  };

  // Fetch retete (keeping for when API is available)
  useEffect(() => {
    const fetchRetete = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/productie/returneaza/retete`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setRetete(data);
          }
        }
      } catch (error) {
        console.error("Error fetching retete:", error);
        // Keep mock data on error
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

  // Check stock availability and open shortage dialog if needed
  const checkStockAvailability = (qty: number) => {
    const materialNeeds = [
      { material: "Bitum 50/70", necesar: qty * 0.05 },
      { material: "Agregat 0/4", necesar: qty * 0.35 },
      { material: "Agregat 4/8", necesar: qty * 0.25 },
      { material: "Filler", necesar: qty * 0.08 },
      { material: "Agregat 8/16", necesar: qty * 0.27 },
    ];
    
    const shortages = materialNeeds
      .filter(m => m.necesar > (mockStocuri[m.material] || 0))
      .map(m => ({
        material: m.material,
        necesar: m.necesar,
        stocDisponibil: mockStocuri[m.material] || 0,
        cantitateNecesara: m.necesar - (mockStocuri[m.material] || 0),
        pretUnitar: ""
      }));
    
    return shortages;
  };

  // Calculate price
  const handleCalculate = () => {
    if (!selectedReteta || !cantitate) {
      toast.error("Selectați o rețetă și introduceți cantitatea");
      return;
    }

    const qty = parseFloat(cantitate);
    
    // Check for stock shortages
    const shortages = checkStockAvailability(qty);
    if (shortages.length > 0) {
      setStockShortages(shortages);
      setOfertaFile(null);
      setIsStockShortageOpen(true);
      return;
    }
    
    proceedWithCalculation(qty);
  };
  
  // Handle stock shortage form submission
  const handleStockShortageSubmit = () => {
    // Validate all prices are filled
    const missingPrices = stockShortages.some(s => !s.pretUnitar || parseFloat(s.pretUnitar) <= 0);
    if (missingPrices) {
      toast.error("Completați prețurile pentru toate materialele");
      return;
    }
    
    setIsStockShortageOpen(false);
    const qty = parseFloat(cantitate);
    proceedWithCalculation(qty, stockShortages);
    toast.success("Oferta a fost înregistrată și calculul a fost realizat");
  };
  
  // Update shortage price
  const updateShortagePrice = (material: string, price: string) => {
    setStockShortages(prev => 
      prev.map(s => s.material === material ? { ...s, pretUnitar: price } : s)
    );
  };
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOfertaFile(file);
    }
  };
  
  // Remove uploaded file
  const handleRemoveFile = () => {
    setOfertaFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Proceed with calculation
  const proceedWithCalculation = (qty: number, shortagesWithPrices?: typeof stockShortages) => {
    setLoading(true);
    
    // Simulate calculation (in real app, this would be an API call)
    setTimeout(() => {
      const marja = marjaProfit / 100;
      
      // Mock cost breakdown based on quantity
      const mockBreakdown: CostBreakdown = {
        materiale: [
          { material: "Bitum 50/70", cantitate: qty * 0.05, pretUnitar: shortagesWithPrices?.find(s => s.material === "Bitum 50/70")?.pretUnitar ? parseFloat(shortagesWithPrices.find(s => s.material === "Bitum 50/70")!.pretUnitar) : 3500, total: 0 },
          { material: "Agregat 0/4", cantitate: qty * 0.35, pretUnitar: shortagesWithPrices?.find(s => s.material === "Agregat 0/4")?.pretUnitar ? parseFloat(shortagesWithPrices.find(s => s.material === "Agregat 0/4")!.pretUnitar) : 45, total: 0 },
          { material: "Agregat 4/8", cantitate: qty * 0.25, pretUnitar: shortagesWithPrices?.find(s => s.material === "Agregat 4/8")?.pretUnitar ? parseFloat(shortagesWithPrices.find(s => s.material === "Agregat 4/8")!.pretUnitar) : 50, total: 0 },
          { material: "Filler", cantitate: qty * 0.08, pretUnitar: shortagesWithPrices?.find(s => s.material === "Filler")?.pretUnitar ? parseFloat(shortagesWithPrices.find(s => s.material === "Filler")!.pretUnitar) : 120, total: 0 },
          { material: "Agregat 8/16", cantitate: qty * 0.27, pretUnitar: shortagesWithPrices?.find(s => s.material === "Agregat 8/16")?.pretUnitar ? parseFloat(shortagesWithPrices.find(s => s.material === "Agregat 8/16")!.pretUnitar) : 55, total: 0 },
        ],
        curentActiv: qty * 12,
        consumCTL: qty * 8,
        costuriIndirecte: {
          curentPasiv: qty * 3,
          salarii: qty * 25,
          amortizari: qty * 18,
          mentenanta: qty * 12,
          chirie: qty * 6,
        },
        costTotal: 0,
        pretRecomandat: 0
      };
      
      // Calculate totals for each material
      mockBreakdown.materiale = mockBreakdown.materiale.map(m => ({
        ...m,
        total: m.cantitate * m.pretUnitar
      }));

      const costMateriale = mockBreakdown.materiale.reduce((sum, m) => sum + m.total, 0);
      const costIndirecte = Object.values(mockBreakdown.costuriIndirecte).reduce((sum, c) => sum + c, 0);
      mockBreakdown.costTotal = costMateriale + mockBreakdown.curentActiv + mockBreakdown.consumCTL + costIndirecte;
      mockBreakdown.pretRecomandat = mockBreakdown.costTotal * (1 + marja);

      setCostBreakdown(mockBreakdown);

      // Auto-save calculation
      const reteta = retete.find(r => r.cod_reteta === selectedReteta);
      const newCalculation: PretCalculat = {
        id: crypto.randomUUID(),
        data: new Date().toLocaleDateString("ro-RO"),
        codReteta: selectedReteta,
        denumireReteta: reteta?.denumire || selectedReteta,
        cantitate: qty,
        marjaProfit: marjaProfit,
        costTotal: mockBreakdown.costTotal,
        pretRecomandat: mockBreakdown.pretRecomandat,
        pretPeTona: mockBreakdown.pretRecomandat / qty
      };
      setPreturiCalculate(prev => [newCalculation, ...prev]);

      setLoading(false);
      toast.success("Calculul a fost realizat și salvat");
    }, 500);
  };

  // Extract product name from selected recipe (e.g., "BA 16" from "BA 16 - Beton Asfaltic")
  const selectedProductName = useMemo(() => {
    const reteta = retete.find(r => r.cod_reteta === selectedReteta);
    if (!reteta) return "";
    // Extract product code from denumire (first part before " - ")
    const match = reteta.denumire.match(/^([A-Z0-9\s.]+)/i);
    return match ? match[1].trim() : reteta.denumire.split(" - ")[0].trim();
  }, [selectedReteta, retete]);

  // Filter competitor prices by selected product
  const filteredPreturiConcurenti = useMemo(() => {
    if (!selectedProductName) return preturiConcurenti;
    return preturiConcurenti.filter(p => 
      p.produs.toLowerCase() === selectedProductName.toLowerCase()
    );
  }, [preturiConcurenti, selectedProductName]);

  // Competitor price stats (based on filtered prices)
  const competitorStats = useMemo(() => {
    if (filteredPreturiConcurenti.length === 0) {
      return { mediu: 0, minim: 0, maxim: 0 };
    }
    const preturi = filteredPreturiConcurenti.map(p => p.pret);
    return {
      mediu: preturi.reduce((a, b) => a + b, 0) / preturi.length,
      minim: Math.min(...preturi),
      maxim: Math.max(...preturi)
    };
  }, [filteredPreturiConcurenti]);

  // Add competitor price
  const handleAddConcurent = () => {
    if (!newConcurent.concurent || !newConcurent.produs || !newConcurent.pret) {
      toast.error("Completați toate câmpurile obligatorii");
      return;
    }
    setPreturiConcurenti(prev => [...prev, {
      id: crypto.randomUUID(),
      concurent: newConcurent.concurent,
      produs: newConcurent.produs,
      pret: parseFloat(newConcurent.pret),
      data: newConcurent.data || new Date().toLocaleDateString("ro-RO")
    }]);
    setNewConcurent({ concurent: "", produs: "", pret: "", data: "" });
  };

  // Remove competitor price
  const handleRemoveConcurent = (id: string) => {
    setPreturiConcurenti(prev => prev.filter(p => p.id !== id));
  };

  // Remove saved calculation
  const handleRemoveCalculation = (id: string) => {
    setPreturiCalculate(prev => prev.filter(p => p.id !== id));
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="preturi-calculate" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Prețuri Calculate
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
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

                {/* Marja de Profit */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      Marjă Profit ({marjaProfit}%)
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {formatCurrency(costBreakdown.pretRecomandat - costBreakdown.costTotal)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatCurrency((costBreakdown.pretRecomandat - costBreakdown.costTotal) / parseFloat(cantitate))}/tonă
                  </p>
                </div>

                {/* Analiză Comparativă Concurență */}
                {filteredPreturiConcurenti.length > 0 ? (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Analiză vs Concurență
                    </h4>
                    {(() => {
                      const pretNostru = costBreakdown.pretRecomandat / parseFloat(cantitate);
                      const diferentaMedie = pretNostru - competitorStats.mediu;
                      const diferentaMinim = pretNostru - competitorStats.minim;
                      const procentMedie = ((diferentaMedie / competitorStats.mediu) * 100);
                      
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">vs Preț Mediu</span>
                            <Badge variant={diferentaMedie > 0 ? "destructive" : "default"} className="text-xs">
                              {diferentaMedie > 0 ? "+" : ""}{procentMedie.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">vs Cel Mai Ieftin</span>
                            <Badge variant={diferentaMinim > 0 ? "outline" : "default"} className="text-xs">
                              {diferentaMinim > 0 ? "+" : ""}{formatCurrency(diferentaMinim)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                            {diferentaMedie <= 0 
                              ? "✓ Prețul este competitiv, sub media pieței"
                              : diferentaMedie <= competitorStats.mediu * 0.05
                                ? "~ Prețul este în linie cu piața"
                                : "⚠ Prețul este peste media pieței"
                            }
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border text-sm text-muted-foreground">
                    Nu există prețuri ale concurenței introduse pentru produsul: <span className="font-medium text-foreground">{selectedProductName}</span>
                  </div>
                )}

                {/* Cost Total Summary */}
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="text-muted-foreground">Cost Total Producție</span>
                  <span className="font-medium">{formatCurrency(costBreakdown.costTotal)}</span>
                </div>

                {/* Detalii Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setShowDetails(true)}
                >
                  <Info className="h-4 w-4 mr-2" />
                  Vezi Detalii Costuri
                </Button>
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
              {selectedProductName && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  Filtru: {selectedProductName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stats */}
            {filteredPreturiConcurenti.length > 0 ? (
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
            ) : preturiConcurenti.length > 0 ? (
              <div className="p-3 rounded-lg bg-muted/50 text-center text-sm text-muted-foreground">
                Nu există prețuri pentru "{selectedProductName}"
              </div>
            ) : null}

            {/* Add button */}
            <Button variant="outline" size="sm" className="w-full" onClick={() => setIsAddConcurentOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Adaugă Preț Concurent
            </Button>

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
                      <TableHead className="text-xs">Data</TableHead>
                      <TableHead className="text-xs text-right">Preț</TableHead>
                      <TableHead className="w-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preturiConcurenti.map((pret) => (
                      <TableRow 
                        key={pret.id} 
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => { setSelectedConcurent(pret); setIsConcurentDetailOpen(true); }}
                      >
                        <TableCell className="text-sm py-2">{pret.concurent}</TableCell>
                        <TableCell className="text-sm py-2">{pret.produs}</TableCell>
                        <TableCell className="text-sm py-2">{pret.data || "-"}</TableCell>
                        <TableCell className="text-sm py-2 text-right font-medium">
                          {formatCurrency(pret.pret)}
                        </TableCell>
                        <TableCell className="py-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleRemoveConcurent(pret.id); }}
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
        </TabsContent>

        <TabsContent value="preturi-calculate" className="mt-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <History className="h-5 w-5" />
                Prețuri Calculate
              </CardTitle>
            </CardHeader>
            <CardContent>
              {preturiCalculate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nu există prețuri calculate salvate</p>
                  <p className="text-sm mt-1">Realizați un calcul și salvați-l pentru a-l vedea aici</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Cod Rețetă</TableHead>
                        <TableHead>Denumire</TableHead>
                        <TableHead className="text-right">Cantitate</TableHead>
                        <TableHead className="text-right">Marjă</TableHead>
                        <TableHead className="text-right">Cost Total</TableHead>
                        <TableHead className="text-right">Preț/Tonă</TableHead>
                        <TableHead className="text-right">Preț Total</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preturiCalculate.map((pret) => (
                        <TableRow key={pret.id}>
                          <TableCell>{pret.data}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{pret.codReteta}</Badge>
                          </TableCell>
                          <TableCell>{pret.denumireReteta}</TableCell>
                          <TableCell className="text-right">{pret.cantitate} t</TableCell>
                          <TableCell className="text-right">{pret.marjaProfit}%</TableCell>
                          <TableCell className="text-right">{formatCurrency(pret.costTotal)}</TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {formatCurrency(pret.pretPeTona)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(pret.pretRecomandat)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveCalculation(pret.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Detalii Costuri
            </DialogTitle>
          </DialogHeader>
          
          {costBreakdown && (
            <div className="space-y-4">
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
                  <div className="flex justify-between font-medium pt-1 border-t border-border">
                    <span>Subtotal Materiale</span>
                    <span>{formatCurrency(costBreakdown.materiale.reduce((sum, m) => sum + m.total, 0))}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Curent Electric */}
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Curent Electric & Consum CTL
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Curent Electric Activ</span>
                    <span>{formatCurrency(costBreakdown.curentActiv)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Consum CTL</span>
                    <span>{formatCurrency(costBreakdown.consumCTL)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t border-border">
                    <span>Subtotal</span>
                    <span>{formatCurrency(costBreakdown.curentActiv + costBreakdown.consumCTL)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Costuri Indirecte */}
              <div>
                <h4 className="text-sm font-medium mb-2">Costuri Indirecte</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Curent Electric Pasiv</span>
                    <span>{formatCurrency(costBreakdown.costuriIndirecte.curentPasiv)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salarii</span>
                    <span>{formatCurrency(costBreakdown.costuriIndirecte.salarii)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amortizări</span>
                    <span>{formatCurrency(costBreakdown.costuriIndirecte.amortizari)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mentenanță</span>
                    <span>{formatCurrency(costBreakdown.costuriIndirecte.mentenanta)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chirie</span>
                    <span>{formatCurrency(costBreakdown.costuriIndirecte.chirie)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t border-border">
                    <span>Subtotal Indirecte</span>
                    <span>{formatCurrency(Object.values(costBreakdown.costuriIndirecte).reduce((a, b) => a + b, 0))}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between font-semibold text-lg">
                <span>Cost Total Producție</span>
                <span>{formatCurrency(costBreakdown.costTotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {formatCurrency(costBreakdown.costTotal / parseFloat(cantitate))}/tonă
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Concurent Detail Dialog */}
      <Dialog open={isConcurentDetailOpen} onOpenChange={setIsConcurentDetailOpen}>
        <DialogContent className="max-w-md" hideCloseButton>
          {selectedConcurent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {selectedConcurent.concurent}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm text-muted-foreground">Concurent</p>
                  <p className="font-medium">{selectedConcurent.concurent}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Produs</p>
                  <p className="font-medium">{selectedConcurent.produs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Introducerii</p>
                  <p className="font-medium">{selectedConcurent.data || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preț</p>
                  <p className="font-medium text-primary">{formatCurrency(selectedConcurent.pret)}</p>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="destructive" 
                  onClick={() => { handleRemoveConcurent(selectedConcurent.id); setIsConcurentDetailOpen(false); }}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Șterge
                </Button>
                <Button variant="outline" onClick={() => setIsConcurentDetailOpen(false)}>
                  Închide
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Concurent Dialog */}
      <Dialog open={isAddConcurentOpen} onOpenChange={setIsAddConcurentOpen}>
        <DialogContent className="max-w-md" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adaugă Preț Concurent
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Concurent</Label>
              <Input
                placeholder="Nume concurent"
                value={newConcurent.concurent}
                onChange={(e) => setNewConcurent(prev => ({ ...prev, concurent: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Produs</Label>
              <Input
                placeholder="Nume produs"
                value={newConcurent.produs}
                onChange={(e) => setNewConcurent(prev => ({ ...prev, produs: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Preț (RON/tonă)</Label>
              <Input
                type="number"
                placeholder="Preț"
                value={newConcurent.pret}
                onChange={(e) => setNewConcurent(prev => ({ ...prev, pret: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={newConcurent.data}
                onChange={(e) => setNewConcurent(prev => ({ ...prev, data: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddConcurentOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => { handleAddConcurent(); setIsAddConcurentOpen(false); }}>
              Adaugă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Shortage Dialog */}
      <Dialog open={isStockShortageOpen} onOpenChange={setIsStockShortageOpen}>
        <DialogContent className="max-w-3xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Stoc Insuficient
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Introduceți prețurile de achiziție pentru materialele cu stoc insuficient:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {stockShortages.map((shortage) => (
                <div key={shortage.material} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{shortage.material}</span>
                    <Badge variant="outline" className="text-amber-600 border-amber-500/30 text-xs">
                      -{shortage.cantitateNecesara.toFixed(1)} t
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                    <span>Necesar: <strong className="text-foreground">{shortage.necesar.toFixed(1)}t</strong></span>
                    <span>Stoc: <strong className="text-foreground">{shortage.stocDisponibil.toFixed(1)}t</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs whitespace-nowrap">Preț (RON/t):</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Preț..."
                      value={shortage.pretUnitar}
                      onChange={(e) => updateShortagePrice(shortage.material, e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            {/* File Upload Section */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Încărcare Ofertă Furnizor
              </Label>
              <p className="text-xs text-muted-foreground">
                Încărcați documentul cu oferta de preț primită de la furnizor (opțional)
              </p>
              
              {ofertaFile ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{ofertaFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(ofertaFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click pentru a încărca sau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOC, DOCX, XLS, XLSX (max 10MB)
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStockShortageOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleStockShortageSubmit}>
              Confirmă și Calculează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalculatorPret;
