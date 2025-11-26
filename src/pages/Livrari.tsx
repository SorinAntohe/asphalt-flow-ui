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
import { Badge } from "@/components/ui/badge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Livrari = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  
  const livrari = [
    { id: 1, data: "26/11/2024", client: "CONSTRUCT SRL", produs: "Asfalt BA16", cantitate: "45 tone", sofer: "Ion Popescu", status: "livrat" },
    { id: 2, data: "26/11/2024", client: "DRUMURI SA", produs: "Beton Stabilizat BSC", cantitate: "30 mc", sofer: "Maria Ionescu", status: "in_tranzit" },
    { id: 3, data: "25/11/2024", client: "INFRASTRUCTURA TOTAL", produs: "Asfalt BA8", cantitate: "28 tone", sofer: "Gheorghe Popa", status: "livrat" },
    { id: 4, data: "25/11/2024", client: "BETON PLUS", produs: "Emulsie Cationica", cantitate: "15 tone", sofer: "Ana Muresan", status: "livrat" },
    { id: 5, data: "27/11/2024", client: "CONSTRUCT SRL", produs: "Asfalt BA16", cantitate: "50 tone", sofer: "Vasile Constantin", status: "planificat" },
    { id: 6, data: "27/11/2024", client: "DRUMURI SA", produs: "Beton Rutier C25/30", cantitate: "40 mc", sofer: "Elena Dumitru", status: "planificat" },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      livrat: { variant: "default", label: "Livrat" },
      in_tranzit: { variant: "secondary", label: "În Tranzit" },
      planificat: { variant: "outline", label: "Planificat" },
    };
    const config = variants[status] || variants.planificat;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Pagination logic
  const totalPages = Math.ceil(livrari.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = livrari.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livrări</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare livrări produse către clienți
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
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-green-600">
              +3 față de ieri
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">În Tranzit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Livrări active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planificate</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Următoarele 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Istoric Livrări</CardTitle>
              <CardDescription>
                Toate livrările către clienți
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
              <TableRow>
                <TableHead>ID Livrare</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Produs</TableHead>
                <TableHead>Cantitate</TableHead>
                <TableHead>Șofer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((livrare) => (
                <TableRow key={livrare.id}>
                  <TableCell className="font-medium">{livrare.id}</TableCell>
                  <TableCell>{livrare.data}</TableCell>
                  <TableCell>{livrare.client}</TableCell>
                  <TableCell>{livrare.produs}</TableCell>
                  <TableCell>{livrare.cantitate}</TableCell>
                  <TableCell>{livrare.sofer}</TableCell>
                  <TableCell>{getStatusBadge(livrare.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Detalii
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-2 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Afișare {startIndex + 1}-{Math.min(endIndex, livrari.length)} din {livrari.length}
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
};

export default Livrari;
