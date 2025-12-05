import { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Package, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Production lines
const productionLines = [
  { id: "L1", name: "Linia 1 - Asfalt", capacity: 120 },
  { id: "L2", name: "Linia 2 - Asfalt", capacity: 100 },
  { id: "L3", name: "Linia 3 - Emulsie", capacity: 80 },
  { id: "L4", name: "Linia 4 - BSC", capacity: 60 },
];

// Hours for the daily view (6:00 - 22:00)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

// Mock scheduled orders with dates
const initialScheduledOrders = [
  { id: "OP-001", recipe: "BA 16 rul 50/70", quantity: 200, line: "L1", startHour: 7, duration: 3, status: "in_progress", date: "2025-12-05" },
  { id: "OP-002", recipe: "MASF 16", quantity: 150, line: "L1", startHour: 11, duration: 2, status: "planned", date: "2025-12-05" },
  { id: "OP-003", recipe: "Emulsie C60B4", quantity: 80, line: "L3", startHour: 8, duration: 2, status: "planned", date: "2025-12-05" },
  { id: "OP-004", recipe: "BSC 0/31.5", quantity: 100, line: "L4", startHour: 9, duration: 4, status: "planned", date: "2025-12-06" },
  { id: "OP-005", recipe: "BA 16 rul 50/70", quantity: 180, line: "L2", startHour: 6, duration: 3, status: "completed", date: "2025-12-04" },
  { id: "OP-006", recipe: "AB2 22.4", quantity: 120, line: "L2", startHour: 14, duration: 2, status: "draft", date: "2025-12-07" },
  { id: "OP-007", recipe: "BA 16 rul 50/70", quantity: 250, line: "L1", startHour: 8, duration: 4, status: "planned", date: "2025-12-10" },
  { id: "OP-008", recipe: "MASF 16", quantity: 180, line: "L2", startHour: 10, duration: 3, status: "planned", date: "2025-12-12" },
  { id: "OP-009", recipe: "Emulsie C60B4", quantity: 90, line: "L3", startHour: 7, duration: 2, status: "draft", date: "2025-12-15" },
  { id: "OP-010", recipe: "BSC 0/31.5", quantity: 150, line: "L4", startHour: 12, duration: 5, status: "planned", date: "2025-12-18" },
  { id: "OP-011", recipe: "BA 16 rul 50/70", quantity: 300, line: "L1", startHour: 6, duration: 5, status: "planned", date: "2025-12-20" },
  { id: "OP-012", recipe: "AB2 22.4", quantity: 200, line: "L2", startHour: 8, duration: 3, status: "draft", date: "2025-12-22" },
];

type ScheduledOrder = typeof initialScheduledOrders[0];

const CalendarProductie = () => {
  const [scheduledOrders] = useState(initialScheduledOrders);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

  // Get calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    let startDay = firstDayOfMonth.getDay();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    const days: (Date | null)[] = [];
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentMonth]);

  // Get orders for a specific date
  const getOrdersForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledOrders.filter(order => order.date === dateStr);
  };

  // Get orders for selected day in daily view
  const selectedDayOrders = useMemo(() => {
    if (!selectedDay) return [];
    return getOrdersForDate(selectedDay);
  }, [selectedDay, scheduledOrders]);

  // Calculate capacity utilization for daily view
  const capacityMap = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};
    
    productionLines.forEach(line => {
      map[line.id] = {};
      hours.forEach(hour => {
        map[line.id][hour] = 0;
      });
    });

    selectedDayOrders.forEach(order => {
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
  }, [selectedDayOrders]);

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

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
    setShowDayDialog(true);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("ro-RO", { month: "long", year: "numeric" });
  };

  const formatDayDate = (date: Date) => {
    return date.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  const weekDays = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendar Producție</h1>
              <p className="text-muted-foreground">Planificare vizuală pe lună</p>
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 bg-muted/50 rounded-lg min-w-[180px] text-center">
              <span className="font-medium capitalize">{formatMonthYear(currentMonth)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
              Astăzi
            </Button>
          </div>
        </div>

        {/* Month Calendar */}
        <Card>
          <CardContent className="p-4">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="min-h-[100px] bg-muted/10 rounded-lg" />;
                }

                const orders = getOrdersForDate(day);
                const hasOrders = orders.length > 0;
                const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "min-h-[100px] p-2 rounded-lg border border-border cursor-pointer transition-all",
                      "hover:border-primary/50 hover:shadow-md",
                      isToday(day) && "ring-2 ring-primary",
                      hasOrders ? "bg-card" : "bg-muted/20"
                    )}
                  >
                    <div className={cn(
                      "text-sm font-medium mb-1",
                      isToday(day) ? "text-primary" : "text-foreground"
                    )}>
                      {day.getDate()}
                    </div>

                    {hasOrders && (
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">
                          {orders.length} ordine
                        </div>
                        <div className="text-xs font-medium text-primary">
                          {totalQuantity} to
                        </div>
                        <div className="flex flex-wrap gap-0.5 mt-1">
                          {orders.slice(0, 3).map(order => (
                            <Tooltip key={order.id}>
                              <TooltipTrigger asChild>
                                <div className={cn(
                                  "w-2 h-2 rounded-full",
                                  order.status === "in_progress" && "bg-primary",
                                  order.status === "planned" && "bg-secondary-foreground",
                                  order.status === "draft" && "bg-muted-foreground",
                                  order.status === "completed" && "bg-emerald-500"
                                )} />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                <div>{order.id} - {order.recipe}</div>
                                <div>{order.quantity} to</div>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {orders.length > 3 && (
                            <span className="text-[10px] text-muted-foreground">+{orders.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">În lucru</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-secondary-foreground" />
                <span className="text-muted-foreground">Planificat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Draft</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">Finalizat</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Detail Dialog - Hourly View */}
        <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="capitalize">{selectedDay && formatDayDate(selectedDay)}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              {selectedDayOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Package className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium">Niciun ordin programat</p>
                  <p className="text-sm">Nu există ordine de producție pentru această zi</p>
                </div>
              ) : (
                <ScrollArea className="h-[60vh]">
                  <div className="min-w-[800px]">
                    {/* Time header */}
                    <div className="flex border-b border-border sticky top-0 bg-background z-10">
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
                          const ordersInSlot = selectedDayOrders.filter(
                            o => o.line === line.id && hour >= o.startHour && hour < o.startHour + o.duration
                          );
                          const isSlotStart = ordersInSlot.find(o => o.startHour === hour);

                          return (
                            <div
                              key={hour}
                              className={cn(
                                "flex-1 min-w-[50px] min-h-[60px] border-r border-border last:border-r-0 relative transition-colors",
                                getCapacityColor(utilization)
                              )}
                            >
                              {isSlotStart && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute inset-1 rounded-md p-1 transition-all",
                                        isSlotStart.status === "in_progress" && "bg-primary text-primary-foreground",
                                        isSlotStart.status === "planned" && "bg-secondary text-secondary-foreground",
                                        isSlotStart.status === "draft" && "bg-muted border border-dashed border-border",
                                        isSlotStart.status === "completed" && "bg-muted/50 text-muted-foreground"
                                      )}
                                      style={{ width: `calc(${isSlotStart.duration * 100}% - 0.5rem)` }}
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
                                      {getStatusBadge(isSlotStart.status)}
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
              )}
            </div>

            {/* Day summary */}
            {selectedDayOrders.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span><strong>{selectedDayOrders.length}</strong> ordine</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span><strong>{selectedDayOrders.reduce((sum, o) => sum + o.quantity, 0)}</strong> tone planificate</span>
                  </div>
                </div>
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
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default CalendarProductie;
