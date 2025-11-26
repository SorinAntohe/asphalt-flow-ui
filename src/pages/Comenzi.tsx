import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Comenzi() {
  const [comenziMateriePrima] = useState([
    { id: 1, numarComanda: "CMP-001", furnizor: "Furnizor A", material: "0/4 NAT", cantitate: 500, dataComanda: "2024-01-15" },
    { id: 2, numarComanda: "CMP-002", furnizor: "Furnizor B", material: "BITUM 50/70", cantitate: 200, dataComanda: "2024-01-16" },
  ]);

  const [comenziProduseFinite] = useState([
    { id: 1, numarComanda: "CPF-001", client: "Client A", produs: "Asfalt BA16", cantitate: 1000, dataComanda: "2024-01-15" },
    { id: 2, numarComanda: "CPF-002", client: "Client B", produs: "Asfalt BA8", cantitate: 750, dataComanda: "2024-01-16" },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Comenzi</h1>
        <p className="text-muted-foreground mt-2">
          Gestionează comenzile de materii prime și produse finite
        </p>
      </div>

      <Tabs defaultValue="materie-prima" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materie-prima">Materie Prima</TabsTrigger>
          <TabsTrigger value="produse-finite">Produs Finit</TabsTrigger>
        </TabsList>

        <TabsContent value="materie-prima">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comenzi Materie Primă</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr. Comandă</TableHead>
                    <TableHead>Furnizor</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Cantitate</TableHead>
                    <TableHead>Data Comandă</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comenziMateriePrima.map((comanda) => (
                    <TableRow key={comanda.id}>
                      <TableCell className="font-medium">{comanda.numarComanda}</TableCell>
                      <TableCell>{comanda.furnizor}</TableCell>
                      <TableCell>{comanda.material}</TableCell>
                      <TableCell>{comanda.cantitate}</TableCell>
                      <TableCell>{comanda.dataComanda}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produse-finite">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comenzi Produse Finite</CardTitle>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nr. Comandă</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produs</TableHead>
                    <TableHead>Cantitate</TableHead>
                    <TableHead>Data Comandă</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comenziProduseFinite.map((comanda) => (
                    <TableRow key={comanda.id}>
                      <TableCell className="font-medium">{comanda.numarComanda}</TableCell>
                      <TableCell>{comanda.client}</TableCell>
                      <TableCell>{comanda.produs}</TableCell>
                      <TableCell>{comanda.cantitate}</TableCell>
                      <TableCell>{comanda.dataComanda}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
