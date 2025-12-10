import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { facturiClienti, livrariClienti, incasariClienti } from "../mockData";

const VanzariTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("facturi");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Încasată":
      case "Facturat":
        return "default";
      case "Parțial":
        return "secondary";
      case "Neîncasată":
      case "Nefacturat":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vânzări (Clienți)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="facturi">Facturi clienți</TabsTrigger>
            <TabsTrigger value="livrari">Livrări (bonuri / avize)</TabsTrigger>
            <TabsTrigger value="incasari">Încasări clienți</TabsTrigger>
          </TabsList>

          <TabsContent value="facturi">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr Factură</TableHead>
                    <TableHead>Dată</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead className="text-right">Total fără TVA</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Dată scadență</TableHead>
                    <TableHead className="text-right">Sumă încasată</TableHead>
                    <TableHead className="text-right">Sumă restantă</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturiClienti.map((factura) => (
                    <TableRow key={factura.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{factura.nr_factura}</TableCell>
                      <TableCell>{factura.data}</TableCell>
                      <TableCell>{factura.client}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.total_fara_tva)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.tva)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(factura.total)}</TableCell>
                      <TableCell>{factura.data_scadenta}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.suma_incasata)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.suma_restanta)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(factura.status)}>
                          {factura.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="livrari">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dată</TableHead>
                    <TableHead>Cod</TableHead>
                    <TableHead>Nr Aviz</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produs</TableHead>
                    <TableHead className="text-right">Cantitate</TableHead>
                    <TableHead className="text-right">Valoare produs</TableHead>
                    <TableHead className="text-right">Valoare transport</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status facturare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {livrariClienti.map((livrare) => (
                    <TableRow key={livrare.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{livrare.data}</TableCell>
                      <TableCell className="font-medium">{livrare.cod}</TableCell>
                      <TableCell>{livrare.nr_aviz}</TableCell>
                      <TableCell>{livrare.client}</TableCell>
                      <TableCell>{livrare.produs}</TableCell>
                      <TableCell className="text-right">{livrare.cantitate} t</TableCell>
                      <TableCell className="text-right">{formatCurrency(livrare.valoare_produs)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(livrare.valoare_transport)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(livrare.total)}</TableCell>
                      <TableCell>
                        <Badge variant={livrare.status_facturare === "Nefacturat" ? "destructive" : "default"}>
                          {livrare.status_facturare}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="incasari">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dată</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead className="text-right">Sumă totală</TableHead>
                    <TableHead className="text-right">Sumă alocată</TableHead>
                    <TableHead className="text-right">Sumă nealocată</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incasariClienti.map((incasare) => (
                    <TableRow key={incasare.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{incasare.data}</TableCell>
                      <TableCell className="font-medium">{incasare.client}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{incasare.tip}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(incasare.suma_totala)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(incasare.suma_alocata)}</TableCell>
                      <TableCell className="text-right">
                        <span className={incasare.suma_nealocata > 0 ? "text-amber-600" : ""}>
                          {formatCurrency(incasare.suma_nealocata)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VanzariTab;
