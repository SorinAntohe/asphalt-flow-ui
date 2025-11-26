import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
const Liste = () => {
  const [autoturismePerPage, setAutoturismePerPage] = useState(10);
  const [soferiPerPage, setSoferiPerPage] = useState(10);
  const [materiiPrimePerPage, setMateriiPrimePerPage] = useState(10);
  const [produseFinitePerPage, setProduseFinitePerPage] = useState(10);
  const [clientiPerPage, setClientiPerPage] = useState(10);
  const [furnizoriPerPage, setFurnizoriPerPage] = useState(10);
  
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
    { id: 12, denumire: "16/31.5 CONC" },
    { id: 13, denumire: "CTL" },
    { id: 14, denumire: "BITUM 50/70" },
    { id: 15, denumire: "BITUM 70/100" },
    { id: 16, denumire: "FILLER CALCAR" },
    { id: 17, denumire: "FILLER CIMENT" },
    { id: 18, denumire: "CURENT ELECTRIC" },
    { id: 19, denumire: "MOTORINA" },
    { id: 20, denumire: "APA" },
    { id: 21, denumire: "ACID CLORHIDRIC" },
    { id: 22, denumire: "EMULGATOR CATIONIC" },
    { id: 23, denumire: "EMULGATOR ANIONIC" },
    { id: 24, denumire: "SARE DE DRUM" },
    { id: 25, denumire: "CELULOZA TOPCEL" },
    { id: 26, denumire: "CELULOZA TECHNOCEL" },
    { id: 27, denumire: "ADITIV ADEZIUNE" },
    { id: 28, denumire: "POLIMER SBS" },
    { id: 29, denumire: "FIBRĂ CELULOZICĂ" },
    { id: 30, denumire: "NISIP SILICOS" }
  ];
  const produseFinite = [
    { id: 1, denumire: "Asfalt tip A" },
    { id: 2, denumire: "Asfalt tip B" },
    { id: 3, denumire: "Asfalt tip C" },
    { id: 4, denumire: "Asfalt tip D" },
    { id: 5, denumire: "Asfalt modificat SBS" },
    { id: 6, denumire: "Mixturi asfaltice rutiere" },
    { id: 7, denumire: "Emulsie bituminoasă cationică" },
    { id: 8, denumire: "Emulsie bituminoasă anionică" }
  ];
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
  const getPaginatedData = (data: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number, itemsPerPage: number) => Math.ceil(dataLength / itemsPerPage);

  const paginatedAutoturisme = getPaginatedData(autoturisme, autoturismePage, autoturismePerPage);
  const paginatedSoferi = getPaginatedData(soferi, soferiPage, soferiPerPage);
  const paginatedMateriiPrime = getPaginatedData(materiiPrime, materiiPrimePage, materiiPrimePerPage);
  const paginatedProduseFinite = getPaginatedData(produseFinite, produseFinitePage, produseFinitePerPage);
  const paginatedClienti = getPaginatedData(clienti, clientiPage, clientiPerPage);
  const paginatedFurnizori = getPaginatedData(furnizori, furnizoriPage, furnizoriPerPage);
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={autoturismePerPage.toString()} onValueChange={(value) => { setAutoturismePerPage(Number(value)); setAutoturismePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
              {getTotalPages(autoturisme.length, autoturismePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setAutoturismePage(p => Math.max(1, p - 1))}
                        className={autoturismePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(autoturisme.length, autoturismePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setAutoturismePage(p => Math.min(getTotalPages(autoturisme.length, autoturismePerPage), p + 1))}
                        className={autoturismePage === getTotalPages(autoturisme.length, autoturismePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={soferiPerPage.toString()} onValueChange={(value) => { setSoferiPerPage(Number(value)); setSoferiPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
              {getTotalPages(soferi.length, soferiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSoferiPage(p => Math.max(1, p - 1))}
                        className={soferiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(soferi.length, soferiPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setSoferiPage(p => Math.min(getTotalPages(soferi.length, soferiPerPage), p + 1))}
                        className={soferiPage === getTotalPages(soferi.length, soferiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={materiiPrimePerPage.toString()} onValueChange={(value) => { setMateriiPrimePerPage(Number(value)); setMateriiPrimePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
              {getTotalPages(materiiPrime.length, materiiPrimePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setMateriiPrimePage(p => Math.max(1, p - 1))}
                        className={materiiPrimePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(materiiPrime.length, materiiPrimePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setMateriiPrimePage(p => Math.min(getTotalPages(materiiPrime.length, materiiPrimePerPage), p + 1))}
                        className={materiiPrimePage === getTotalPages(materiiPrime.length, materiiPrimePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={produseFinitePerPage.toString()} onValueChange={(value) => { setProduseFinitePerPage(Number(value)); setProduseFinitePage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
                  {paginatedProduseFinite.map(produs => <TableRow key={produs.id}>
                      <TableCell className="font-medium">{produs.id}</TableCell>
                      <TableCell>{produs.denumire}</TableCell>
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
              {getTotalPages(produseFinite.length, produseFinitePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setProduseFinitePage(p => Math.max(1, p - 1))}
                        className={produseFinitePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(produseFinite.length, produseFinitePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setProduseFinitePage(p => Math.min(getTotalPages(produseFinite.length, produseFinitePerPage), p + 1))}
                        className={produseFinitePage === getTotalPages(produseFinite.length, produseFinitePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={clientiPerPage.toString()} onValueChange={(value) => { setClientiPerPage(Number(value)); setClientiPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
              {getTotalPages(clienti.length, clientiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setClientiPage(p => Math.max(1, p - 1))}
                        className={clientiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(clienti.length, clientiPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setClientiPage(p => Math.min(getTotalPages(clienti.length, clientiPerPage), p + 1))}
                        className={clientiPage === getTotalPages(clienti.length, clientiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
            <CardHeader>
              <div className="flex flex-row items-center justify-between">
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
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Afișează:</span>
                <Select value={furnizoriPerPage.toString()} onValueChange={(value) => { setFurnizoriPerPage(Number(value)); setFurnizoriPage(1); }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">înregistrări</span>
              </div>
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
              {getTotalPages(furnizori.length, furnizoriPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setFurnizoriPage(p => Math.max(1, p - 1))}
                        className={furnizoriPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(furnizori.length, furnizoriPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setFurnizoriPage(p => Math.min(getTotalPages(furnizori.length, furnizoriPerPage), p + 1))}
                        className={furnizoriPage === getTotalPages(furnizori.length, furnizoriPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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