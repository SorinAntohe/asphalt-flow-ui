import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

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

  // Filters for Materie Prima
  const [filtersMP, setFiltersMP] = useState({
    cod: "", data: "", furnizor: "", material: "", unitate_masura: "",
    cantitate: "", punct_descarcare: "", pret_fara_tva: "", pret_transport: "", observatii: ""
  });

  // Sort for Materie Prima
  const [sortMP, setSortMP] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

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

  // Filters for Produs Finit
  const [filtersPF, setFiltersPF] = useState({
    cod: "", data: "", client: "", produs: "", unitate_masura: "",
    cantitate: "", punct_descarcare: "", pret_fara_tva: "", pret_transport: "", observatii: ""
  });

  // Sort for Produs Finit
  const [sortPF, setSortPF] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ 
    field: '', direction: null 
  });

  // Filtering and sorting logic for Materie Prima
  const filteredAndSortedMP = comenziMateriePrima
    .filter((item) => {
      return (
        item.cod.toLowerCase().includes(filtersMP.cod.toLowerCase()) &&
        item.data.toLowerCase().includes(filtersMP.data.toLowerCase()) &&
        item.furnizor.toLowerCase().includes(filtersMP.furnizor.toLowerCase()) &&
        item.material.toLowerCase().includes(filtersMP.material.toLowerCase()) &&
        item.unitate_masura.toLowerCase().includes(filtersMP.unitate_masura.toLowerCase()) &&
        item.cantitate.toString().includes(filtersMP.cantitate) &&
        item.punct_descarcare.toLowerCase().includes(filtersMP.punct_descarcare.toLowerCase()) &&
        item.pret_fara_tva.toString().includes(filtersMP.pret_fara_tva) &&
        item.pret_transport.toString().includes(filtersMP.pret_transport) &&
        item.observatii.toLowerCase().includes(filtersMP.observatii.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortMP.field || !sortMP.direction) return 0;
      const aVal = a[sortMP.field as keyof typeof a];
      const bVal = b[sortMP.field as keyof typeof b];
      if (aVal < bVal) return sortMP.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortMP.direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Filtering and sorting logic for Produs Finit
  const filteredAndSortedPF = comenziProduseFinite
    .filter((item) => {
      return (
        item.cod.toLowerCase().includes(filtersPF.cod.toLowerCase()) &&
        item.data.toLowerCase().includes(filtersPF.data.toLowerCase()) &&
        item.client.toLowerCase().includes(filtersPF.client.toLowerCase()) &&
        item.produs.toLowerCase().includes(filtersPF.produs.toLowerCase()) &&
        item.unitate_masura.toLowerCase().includes(filtersPF.unitate_masura.toLowerCase()) &&
        item.cantitate.toString().includes(filtersPF.cantitate) &&
        item.punct_descarcare.toLowerCase().includes(filtersPF.punct_descarcare.toLowerCase()) &&
        item.pret_fara_tva.toString().includes(filtersPF.pret_fara_tva) &&
        item.pret_transport.toString().includes(filtersPF.pret_transport) &&
        item.observatii.toLowerCase().includes(filtersPF.observatii.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (!sortPF.field || !sortPF.direction) return 0;
      const aVal = a[sortPF.field as keyof typeof a];
      const bVal = b[sortPF.field as keyof typeof b];
      if (aVal < bVal) return sortPF.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortPF.direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Comenzi</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
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
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Comenzi Materie Primă</CardTitle>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cod</span>
                              {sortMP.field === 'cod' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cod..." value={filtersMP.cod} onChange={(e) => setFiltersMP({...filtersMP, cod: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cod', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cod', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Data</span>
                              {sortMP.field === 'data' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută data..." value={filtersMP.data} onChange={(e) => setFiltersMP({...filtersMP, data: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'data', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'data', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Furnizor</span>
                              {sortMP.field === 'furnizor' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută furnizor..." value={filtersMP.furnizor} onChange={(e) => setFiltersMP({...filtersMP, furnizor: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'furnizor', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'furnizor', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Material</span>
                              {sortMP.field === 'material' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută material..." value={filtersMP.material} onChange={(e) => setFiltersMP({...filtersMP, material: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'material', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'material', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>U.M.</span>
                              {sortMP.field === 'unitate_masura' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută U.M...." value={filtersMP.unitate_masura} onChange={(e) => setFiltersMP({...filtersMP, unitate_masura: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'unitate_masura', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'unitate_masura', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cantitate</span>
                              {sortMP.field === 'cantitate' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cantitate..." value={filtersMP.cantitate} onChange={(e) => setFiltersMP({...filtersMP, cantitate: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cantitate', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'cantitate', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Punct Descărcare</span>
                              {sortMP.field === 'punct_descarcare' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută punct..." value={filtersMP.punct_descarcare} onChange={(e) => setFiltersMP({...filtersMP, punct_descarcare: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'punct_descarcare', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'punct_descarcare', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț fără TVA</span>
                              {sortMP.field === 'pret_fara_tva' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersMP.pret_fara_tva} onChange={(e) => setFiltersMP({...filtersMP, pret_fara_tva: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_fara_tva', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_fara_tva', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț Transport</span>
                              {sortMP.field === 'pret_transport' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersMP.pret_transport} onChange={(e) => setFiltersMP({...filtersMP, pret_transport: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_transport', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'pret_transport', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Observații</span>
                              {sortMP.field === 'observatii' ? (sortMP.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută observații..." value={filtersMP.observatii} onChange={(e) => setFiltersMP({...filtersMP, observatii: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'observatii', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortMP({ field: 'observatii', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-10 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedMP.map((comanda) => (
                    <TableRow key={comanda.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.furnizor}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.material}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.unitate_masura}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.punct_descarcare}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.pret_transport}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.observatii}</TableCell>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="produse-finite">
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
              <CardTitle className="text-lg sm:text-xl">Comenzi Produse Finite</CardTitle>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Adaugă Comandă
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cod</span>
                              {sortPF.field === 'cod' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cod..." value={filtersPF.cod} onChange={(e) => setFiltersPF({...filtersPF, cod: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cod', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cod', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Data</span>
                              {sortPF.field === 'data' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută data..." value={filtersPF.data} onChange={(e) => setFiltersPF({...filtersPF, data: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'data', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'data', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Client</span>
                              {sortPF.field === 'client' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută client..." value={filtersPF.client} onChange={(e) => setFiltersPF({...filtersPF, client: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'client', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'client', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Produs</span>
                              {sortPF.field === 'produs' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută produs..." value={filtersPF.produs} onChange={(e) => setFiltersPF({...filtersPF, produs: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'produs', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'produs', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>U.M.</span>
                              {sortPF.field === 'unitate_masura' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută U.M...." value={filtersPF.unitate_masura} onChange={(e) => setFiltersPF({...filtersPF, unitate_masura: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'unitate_masura', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'unitate_masura', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Cantitate</span>
                              {sortPF.field === 'cantitate' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută cantitate..." value={filtersPF.cantitate} onChange={(e) => setFiltersPF({...filtersPF, cantitate: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cantitate', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'cantitate', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Punct Descărcare</span>
                              {sortPF.field === 'punct_descarcare' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută punct..." value={filtersPF.punct_descarcare} onChange={(e) => setFiltersPF({...filtersPF, punct_descarcare: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'punct_descarcare', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'punct_descarcare', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț fără TVA</span>
                              {sortPF.field === 'pret_fara_tva' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersPF.pret_fara_tva} onChange={(e) => setFiltersPF({...filtersPF, pret_fara_tva: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_fara_tva', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_fara_tva', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Preț Transport</span>
                              {sortPF.field === 'pret_transport' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută preț..." value={filtersPF.pret_transport} onChange={(e) => setFiltersPF({...filtersPF, pret_transport: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_transport', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'pret_transport', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="h-10 text-xs">
                      <div className="flex items-center gap-1">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                              <span>Observații</span>
                              {sortPF.field === 'observatii' ? (sortPF.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 p-2">
                            <div className="space-y-2">
                              <Input placeholder="Caută observații..." value={filtersPF.observatii} onChange={(e) => setFiltersPF({...filtersPF, observatii: e.target.value})} className="h-7 text-xs" />
                              <div className="flex gap-1">
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'observatii', direction: 'asc' })}>
                                  <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortPF({ field: 'observatii', direction: 'desc' })}>
                                  <ArrowDown className="h-3 w-3 mr-1" /> Z-A
                                </Button>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </TableHead>
                    <TableHead className="text-right h-10 text-xs">
                      <span>Acțiuni</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPF.map((comanda) => (
                    <TableRow key={comanda.id} className="h-10">
                      <TableCell className="font-medium py-1 text-xs">{comanda.cod}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.data}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.client}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.produs}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.unitate_masura}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.cantitate}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.punct_descarcare}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.pret_fara_tva}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.pret_transport}</TableCell>
                      <TableCell className="py-1 text-xs">{comanda.observatii}</TableCell>
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
