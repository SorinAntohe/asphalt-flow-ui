import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { furnizoriCuSold, facturiFurnizoriIstoric, platiFurnizori, soldIntervaleFurnizori } from "../parteneri-mockData";
import { FurnizorCuSold } from "../parteneri-types";

const FurnizoriTab = () => {
  const [selectedFurnizor, setSelectedFurnizor] = useState<FurnizorCuSold | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRowClick = (furnizor: FurnizorCuSold) => {
    setSelectedFurnizor(furnizor);
    setDialogOpen(true);
  };

  const getZileIntarziereColor = (zile: number) => {
    if (zile === 0) return "text-green-600";
    if (zile <= 30) return "text-amber-600";
    return "text-red-600";
  };

  const furnizorFacturi = selectedFurnizor ? facturiFurnizoriIstoric[selectedFurnizor.id] || [] : [];
  const furnizorPlati = selectedFurnizor ? platiFurnizori[selectedFurnizor.id] || [] : [];
  const furnizorSoldIntervale = selectedFurnizor ? soldIntervaleFurnizori[selectedFurnizor.id] : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista Furnizori cu Solduri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Furnizor</TableHead>
                  <TableHead>CUI</TableHead>
                  <TableHead>Adresă</TableHead>
                  <TableHead className="text-right">Sold curent</TableHead>
                  <TableHead className="text-right">Zile întârziere max.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {furnizoriCuSold.map((furnizor) => (
                  <TableRow 
                    key={furnizor.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(furnizor)}
                  >
                    <TableCell className="font-medium">{furnizor.nume}</TableCell>
                    <TableCell>{furnizor.cui}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{furnizor.adresa}</TableCell>
                    <TableCell className="text-right">
                      <span className={furnizor.sold_curent > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(furnizor.sold_curent)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getZileIntarziereColor(furnizor.zile_intarziere_max)}`}>
                      {furnizor.zile_intarziere_max} zile
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Furnizori</div>
                <div className="text-2xl font-bold">{furnizoriCuSold.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Sold Furnizori</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(furnizoriCuSold.reduce((sum, f) => sum + f.sold_curent, 0))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Furnizori cu Întârzieri</div>
                <div className="text-2xl font-bold text-amber-600">
                  {furnizoriCuSold.filter((f) => f.zile_intarziere_max > 0).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Furnizori &gt;60 zile</div>
                <div className="text-2xl font-bold text-red-600">
                  {furnizoriCuSold.filter((f) => f.zile_intarziere_max > 60).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Furnizor Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Fișă Furnizor: {selectedFurnizor?.nume}
            </DialogTitle>
          </DialogHeader>

          {selectedFurnizor && (
            <div className="space-y-6">
              {/* Furnizor Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">CUI</div>
                  <div className="font-medium">{selectedFurnizor.cui}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Adresă</div>
                  <div className="font-medium">{selectedFurnizor.adresa}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sold Curent</div>
                  <div className={`font-bold text-lg ${selectedFurnizor.sold_curent > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(selectedFurnizor.sold_curent)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zile Întârziere Max.</div>
                  <div className={`font-bold text-lg ${getZileIntarziereColor(selectedFurnizor.zile_intarziere_max)}`}>
                    {selectedFurnizor.zile_intarziere_max} zile
                  </div>
                </div>
              </div>

              {/* Sold pe Intervale */}
              {furnizorSoldIntervale && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sold pe Intervale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">0-30 zile</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(furnizorSoldIntervale.interval_0_30)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">30-60 zile</div>
                        <div className="text-xl font-bold text-amber-600">
                          {formatCurrency(furnizorSoldIntervale.interval_30_60)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">60+ zile</div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(furnizorSoldIntervale.interval_60_plus)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for Facturi & Plăți */}
              <Tabs defaultValue="facturi">
                <TabsList>
                  <TabsTrigger value="facturi">Istoric Facturi ({furnizorFacturi.length})</TabsTrigger>
                  <TabsTrigger value="plati">Istoric Plăți ({furnizorPlati.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="facturi" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nr Factură</TableHead>
                          <TableHead>Dată</TableHead>
                          <TableHead>Dată Scadență</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="text-right">Plătit</TableHead>
                          <TableHead className="text-right">Restant</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {furnizorFacturi.map((factura) => (
                          <TableRow key={factura.id}>
                            <TableCell className="font-medium">{factura.nr_factura}</TableCell>
                            <TableCell>{factura.data}</TableCell>
                            <TableCell>{factura.data_scadenta}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.total)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.suma_achitata)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(factura.suma_restanta)}</TableCell>
                            <TableCell>
                              <Badge variant={
                                factura.status === "Achitată" ? "default" :
                                factura.status === "Parțial" ? "secondary" : "destructive"
                              }>
                                {factura.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {furnizorFacturi.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nu există facturi pentru acest furnizor
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="plati" className="mt-4">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dată</TableHead>
                          <TableHead>Tip</TableHead>
                          <TableHead className="text-right">Sumă</TableHead>
                          <TableHead>Document Referință</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {furnizorPlati.map((plata) => (
                          <TableRow key={plata.id}>
                            <TableCell>{plata.data}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{plata.tip}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-red-600">
                              -{formatCurrency(plata.suma)}
                            </TableCell>
                            <TableCell>{plata.document_referinta}</TableCell>
                          </TableRow>
                        ))}
                        {furnizorPlati.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nu există plăți pentru acest furnizor
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FurnizoriTab;
