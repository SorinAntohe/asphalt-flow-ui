import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const DocumenteTrezorerie = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">Documente & Trezorerie</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Gestionare Documente și Trezorerie</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Această pagină va conține documentele contabile și operațiunile de trezorerie.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumenteTrezorerie;
