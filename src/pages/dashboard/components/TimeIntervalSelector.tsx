import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

type IntervalType = "today" | "yesterday" | "week" | "month" | "custom";

interface TimeIntervalSelectorProps {
  onIntervalChange?: (interval: IntervalType, dateRange?: DateRange) => void;
}

const TimeIntervalSelector = ({ onIntervalChange }: TimeIntervalSelectorProps) => {
  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("today");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleIntervalChange = (interval: IntervalType) => {
    setSelectedInterval(interval);
    if (interval !== "custom") {
      onIntervalChange?.(interval);
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      onIntervalChange?.("custom", range);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-lg border border-border/50">
      <Button
        variant={selectedInterval === "today" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleIntervalChange("today")}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          selectedInterval === "today" && "shadow-sm"
        )}
      >
        Azi
      </Button>
      <Button
        variant={selectedInterval === "yesterday" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleIntervalChange("yesterday")}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          selectedInterval === "yesterday" && "shadow-sm"
        )}
      >
        Ieri
      </Button>
      <Button
        variant={selectedInterval === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleIntervalChange("week")}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          selectedInterval === "week" && "shadow-sm"
        )}
      >
        Săptămână
      </Button>
      <Button
        variant={selectedInterval === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleIntervalChange("month")}
        className={cn(
          "h-8 px-3 text-xs font-medium transition-all",
          selectedInterval === "month" && "shadow-sm"
        )}
      >
        Lună
      </Button>
      <div className="w-px h-5 bg-border/60 mx-1" />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={selectedInterval === "custom" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleIntervalChange("custom")}
            className={cn(
              "h-8 px-3 text-xs font-medium gap-1.5 transition-all",
              selectedInterval === "custom" && "shadow-sm"
            )}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd MMM", { locale: ro })} -{" "}
                  {format(dateRange.to, "dd MMM", { locale: ro })}
                </>
              ) : (
                format(dateRange.from, "dd MMM yyyy", { locale: ro })
              )
            ) : (
              "Custom"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateRangeChange}
            numberOfMonths={2}
            locale={ro}
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimeIntervalSelector;
