import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  
  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    id: "",
    tipMaterial: "",
    cantitateStoc: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Mock stocuri data
  useEffect(() => {
    const mockData = [
      { id: 1, materiale_prime: "0/4 NAT", stoc: 150.75 },
      { id: 2, materiale_prime: "0/4 CONC", stoc: 230.50 },
      { id: 3, materiale_prime: "8/16 CONC", stoc: 180.25 },
      { id: 4, materiale_prime: "BITUM 50/70", stoc: 45.00 },
      { id: 5, materiale_prime: "FILLER", stoc: 80.00 },
      { id: 6, materiale_prime: "MOTORINA", stoc: 1200.00 },
      { id: 7, materiale_prime: "CTL", stoc: 95.50 },
      { id: 8, materiale_prime: "16/22.4 CONC", stoc: 120.00 },
      { id: 9, materiale_prime: "4/8 CONC", stoc: 200.75 },
      { id: 10, materiale_prime: "CURENT ELECTRIC", stoc: null },
    ];
    setStocuri(mockData);
    setLoading(false);
  }, []);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedStocuri.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredAndSortedStocuri.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl">Stocuri Materiale</CardTitle>
            <div className="flex items-center gap-2">
              <Label className="text-sm">Înregistrări per pagină:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
            <TableBody key={`stocuri-page-${currentPage}`} className="animate-fade-in">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nu există date disponibile
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="h-10">
                    <TableCell className="py-1 text-xs">{item.id}</TableCell>
                    <TableCell className="py-1 text-xs">{item.materiale_prime}</TableCell>
                    <TableCell className="py-1 text-xs">{item.stoc ?? '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Afișare {startIndex + 1}-{Math.min(endIndex, filteredAndSortedStocuri.length)} din {filteredAndSortedStocuri.length}
              </span>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
