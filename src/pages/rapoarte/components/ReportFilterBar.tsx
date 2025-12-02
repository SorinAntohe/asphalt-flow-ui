import { useState } from "react";
import { Calendar, Download, Mail, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportFilterBarProps {
  onExport: (format: "csv" | "xlsx" | "pdf") => void;
  showPlantFilter?: boolean;
  showClientFilter?: boolean;
  showMaterialFilter?: boolean;
  showSiteFilter?: boolean;
}

export function ReportFilterBar({
  onExport,
  showPlantFilter = true,
  showClientFilter = false,
  showMaterialFilter = false,
  showSiteFilter = false,
}: ReportFilterBarProps) {
  const [dateFrom, setDateFrom] = useState<Date>(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [dateTo, setDateTo] = useState<Date>(new Date());
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isSaveViewDialogOpen, setIsSaveViewDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Date Range */}
            <div className="flex-1 min-w-[200px]">
              <Label className="text-sm mb-2 block">Interval</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "De la"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => date && setDateFrom(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "dd/MM/yyyy") : "Până la"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => date && setDateTo(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Plant Filter */}
            {showPlantFilter && (
              <div className="flex-1 min-w-[150px]">
                <Label className="text-sm mb-2 block">Plantă</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate</SelectItem>
                    <SelectItem value="asfalt">Asfalt + Emulsie</SelectItem>
                    <SelectItem value="bsc">Beton Stabilizat (BSC)</SelectItem>
                    <SelectItem value="betoane">Betoane</SelectItem>
                    <SelectItem value="concasat">Beton Concasat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Client Filter */}
            {showClientFilter && (
              <div className="flex-1 min-w-[150px]">
                <Label className="text-sm mb-2 block">Client</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toți clienții</SelectItem>
                    <SelectItem value="client1">SC Construct SRL</SelectItem>
                    <SelectItem value="client2">Romanian Roads SA</SelectItem>
                    <SelectItem value="client3">Urban Build SRL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Material Filter */}
            {showMaterialFilter && (
              <div className="flex-1 min-w-[150px]">
                <Label className="text-sm mb-2 block">Material</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate materialele</SelectItem>
                    <SelectItem value="bitum">BITUM 50/70</SelectItem>
                    <SelectItem value="04nat">0/4 NAT</SelectItem>
                    <SelectItem value="816conc">8/16 CONC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Site Filter */}
            {showSiteFilter && (
              <div className="flex-1 min-w-[150px]">
                <Label className="text-sm mb-2 block">Șantier</Label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toate șantierele</SelectItem>
                    <SelectItem value="a1">Autostrada A1 km 45</SelectItem>
                    <SelectItem value="dn1">DN1 Reabilitare</SelectItem>
                    <SelectItem value="bucuresti">Parcare Centru București</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={() => setIsSaveViewDialogOpen(true)}>
                <Save className="h-4 w-4" />
                Salvează
              </Button>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48" align="end">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onExport("csv")}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onExport("xlsx")}
                    >
                      Export XLSX
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => onExport("pdf")}
                    >
                      Export PDF
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="gap-2" onClick={() => setIsScheduleDialogOpen(true)}>
                <Mail className="h-4 w-4" />
                Programează
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save View Dialog */}
      <Dialog open={isSaveViewDialogOpen} onOpenChange={setIsSaveViewDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Salvează Vizualizare</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="view_name">Nume Vizualizare</Label>
              <Input id="view_name" placeholder="ex: Raport lunar producție" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveViewDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => setIsSaveViewDialogOpen(false)}>
              Salvează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Email Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent hideCloseButton>
          <DialogHeader>
            <DialogTitle>Programează pe Email</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Destinatar</Label>
              <Input id="email" type="email" placeholder="exemplu@duotip.ro" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frequency">Frecvență</Label>
              <Select defaultValue="daily">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Zilnic</SelectItem>
                  <SelectItem value="weekly">Săptămânal</SelectItem>
                  <SelectItem value="monthly">Lunar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="time">Ora Trimitere</Label>
              <Input id="time" type="time" defaultValue="08:00" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="format">Format Export</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsScheduleDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={() => setIsScheduleDialogOpen(false)}>
              Programează
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
