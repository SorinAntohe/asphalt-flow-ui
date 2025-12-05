import { useState, useMemo } from "react";
import { Calendar, ChevronLeft, ChevronRight, Package, Clock, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Hours for the daily view (6:00 - 22:00)
const hours = Array.from({ length: 17 }, (_, i) => i + 6);

// Color palette for different product types with gradients
const productColors: Record<string, { bg: string; gradient: string; border: string; text: string; glow: string }> = {
  "BA16 - Beton Asfaltic": { 
    bg: "bg-blue-500", 
    gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
    border: "border-blue-400/50", 
    text: "text-white",
    glow: "shadow-blue-500/30"
  },
  "MASF16 - Mixtură Asfaltică": { 
    bg: "bg-emerald-500", 
    gradient: "bg-gradient-to-r from-emerald-500 to-emerald-600",
    border: "border-emerald-400/50", 
    text: "text-white",
    glow: "shadow-emerald-500/30"
  },
  "BSC - Beton Stabilizat": { 
    bg: "bg-purple-500", 
    gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
    border: "border-purple-400/50", 
    text: "text-white",
    glow: "shadow-purple-500/30"
  },
  "AB2 - Anrobat Bituminos": { 
    bg: "bg-rose-500", 
    gradient: "bg-gradient-to-r from-rose-500 to-rose-600",
    border: "border-rose-400/50", 
    text: "text-white",
    glow: "shadow-rose-500/30"
  },
};

const getProductColor = (produs: string) => {
  return productColors[produs] || { 
    bg: "bg-primary", 
    gradient: "bg-gradient-to-r from-primary to-primary/80",
    border: "border-primary/50", 
    text: "text-primary-foreground",
    glow: "shadow-primary/30"
  };
};

// Types
interface ProdusOrdin {
  produs: string;
  cantitate: number;
  reteta: string;
}

interface OrdinProductie {
  id: number;
  numar: string;
  produse: ProdusOrdin[];
  cantitateTotala: number;
  unitateMasura: string;
  startPlanificat: string;
  operator: string;
  sefSchimb: string;
  status: "Planificat" | "În lucru" | "Finalizat";
  observatii: string;
}

interface CalendarOrder {
  id: string;
  produs: string;
  quantity: number;
  startHour: number;
  duration: number;
  status: string;
  date: string;
}

interface CalendarProductieProps {
  ordine?: OrdinProductie[];
}

const CalendarProductie = ({ ordine = [] }: CalendarProductieProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showDayDialog, setShowDayDialog] = useState(false);

  // Transform ordine to calendar format
  const scheduledOrders = useMemo((): CalendarOrder[] => {
    return ordine.flatMap(ordin => {
      // Parse date from startPlanificat (format: "DD/MM/YYYY HH:mm")
      let dateStr = new Date().toISOString().split('T')[0]; // Default to today
      let startHour = 8;
      
      try {
        if (ordin.startPlanificat) {
          const dateParts = ordin.startPlanificat.split(" ");
          if (dateParts[0]) {
            const dateComponents = dateParts[0].split("/");
            if (dateComponents.length === 3) {
              const [day, month, year] = dateComponents;
              if (day && month && year) {
                dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
              }
            }
          }
          if (dateParts[1]) {
            const [hourStr] = dateParts[1].split(":");
            startHour = parseInt(hourStr) || 8;
          }
        }
      } catch (e) {
        console.warn('Failed to parse date:', ordin.startPlanificat);
      }
      
      // Map status
      const statusMap: Record<string, string> = {
        "Planificat": "planificat",
        "În lucru": "in_lucru",
        "Finalizat": "finalizat"
      };

      // Production rate: 125 tons/hour
      const TONS_PER_HOUR = 125;
      
      // Create an entry for each product in the order, scheduled sequentially
      let currentHour = startHour;
      return ordin.produse.map((p, idx) => {
        // Calculate duration based on quantity and production rate (125 t/h)
        const durationHours = Math.max(1, Math.ceil(p.cantitate / TONS_PER_HOUR));
        const productStartHour = currentHour;
        
        // Update currentHour for next product
        currentHour = Math.min(22, currentHour + durationHours);
        
        return {
          id: `${ordin.numar}${idx > 0 ? `-${idx + 1}` : ''}`,
          produs: p.produs,
          quantity: p.cantitate,
          startHour: Math.min(22, Math.max(6, productStartHour)),
          duration: durationHours,
          status: statusMap[ordin.status] || "planificat",
          date: dateStr
        };
      });
    });
  }, [ordine]);

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
    const variants: Record<string, { className: string; label: string }> = {
      planificat: { 
        className: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30", 
        label: "Planificat" 
      },
      in_lucru: { 
        className: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30", 
        label: "În lucru" 
      },
      finalizat: { 
        className: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", 
        label: "Finalizat" 
      },
    };
    const config = variants[status] || variants.planificat;
    return <Badge variant="outline" className={cn("text-xs font-medium", config.className)}>{config.label}</Badge>;
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

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const weekDays = ["Lun", "Mar", "Mie", "Joi", "Vin", "Sâm", "Dum"];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Modern Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 border border-primary/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Calendar Producție</h1>
                <p className="text-sm text-muted-foreground">Planificare vizuală a ordinelor de producție</p>
              </div>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateMonth(-1)}
                className="rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-5 py-2.5 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 min-w-[200px] text-center shadow-sm">
                <span className="font-semibold capitalize text-foreground">{formatMonthYear(currentMonth)}</span>
              </div>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigateMonth(1)}
                className="rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setCurrentMonth(new Date())}
                className="rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Astăzi
              </Button>
            </div>
          </div>
        </div>

        {/* Month Calendar */}
        <Card className="overflow-hidden border-border/50 shadow-lg">
          <CardContent className="p-0">
            {/* Week days header */}
            <div className="grid grid-cols-7 bg-muted/30 border-b border-border/50">
              {weekDays.map((day, idx) => (
                <div 
                  key={day} 
                  className={cn(
                    "text-center text-sm font-semibold py-3 uppercase tracking-wider",
                    idx >= 5 ? "text-muted-foreground/70" : "text-muted-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return (
                    <div 
                      key={`empty-${index}`} 
                      className="min-h-[110px] bg-muted/5 border-b border-r border-border/30" 
                    />
                  );
                }

                const orders = getOrdersForDate(day);
                const hasOrders = orders.length > 0;
                const totalQuantity = orders.reduce((sum, o) => sum + o.quantity, 0);
                const inProgress = orders.filter(o => o.status === "in_lucru").length;
                const completed = orders.filter(o => o.status === "finalizat").length;

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "min-h-[110px] p-2.5 border-b border-r border-border/30 cursor-pointer transition-all duration-200 group",
                      "hover:bg-primary/5 hover:shadow-inner",
                      isToday(day) && "bg-primary/5 ring-2 ring-primary/30 ring-inset relative z-10",
                      isWeekend(day) && !isToday(day) && "bg-muted/10",
                      hasOrders && !isToday(day) && "bg-gradient-to-br from-background to-muted/20"
                    )}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-semibold transition-all",
                        isToday(day) 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : isWeekend(day)
                          ? "text-muted-foreground/70"
                          : "text-foreground group-hover:bg-muted/50"
                      )}>
                        {day.getDate()}
                      </span>
                      {hasOrders && (
                        <span className="text-[10px] font-medium text-primary/80 bg-primary/10 px-1.5 py-0.5 rounded-md">
                          {orders.length}
                        </span>
                      )}
                    </div>

                    {/* Orders summary */}
                    {hasOrders && (
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          <Package className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-medium text-foreground">{totalQuantity} to</span>
                        </div>
                        
                        {/* Status indicators */}
                        <div className="flex items-center gap-1">
                          {inProgress > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-500/15">
                                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                                  <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">{inProgress}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                {inProgress} în lucru
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {completed > 0 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/15">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{completed}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="text-xs">
                                {completed} finalizat
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>

                        {/* Product dots */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {orders.slice(0, 4).map(order => {
                            const colors = getProductColor(order.produs);
                            return (
                              <Tooltip key={order.id}>
                                <TooltipTrigger asChild>
                                  <div className={cn(
                                    "w-2.5 h-2.5 rounded-sm transition-transform hover:scale-125",
                                    colors.bg,
                                    order.status === "finalizat" && "opacity-50"
                                  )} />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="text-xs p-2">
                                  <div className="font-medium">{order.id}</div>
                                  <div className="text-muted-foreground">{order.produs}</div>
                                  <div>{order.quantity} to</div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                          {orders.length > 4 && (
                            <span className="text-[10px] font-medium text-muted-foreground bg-muted/50 px-1 rounded">
                              +{orders.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 py-4 bg-muted/20 border-t border-border/30">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-muted-foreground">În lucru</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-xs font-medium text-muted-foreground">Planificat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-muted-foreground">Finalizat</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Detail Dialog - Hourly View */}
        <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-4 border-b border-border/50">
              <DialogTitle className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <span className="capitalize text-lg">{selectedDay && formatDayDate(selectedDay)}</span>
                  {selectedDayOrders.length > 0 && (
                    <p className="text-sm font-normal text-muted-foreground mt-0.5">
                      {selectedDayOrders.length} ordine • {selectedDayOrders.reduce((sum, o) => sum + o.quantity, 0)} tone planificate
                    </p>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              {selectedDayOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/30 mb-4">
                    <Package className="h-10 w-10 opacity-50" />
                  </div>
                  <p className="text-lg font-semibold">Niciun ordin programat</p>
                  <p className="text-sm text-muted-foreground/70">Nu există ordine de producție pentru această zi</p>
                </div>
              ) : (
                <ScrollArea className="h-[55vh] mt-4">
                  <div className="min-w-[700px]">
                    {/* Time header */}
                    <div className="flex border-b-2 border-border sticky top-0 bg-background z-10 rounded-t-lg overflow-hidden">
                      <div className="w-28 shrink-0 p-3 bg-muted/50 border-r border-border">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ordin</span>
                      </div>
                      <div className="flex-1 flex">
                        {hours.map((hour, idx) => (
                          <div 
                            key={hour} 
                            className={cn(
                              "flex-1 min-w-[40px] p-2 text-center border-r border-border/50 last:border-r-0",
                              idx % 2 === 0 ? "bg-muted/30" : "bg-muted/10"
                            )}
                          >
                            <span className="text-xs font-semibold text-foreground">{hour}:00</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Orders rows */}
                    <div className="relative rounded-b-lg overflow-hidden border-x border-b border-border/50">
                      {selectedDayOrders.map((order, idx) => {
                        const colors = getProductColor(order.produs);
                        return (
                          <div 
                            key={order.id} 
                            className={cn(
                              "flex h-16 relative",
                              idx % 2 === 0 ? "bg-background" : "bg-muted/5"
                            )}
                          >
                            <div className="w-28 shrink-0 p-2.5 border-r border-border/50 flex flex-col justify-center">
                              <span className="text-sm font-semibold text-foreground truncate">{order.id}</span>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="flex-1 relative py-2 px-1">
                              {/* Hour grid lines */}
                              <div className="absolute inset-0 flex pointer-events-none">
                                {hours.map((hour, idx) => (
                                  <div 
                                    key={hour} 
                                    className={cn(
                                      "flex-1 border-r",
                                      idx % 2 === 0 ? "border-border/30" : "border-border/10"
                                    )}
                                  />
                                ))}
                              </div>
                              
                              {/* Order bar */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "absolute rounded-lg px-3 py-1.5 transition-all cursor-pointer",
                                      "hover:scale-[1.02] hover:brightness-110",
                                      "shadow-lg border",
                                      colors.gradient,
                                      colors.border,
                                      colors.text,
                                      colors.glow,
                                      order.status === "finalizat" && "opacity-70"
                                    )}
                                    style={{
                                      left: `${((order.startHour - 6) / 17) * 100}%`,
                                      width: `calc(${(order.duration / 17) * 100}% - 8px)`,
                                      top: '6px',
                                      bottom: '6px'
                                    }}
                                  >
                                    <div className="text-sm font-bold truncate drop-shadow-sm">{order.produs}</div>
                                    <div className="text-[11px] opacity-90 truncate">
                                      {order.quantity} to • {order.startHour}:00-{order.startHour + order.duration}:00
                                    </div>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="p-3 space-y-1.5">
                                  <div className="font-bold">{order.id}</div>
                                  <div className="text-sm">{order.produs}</div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-3.5 w-3.5" />
                                    <span className="font-medium">{order.quantity} tone</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>{order.startHour}:00 - {order.startHour + order.duration}:00</span>
                                  </div>
                                  <div className="pt-1">{getStatusBadge(order.status)}</div>
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

            {/* Product color legend */}
            {selectedDayOrders.length > 0 && (
              <div className="pt-4 border-t border-border/50 mt-4">
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-muted-foreground font-medium">Produse:</span>
                  {Object.entries(productColors).map(([produs, colors]) => (
                    <div key={produs} className="flex items-center gap-1.5">
                      <div className={cn("w-3 h-3 rounded shadow-sm", colors.bg)} />
                      <span className="text-muted-foreground">{produs}</span>
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
