import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Liste = () => {
  const items = [
    { id: 1, cod: "ASF-A-001", nume: "Asfalt tip A", cantitate: "450t", pret: "250 RON/t" },
    { id: 2, cod: "ASF-B-002", nume: "Asfalt tip B", cantitate: "320t", pret: "220 RON/t" },
    { id: 3, cod: "ASF-C-003", nume: "Asfalt tip C", cantitate: "180t", pret: "200 RON/t" },
    { id: 4, cod: "BIT-001", nume: "Bitum rutier", cantitate: "120t", pret: "350 RON/t" },
    { id: 5, cod: "AGR-001", nume: "Agregate minerale", cantitate: "560t", pret: "80 RON/t" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liste Produse</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare nomenclator produse și materiale
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Adaugă Produs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nomenclator Produse</CardTitle>
          <CardDescription>
            Lista completă a produselor și materialelor disponibile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cod</TableHead>
                <TableHead>Denumire</TableHead>
                <TableHead>Cantitate Stoc</TableHead>
                <TableHead>Preț Unitar</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.cod}</TableCell>
                  <TableCell>{item.nume}</TableCell>
                  <TableCell>{item.cantitate}</TableCell>
                  <TableCell>{item.pret}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Editează
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Liste;
