import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck } from "lucide-react";

export default function Angajati() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <UserCheck className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Lista Angajați</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Angajați</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pagina pentru gestionarea angajaților va fi implementată în curând.</p>
        </CardContent>
      </Card>
    </div>
  );
}
