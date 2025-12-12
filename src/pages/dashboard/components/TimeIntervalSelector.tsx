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
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={selectedInterval === "today" ? "default" : "outline"}
        size="sm"
        onClick={() => handleIntervalChange("today")}
      >
        Azi
      </Button>
      <Button
        variant={selectedInterval === "yesterday" ? "default" : "outline"}
        size="sm"
        onClick={() => handleIntervalChange("yesterday")}
      >
        Ieri
      </Button>
      <Button
        variant={selectedInterval === "week" ? "default" : "outline"}
        size="sm"
        onClick={() => handleIntervalChange("week")}
      >
        Săptămână
      </Button>
      <Button
        variant={selectedInterval === "month" ? "default" : "outline"}
        size="sm"
        onClick={() => handleIntervalChange("month")}
      >
        Lună
      </Button>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={selectedInterval === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => handleIntervalChange("custom")}
            className="gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
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
        <PopoverContent className="w-auto p-0" align="start">
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
