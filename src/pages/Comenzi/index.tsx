import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Comenzi() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Comenzi</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Gestionează comenzile de materii prime și produse finite
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Comenzi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pagină în dezvoltare...</p>
        </CardContent>
      </Card>
    </div>
  );
}
