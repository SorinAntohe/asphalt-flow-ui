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

export function TimePicker({ value, onChange, className, disabled }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selecting, setSelecting] = React.useState<"hour" | "minute">("hour");
  
  const [hour, minute] = value ? value.split(":") : ["08", "30"];
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);

  const handleHourClick = (h: number) => {
    const newHour = h.toString().padStart(2, "0");
    onChange(`${newHour}:${minute}`);
    setSelecting("minute");
  };

  const handleMinuteClick = (m: number) => {
    const newMinute = m.toString().padStart(2, "0");
    onChange(`${hour}:${newMinute}`);
  };

  const handleOk = () => {
    setOpen(false);
    setSelecting("hour");
  };

  const handleCancel = () => {
    setOpen(false);
    setSelecting("hour");
  };

  // Calculate position on clock face
  const getPosition = (value: number, total: number, radius: number) => {
    const angle = (value * 360 / total - 90) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const currentHour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
  const selectedPos = selecting === "hour" 
    ? getPosition(currentHour12, 12, 70)
    : getPosition(minuteNum, 60, 70);

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
      <PopoverContent className="w-auto p-4 pointer-events-auto" align="start">
        <div className="flex flex-col items-center gap-4">
          {/* Time display */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelecting("hour")}
              className={cn(
                "text-4xl font-light px-3 py-2 rounded-lg transition-colors",
                selecting === "hour" 
                  ? "bg-primary/20 text-primary" 
                  : "text-foreground hover:bg-muted"
              )}
            >
              {hour}
            </button>
            <span className="text-4xl font-light text-foreground">:</span>
            <button
              onClick={() => setSelecting("minute")}
              className={cn(
                "text-4xl font-light px-3 py-2 rounded-lg transition-colors",
                selecting === "minute" 
                  ? "bg-primary/20 text-primary" 
                  : "text-foreground hover:bg-muted"
              )}
            >
              {minute}
            </button>
          </div>

          {/* Clock face */}
          <div className="relative w-48 h-48 rounded-full bg-muted flex items-center justify-center">
            {/* Center dot */}
            <div className="absolute w-2 h-2 rounded-full bg-primary z-10" />
            
            {/* Selection line and dot */}
            <svg className="absolute w-full h-full" viewBox="-96 -96 192 192">
              <line
                x1="0"
                y1="0"
                x2={selectedPos.x}
                y2={selectedPos.y}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
              />
              <circle
                cx={selectedPos.x}
                cy={selectedPos.y}
                r="16"
                fill="hsl(var(--primary))"
              />
            </svg>

            {/* Hour numbers or minute numbers */}
            {selecting === "hour" ? (
              hours.map((h) => {
                const pos = getPosition(h, 12, 70);
                const isSelected = currentHour12 === h;
                return (
                  <button
                    key={h}
                    onClick={() => handleHourClick(h === 12 ? 0 : h)}
                    className={cn(
                      "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors z-20",
                      isSelected 
                        ? "text-primary-foreground" 
                        : "text-foreground hover:bg-primary/10"
                    )}
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                  >
                    {h}
                  </button>
                );
              })
            ) : (
              minutes.map((m) => {
                const pos = getPosition(m, 60, 70);
                const isSelected = minuteNum === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleMinuteClick(m)}
                    className={cn(
                      "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors z-20",
                      isSelected 
                        ? "text-primary-foreground" 
                        : "text-foreground hover:bg-primary/10"
                    )}
                    style={{
                      transform: `translate(${pos.x}px, ${pos.y}px)`,
                    }}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                );
              })
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 w-full">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              Anulează
            </Button>
            <Button size="sm" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
