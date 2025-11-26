import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
const Liste = () => {
  const autoturisme = [{
    id: 1,
    marca: "Mercedes",
    model: "Actros",
    numar: "B-123-ABC",
    an: "2020"
  }, {
    id: 2,
    marca: "Volvo",
    model: "FH16",
    numar: "B-456-DEF",
    an: "2019"
  }, {
    id: 3,
    marca: "MAN",
    model: "TGX",
    numar: "B-789-GHI",
    an: "2021"
  }];
  const soferi = [{
    id: 1,
    nume: "Ion Popescu",
    cnp: "1850102123456",
    telefon: "0721234567",
    permis: "CE"
  }, {
    id: 2,
    nume: "Gheorghe Ionescu",
    cnp: "1750203234567",
    telefon: "0732345678",
    permis: "CE"
  }, {
    id: 3,
    nume: "Vasile Dumitrescu",
    cnp: "1800304345678",
    telefon: "0743456789",
    permis: "CE"
  }];
  const materiiPrime = [{
    id: 1,
    cod: "BIT-001",
    denumire: "Bitum rutier",
    um: "tone",
    stoc: "120t",
    pret: "350 RON/t"
  }, {
    id: 2,
    cod: "AGR-001",
    denumire: "Agregate minerale",
    um: "tone",
    stoc: "560t",
    pret: "80 RON/t"
  }, {
    id: 3,
    cod: "ADD-001",
    denumire: "Aditivi speciali",
    um: "kg",
    stoc: "450kg",
    pret: "25 RON/kg"
  }];
  const produseFinite = [{
    id: 1,
    cod: "ASF-A-001",
    denumire: "Asfalt tip A",
    stoc: "450t",
    pret: "250 RON/t"
  }, {
    id: 2,
    cod: "ASF-B-002",
    denumire: "Asfalt tip B",
    stoc: "320t",
    pret: "220 RON/t"
  }, {
    id: 3,
    cod: "ASF-C-003",
    denumire: "Asfalt tip C",
    stoc: "180t",
    pret: "200 RON/t"
  }];
  const clienti = [{
    id: 1,
    denumire: "Construct Pro SRL",
    cui: "RO12345678",
    telefon: "0212345678",
    oras: "București"
  }, {
    id: 2,
    denumire: "Drumuri Moderne SA",
    cui: "RO23456789",
    telefon: "0223456789",
    oras: "Cluj-Napoca"
  }, {
    id: 3,
    denumire: "Asfaltari Express",
    cui: "RO34567890",
    telefon: "0234567890",
    oras: "Timișoara"
  }];
  const furnizori = [{
    id: 1,
    denumire: "Agregat SRL",
    cui: "RO45678901",
    telefon: "0245678901",
    produse: "Agregate minerale"
  }, {
    id: 2,
    denumire: "Bitum Expert",
    cui: "RO56789012",
    telefon: "0256789012",
    produse: "Bitum rutier"
  }, {
    id: 3,
    denumire: "Material Construct",
    cui: "RO67890123",
    telefon: "0267890123",
    produse: "Diverse materiale"
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liste</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare nomenclatoare și registre
          </p>
        </div>
      </div>

      <Tabs defaultValue="autoturisme" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="autoturisme">Autoturisme</TabsTrigger>
          <TabsTrigger value="soferi">Șoferi</TabsTrigger>
          <TabsTrigger value="materii">Materii Prime</TabsTrigger>
          <TabsTrigger value="produse">Produse Finite</TabsTrigger>
          <TabsTrigger value="clienti">Clienți</TabsTrigger>
          <TabsTrigger value="furnizori">Furnizori</TabsTrigger>
        </TabsList>

        <TabsContent value="autoturisme">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Autoturisme</CardTitle>
                <CardDescription>
                  Parcul auto disponibil pentru transport
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Autoturism
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marcă</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Număr Înmatriculare</TableHead>
                    <TableHead>An Fabricație</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {autoturisme.map(auto => <TableRow key={auto.id}>
                      <TableCell className="font-medium">{auto.marca}</TableCell>
                      <TableCell>{auto.model}</TableCell>
                      <TableCell>{auto.numar}</TableCell>
                      <TableCell>{auto.an}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="soferi">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Șoferi</CardTitle>
                <CardDescription>
                  Personal autorizat pentru conducere
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Șofer
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume Complet</TableHead>
                    <TableHead>CNP</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Categorie Permis</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {soferi.map(sofer => <TableRow key={sofer.id}>
                      <TableCell className="font-medium">{sofer.nume}</TableCell>
                      <TableCell>{sofer.cnp}</TableCell>
                      <TableCell>{sofer.telefon}</TableCell>
                      <TableCell>{sofer.permis}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materii">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Materii Prime</CardTitle>
                <CardDescription>
                  Materii prime utilizate în producție
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Materie Primă
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead>UM</TableHead>
                    <TableHead>Stoc</TableHead>
                    <TableHead>Preț Unitar</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiiPrime.map(materie => <TableRow key={materie.id}>
                      <TableCell className="font-medium">{materie.cod}</TableCell>
                      <TableCell>{materie.denumire}</TableCell>
                      <TableCell>{materie.um}</TableCell>
                      <TableCell>{materie.stoc}</TableCell>
                      <TableCell>{materie.pret}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produse">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Produse Finite</CardTitle>
                <CardDescription>
                  Produse finite disponibile pentru livrare
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Produs
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cod</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead>Stoc Disponibil</TableHead>
                    <TableHead>Preț Unitar</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produseFinite.map(produs => <TableRow key={produs.id}>
                      <TableCell className="font-medium">{produs.cod}</TableCell>
                      <TableCell>{produs.denumire}</TableCell>
                      <TableCell>{produs.stoc}</TableCell>
                      <TableCell>{produs.pret}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clienti">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Clienți</CardTitle>
                <CardDescription>
                  Clienți activi și parteneri comerciali
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Client
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denumire</TableHead>
                    <TableHead>CUI</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Oraș</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clienti.map(client => <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.denumire}</TableCell>
                      <TableCell>{client.cui}</TableCell>
                      <TableCell>{client.telefon}</TableCell>
                      <TableCell>{client.oras}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="furnizori">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Lista Furnizori</CardTitle>
                <CardDescription>
                  Furnizori de materii prime și materiale
                </CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Adaugă Furnizor
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Denumire</TableHead>
                    <TableHead>CUI</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Produse Furnizate</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {furnizori.map(furnizor => <TableRow key={furnizor.id}>
                      <TableCell className="font-medium">{furnizor.denumire}</TableCell>
                      <TableCell>{furnizor.cui}</TableCell>
                      <TableCell>{furnizor.telefon}</TableCell>
                      <TableCell>{furnizor.produse}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Pencil className="w-4 h-4" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2 bg-red-700 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Liste;