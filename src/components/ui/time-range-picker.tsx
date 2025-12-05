import * as React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function TimeRangePicker({ value, onChange, className, disabled }: TimeRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [activeTime, setActiveTime] = React.useState<"start" | "end">("start");
  const [selecting, setSelecting] = React.useState<"hour" | "minute">("hour");
  
  // Parse value "HH:MM - HH:MM"
  const [startTime, endTime] = value ? value.split(" - ") : ["08:00", "12:00"];
  const [tempStart, setTempStart] = React.useState(startTime);
  const [tempEnd, setTempEnd] = React.useState(endTime);
  
  React.useEffect(() => {
    if (open) {
      const [start, end] = value ? value.split(" - ") : ["08:00", "12:00"];
      setTempStart(start);
      setTempEnd(end);
      setActiveTime("start");
      setSelecting("hour");
    }
  }, [open, value]);

  const currentTime = activeTime === "start" ? tempStart : tempEnd;
  const setCurrentTime = activeTime === "start" ? setTempStart : setTempEnd;
  
  const [hour, minute] = currentTime ? currentTime.split(":") : ["08", "00"];
  const hourNum = parseInt(hour);
  const minuteNum = parseInt(minute);

  const handleHourClick = (h: number) => {
    const newHour = h.toString().padStart(2, "0");
    setCurrentTime(`${newHour}:${minute}`);
  };

  const handleMinuteClick = (m: number) => {
    const newMinute = m.toString().padStart(2, "0");
    setCurrentTime(`${hour}:${newMinute}`);
  };

  const handleOk = () => {
    onChange(`${tempStart} - ${tempEnd}`);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Calculate position on clock face
  const getPosition = (value: number, total: number, radius: number) => {
    const angle = (value * 360 / total - 90) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const displayHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const outerHours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const innerHours = [0, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  const selectedPos = selecting === "hour" 
    ? getPosition(hourNum < 12 ? (hourNum === 0 ? 12 : hourNum) : (hourNum === 12 ? 12 : hourNum - 12), 12, hourNum >= 12 && hourNum !== 0 ? 45 : 70)
    : getPosition(minuteNum, 60, 70);

  return (
    <>
      <Button
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-start text-left font-normal h-10",
          !value && "text-muted-foreground",
          className
        )}
      >
        <Clock className="mr-2 h-4 w-4" />
        <span>{value || "Selectează interval"}</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-auto max-w-fit p-4" hideCloseButton>
          <div className="flex flex-col items-center gap-4">
            {/* Time tabs */}
            <div className="flex gap-2 w-full">
              <button
                onClick={() => { setActiveTime("start"); setSelecting("hour"); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-center transition-all",
                  activeTime === "start" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <div className="text-xs mb-1">De la</div>
                <div className="text-xl font-medium">{tempStart}</div>
              </button>
              <button
                onClick={() => { setActiveTime("end"); setSelecting("hour"); }}
                className={cn(
                  "flex-1 py-2 px-4 rounded-lg text-center transition-all",
                  activeTime === "end" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <div className="text-xs mb-1">Până la</div>
                <div className="text-xl font-medium">{tempEnd}</div>
              </button>
            </div>

            {/* Hour/Minute toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelecting("hour")}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-all",
                  selecting === "hour" 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Oră
              </button>
              <button
                onClick={() => setSelecting("minute")}
                className={cn(
                  "px-3 py-1 rounded text-sm transition-all",
                  selecting === "minute" 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                Minut
              </button>
            </div>

            {/* Clock face */}
            <div className="relative w-52 h-52 rounded-full bg-muted flex items-center justify-center">
              {/* Center dot */}
              <div className="absolute w-2 h-2 rounded-full bg-primary z-10" />
              
              {/* Selection line */}
              <svg className="absolute w-full h-full" viewBox="-104 -104 208 208">
                <line
                  x1="0"
                  y1="0"
                  x2={selectedPos.x}
                  y2={selectedPos.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  className="transition-all duration-200"
                />
                <circle
                  cx={selectedPos.x}
                  cy={selectedPos.y}
                  r="16"
                  fill="hsl(var(--primary))"
                  className="transition-all duration-200"
                />
              </svg>

              {/* Hour numbers (24h format) */}
              {selecting === "hour" && (
                <>
                  {/* Outer ring (1-12) */}
                  {outerHours.map((h) => {
                    const displayH = h === 0 ? 12 : h;
                    const pos = getPosition(displayH, 12, 70);
                    const isSelected = hourNum === h;
                    return (
                      <button
                        key={`outer-${h}`}
                        onClick={() => handleHourClick(h)}
                        className={cn(
                          "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-20",
                          "transition-all duration-200 hover:scale-110",
                          isSelected ? "text-primary-foreground" : "text-foreground hover:bg-primary/10"
                        )}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                        }}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    );
                  })}
                  {/* Inner ring (13-23, 0) */}
                  {innerHours.map((h) => {
                    const angleH = h === 0 ? 12 : (h - 12);
                    const pos = getPosition(angleH, 12, 45);
                    const isSelected = hourNum === h;
                    return (
                      <button
                        key={`inner-${h}`}
                        onClick={() => handleHourClick(h)}
                        className={cn(
                          "absolute w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium z-20",
                          "transition-all duration-200 hover:scale-110",
                          isSelected ? "text-primary-foreground" : "text-muted-foreground hover:bg-primary/10"
                        )}
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                        }}
                      >
                        {h.toString().padStart(2, "0")}
                      </button>
                    );
                  })}
                </>
              )}

              {/* Minute numbers */}
              {selecting === "minute" && minutes.map((m) => {
                const pos = getPosition(m, 60, 70);
                const isSelected = minuteNum === m;
                return (
                  <button
                    key={m}
                    onClick={() => handleMinuteClick(m)}
                    className={cn(
                      "absolute w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium z-20",
                      "transition-all duration-200 hover:scale-110",
                      isSelected ? "text-primary-foreground" : "text-foreground hover:bg-primary/10"
                    )}
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    }}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                );
              })}
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
        </DialogContent>
      </Dialog>
    </>
  );
}
