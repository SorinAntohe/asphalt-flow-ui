import { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Package, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Hours for the daily view (6:00 - 22:00)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

// Color palette for different product types (recipes)
const recipeColors: Record<string, { bg: string; border: string; text: string }> = {
  "BA 16 rul 50/70": { bg: "bg-blue-500", border: "border-blue-600", text: "text-white" },
  "MASF 16": { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-white" },
  "Emulsie C60B4": { bg: "bg-amber-500", border: "border-amber-600", text: "text-white" },
  "BSC 0/31.5": { bg: "bg-purple-500", border: "border-purple-600", text: "text-white" },
  "AB2 22.4": { bg: "bg-rose-500", border: "border-rose-600", text: "text-white" },
};

const getRecipeColor = (recipe: string) => {
  return recipeColors[recipe] || { bg: "bg-primary", border: "border-primary", text: "text-primary-foreground" };
};

// Mock scheduled orders with dates
const initialScheduledOrders = [
  { id: "OP-001", recipe: "BA 16 rul 50/70", quantity: 200, startHour: 7, duration: 3, status: "in_progress", date: "2025-12-05" },
  { id: "OP-002", recipe: "MASF 16", quantity: 150, startHour: 11, duration: 2, status: "planned", date: "2025-12-05" },
  { id: "OP-003", recipe: "Emulsie C60B4", quantity: 80, startHour: 8, duration: 2, status: "planned", date: "2025-12-05" },
  { id: "OP-004", recipe: "BSC 0/31.5", quantity: 100, startHour: 9, duration: 4, status: "planned", date: "2025-12-06" },
  { id: "OP-005", recipe: "BA 16 rul 50/70", quantity: 180, startHour: 6, duration: 3, status: "completed", date: "2025-12-04" },
  { id: "OP-006", recipe: "AB2 22.4", quantity: 120, startHour: 14, duration: 2, status: "draft", date: "2025-12-07" },
  { id: "OP-007", recipe: "BA 16 rul 50/70", quantity: 250, startHour: 8, duration: 4, status: "planned", date: "2025-12-10" },
  { id: "OP-008", recipe: "MASF 16", quantity: 180, startHour: 10, duration: 3, status: "planned", date: "2025-12-12" },
  { id: "OP-009", recipe: "Emulsie C60B4", quantity: 90, startHour: 7, duration: 2, status: "draft", date: "2025-12-15" },
  { id: "OP-010", recipe: "BSC 0/31.5", quantity: 150, startHour: 12, duration: 5, status: "planned", date: "2025-12-18" },
  { id: "OP-011", recipe: "BA 16 rul 50/70", quantity: 300, startHour: 6, duration: 5, status: "planned", date: "2025-12-20" },
  { id: "OP-012", recipe: "AB2 22.4", quantity: 200, startHour: 8, duration: 3, status: "draft", date: "2025-12-22" },
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
                  <div className="min-w-[700px]">
                    {/* Time header */}
                    <div className="flex border-b border-border sticky top-0 bg-background z-10">
                      <div className="w-24 shrink-0 p-2 bg-muted/30 border-r border-border">
                        <span className="text-xs font-medium text-muted-foreground">Ora</span>
                      </div>
                      {hours.map(hour => (
                        <div 
                          key={hour} 
                          className="flex-1 min-w-[40px] p-2 text-center border-r border-border last:border-r-0 bg-muted/30"
                        >
                          <span className="text-xs font-medium text-muted-foreground">{hour}:00</span>
                        </div>
                      ))}
                    </div>

                    {/* Orders rows - each order on its own row */}
                    <div className="relative" style={{ minHeight: `${Math.max(selectedDayOrders.length * 56 + 16, 120)}px` }}>
                      {/* Hour grid lines */}
                      <div className="absolute inset-0 flex">
                        <div className="w-24 shrink-0" />
                        <div className="flex-1 relative">
                          {hours.map(hour => (
                            <div 
                              key={hour} 
                              className="absolute top-0 bottom-0 border-r border-border/20"
                              style={{ left: `${((hour - 6) / 17) * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Order bars */}
                      {selectedDayOrders.map((order, idx) => {
                        const colors = getRecipeColor(order.recipe);
                        return (
                          <div key={order.id} className="flex border-b border-border/30 h-14 relative">
                            <div className="w-24 shrink-0 p-2 bg-muted/10 border-r border-border flex items-center">
                              <span className="text-xs font-medium text-muted-foreground">{order.id}</span>
                            </div>
                            <div className="flex-1 relative py-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "absolute rounded-lg px-3 py-2 transition-all cursor-pointer shadow-md border-2",
                                      "hover:scale-[1.02] hover:shadow-lg",
                                      colors.bg,
                                      colors.border,
                                      colors.text,
                                      order.status === "completed" && "opacity-60",
                                      order.status === "draft" && "opacity-80 border-dashed"
                                    )}
                                    style={{ 
                                      left: `${((order.startHour - 6) / 17) * 100}%`,
                                      width: `calc(${(order.duration / 17) * 100}% - 4px)`,
                                      top: '4px',
                                      bottom: '4px'
                                    }}
                                  >
                                    <div className="text-sm font-bold truncate">{order.recipe}</div>
                                    <div className="text-xs opacity-90 truncate">{order.quantity} to • {order.startHour}:00-{order.startHour + order.duration}:00</div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="p-3">
                                  <div className="space-y-2">
                                    <div className="font-bold text-sm">{order.id}</div>
                                    <div className="text-sm">{order.recipe}</div>
                                    <div className="text-sm font-medium">{order.quantity} tone</div>
                                    <div className="text-sm text-muted-foreground">{order.startHour}:00 - {order.startHour + order.duration}:00</div>
                                    {getStatusBadge(order.status)}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Day summary */}
            {selectedDayOrders.length > 0 && (
              <div className="pt-4 border-t border-border mt-4 space-y-3">
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
                {/* Recipe color legend */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  {Object.entries(recipeColors).map(([recipe, colors]) => (
                    <div key={recipe} className="flex items-center gap-1.5">
                      <div className={cn("w-3 h-3 rounded", colors.bg)} />
                      <span className="text-muted-foreground">{recipe}</span>
                    </div>
                  ))}
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
