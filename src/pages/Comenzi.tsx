import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function Comenzi() {
  const [comenziMateriePrima] = useState([
    { 
      id: 1, 
      cod: "CMP-001", 
      data: "2024-01-15", 
      furnizor: "Furnizor A", 
      material: "0/4 NAT", 
      unitate_masura: "tone",
      cantitate: 500, 
      punct_descarcare: "Punct A",
      pret_fara_tva: 150.5,
      pret_transport: 25.0,
      observatii: "Livrare urgentă"
    },
    { 
      id: 2, 
      cod: "CMP-002", 
      data: "2024-01-16", 
      furnizor: "Furnizor B", 
      material: "BITUM 50/70", 
      unitate_masura: "tone",
      cantitate: 200, 
      punct_descarcare: "Punct B",
      pret_fara_tva: 320.0,
      pret_transport: 45.0,
      observatii: ""
    },
  ]);

  const [comenziProduseFinite] = useState([
    { 
      id: 1, 
      cod: "CPF-001", 
      data: "2024-01-15", 
      client: "Client A", 
      produs: "Asfalt BA16", 
      unitate_masura: "tone",
      cantitate: 1000, 
      punct_descarcare: "Șantier X",
      pret_fara_tva: 280.5,
      pret_transport: 35.0,
      observatii: "Transport cu basculantă"
    },
    { 
      id: 2, 
      cod: "CPF-002", 
      data: "2024-01-16", 
      client: "Client B", 
      produs: "Asfalt BA8", 
      unitate_masura: "tone",
      cantitate: 750, 
      punct_descarcare: "Șantier Y",
      pret_fara_tva: 195.0,
      pret_transport: 30.0,
      observatii: ""
    },
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
                    <TableHead>Cod</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Furnizor</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>U.M.</TableHead>
                    <TableHead>Cantitate</TableHead>
                    <TableHead>Punct Descărcare</TableHead>
                    <TableHead>Preț fără TVA</TableHead>
                    <TableHead>Preț Transport</TableHead>
                    <TableHead>Observații</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comenziMateriePrima.map((comanda) => (
                    <TableRow key={comanda.id}>
                      <TableCell className="font-medium">{comanda.cod}</TableCell>
                      <TableCell>{comanda.data}</TableCell>
                      <TableCell>{comanda.furnizor}</TableCell>
                      <TableCell>{comanda.material}</TableCell>
                      <TableCell>{comanda.unitate_masura}</TableCell>
                      <TableCell>{comanda.cantitate}</TableCell>
                      <TableCell>{comanda.punct_descarcare}</TableCell>
                      <TableCell>{comanda.pret_fara_tva}</TableCell>
                      <TableCell>{comanda.pret_transport}</TableCell>
                      <TableCell>{comanda.observatii}</TableCell>
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
                    <TableHead>Cod</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Produs</TableHead>
                    <TableHead>U.M.</TableHead>
                    <TableHead>Cantitate</TableHead>
                    <TableHead>Punct Descărcare</TableHead>
                    <TableHead>Preț fără TVA</TableHead>
                    <TableHead>Preț Transport</TableHead>
                    <TableHead>Observații</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comenziProduseFinite.map((comanda) => (
                    <TableRow key={comanda.id}>
                      <TableCell className="font-medium">{comanda.cod}</TableCell>
                      <TableCell>{comanda.data}</TableCell>
                      <TableCell>{comanda.client}</TableCell>
                      <TableCell>{comanda.produs}</TableCell>
                      <TableCell>{comanda.unitate_masura}</TableCell>
                      <TableCell>{comanda.cantitate}</TableCell>
                      <TableCell>{comanda.punct_descarcare}</TableCell>
                      <TableCell>{comanda.pret_fara_tva}</TableCell>
                      <TableCell>{comanda.pret_transport}</TableCell>
                      <TableCell>{comanda.observatii}</TableCell>
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
