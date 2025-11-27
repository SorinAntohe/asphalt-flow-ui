import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Truck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Livrare {
  id: number;
  data: string | null;
  cod: string | null;
  nr_aviz: string | null;
  nr_inmatriculare: string | null;
  tip_masina: string | null;
  nume_sofer: string | null;
  pret_material_total: number | null;
  pret_transport_total: number | null;
  pret_total: number | null;
}

const Livrari = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const livrari: Livrare[] = [];

  // Pagination logic
  const totalPages = Math.ceil(livrari.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = livrari.slice(startIndex, endIndex);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return "-";
    return value.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livrări</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare livrări produse finite către clienți
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Livrare Nouă
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livrări Astăzi</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Total livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valoare Totală</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 RON</div>
            <p className="text-xs text-muted-foreground">
              Valoare livrări azi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Livrări</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{livrari.length}</div>
            <p className="text-xs text-muted-foreground">
              Înregistrări totale
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Istoric Livrări Produs Finit</CardTitle>
              <CardDescription>
                Toate livrările de produse finite către clienți
              </CardDescription>
            </div>
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
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="h-10">
                <TableHead className="text-xs">ID</TableHead>
                <TableHead className="text-xs">Data</TableHead>
                <TableHead className="text-xs">Cod</TableHead>
                <TableHead className="text-xs">Nr. Aviz</TableHead>
                <TableHead className="text-xs">Nr. Înmatriculare</TableHead>
                <TableHead className="text-xs">Tip Mașină</TableHead>
                <TableHead className="text-xs">Nume Șofer</TableHead>
                <TableHead className="text-xs text-right">Preț Material Total</TableHead>
                <TableHead className="text-xs text-right">Preț Transport Total</TableHead>
                <TableHead className="text-xs text-right">Preț Total</TableHead>
                <TableHead className="text-xs text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                    Nu există livrări înregistrate
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((livrare) => (
                  <TableRow key={livrare.id} className="h-10">
                    <TableCell className="py-1 text-xs font-medium">{livrare.id}</TableCell>
                    <TableCell className="py-1 text-xs">{formatDate(livrare.data)}</TableCell>
                    <TableCell className="py-1 text-xs">{livrare.cod || "-"}</TableCell>
                    <TableCell className="py-1 text-xs">{livrare.nr_aviz || "-"}</TableCell>
                    <TableCell className="py-1 text-xs">{livrare.nr_inmatriculare || "-"}</TableCell>
                    <TableCell className="py-1 text-xs">{livrare.tip_masina || "-"}</TableCell>
                    <TableCell className="py-1 text-xs">{livrare.nume_sofer || "-"}</TableCell>
                    <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_material_total)}</TableCell>
                    <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_transport_total)}</TableCell>
                    <TableCell className="py-1 text-xs text-right">{formatNumber(livrare.pret_total)}</TableCell>
                    <TableCell className="py-1 text-xs text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        Detalii
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Afișare {livrari.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, livrari.length)} din {livrari.length}
              </span>
            </div>
            
            {totalPages > 0 && (
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
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Livrari;
