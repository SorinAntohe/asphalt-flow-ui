import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

interface StocItem {
  id: number;
  materiale_prime: string;
  stoc: number | null;
}

export default function Stocuri() {
  const { toast } = useToast();
  const [stocuri, setStocuri] = useState<StocItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    id: "",
    tipMaterial: "",
    cantitateStoc: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Fetch stocuri from API
  useEffect(() => {
    const fetchStocuri = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.1.22:8002/liste/returneaza/stocuri');
        if (!response.ok) {
          throw new Error('Failed to fetch stocuri');
        }
        const data = await response.json();
        setStocuri(data);
      } catch (error) {
        console.error('Error fetching stocuri:', error);
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca datele despre stocuri",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStocuri();
  }, [toast]);

  const filteredAndSortedStocuri = stocuri
    .filter((item) => {
      return (
        item.id.toString().includes(filters.id) &&
        item.materiale_prime.toLowerCase().includes(filters.tipMaterial.toLowerCase()) &&
        (item.stoc?.toString() || '').includes(filters.cantitateStoc)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      
      let aVal: string | number | null;
      let bVal: string | number | null;
      
      if (key === 'id') {
        aVal = a.id;
        bVal = b.id;
      } else if (key === 'materiale_prime') {
        aVal = a.materiale_prime;
        bVal = b.materiale_prime;
      } else {
        aVal = a.stoc ?? 0;
        bVal = b.stoc ?? 0;
      }
      
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return direction === "asc" ? 1 : -1;
      if (bVal === null) return direction === "asc" ? -1 : 1;
      
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Stocuri</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Vizualizează stocurile de materii prime
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Stocuri Materiale</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10 text-xs">
                  <div className="flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                          <span>ID</span>
                          {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="space-y-2">
                          <Input 
                            placeholder="Caută ID..." 
                            value={filters.id}
                            onChange={(e) => setFilters({ ...filters, id: e.target.value })} 
                            className="h-7 text-xs" 
                          />
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'id', direction: 'asc' })}>
                              <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'id', direction: 'desc' })}>
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
                          <span>Tip Material</span>
                          {sortConfig?.key === 'materiale_prime' ? (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="space-y-2">
                          <Input 
                            placeholder="Caută material..." 
                            value={filters.tipMaterial}
                            onChange={(e) => setFilters({ ...filters, tipMaterial: e.target.value })} 
                            className="h-7 text-xs" 
                          />
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'materiale_prime', direction: 'asc' })}>
                              <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'materiale_prime', direction: 'desc' })}>
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
                          <span>Cantitate Stoc</span>
                          {sortConfig?.key === 'stoc' ? (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-2">
                        <div className="space-y-2">
                          <Input 
                            placeholder="Caută cantitate..." 
                            value={filters.cantitateStoc}
                            onChange={(e) => setFilters({ ...filters, cantitateStoc: e.target.value })} 
                            className="h-7 text-xs" 
                          />
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'stoc', direction: 'asc' })}>
                              <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'stoc', direction: 'desc' })}>
                              <ArrowDown className="h-3 w-3 mr-1" /> Descresc.
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAndSortedStocuri.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nu există date disponibile
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedStocuri.map((item) => (
                  <TableRow key={item.id} className="h-10">
                    <TableCell className="py-1 text-xs">{item.id}</TableCell>
                    <TableCell className="py-1 text-xs">{item.materiale_prime}</TableCell>
                    <TableCell className="py-1 text-xs">{item.stoc ?? '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
