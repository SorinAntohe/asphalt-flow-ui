import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Truck, Package, User } from "lucide-react";
import { WeighSession } from "../types";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  session: WeighSession;
  isActive?: boolean;
  onClick: () => void;
  showWaitTime?: boolean;
}

export function SessionCard({ session, isActive, onClick, showWaitTime }: SessionCardProps) {
  const isInbound = session.direction === 'INBOUND';
  
  const getWaitTime = () => {
    const created = new Date(session.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min`;
    return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`;
  };

  return (
    <Card 
      className={cn(
        "p-2 sm:p-3 cursor-pointer transition-all hover:shadow-md touch-manipulation",
        isActive 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <Badge 
            variant={isInbound ? "info" : "warning"} 
            className={cn("text-[10px] sm:text-xs", isActive && "bg-primary-foreground/20 text-primary-foreground")}
          >
            {isInbound ? (
              <><Package className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> Recepție</>
            ) : (
              <><Truck className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" /> Livrare</>
            )}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("text-[10px] sm:text-xs", isActive && "border-primary-foreground/30 text-primary-foreground")}
          >
            Pas {session.step}
          </Badge>
        </div>
      </div>
      
      <div className="mt-1.5 sm:mt-2 space-y-0.5 sm:space-y-1">
        <p className={cn("font-medium text-xs sm:text-sm", isActive && "text-primary-foreground")}>
          {isInbound ? `Comandă: ${session.poNo}` : `Comandă: ${session.orderNo}`}
        </p>
        <div className={cn(
          "flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs flex-wrap",
          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          <span className="font-mono">{session.nrAuto}</span>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[10px] sm:text-xs",
          isActive ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          <User className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span>Șofer: {session.createdBy}</span>
        </div>
        {showWaitTime && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] sm:text-xs mt-0.5 sm:mt-1",
            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
          )}>
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>În așteptare: {getWaitTime()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
