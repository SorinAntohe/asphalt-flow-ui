import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PackageCheck } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Receptii = () => {
  const receptii = [
    {
      id: "RCP-001",
      data: "15.11.2024",
      furnizor: "Agregat SRL",
      produs: "Agregate minerale",
      cantitate: "50t",
      status: "finalizat",
    },
    {
      id: "RCP-002",
      data: "16.11.2024",
      furnizor: "Bitum Expert",
      produs: "Bitum rutier",
      cantitate: "30t",
      status: "in_proces",
    },
    {
      id: "RCP-003",
      data: "18.11.2024",
      furnizor: "Material Construct",
      produs: "Agregate minerale",
      cantitate: "45t",
      status: "planificat",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      finalizat: { variant: "default", label: "Finalizat" },
      in_proces: { variant: "secondary", label: "În Proces" },
      planificat: { variant: "outline", label: "Planificat" },
    };
    const config = variants[status] || variants.planificat;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recepții</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare recepții materii prime și materiale
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Recepție Nouă
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recepții</CardTitle>
            <PackageCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">125t</div>
            <p className="text-xs text-muted-foreground">
              Luna curentă
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Istoric Recepții</CardTitle>
          <CardDescription>
            Toate recepțiile de materii prime înregistrate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Recepție</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Furnizor</TableHead>
                <TableHead>Produs</TableHead>
                <TableHead>Cantitate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receptii.map((receptie) => (
                <TableRow key={receptie.id}>
                  <TableCell className="font-medium">{receptie.id}</TableCell>
                  <TableCell>{receptie.data}</TableCell>
                  <TableCell>{receptie.furnizor}</TableCell>
                  <TableCell>{receptie.produs}</TableCell>
                  <TableCell>{receptie.cantitate}</TableCell>
                  <TableCell>{getStatusBadge(receptie.status)}</TableCell>
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

export default Receptii;
