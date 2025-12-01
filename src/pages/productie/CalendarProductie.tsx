import { useState, useMemo } from "react";
import { Calendar, GripVertical, AlertTriangle, Package, Clock, ArrowRight, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Production lines
const productionLines = [
  { id: "L1", name: "Linia 1 - Asfalt", capacity: 120 },
  { id: "L2", name: "Linia 2 - Asfalt", capacity: 100 },
  { id: "L3", name: "Linia 3 - Emulsie", capacity: 80 },
  { id: "L4", name: "Linia 4 - BSC", capacity: 60 },
];

// Hours for the calendar (6:00 - 22:00)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

// Mock scheduled orders
const initialScheduledOrders = [
  { id: "OP-001", recipe: "BA 16 rul 50/70", quantity: 200, line: "L1", startHour: 7, duration: 3, status: "in_progress" },
  { id: "OP-002", recipe: "MASF 16", quantity: 150, line: "L1", startHour: 11, duration: 2, status: "planned" },
  { id: "OP-003", recipe: "Emulsie C60B4", quantity: 80, line: "L3", startHour: 8, duration: 2, status: "planned" },
  { id: "OP-004", recipe: "BSC 0/31.5", quantity: 100, line: "L4", startHour: 9, duration: 4, status: "planned" },
  { id: "OP-005", recipe: "BA 16 rul 50/70", quantity: 180, line: "L2", startHour: 6, duration: 3, status: "completed" },
  { id: "OP-006", recipe: "AB2 22.4", quantity: 120, line: "L2", startHour: 14, duration: 2, status: "draft" },
];

// Mock candidate orders (not yet scheduled)
const candidateOrders = [
  { id: "CMD-101", client: "Primăria Sector 3", recipe: "BA 16 rul 50/70", quantity: 250, priority: "high", deadline: "15/01/2025" },
  { id: "CMD-102", client: "CNAIR", recipe: "MASF 16", quantity: 400, priority: "medium", deadline: "16/01/2025" },
  { id: "CMD-103", client: "Drumuri Naționale", recipe: "AB2 22.4", quantity: 180, priority: "low", deadline: "18/01/2025" },
  { id: "CMD-104", client: "SC Construct SRL", recipe: "Emulsie C60B4", quantity: 60, priority: "high", deadline: "14/01/2025" },
  { id: "CMD-105", client: "Autostrada A3", recipe: "BSC 0/31.5", quantity: 300, priority: "medium", deadline: "17/01/2025" },
];

// Stock status for materials
const stockStatus = {
  "BA 16 rul 50/70": { available: 500, required: 450, status: "ok" },
  "MASF 16": { available: 200, required: 550, status: "warning" },
  "AB2 22.4": { available: 100, required: 300, status: "critical" },
  "Emulsie C60B4": { available: 150, required: 140, status: "ok" },
  "BSC 0/31.5": { available: 400, required: 400, status: "warning" },
};

type ScheduledOrder = typeof initialScheduledOrders[0];
type CandidateOrder = typeof candidateOrders[0];

const CalendarProductie = () => {
  const [scheduledOrders, setScheduledOrders] = useState(initialScheduledOrders);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [draggedOrder, setDraggedOrder] = useState<CandidateOrder | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ScheduledOrder | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [showStockWarning, setShowStockWarning] = useState(false);
  const [stockWarningData, setStockWarningData] = useState<{ recipe: string; available: number; required: number } | null>(null);

  // Calculate capacity utilization per line per hour
  const capacityMap = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};
    
    productionLines.forEach(line => {
      map[line.id] = {};
      hours.forEach(hour => {
        map[line.id][hour] = 0;
      });
    });

    scheduledOrders.forEach(order => {
      for (let h = order.startHour; h < order.startHour + order.duration; h++) {
        if (map[order.line] && map[order.line][h] !== undefined) {
          const line = productionLines.find(l => l.id === order.line);
          if (line) {
            map[order.line][h] += (order.quantity / order.duration) / line.capacity * 100;
          }
        }
      }
    });

    return map;
  }, [scheduledOrders]);

  const getCapacityColor = (utilization: number) => {
    if (utilization === 0) return "bg-muted/30";
    if (utilization < 50) return "bg-emerald-500/20 dark:bg-emerald-500/30";
    if (utilization < 80) return "bg-amber-500/30 dark:bg-amber-500/40";
    return "bg-red-500/30 dark:bg-red-500/40";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      draft: { variant: "outline", label: "Draft" },
      planned: { variant: "secondary", label: "Planificat" },
      in_progress: { variant: "default", label: "În lucru" },
      completed: { variant: "outline", label: "Finalizat" },
    };
    const config = variants[status] || variants.draft;
    return <Badge variant={config.variant} className="text-xs">{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30",
      medium: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
    };
    const labels: Record<string, string> = { high: "Urgent", medium: "Normal", low: "Scăzut" };
    return (
      <Badge variant="outline" className={cn("text-xs", colors[priority])}>
        {labels[priority]}
      </Badge>
    );
  };

  const handleDragStart = (order: CandidateOrder) => {
    setDraggedOrder(order);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (lineId: string, hour: number) => {
    if (!draggedOrder) return;

    // Check stock availability
    const stock = stockStatus[draggedOrder.recipe as keyof typeof stockStatus];
    if (stock && stock.status !== "ok") {
      setStockWarningData({
        recipe: draggedOrder.recipe,
        available: stock.available,
        required: stock.required + draggedOrder.quantity,
      });
      setShowStockWarning(true);
    }

    // Add to scheduled orders
    const newOrder: ScheduledOrder = {
      id: `OP-${Date.now()}`,
      recipe: draggedOrder.recipe,
      quantity: draggedOrder.quantity,
      line: lineId,
      startHour: hour,
      duration: Math.ceil(draggedOrder.quantity / 80), // Estimate duration
      status: "draft",
    };

    setScheduledOrders([...scheduledOrders, newOrder]);
    setDraggedOrder(null);
    toast.success(`Comanda ${draggedOrder.id} programată pe ${productionLines.find(l => l.id === lineId)?.name}`);
  };

  const handleOrderClick = (order: ScheduledOrder) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleReserveMaterials = () => {
    if (selectedOrder) {
      toast.success(`Materiile prime pentru ${selectedOrder.id} au fost rezervate`);
      setShowOrderDialog(false);
    }
  };

  const handleChangeLine = () => {
    if (selectedOrder) {
      const currentIndex = productionLines.findIndex(l => l.id === selectedOrder.line);
      const nextLine = productionLines[(currentIndex + 1) % productionLines.length];
      
      setScheduledOrders(orders => 
        orders.map(o => o.id === selectedOrder.id ? { ...o, line: nextLine.id } : o)
      );
      setSelectedOrder({ ...selectedOrder, line: nextLine.id });
      toast.success(`Ordin mutat pe ${nextLine.name}`);
    }
  };

  const handleSendToDispatch = () => {
    if (selectedOrder) {
      setScheduledOrders(orders =>
        orders.map(o => o.id === selectedOrder.id ? { ...o, status: "planned" } : o)
      );
      toast.success(`Ordinul ${selectedOrder.id} trimis în dispecerizare`);
      setShowOrderDialog(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const navigateDate = (direction: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + direction);
    setSelectedDate(newDate);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendar Producție</h1>
              <p className="text-muted-foreground">Planificare vizuală pe ore și linii de producție</p>
            </div>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-muted/50 rounded-lg min-w-[200px] text-center">
              <span className="font-medium capitalize">{formatDate(selectedDate)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigateDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
              Astăzi
            </Button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6">
          {/* Calendar Grid */}
          <div className="flex-1">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Programare Producție</CardTitle>
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-emerald-500/30" />
                      <span className="text-muted-foreground">&lt;50%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-amber-500/40" />
                      <span className="text-muted-foreground">50-80%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-red-500/40" />
                      <span className="text-muted-foreground">&gt;80%</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="w-full">
                  <div className="min-w-[900px]">
                    {/* Time header */}
                    <div className="flex border-b border-border">
                      <div className="w-32 shrink-0 p-2 bg-muted/30 border-r border-border">
                        <span className="text-xs font-medium text-muted-foreground">Linie / Ora</span>
                      </div>
                      {hours.map(hour => (
                        <div 
                          key={hour} 
                          className="flex-1 min-w-[50px] p-2 text-center border-r border-border last:border-r-0 bg-muted/30"
                        >
                          <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
                        </div>
                      ))}
                    </div>

                    {/* Lines rows */}
                    {productionLines.map(line => (
                      <div key={line.id} className="flex border-b border-border last:border-b-0">
                        <div className="w-32 shrink-0 p-2 bg-muted/20 border-r border-border flex flex-col justify-center">
                          <span className="text-sm font-medium">{line.name}</span>
                          <span className="text-xs text-muted-foreground">{line.capacity} to/h</span>
                        </div>
                        
                        {hours.map(hour => {
                          const utilization = capacityMap[line.id]?.[hour] || 0;
                          const ordersInSlot = scheduledOrders.filter(
                            o => o.line === line.id && hour >= o.startHour && hour < o.startHour + o.duration
                          );
                          const isSlotStart = ordersInSlot.find(o => o.startHour === hour);

                          return (
                            <div
                              key={hour}
                              className={cn(
                                "flex-1 min-w-[50px] min-h-[60px] border-r border-border last:border-r-0 relative transition-colors",
                                getCapacityColor(utilization),
                                draggedOrder && "hover:bg-primary/20 cursor-pointer"
                              )}
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(line.id, hour)}
                            >
                              {isSlotStart && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute inset-1 rounded-md p-1 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                                        isSlotStart.status === "in_progress" && "bg-primary text-primary-foreground",
                                        isSlotStart.status === "planned" && "bg-secondary text-secondary-foreground",
                                        isSlotStart.status === "draft" && "bg-muted border border-dashed border-border",
                                        isSlotStart.status === "completed" && "bg-muted/50 text-muted-foreground"
                                      )}
                                      style={{ width: `calc(${isSlotStart.duration * 100}% - 0.5rem)` }}
                                      onClick={() => handleOrderClick(isSlotStart)}
                                    >
                                      <div className="text-xs font-medium truncate">{isSlotStart.id}</div>
                                      <div className="text-[10px] opacity-80 truncate">{isSlotStart.recipe}</div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">
                                    <div className="text-xs space-y-1">
                                      <div className="font-medium">{isSlotStart.id}</div>
                                      <div>{isSlotStart.recipe}</div>
                                      <div>{isSlotStart.quantity} tone</div>
                                      <div>{isSlotStart.startHour}:00 - {isSlotStart.startHour + isSlotStart.duration}:00</div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Candidate Orders Sidebar */}
          <div className="w-full xl:w-80 shrink-0">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Comenzi Candidate
                </CardTitle>
                <p className="text-xs text-muted-foreground">Trage și plasează în calendar</p>
              </CardHeader>
              <CardContent className="p-2">
                <ScrollArea className="h-[400px] xl:h-[500px]">
                  <div className="space-y-2 pr-2">
                    {candidateOrders.map(order => {
                      const stock = stockStatus[order.recipe as keyof typeof stockStatus];
                      const hasStockIssue = stock && stock.status !== "ok";

                      return (
                        <div
                          key={order.id}
                          draggable
                          onDragStart={() => handleDragStart(order)}
                          className={cn(
                            "p-3 rounded-lg border border-border bg-card cursor-grab active:cursor-grabbing",
                            "hover:border-primary/50 hover:shadow-md transition-all",
                            hasStockIssue && "border-amber-500/50"
                          )}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{order.id}</span>
                            </div>
                            {getPriorityBadge(order.priority)}
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            <div className="text-muted-foreground">{order.client}</div>
                            <div className="font-medium">{order.recipe}</div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1">
                                <Package className="h-3 w-3" />
                                {order.quantity} tone
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {order.deadline}
                              </span>
                            </div>
                          </div>

                          {hasStockIssue && (
                            <div className="mt-2 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                              <AlertTriangle className="h-3 w-3" />
                              <span>Stoc insuficient</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Detail Dialog */}
        <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
          <DialogContent className="max-w-md" hideCloseButton>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedOrder?.id}</span>
                {selectedOrder && getStatusBadge(selectedOrder.status)}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground">Rețetă</label>
                    <p className="font-medium">{selectedOrder.recipe}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Cantitate</label>
                    <p className="font-medium">{selectedOrder.quantity} tone</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Linie</label>
                    <p className="font-medium">{productionLines.find(l => l.id === selectedOrder.line)?.name}</p>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Interval</label>
                    <p className="font-medium">{selectedOrder.startHour}:00 - {selectedOrder.startHour + selectedOrder.duration}:00</p>
                  </div>
                </div>

                {/* Stock Status */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <h4 className="text-sm font-medium mb-2">Status Materii Prime</h4>
                  {(() => {
                    const stock = stockStatus[selectedOrder.recipe as keyof typeof stockStatus];
                    if (!stock) return <p className="text-xs text-muted-foreground">N/A</p>;
                    return (
                      <div className="flex items-center justify-between text-sm">
                        <span>Disponibil: {stock.available} to</span>
                        <span>Necesar: {stock.required} to</span>
                        <Badge variant={stock.status === "ok" ? "secondary" : "destructive"} className="text-xs">
                          {stock.status === "ok" ? "OK" : stock.status === "warning" ? "Limitat" : "Insuficient"}
                        </Badge>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleChangeLine}>
                Schimbă Linia
              </Button>
              <Button variant="outline" onClick={handleReserveMaterials}>
                <Package className="h-4 w-4 mr-2" />
                Rezervă Materii
              </Button>
              <Button onClick={handleSendToDispatch}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Trimite în Dispecerizare
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stock Warning Dialog */}
        <Dialog open={showStockWarning} onOpenChange={setShowStockWarning}>
          <DialogContent className="max-w-sm" hideCloseButton>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-5 w-5" />
                Avertisment Stoc
              </DialogTitle>
            </DialogHeader>

            {stockWarningData && (
              <div className="space-y-3">
                <p className="text-sm">
                  Stocul pentru <strong>{stockWarningData.recipe}</strong> este insuficient pentru această comandă.
                </p>
                <div className="p-3 rounded-lg bg-muted/50 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Disponibil:</span>
                    <span className="font-medium">{stockWarningData.available} tone</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Necesar total:</span>
                    <span className="font-medium text-amber-600 dark:text-amber-400">{stockWarningData.required} tone</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Se recomandă rezervarea materiilor prime sau verificarea programării.
                </p>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStockWarning(false)}>
                Anulează
              </Button>
              <Button onClick={() => {
                setShowStockWarning(false);
                toast.info("Comandă adăugată cu avertisment de stoc");
              }}>
                Continuă Oricum
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default CalendarProductie;
