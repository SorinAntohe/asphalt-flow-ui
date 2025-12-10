import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { noteContabile, liniiNoteContabile } from "../contabilitate-mockData";
import { NotaContabila, LinieNotaContabila } from "../contabilitate-types";
import { BookOpen, FileText } from "lucide-react";

const JurnalTab = () => {
  const [selectedNota, setSelectedNota] = useState<NotaContabila | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const getTipJurnalColor = (tip: string) => {
    switch (tip) {
      case 'Vânzări': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Cumpărări': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Bancă': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'Casă': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSursaColor = (sursa: string) => {
    return sursa === 'Automat' 
      ? 'bg-primary/10 text-primary' 
      : 'bg-secondary text-secondary-foreground';
  };

  const handleRowClick = (nota: NotaContabila) => {
    setSelectedNota(nota);
    setDialogOpen(true);
  };

  const getLiniiForNota = (notaId: string): LinieNotaContabila[] => {
    return liniiNoteContabile.filter(linie => linie.notaId === notaId);
  };

  // Summary calculations
  const totalNote = noteContabile.length;
  const noteAutomate = noteContabile.filter(n => n.sursa === 'Automat').length;
  const noteManuale = noteContabile.filter(n => n.sursa === 'Manual').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Note</p>
                <p className="text-2xl font-bold">{totalNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note Automate</p>
                <p className="text-2xl font-bold">{noteAutomate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Note Manuale</p>
                <p className="text-2xl font-bold">{noteManuale}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journal Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Note Contabile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dată</TableHead>
                  <TableHead>Nr. Notă</TableHead>
                  <TableHead>Tip Jurnal</TableHead>
                  <TableHead>Explicație</TableHead>
                  <TableHead>Sursă</TableHead>
                  <TableHead className="text-right">Total Debit</TableHead>
                  <TableHead className="text-right">Total Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {noteContabile.map((nota) => (
                  <TableRow 
                    key={nota.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(nota)}
                  >
                    <TableCell>{formatDate(nota.data)}</TableCell>
                    <TableCell className="font-medium">{nota.nrNota}</TableCell>
                    <TableCell>
                      <Badge className={getTipJurnalColor(nota.tipJurnal)} variant="secondary">
                        {nota.tipJurnal}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{nota.explicatie}</TableCell>
                    <TableCell>
                      <Badge className={getSursaColor(nota.sursa)} variant="secondary">
                        {nota.sursa}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(nota.totalDebit)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(nota.totalCredit)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Notă Contabilă {selectedNota?.nrNota}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNota && (
            <div className="space-y-6">
              {/* Note Header Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Dată</p>
                  <p className="font-medium">{formatDate(selectedNota.data)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tip Jurnal</p>
                  <Badge className={getTipJurnalColor(selectedNota.tipJurnal)} variant="secondary">
                    {selectedNota.tipJurnal}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sursă</p>
                  <Badge className={getSursaColor(selectedNota.sursa)} variant="secondary">
                    {selectedNota.sursa}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Explicație</p>
                  <p className="font-medium">{selectedNota.explicatie}</p>
                </div>
              </div>

              {/* Lines Table */}
              <div>
                <h4 className="font-medium mb-3">Linii Notă Contabilă</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cont</TableHead>
                        <TableHead>Denumire Cont</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getLiniiForNota(selectedNota.id).map((linie) => (
                        <TableRow key={linie.id}>
                          <TableCell className="font-mono">{linie.cont}</TableCell>
                          <TableCell>{linie.denumireCont}</TableCell>
                          <TableCell className="text-right">
                            {linie.debit > 0 ? formatCurrency(linie.debit) : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {linie.credit > 0 ? formatCurrency(linie.credit) : '-'}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Totals Row */}
                      <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={2}>Total</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedNota.totalDebit)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(selectedNota.totalCredit)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JurnalTab;
