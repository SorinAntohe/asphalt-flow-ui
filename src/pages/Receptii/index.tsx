import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Receptii() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recepții Materiale</h1>
          <p className="text-muted-foreground mt-2">
            Gestionare recepții materii prime
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista Recepții</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pagină în dezvoltare...</p>
        </CardContent>
      </Card>
    </div>
  );
}
