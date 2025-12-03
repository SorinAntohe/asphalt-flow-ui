import { useState, useMemo } from "react";
import { CalendarRange, Plus, Download, Clock, AlertTriangle, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { exportToCSV } from "@/lib/exportUtils";
import { DataTablePagination } from "@/components/ui/data-table";

// Mock data for maintenance rules
const mockMaintenanceRules = [
  {
    id: 1,
    cod_utilaj: "EXC-001",
    nume_utilaj: "Excavator Komatsu PC210",
    tip_frecventa: "ore",
    interval_frecventa: 250,
    ore_curente: 240,
    ultima_revizie: "15/11/2025",
    urmatoarea_revizie: "20/12/2025",
    checklist: ["Schimb ulei motor", "Verificare filtre", "Verificare sistem hidraulic"],
    timp_estimat: 4,
    piese_necesare: ["Filtru ulei", "Ulei motor 10W-40"],
    responsabil: "Ion Popescu",
    status: "programata",
  },
  {
    id: 2,
    cod_utilaj: "MIX-001",
    nume_utilaj: "Centrală asfalt Ammann 240t/h",
    tip_frecventa: "zile",
    interval_frecventa: 30,
    zile_ramase: 5,
    ultima_revizie: "28/11/2025",
    urmatoarea_revizie: "28/12/2025",
    checklist: ["Curățare arzător", "Verificare benzi transportoare", "Calibrare cântare"],
    timp_estimat: 8,
    piese_necesare: ["Bandă transportoare", "Senzor temperatură"],
    responsabil: "Maria Ionescu",
    status: "programata",
  },
  {
    id: 3,
    cod_utilaj: "CAM-003",
    nume_utilaj: "Camion MAN TGS 8x4",
    tip_frecventa: "luni",
    interval_frecventa: 6,
    ultima_revizie: "01/06/2025",
    urmatoarea_revizie: "01/12/2025",
    checklist: ["ITP", "Revizie tehnică completă", "Verificare frâne"],
    timp_estimat: 6,
    piese_necesare: ["Plăcuțe frână", "Filtru aer", "Ulei transmisie"],
    responsabil: "Andrei Dumitrescu",
    status: "depasita",
  },
  {
    id: 4,
    cod_utilaj: "FIN-001",
    nume_utilaj: "Finișer Vogele Super 1800",
    tip_frecventa: "ore",
    interval_frecventa: 500,
    ore_curente: 120,
    ultima_revizie: "10/10/2025",
    urmatoarea_revizie: "15/01/2026",
    checklist: ["Verificare screed", "Ungere articulații", "Verificare senzori nivelare"],
    timp_estimat: 5,
    piese_necesare: ["Placă screed", "Unsoare"],
    responsabil: "Ion Popescu",
    status: "programata",
  },
  {
    id: 5,
    cod_utilaj: "COM-001",
    nume_utilaj: "Compactor Bomag BW219",
    tip_frecventa: "zile",
    interval_frecventa: 7,
    zile_ramase: -2,
    ultima_revizie: "15/11/2025",
    urmatoarea_revizie: "22/11/2025",
    checklist: ["Verificare sistem vibrare", "Schimb ulei hidraulic", "Curățare sistem răcire"],
    timp_estimat: 3,
    piese_necesare: ["Ulei hidraulic", "Filtru hidraulic"],
    responsabil: "Maria Ionescu",
    status: "depasita",
  },
];

const PlanMentenanta = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<typeof mockMaintenanceRules[0] | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Statistics
  const stats = useMemo(() => {
    const total = mockMaintenanceRules.length;
    const programate = mockMaintenanceRules.filter(r => r.status === "programata").length;
    const depasita = mockMaintenanceRules.filter(r => r.status === "depasita").length;
    
    return { total, programate, depasita };
  }, []);

  // Pagination logic
  const paginatedRules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return mockMaintenanceRules.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(mockMaintenanceRules.length / itemsPerPage);

  const handleExport = () => {
    const exportData = mockMaintenanceRules.map(rule => ({
      cod_utilaj: rule.cod_utilaj,
      nume_utilaj: rule.nume_utilaj,
      frecventa: `${rule.interval_frecventa} ${rule.tip_frecventa}`,
      ultima_revizie: rule.ultima_revizie,
      urmatoarea_revizie: rule.urmatoarea_revizie,
      timp_estimat: rule.timp_estimat,
      responsabil: rule.responsabil,
      status: rule.status === "depasita" ? "Depășită" : "Programată",
    }));

    const columns = [
      { key: "cod_utilaj" as const, label: "Cod Utilaj" },
      { key: "nume_utilaj" as const, label: "Nume Utilaj" },
      { key: "frecventa" as const, label: "Frecvență" },
      { key: "ultima_revizie" as const, label: "Ultima Revizie" },
      { key: "urmatoarea_revizie" as const, label: "Următoarea Revizie" },
      { key: "timp_estimat" as const, label: "Timp Estimat (ore)" },
      { key: "responsabil" as const, label: "Responsabil" },
      { key: "status" as const, label: "Status" },
    ];

    exportToCSV(exportData, "plan_mentenanta", columns);
  };

  const getStatusBadge = (status: string) => {
    if (status === "depasita") {
      return <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Depășită</Badge>;
    }
    return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" />Programată</Badge>;
  };

  const getFrequencyDisplay = (rule: typeof mockMaintenanceRules[0]) => {
    if (rule.tip_frecventa === "ore") {
      return `${rule.ore_curente}/${rule.interval_frecventa} ore`;
    } else if (rule.tip_frecventa === "zile" && rule.zile_ramase !== undefined) {
      return rule.zile_ramase < 0 
        ? `Depășită cu ${Math.abs(rule.zile_ramase)} zile`
        : `${rule.zile_ramase} zile rămase`;
    } else if (rule.tip_frecventa === "luni") {
      return `La ${rule.interval_frecventa} luni`;
    }
    return `${rule.interval_frecventa} ${rule.tip_frecventa}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarRange className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Plan de Mentenanță</h1>
            <p className="text-muted-foreground">Planificare mentenanță preventivă pe utilaje</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adaugă Regulă
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reguli</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CalendarRange className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Programate</p>
                <p className="text-2xl font-bold">{stats.programate}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Depășite</p>
                <p className="text-2xl font-bold text-destructive">{stats.depasita}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "calendar" | "list")}>
          <CardHeader className="border-b border-border">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <Clock className="h-4 w-4" />
                Listă Reguli
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent className="p-6">
            {/* Calendar View */}
            <TabsContent value="calendar" className="m-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <div className="lg:col-span-1">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-border"
                  />
                </div>

                {/* Tasks for selected date */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Revizii programate pentru {selectedDate?.toLocaleDateString("ro-RO")}
                  </h3>
                  
                  {mockMaintenanceRules
                    .filter(rule => rule.urmatoarea_revizie === selectedDate?.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" }))
                    .map(rule => (
                      <Card key={rule.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRule(rule)}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-semibold text-foreground">{rule.cod_utilaj}</h4>
                                {getStatusBadge(rule.status)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{rule.nume_utilaj}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-muted-foreground">
                                  <Clock className="h-3 w-3 inline mr-1" />
                                  {rule.timp_estimat}h
                                </span>
                                <span className="text-muted-foreground">
                                  Responsabil: {rule.responsabil}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  
                  {mockMaintenanceRules.filter(rule => rule.urmatoarea_revizie === selectedDate?.toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" })).length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      <CalendarRange className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nu există revizii programate pentru această dată</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* List View */}
            <TabsContent value="list" className="m-0">
              <div className="space-y-4">
                {paginatedRules.map(rule => (
                  <Card key={rule.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedRule(rule)}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-foreground">{rule.cod_utilaj}</h4>
                            {getStatusBadge(rule.status)}
                            <Badge variant="outline">{rule.tip_frecventa}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rule.nume_utilaj}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Frecvență: {getFrequencyDisplay(rule)}
                            </span>
                            <span className="text-muted-foreground">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {rule.timp_estimat}h estimat
                            </span>
                            <span className="text-muted-foreground">
                              Responsabil: {rule.responsabil}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          <p className="text-muted-foreground">Următoarea revizie</p>
                          <p className="font-semibold text-foreground">{rule.urmatoarea_revizie}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-6">
                <DataTablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={mockMaintenanceRules.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl" hideCloseButton>
          <DialogHeader>
            <DialogTitle>Adaugă Regulă Preventivă</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="utilaj">Utilaj / Echipament</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selectează utilaj" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXC-001">EXC-001 - Excavator Komatsu PC210</SelectItem>
                  <SelectItem value="MIX-001">MIX-001 - Centrală asfalt Ammann 240t/h</SelectItem>
                  <SelectItem value="CAM-003">CAM-003 - Camion MAN TGS 8x4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tip_frecventa">Tip Frecvență</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează tip" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ore">Ore funcționare</SelectItem>
                    <SelectItem value="zile">Zile</SelectItem>
                    <SelectItem value="luni">Luni</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="interval">Interval</Label>
                <Input id="interval" type="number" placeholder="ex: 250" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="checklist">Checklist Activități</Label>
              <Textarea 
                id="checklist" 
                placeholder="Introdu activitățile de mentenanță (câte una pe linie)"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="timp_estimat">Timp Estimat (ore)</Label>
                <Input id="timp_estimat" type="number" placeholder="ex: 4" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="responsabil">Responsabil</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează responsabil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ion">Ion Popescu</SelectItem>
                    <SelectItem value="maria">Maria Ionescu</SelectItem>
                    <SelectItem value="andrei">Andrei Dumitrescu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="piese">Piese Necesare</Label>
              <Textarea 
                id="piese" 
                placeholder="Introdu piesele necesare (câte una pe linie)"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => setIsAddDialogOpen(false)}>
              Salvează Regulă
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRule} onOpenChange={(open) => !open && setSelectedRule(null)}>
        <DialogContent className="max-w-3xl" hideCloseButton>
          {selectedRule && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <DialogTitle>{selectedRule.cod_utilaj} - {selectedRule.nume_utilaj}</DialogTitle>
                  {getStatusBadge(selectedRule.status)}
                </div>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tip Frecvență</p>
                    <p className="font-medium text-foreground capitalize">{selectedRule.tip_frecventa}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Interval</p>
                    <p className="font-medium text-foreground">{getFrequencyDisplay(selectedRule)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ultima Revizie</p>
                    <p className="font-medium text-foreground">{selectedRule.ultima_revizie}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Următoarea Revizie</p>
                    <p className="font-medium text-foreground">{selectedRule.urmatoarea_revizie}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Timp Estimat</p>
                    <p className="font-medium text-foreground">{selectedRule.timp_estimat} ore</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Responsabil</p>
                    <p className="font-medium text-foreground">{selectedRule.responsabil}</p>
                  </div>
                </div>

                {/* Checklist */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Checklist Activități</p>
                  <ul className="space-y-1">
                    {selectedRule.checklist.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Piese necesare */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Piese Necesare</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRule.piese_necesare.map((piesa, idx) => (
                      <Badge key={idx} variant="outline">{piesa}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedRule(null)}>
                  Închide
                </Button>
                <Button>
                  Editează Regulă
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanMentenanta;
