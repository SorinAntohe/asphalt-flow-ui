import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState } from "react";
const Liste = () => {
  const ITEMS_PER_PAGE = 10;
  
  const [autoturismePage, setAutoturismePage] = useState(1);
  const [soferiPage, setSoferiPage] = useState(1);
  const [materiiPrimePage, setMateriiPrimePage] = useState(1);
  const [produseFinitePage, setProduseFinitePage] = useState(1);
  const [clientiPage, setClientiPage] = useState(1);
  const [furnizoriPage, setFurnizoriPage] = useState(1);
  const autoturisme = [{
    id: 1,
    tipMasina: "Camion cisternă",
    nrAuto: "B-123-ABC",
    sarcinaMax: "25t",
    tipTransport: "Propriu"
  }, {
    id: 2,
    tipMasina: "Camion basculantă",
    nrAuto: "B-456-DEF",
    sarcinaMax: "20t",
    tipTransport: "Închiriat"
  }, {
    id: 3,
    tipMasina: "Camion remorcă",
    nrAuto: "B-789-GHI",
    sarcinaMax: "30t",
    tipTransport: "Extern"
  }];
  const soferi = [{
    id: 1,
    nume: "Ion Popescu",
    ci: "AB123456"
  }, {
    id: 2,
    nume: "Gheorghe Ionescu",
    ci: "BC234567"
  }, {
    id: 3,
    nume: "Vasile Dumitrescu",
    ci: "CD345678"
  }];
  const materiiPrime = [
    { id: 1, denumire: "0/4 NAT" },
    { id: 2, denumire: "0/4 CONC" },
    { id: 3, denumire: "0/4 CRIBLURI" },
    { id: 4, denumire: "4/8 CONC" },
    { id: 5, denumire: "4/8 CRIBLURI" },
    { id: 6, denumire: "4/8 NAT" },
    { id: 7, denumire: "8/16 CONC" },
    { id: 8, denumire: "8/16 CRIBLURI" },
    { id: 9, denumire: "16/22.4 CONC" },
    { id: 10, denumire: "16/22.4 CRIBLURI" },
    { id: 11, denumire: "16/31.5 CRIBLURI" },
    { id: 12, denumire: "CTL" },
    { id: 13, denumire: "BITUM 50/70" },
    { id: 14, denumire: "FILLER" },
    { id: 15, denumire: "CURENT ELECTRIC" },
    { id: 16, denumire: "MOTORINA" },
    { id: 17, denumire: "16/31.5 CONC" },
    { id: 18, denumire: "APA" },
    { id: 19, denumire: "ACID CLORHIDRIC" },
    { id: 20, denumire: "EMULGATOR" },
    { id: 21, denumire: "SARE" },
    { id: 22, denumire: "CELULOZA TOPCEL/TECHNOCEL" }
  ];
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

  // Pagination helpers
  const getPaginatedData = (data: any[], page: number) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number) => Math.ceil(dataLength / ITEMS_PER_PAGE);

  const paginatedAutoturisme = getPaginatedData(autoturisme, autoturismePage);
  const paginatedSoferi = getPaginatedData(soferi, soferiPage);
  const paginatedMateriiPrime = getPaginatedData(materiiPrime, materiiPrimePage);
  const paginatedProduseFinite = getPaginatedData(produseFinite, produseFinitePage);
  const paginatedClienti = getPaginatedData(clienti, clientiPage);
  const paginatedFurnizori = getPaginatedData(furnizori, furnizoriPage);
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
                    <TableHead>ID</TableHead>
                    <TableHead>Tip Mașină</TableHead>
                    <TableHead>Nr. Auto</TableHead>
                    <TableHead>Sarcină Max</TableHead>
                    <TableHead>Tip Transport</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAutoturisme.map(auto => <TableRow key={auto.id}>
                      <TableCell className="font-medium">{auto.id}</TableCell>
                      <TableCell>{auto.tipMasina}</TableCell>
                      <TableCell>{auto.nrAuto}</TableCell>
                      <TableCell>{auto.sarcinaMax}</TableCell>
                      <TableCell>{auto.tipTransport}</TableCell>
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
              {getTotalPages(autoturisme.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setAutoturismePage(p => Math.max(1, p - 1))}
                        className={autoturismePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(autoturisme.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setAutoturismePage(page)}
                          isActive={autoturismePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setAutoturismePage(p => Math.min(getTotalPages(autoturisme.length), p + 1))}
                        className={autoturismePage === getTotalPages(autoturisme.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
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
                    <TableHead>ID</TableHead>
                    <TableHead>Nume Șofer</TableHead>
                    <TableHead>C.I.</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSoferi.map(sofer => <TableRow key={sofer.id}>
                      <TableCell className="font-medium">{sofer.id}</TableCell>
                      <TableCell>{sofer.nume}</TableCell>
                      <TableCell>{sofer.ci}</TableCell>
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
              {getTotalPages(soferi.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSoferiPage(p => Math.max(1, p - 1))}
                        className={soferiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(soferi.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setSoferiPage(page)}
                          isActive={soferiPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setSoferiPage(p => Math.min(getTotalPages(soferi.length), p + 1))}
                        className={soferiPage === getTotalPages(soferi.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
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
                    <TableHead>ID</TableHead>
                    <TableHead>Denumire</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMateriiPrime.map(materie => <TableRow key={materie.id}>
                      <TableCell className="font-medium">{materie.id}</TableCell>
                      <TableCell>{materie.denumire}</TableCell>
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
              {getTotalPages(materiiPrime.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setMateriiPrimePage(p => Math.max(1, p - 1))}
                        className={materiiPrimePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(materiiPrime.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setMateriiPrimePage(page)}
                          isActive={materiiPrimePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setMateriiPrimePage(p => Math.min(getTotalPages(materiiPrime.length), p + 1))}
                        className={materiiPrimePage === getTotalPages(materiiPrime.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
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
                  {paginatedProduseFinite.map(produs => <TableRow key={produs.id}>
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
              {getTotalPages(produseFinite.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setProduseFinitePage(p => Math.max(1, p - 1))}
                        className={produseFinitePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(produseFinite.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setProduseFinitePage(page)}
                          isActive={produseFinitePage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setProduseFinitePage(p => Math.min(getTotalPages(produseFinite.length), p + 1))}
                        className={produseFinitePage === getTotalPages(produseFinite.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
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
                  {paginatedClienti.map(client => <TableRow key={client.id}>
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
              {getTotalPages(clienti.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setClientiPage(p => Math.max(1, p - 1))}
                        className={clientiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(clienti.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setClientiPage(page)}
                          isActive={clientiPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setClientiPage(p => Math.min(getTotalPages(clienti.length), p + 1))}
                        className={clientiPage === getTotalPages(clienti.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
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
                  {paginatedFurnizori.map(furnizor => <TableRow key={furnizor.id}>
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
              {getTotalPages(furnizori.length) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setFurnizoriPage(p => Math.max(1, p - 1))}
                        className={furnizoriPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(furnizori.length) }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setFurnizoriPage(page)}
                          isActive={furnizoriPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setFurnizoriPage(p => Math.min(getTotalPages(furnizori.length), p + 1))}
                        className={furnizoriPage === getTotalPages(furnizori.length) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Liste;