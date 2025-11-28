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
  
  // Determine AM/PM based on 24h hour
  const isPM = hourNum >= 12;
  const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;

  const handleHourClick = (h: number) => {
    // Convert 12h to 24h based on current AM/PM
    let hour24 = h;
    if (isPM) {
      hour24 = h === 12 ? 12 : h + 12;
    } else {
      hour24 = h === 12 ? 0 : h;
    }
    const newHour = hour24.toString().padStart(2, "0");
    onChange(`${newHour}:${minute}`);
  };

  const handleMinuteClick = (m: number) => {
    const newMinute = m.toString().padStart(2, "0");
    onChange(`${hour}:${newMinute}`);
  };

  const handleAmPmToggle = (newIsPM: boolean) => {
    let newHour24: number;
    if (newIsPM && !isPM) {
      // Switching to PM
      newHour24 = hourNum === 0 ? 12 : hourNum + 12;
    } else if (!newIsPM && isPM) {
      // Switching to AM
      newHour24 = hourNum === 12 ? 0 : hourNum - 12;
    } else {
      return;
    }
    const newHour = newHour24.toString().padStart(2, "0");
    onChange(`${newHour}:${minute}`);
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

  const selectedPos = selecting === "hour" 
    ? getPosition(hour12, 12, 70)
    : getPosition(minuteNum, 60, 70);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          size="sm"
          className={cn(
            "w-full justify-start text-left font-normal h-9 transition-all duration-200 hover:scale-[1.02]",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-3.5 w-3.5" />
          <span className="text-sm">{value || "Selectează ora"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-4 pointer-events-auto animate-scale-in" 
        align="start"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Time display with AM/PM */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSelecting("hour")}
                className={cn(
                  "text-4xl font-light px-3 py-2 rounded-lg transition-all duration-300 ease-out",
                  selecting === "hour" 
                    ? "bg-primary/20 text-primary scale-105" 
                    : "text-foreground hover:bg-muted scale-100"
                )}
              >
                {hour12.toString().padStart(2, "0")}
              </button>
              <span className="text-4xl font-light text-foreground">:</span>
              <button
                onClick={() => setSelecting("minute")}
                className={cn(
                  "text-4xl font-light px-3 py-2 rounded-lg transition-all duration-300 ease-out",
                  selecting === "minute" 
                    ? "bg-primary/20 text-primary scale-105" 
                    : "text-foreground hover:bg-muted scale-100"
                )}
              >
                {minute}
              </button>
            </div>
            
            {/* AM/PM Toggle */}
            <div className="flex flex-col gap-1 ml-2">
              <button
                onClick={() => handleAmPmToggle(false)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded transition-all duration-200",
                  !isPM 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                AM
              </button>
              <button
                onClick={() => handleAmPmToggle(true)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded transition-all duration-200",
                  isPM 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                PM
              </button>
            </div>
          </div>

          {/* Clock face */}
          <div className="relative w-48 h-48 rounded-full bg-muted flex items-center justify-center transition-transform duration-300">
            {/* Center dot */}
            <div className="absolute w-2 h-2 rounded-full bg-primary z-10 transition-transform duration-300" />
            
            {/* Selection line and dot */}
            <svg className="absolute w-full h-full" viewBox="-96 -96 192 192">
              <line
                x1="0"
                y1="0"
                x2={selectedPos.x}
                y2={selectedPos.y}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                className="transition-all duration-300 ease-out"
                style={{
                  transformOrigin: '0 0',
                }}
              />
              <circle
                cx={selectedPos.x}
                cy={selectedPos.y}
                r="16"
                fill="hsl(var(--primary))"
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Hour numbers */}
            <div 
              className={cn(
                "absolute inset-0 transition-all duration-300 ease-out",
                selecting === "hour" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              {hours.map((h, index) => {
                const pos = getPosition(h, 12, 70);
                const isSelected = hour12 === h;
                return (
                  <button
                    key={h}
                    onClick={() => handleHourClick(h)}
                    className={cn(
                      "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-20",
                      "transition-all duration-200 ease-out hover:scale-110",
                      isSelected 
                        ? "text-primary-foreground" 
                        : "text-foreground hover:bg-primary/10"
                    )}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                      animationDelay: `${index * 30}ms`,
                    }}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            {/* Minute numbers */}
            <div 
              className={cn(
                "absolute inset-0 transition-all duration-300 ease-out",
                selecting === "minute" ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
              )}
            >
              {minutes.map((m, index) => {
                const pos = getPosition(m, 60, 70);
                const isSelected = minuteNum === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleMinuteClick(m)}
                    className={cn(
                      "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-20",
                      "transition-all duration-200 ease-out hover:scale-110",
                      isSelected 
                        ? "text-primary-foreground" 
                        : "text-foreground hover:bg-primary/10"
                    )}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                      animationDelay: `${index * 30}ms`,
                    }}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancel}
              className="transition-all duration-200 hover:scale-105"
            >
              Anulează
            </Button>
            <Button 
              size="sm" 
              onClick={handleOk}
              className="transition-all duration-200 hover:scale-105"
            >
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
