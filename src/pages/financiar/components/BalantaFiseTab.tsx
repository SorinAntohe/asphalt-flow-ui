import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { balanta, miscariCont } from "../contabilitate-mockData";
import { ContBalanta, MiscareCont } from "../contabilitate-types";
import { Calculator, FileSpreadsheet } from "lucide-react";

const BalantaFiseTab = () => {
  const [selectedCont, setSelectedCont] = useState<ContBalanta | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO');
  };

  const handleRowClick = (cont: ContBalanta) => {
    setSelectedCont(cont);
    setDialogOpen(true);
  };

  const getMiscariForCont = (cont: string): MiscareCont[] => {
    return miscariCont[cont] || [];
  };

  // Summary calculations
  const totalSoldDebit = balanta.reduce((sum, c) => sum + c.soldFinalDebit, 0);
  const totalSoldCredit = balanta.reduce((sum, c) => sum + c.soldFinalCredit, 0);
  const totalRulajDebit = balanta.reduce((sum, c) => sum + c.rulajDebit, 0);
  const totalRulajCredit = balanta.reduce((sum, c) => sum + c.rulajCredit, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conturi Active</p>
                <p className="text-2xl font-bold">{balanta.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Sold Debit</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalSoldDebit)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Sold Credit</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(totalSoldCredit)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div>
              <p className="text-sm text-muted-foreground">Rulaj Perioadă</p>
              <p className="text-xl font-bold">{formatCurrency(totalRulajDebit)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Balanță de Verificare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cont</TableHead>
                  <TableHead>Denumire</TableHead>
                  <TableHead className="text-right">Sold Inițial D</TableHead>
                  <TableHead className="text-right">Sold Inițial C</TableHead>
                  <TableHead className="text-right">Rulaj D</TableHead>
                  <TableHead className="text-right">Rulaj C</TableHead>
                  <TableHead className="text-right">Sold Final D</TableHead>
                  <TableHead className="text-right">Sold Final C</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {balanta.map((cont) => (
                  <TableRow 
                    key={cont.cont} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(cont)}
                  >
                    <TableCell className="font-mono font-medium">{cont.cont}</TableCell>
                    <TableCell>{cont.denumire}</TableCell>
                    <TableCell className="text-right">
                      {cont.soldInitialDebit > 0 ? formatCurrency(cont.soldInitialDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.soldInitialCredit > 0 ? formatCurrency(cont.soldInitialCredit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.rulajDebit > 0 ? formatCurrency(cont.rulajDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {cont.rulajCredit > 0 ? formatCurrency(cont.rulajCredit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-green-600 dark:text-green-400">
                      {cont.soldFinalDebit > 0 ? formatCurrency(cont.soldFinalDebit) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-blue-600 dark:text-blue-400">
                      {cont.soldFinalCredit > 0 ? formatCurrency(cont.soldFinalCredit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={2}>TOTAL</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(balanta.reduce((s, c) => s + c.soldInitialDebit, 0))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(balanta.reduce((s, c) => s + c.soldInitialCredit, 0))}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(totalRulajDebit)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(totalRulajCredit)}</TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-400">
                    {formatCurrency(totalSoldDebit)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600 dark:text-blue-400">
                    {formatCurrency(totalSoldCredit)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Account Statement Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Fișă Cont {selectedCont?.cont} - {selectedCont?.denumire}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCont && (
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Sold Inițial</p>
                    <p className="text-lg font-bold">
                      {selectedCont.soldInitialDebit > 0 
                        ? `${formatCurrency(selectedCont.soldInitialDebit)} D`
                        : `${formatCurrency(selectedCont.soldInitialCredit)} C`
                      }
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Rulaj Debit</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(selectedCont.rulajDebit)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Rulaj Credit</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(selectedCont.rulajCredit)}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">Sold Final</p>
                    <p className="text-lg font-bold">
                      {selectedCont.soldFinalDebit > 0 
                        ? `${formatCurrency(selectedCont.soldFinalDebit)} D`
                        : `${formatCurrency(selectedCont.soldFinalCredit)} C`
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Movements Table */}
              <div>
                <h4 className="font-medium mb-3">Mișcări Cont</h4>
                <div className="overflow-x-auto border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dată</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Explicație</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="text-right">Sold</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getMiscariForCont(selectedCont.cont).length > 0 ? (
                        getMiscariForCont(selectedCont.cont).map((miscare) => (
                          <TableRow key={miscare.id}>
                            <TableCell>{formatDate(miscare.data)}</TableCell>
                            <TableCell className="font-mono">{miscare.document}</TableCell>
                            <TableCell>{miscare.explicatie}</TableCell>
                            <TableCell className="text-right text-green-600 dark:text-green-400">
                              {miscare.debit > 0 ? formatCurrency(miscare.debit) : '-'}
                            </TableCell>
                            <TableCell className="text-right text-blue-600 dark:text-blue-400">
                              {miscare.credit > 0 ? formatCurrency(miscare.credit) : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(miscare.soldDupa)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            Nu există mișcări pentru acest cont
                          </TableCell>
                        </TableRow>
                      )}
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

export default BalantaFiseTab;
