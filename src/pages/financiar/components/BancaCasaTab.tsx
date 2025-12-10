import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { conturiBancare, miscariBanca, registruCasa } from "../mockData";

const BancaCasaTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("conturi");

  const formatCurrency = (value: number, currency: string = "RON") => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bancă & Casă</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="conturi">Conturi bancare</TabsTrigger>
            <TabsTrigger value="miscari">Mișcări bancă</TabsTrigger>
            <TabsTrigger value="casa">Registru de casă</TabsTrigger>
          </TabsList>

          <TabsContent value="conturi">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bancă</TableHead>
                    <TableHead>IBAN</TableHead>
                    <TableHead>Monedă</TableHead>
                    <TableHead className="text-right">Sold curent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conturiBancare.map((cont) => (
                    <TableRow key={cont.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{cont.banca}</TableCell>
                      <TableCell className="font-mono text-sm">{cont.iban}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cont.moneda}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(cont.sold_curent, cont.moneda)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Summary Card */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total RON</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      conturiBancare
                        .filter((c) => c.moneda === "RON")
                        .reduce((sum, c) => sum + c.sold_curent, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total EUR</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      conturiBancare
                        .filter((c) => c.moneda === "EUR")
                        .reduce((sum, c) => sum + c.sold_curent, 0),
                      "EUR"
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Nr. Conturi Active</div>
                  <div className="text-2xl font-bold">{conturiBancare.length}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="miscari">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dată</TableHead>
                    <TableHead>Cont bancar</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Partener</TableHead>
                    <TableHead className="text-right">Sumă</TableHead>
                    <TableHead>Document asociat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {miscariBanca.map((miscare) => (
                    <TableRow key={miscare.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{miscare.data}</TableCell>
                      <TableCell className="font-medium">{miscare.cont_bancar}</TableCell>
                      <TableCell>
                        <Badge variant={miscare.tip === "Încasare" ? "default" : "secondary"}>
                          {miscare.tip}
                        </Badge>
                      </TableCell>
                      <TableCell>{miscare.partener}</TableCell>
                      <TableCell className={`text-right font-medium ${miscare.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                        {miscare.tip === "Încasare" ? "+" : "-"}{formatCurrency(miscare.suma)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{miscare.document_asociat}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="casa">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dată</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Partener</TableHead>
                    <TableHead className="text-right">Sumă</TableHead>
                    <TableHead>Document asociat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registruCasa.map((inregistrare) => (
                    <TableRow key={inregistrare.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>{inregistrare.data}</TableCell>
                      <TableCell>
                        <Badge variant={inregistrare.tip === "Încasare" ? "default" : "secondary"}>
                          {inregistrare.tip}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{inregistrare.partener}</TableCell>
                      <TableCell className={`text-right font-medium ${inregistrare.tip === "Încasare" ? "text-green-600" : "text-red-600"}`}>
                        {inregistrare.tip === "Încasare" ? "+" : "-"}{formatCurrency(inregistrare.suma)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{inregistrare.document_asociat}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Casa Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Încasări</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      registruCasa
                        .filter((r) => r.tip === "Încasare")
                        .reduce((sum, r) => sum + r.suma, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Total Plăți</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(
                      registruCasa
                        .filter((r) => r.tip === "Plată")
                        .reduce((sum, r) => sum + r.suma, 0)
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-sm text-muted-foreground">Sold Casă</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(
                      registruCasa.reduce((sum, r) => 
                        r.tip === "Încasare" ? sum + r.suma : sum - r.suma, 0
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BancaCasaTab;
