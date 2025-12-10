import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { facturiFurnizori, receptiiMateriale } from "../mockData";

const AchizitiiTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("facturi");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Plătită":
        return "default";
      case "Parțial":
        return "secondary";
      case "Neplătită":
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
        <CardTitle>Achiziții (Furnizori)</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="facturi">Facturi furnizori</TabsTrigger>
            <TabsTrigger value="receptii">Recepții / NIR-uri</TabsTrigger>
          </TabsList>

          <TabsContent value="facturi">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr Factură</TableHead>
                    <TableHead>Dată</TableHead>
                    <TableHead>Furnizor</TableHead>
                    <TableHead className="text-right">Total fără TVA</TableHead>
                    <TableHead className="text-right">TVA</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Dată scadență</TableHead>
                    <TableHead className="text-right">Sumă plătită</TableHead>
                    <TableHead className="text-right">Sumă restantă</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facturiFurnizori.map((factura) => (
                    <TableRow key={factura.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{factura.nr_factura}</TableCell>
                      <TableCell>{factura.data}</TableCell>
                      <TableCell>{factura.furnizor}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.total_fara_tva)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.tva)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(factura.total)}</TableCell>
                      <TableCell>{factura.data_scadenta}</TableCell>
                      <TableCell className="text-right">{formatCurrency(factura.suma_platita)}</TableCell>
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

          <TabsContent value="receptii">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dată</TableHead>
                    <TableHead>Cod (comandă)</TableHead>
                    <TableHead>Furnizor</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Cantitate recepționată</TableHead>
                    <TableHead className="text-right">Preț material total</TableHead>
                    <TableHead className="text-right">Preț transport total</TableHead>
                    <TableHead className="text-right">Preț total</TableHead>
                    <TableHead>Nr Factură</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receptiiMateriale.map((receptie) => (
                    <TableRow key={receptie.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{receptie.data}</TableCell>
                      <TableCell className="font-medium">{receptie.cod}</TableCell>
                      <TableCell>{receptie.furnizor}</TableCell>
                      <TableCell>{receptie.material}</TableCell>
                      <TableCell className="text-right">{receptie.cantitate_receptionata} t</TableCell>
                      <TableCell className="text-right">{formatCurrency(receptie.pret_material_total)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(receptie.pret_transport_total)}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(receptie.pret_total)}</TableCell>
                      <TableCell>
                        {receptie.nr_factura ? (
                          <Badge variant="outline">{receptie.nr_factura}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
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

export default AchizitiiTab;
