import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { scadentarEntries } from "../parteneri-mockData";

const ScadentarTab = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ro-RO", {
      style: "currency",
      currency: "RON",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getZileIntarziereColor = (zile: number) => {
    if (zile === 0) return "text-green-600";
    if (zile <= 30) return "text-amber-600";
    return "text-red-600";
  };

  const totalRestantClienti = scadentarEntries
    .filter((e) => e.tip_partener === "Client")
    .reduce((sum, e) => sum + e.suma_restanta, 0);

  const totalRestantFurnizori = scadentarEntries
    .filter((e) => e.tip_partener === "Furnizor")
    .reduce((sum, e) => sum + e.suma_restanta, 0);

  const sortedEntries = [...scadentarEntries].sort((a, b) => b.zile_intarziere - a.zile_intarziere);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scadențar - Documente Restante</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Total Documente</div>
              <div className="text-2xl font-bold">{scadentarEntries.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">De Încasat (Clienți)</div>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRestantClienti)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">De Plătit (Furnizori)</div>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalRestantFurnizori)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground">Sold Net</div>
              <div className={`text-2xl font-bold ${totalRestantClienti - totalRestantFurnizori >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totalRestantClienti - totalRestantFurnizori)}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tip Partener</TableHead>
                <TableHead>Nume Partener</TableHead>
                <TableHead>Tip Document</TableHead>
                <TableHead>Număr Document</TableHead>
                <TableHead>Dată Document</TableHead>
                <TableHead>Dată Scadență</TableHead>
                <TableHead className="text-right">Sumă Restantă</TableHead>
                <TableHead className="text-right">Zile Întârziere</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/50">
                  <TableCell>
                    <Badge variant={entry.tip_partener === "Client" ? "default" : "secondary"}>
                      {entry.tip_partener}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{entry.nume_partener}</TableCell>
                  <TableCell>{entry.tip_document}</TableCell>
                  <TableCell>{entry.numar_document}</TableCell>
                  <TableCell>{entry.data_document}</TableCell>
                  <TableCell>{entry.data_scadenta}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(entry.suma_restanta)}
                  </TableCell>
                  <TableCell className={`text-right font-medium ${getZileIntarziereColor(entry.zile_intarziere)}`}>
                    {entry.zile_intarziere} zile
                  </TableCell>
                  <TableCell>
                    <Badge variant={entry.status === "La zi" ? "default" : "destructive"}>
                      {entry.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScadentarTab;
