import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hour, minute] = value ? value.split(":") : ["08", "00"];

  const handleHourSelect = (h: string) => {
    onChange(`${h}:${minute}`);
  };

  const handleMinuteSelect = (m: string) => {
    onChange(`${hour}:${m}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          size="sm"
          className={cn(
            "w-full justify-start text-left font-normal h-9",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-3.5 w-3.5" />
          <span className="text-sm">{value || "Selectează ora"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          <div className="flex flex-col">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b text-center">
              Ore
            </div>
            <div className="h-32 overflow-y-auto">
              <div className="flex flex-col p-0.5">
                {hours.map((h) => (
                  <Button
                    key={h}
                    variant={h === hour ? "default" : "ghost"}
                    size="sm"
                    className="w-9 h-6 text-xs justify-center px-1"
                    onClick={() => handleHourSelect(h)}
                  >
                    {h}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col border-l">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground border-b text-center">
              Min
            </div>
            <div className="h-32 overflow-y-auto">
              <div className="flex flex-col p-0.5">
                {minutes.map((m) => (
                  <Button
                    key={m}
                    variant={m === minute ? "default" : "ghost"}
                    size="sm"
                    className="w-9 h-6 text-xs justify-center px-1"
                    onClick={() => handleMinuteSelect(m)}
                  >
                    {m}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
