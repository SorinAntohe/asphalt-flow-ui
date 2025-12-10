import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clientiCuSold, facturiClienti, incasariClienti, soldIntervaleClienti } from "../parteneri-mockData";
import { ClientCuSold } from "../parteneri-types";

const ClientiTab = () => {
  const [selectedClient, setSelectedClient] = useState<ClientCuSold | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const handleRowClick = (client: ClientCuSold) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const getZileIntarziereColor = (zile: number) => {
    if (zile === 0) return "text-green-600";
    if (zile <= 30) return "text-amber-600";
    return "text-red-600";
  };

  const clientFacturi = selectedClient ? facturiClienti[selectedClient.id] || [] : [];
  const clientIncasari = selectedClient ? incasariClienti[selectedClient.id] || [] : [];
  const clientSoldIntervale = selectedClient ? soldIntervaleClienti[selectedClient.id] : null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Lista Clienți cu Solduri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>CUI</TableHead>
                  <TableHead>Adresă</TableHead>
                  <TableHead className="text-right">Sold curent</TableHead>
                  <TableHead className="text-right">Zile întârziere max.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientiCuSold.map((client) => (
                  <TableRow 
                    key={client.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(client)}
                  >
                    <TableCell className="font-medium">{client.nume}</TableCell>
                    <TableCell>{client.cui}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{client.adresa}</TableCell>
                    <TableCell className="text-right">
                      <span className={client.sold_curent > 0 ? "text-red-600 font-medium" : "text-green-600"}>
                        {formatCurrency(client.sold_curent)}
                      </span>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${getZileIntarziereColor(client.zile_intarziere_max)}`}>
                      {client.zile_intarziere_max} zile
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
                <div className="text-sm text-muted-foreground">Total Clienți</div>
                <div className="text-2xl font-bold">{clientiCuSold.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Total Sold Clienți</div>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(clientiCuSold.reduce((sum, c) => sum + c.sold_curent, 0))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Clienți cu Întârzieri</div>
                <div className="text-2xl font-bold text-amber-600">
                  {clientiCuSold.filter((c) => c.zile_intarziere_max > 0).length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">Clienți &gt;60 zile</div>
                <div className="text-2xl font-bold text-red-600">
                  {clientiCuSold.filter((c) => c.zile_intarziere_max > 60).length}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Client Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Fișă Client: {selectedClient?.nume}
            </DialogTitle>
          </DialogHeader>

          {selectedClient && (
            <div className="space-y-6">
              {/* Client Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">CUI</div>
                  <div className="font-medium">{selectedClient.cui}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Adresă</div>
                  <div className="font-medium">{selectedClient.adresa}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sold Curent</div>
                  <div className={`font-bold text-lg ${selectedClient.sold_curent > 0 ? "text-red-600" : "text-green-600"}`}>
                    {formatCurrency(selectedClient.sold_curent)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Zile Întârziere Max.</div>
                  <div className={`font-bold text-lg ${getZileIntarziereColor(selectedClient.zile_intarziere_max)}`}>
                    {selectedClient.zile_intarziere_max} zile
                  </div>
                </div>
              </div>

              {/* Sold pe Intervale */}
              {clientSoldIntervale && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Sold pe Intervale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">0-30 zile</div>
                        <div className="text-xl font-bold text-green-600">
                          {formatCurrency(clientSoldIntervale.interval_0_30)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">30-60 zile</div>
                        <div className="text-xl font-bold text-amber-600">
                          {formatCurrency(clientSoldIntervale.interval_30_60)}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                        <div className="text-sm text-muted-foreground">60+ zile</div>
                        <div className="text-xl font-bold text-red-600">
                          {formatCurrency(clientSoldIntervale.interval_60_plus)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tabs for Facturi & Încasări */}
              <Tabs defaultValue="facturi">
                <TabsList>
                  <TabsTrigger value="facturi">Istoric Facturi ({clientFacturi.length})</TabsTrigger>
                  <TabsTrigger value="incasari">Istoric Încasări ({clientIncasari.length})</TabsTrigger>
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
                          <TableHead className="text-right">Achitat</TableHead>
                          <TableHead className="text-right">Restant</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientFacturi.map((factura) => (
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
                        {clientFacturi.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                              Nu există facturi pentru acest client
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="incasari" className="mt-4">
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
                        {clientIncasari.map((incasare) => (
                          <TableRow key={incasare.id}>
                            <TableCell>{incasare.data}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{incasare.tip}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium text-green-600">
                              +{formatCurrency(incasare.suma)}
                            </TableCell>
                            <TableCell>{incasare.document_referinta}</TableCell>
                          </TableRow>
                        ))}
                        {clientIncasari.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                              Nu există încasări pentru acest client
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

export default ClientiTab;
