import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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

  // Filters
  const [autoturismeFilters, setAutoturismeFilters] = useState({ id: "", tipMasina: "", nrAuto: "", sarcinaMax: "", tipTransport: "" });
  const [soferiFilters, setSoferiFilters] = useState({ id: "", nume: "", ci: "" });
  const [materiiPrimeFilters, setMateriiPrimeFilters] = useState({ id: "", denumire: "" });
  const [produseFiniteFilters, setProduseFiniteFilters] = useState({ id: "", denumire: "" });
  const [clientiFilters, setClientiFilters] = useState({ id: "", denumire: "", sediu: "", cui: "", nrReg: "" });
  const [furnizoriFilters, setFurnizoriFilters] = useState({ id: "", denumire: "", sediu: "", cui: "", nrReg: "" });
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
  const clienti = [
    { id: 1, denumire: "Construct Pro SRL", sediu: "București", cui: "RO12345678", nrReg: "J40/1234/2020" },
    { id: 2, denumire: "Drumuri Moderne SA", sediu: "Cluj-Napoca", cui: "RO23456789", nrReg: "J12/2345/2019" },
    { id: 3, denumire: "Asfaltari Express", sediu: "Timișoara", cui: "RO34567890", nrReg: "J35/3456/2021" },
    { id: 4, denumire: "Infrastructura Sud SRL", sediu: "Craiova", cui: "RO45678901", nrReg: "J16/4567/2018" },
    { id: 5, denumire: "RoadTech Solutions", sediu: "Brașov", cui: "RO56789012", nrReg: "J08/5678/2022" }
  ];
  const furnizori = [
    { id: 1, denumire: "Agregat SRL", sediu: "Ploiești", cui: "RO11111111", nrReg: "J29/1111/2017" },
    { id: 2, denumire: "Bitum Expert", sediu: "București", cui: "RO22222222", nrReg: "J40/2222/2016" },
    { id: 3, denumire: "Material Construct", sediu: "Iași", cui: "RO33333333", nrReg: "J22/3333/2019" },
    { id: 4, denumire: "Agregate Premium SRL", sediu: "Bacău", cui: "RO44444444", nrReg: "J04/4444/2020" },
    { id: 5, denumire: "Chimie Rutieră SA", sediu: "Constanța", cui: "RO55555555", nrReg: "J13/5555/2015" }
  ];

  // Pagination helpers
  const getPaginatedData = (data: any[], page: number, itemsPerPage: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const getTotalPages = (dataLength: number, itemsPerPage: number) => Math.ceil(dataLength / itemsPerPage);

  // Filter helpers
  const filterAutoturisme = autoturisme.filter(item => 
    item.id.toString().includes(autoturismeFilters.id) &&
    item.tipMasina.toLowerCase().includes(autoturismeFilters.tipMasina.toLowerCase()) &&
    item.nrAuto.toLowerCase().includes(autoturismeFilters.nrAuto.toLowerCase()) &&
    item.sarcinaMax.toLowerCase().includes(autoturismeFilters.sarcinaMax.toLowerCase()) &&
    item.tipTransport.toLowerCase().includes(autoturismeFilters.tipTransport.toLowerCase())
  );

  const filterSoferi = soferi.filter(item =>
    item.id.toString().includes(soferiFilters.id) &&
    item.nume.toLowerCase().includes(soferiFilters.nume.toLowerCase()) &&
    item.ci.toLowerCase().includes(soferiFilters.ci.toLowerCase())
  );

  const filterMateriiPrime = materiiPrime.filter(item =>
    item.id.toString().includes(materiiPrimeFilters.id) &&
    item.denumire.toLowerCase().includes(materiiPrimeFilters.denumire.toLowerCase())
  );

  const filterProduseFinite = produseFinite.filter(item =>
    item.id.toString().includes(produseFiniteFilters.id) &&
    item.denumire.toLowerCase().includes(produseFiniteFilters.denumire.toLowerCase())
  );

  const filterClienti = clienti.filter(item =>
    item.id.toString().includes(clientiFilters.id) &&
    item.denumire.toLowerCase().includes(clientiFilters.denumire.toLowerCase()) &&
    item.sediu.toLowerCase().includes(clientiFilters.sediu.toLowerCase()) &&
    item.cui.toLowerCase().includes(clientiFilters.cui.toLowerCase()) &&
    item.nrReg.toLowerCase().includes(clientiFilters.nrReg.toLowerCase())
  );

  const filterFurnizori = furnizori.filter(item =>
    item.id.toString().includes(furnizoriFilters.id) &&
    item.denumire.toLowerCase().includes(furnizoriFilters.denumire.toLowerCase()) &&
    item.sediu.toLowerCase().includes(furnizoriFilters.sediu.toLowerCase()) &&
    item.cui.toLowerCase().includes(furnizoriFilters.cui.toLowerCase()) &&
    item.nrReg.toLowerCase().includes(furnizoriFilters.nrReg.toLowerCase())
  );

  const paginatedAutoturisme = getPaginatedData(filterAutoturisme, autoturismePage, autoturismePerPage);
  const paginatedSoferi = getPaginatedData(filterSoferi, soferiPage, soferiPerPage);
  const paginatedMateriiPrime = getPaginatedData(filterMateriiPrime, materiiPrimePage, materiiPrimePerPage);
  const paginatedProduseFinite = getPaginatedData(filterProduseFinite, produseFinitePage, produseFinitePerPage);
  const paginatedClienti = getPaginatedData(filterClienti, clientiPage, clientiPerPage);
  const paginatedFurnizori = getPaginatedData(filterFurnizori, furnizoriPage, furnizoriPerPage);
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={autoturismeFilters.id} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, id: e.target.value}); setAutoturismePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Tip Mașină</span>
                        <Input placeholder="Caută..." value={autoturismeFilters.tipMasina} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, tipMasina: e.target.value}); setAutoturismePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Nr. Auto</span>
                        <Input placeholder="Caută..." value={autoturismeFilters.nrAuto} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, nrAuto: e.target.value}); setAutoturismePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Sarcină Max</span>
                        <Input placeholder="Caută..." value={autoturismeFilters.sarcinaMax} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, sarcinaMax: e.target.value}); setAutoturismePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Tip Transport</span>
                        <Input placeholder="Caută..." value={autoturismeFilters.tipTransport} onChange={(e) => { setAutoturismeFilters({...autoturismeFilters, tipTransport: e.target.value}); setAutoturismePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAutoturisme.map(auto => <TableRow key={auto.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{auto.id}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.tipMasina}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.nrAuto}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.sarcinaMax}</TableCell>
                      <TableCell className="py-1 text-xs">{auto.tipTransport}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterAutoturisme.length, autoturismePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setAutoturismePage(p => Math.max(1, p - 1))}
                        className={autoturismePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterAutoturisme.length, autoturismePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setAutoturismePage(p => Math.min(getTotalPages(filterAutoturisme.length, autoturismePerPage), p + 1))}
                        className={autoturismePage === getTotalPages(filterAutoturisme.length, autoturismePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={soferiFilters.id} onChange={(e) => { setSoferiFilters({...soferiFilters, id: e.target.value}); setSoferiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Nume Șofer</span>
                        <Input placeholder="Caută..." value={soferiFilters.nume} onChange={(e) => { setSoferiFilters({...soferiFilters, nume: e.target.value}); setSoferiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>C.I.</span>
                        <Input placeholder="Caută..." value={soferiFilters.ci} onChange={(e) => { setSoferiFilters({...soferiFilters, ci: e.target.value}); setSoferiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSoferi.map(sofer => <TableRow key={sofer.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{sofer.id}</TableCell>
                      <TableCell className="py-1 text-xs">{sofer.nume}</TableCell>
                      <TableCell className="py-1 text-xs">{sofer.ci}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterSoferi.length, soferiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setSoferiPage(p => Math.max(1, p - 1))}
                        className={soferiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterSoferi.length, soferiPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setSoferiPage(p => Math.min(getTotalPages(filterSoferi.length, soferiPerPage), p + 1))}
                        className={soferiPage === getTotalPages(filterSoferi.length, soferiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={materiiPrimeFilters.id} onChange={(e) => { setMateriiPrimeFilters({...materiiPrimeFilters, id: e.target.value}); setMateriiPrimePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Denumire</span>
                        <Input placeholder="Caută..." value={materiiPrimeFilters.denumire} onChange={(e) => { setMateriiPrimeFilters({...materiiPrimeFilters, denumire: e.target.value}); setMateriiPrimePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMateriiPrime.map(materie => <TableRow key={materie.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{materie.id}</TableCell>
                      <TableCell className="py-1 text-xs">{materie.denumire}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterMateriiPrime.length, materiiPrimePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setMateriiPrimePage(p => Math.max(1, p - 1))}
                        className={materiiPrimePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterMateriiPrime.length, materiiPrimePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setMateriiPrimePage(p => Math.min(getTotalPages(filterMateriiPrime.length, materiiPrimePerPage), p + 1))}
                        className={materiiPrimePage === getTotalPages(filterMateriiPrime.length, materiiPrimePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={produseFiniteFilters.id} onChange={(e) => { setProduseFiniteFilters({...produseFiniteFilters, id: e.target.value}); setProduseFinitePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Denumire</span>
                        <Input placeholder="Caută..." value={produseFiniteFilters.denumire} onChange={(e) => { setProduseFiniteFilters({...produseFiniteFilters, denumire: e.target.value}); setProduseFinitePage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProduseFinite.map(produs => <TableRow key={produs.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{produs.id}</TableCell>
                      <TableCell className="py-1 text-xs">{produs.denumire}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterProduseFinite.length, produseFinitePerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setProduseFinitePage(p => Math.max(1, p - 1))}
                        className={produseFinitePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterProduseFinite.length, produseFinitePerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setProduseFinitePage(p => Math.min(getTotalPages(filterProduseFinite.length, produseFinitePerPage), p + 1))}
                        className={produseFinitePage === getTotalPages(filterProduseFinite.length, produseFinitePerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={clientiFilters.id} onChange={(e) => { setClientiFilters({...clientiFilters, id: e.target.value}); setClientiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Denumire</span>
                        <Input placeholder="Caută..." value={clientiFilters.denumire} onChange={(e) => { setClientiFilters({...clientiFilters, denumire: e.target.value}); setClientiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Sediu</span>
                        <Input placeholder="Caută..." value={clientiFilters.sediu} onChange={(e) => { setClientiFilters({...clientiFilters, sediu: e.target.value}); setClientiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>CUI</span>
                        <Input placeholder="Caută..." value={clientiFilters.cui} onChange={(e) => { setClientiFilters({...clientiFilters, cui: e.target.value}); setClientiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Nr. REG</span>
                        <Input placeholder="Caută..." value={clientiFilters.nrReg} onChange={(e) => { setClientiFilters({...clientiFilters, nrReg: e.target.value}); setClientiPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedClienti.map(client => <TableRow key={client.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{client.id}</TableCell>
                      <TableCell className="py-1 text-xs">{client.denumire}</TableCell>
                      <TableCell className="py-1 text-xs">{client.sediu}</TableCell>
                      <TableCell className="py-1 text-xs">{client.cui}</TableCell>
                      <TableCell className="py-1 text-xs">{client.nrReg}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterClienti.length, clientiPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setClientiPage(p => Math.max(1, p - 1))}
                        className={clientiPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterClienti.length, clientiPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setClientiPage(p => Math.min(getTotalPages(filterClienti.length, clientiPerPage), p + 1))}
                        className={clientiPage === getTotalPages(filterClienti.length, clientiPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>ID</span>
                        <Input placeholder="Caută..." value={furnizoriFilters.id} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, id: e.target.value}); setFurnizoriPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Denumire</span>
                        <Input placeholder="Caută..." value={furnizoriFilters.denumire} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, denumire: e.target.value}); setFurnizoriPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Sediu</span>
                        <Input placeholder="Caută..." value={furnizoriFilters.sediu} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, sediu: e.target.value}); setFurnizoriPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>CUI</span>
                        <Input placeholder="Caută..." value={furnizoriFilters.cui} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, cui: e.target.value}); setFurnizoriPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="h-14 text-xs">
                      <div className="flex flex-col gap-1">
                        <span>Nr. REG</span>
                        <Input placeholder="Caută..." value={furnizoriFilters.nrReg} onChange={(e) => { setFurnizoriFilters({...furnizoriFilters, nrReg: e.target.value}); setFurnizoriPage(1); }} className="h-6 text-xs" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-14 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFurnizori.map(furnizor => <TableRow key={furnizor.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{furnizor.id}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.denumire}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.sediu}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.cui}</TableCell>
                      <TableCell className="py-1 text-xs">{furnizor.nrReg}</TableCell>
                      <TableCell className="text-right py-1">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 text-xs">
                            <Pencil className="w-3 h-3" />
                            Editează
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-1 bg-red-700 hover:bg-red-600 h-7 px-2 text-xs">
                            <Trash2 className="w-3 h-3" />
                            Șterge
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
              {getTotalPages(filterFurnizori.length, furnizoriPerPage) > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setFurnizoriPage(p => Math.max(1, p - 1))}
                        className={furnizoriPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: getTotalPages(filterFurnizori.length, furnizoriPerPage) }, (_, i) => i + 1).map(page => (
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
                        onClick={() => setFurnizoriPage(p => Math.min(getTotalPages(filterFurnizori.length, furnizoriPerPage), p + 1))}
                        className={furnizoriPage === getTotalPages(filterFurnizori.length, furnizoriPerPage) ? "pointer-events-none opacity-50" : "cursor-pointer"}
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