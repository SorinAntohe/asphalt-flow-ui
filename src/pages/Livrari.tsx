import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

const Livrari = () => {
  const livrari = [
    {
      id: "LVR-1234",
      data: "20.11.2024",
      client: "Construct Pro SRL",
      produs: "Asfalt tip A",
      cantitate: "45t",
      status: "livrat",
      sofer: "Ion Popescu",
    },
    {
      id: "LVR-1235",
      data: "20.11.2024",
      client: "Drumuri Moderne",
      produs: "Asfalt tip B",
      cantitate: "38t",
      status: "in_tranzit",
      sofer: "Gheorghe Ionescu",
    },
    {
      id: "LVR-1236",
      data: "21.11.2024",
      client: "Asfaltari Express",
      produs: "Asfalt tip C",
      cantitate: "52t",
      status: "planificat",
      sofer: "Vasile Dumitrescu",
    },
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
          <CardTitle>Istoric Livrări</CardTitle>
          <CardDescription>
            Toate livrările către clienți
          </CardDescription>
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
              {livrari.map((livrare) => (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Livrari;
