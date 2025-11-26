import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function Stocuri() {
  const [stocuri] = useState([
    { id: 1, tipMaterial: "0/4 NAT", cantitateStoc: 1500 },
    { id: 2, tipMaterial: "0/4 CONC", cantitateStoc: 2300 },
    { id: 3, tipMaterial: "BITUM 50/70", cantitateStoc: 450 },
  ]);

  const [filters, setFilters] = useState({
    tipMaterial: "",
    cantitateStoc: "",
  });

  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedStocuri = stocuri
    .filter((item) => {
      return (
        item.tipMaterial.toLowerCase().includes(filters.tipMaterial.toLowerCase()) &&
        item.cantitateStoc.toString().includes(filters.cantitateStoc)
      );
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      const aVal = a[key as keyof typeof a];
      const bVal = b[key as keyof typeof b];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Stocuri</h1>
        <p className="text-muted-foreground mt-2">
          Vizualizează stocurile de materii prime
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stocuri Materiale</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="h-10 text-xs">
                  <div className="flex items-center gap-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
                          <span>Tip Material</span>
                          {sortConfig?.key === 'tipMaterial' ? (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
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
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'tipMaterial', direction: 'asc' })}>
                              <ArrowUp className="h-3 w-3 mr-1" /> A-Z
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'tipMaterial', direction: 'desc' })}>
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
                          {sortConfig?.key === 'cantitateStoc' ? (sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3" />}
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
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'cantitateStoc', direction: 'asc' })}>
                              <ArrowUp className="h-3 w-3 mr-1" /> Cresc.
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={() => setSortConfig({ key: 'cantitateStoc', direction: 'desc' })}>
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
              {filteredAndSortedStocuri.map((item) => (
                <TableRow key={item.id} className="h-10">
                  <TableCell className="py-1 text-xs">{item.tipMaterial}</TableCell>
                  <TableCell className="py-1 text-xs">{item.cantitateStoc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
