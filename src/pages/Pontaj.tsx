import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function Pontaj() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <CalendarClock className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold text-foreground">Pontaj</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Evidența Pontajului</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Pagina pentru gestionarea pontajului va fi implementată în curând.</p>
        </CardContent>
      </Card>
    </div>
  );
}
