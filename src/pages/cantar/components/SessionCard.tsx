import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Truck, Package } from "lucide-react";
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
        "p-3 cursor-pointer transition-all hover:shadow-md hover:border-primary/50",
        isActive && "ring-2 ring-primary border-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant={isInbound ? "info" : "warning"} className="text-xs">
            {isInbound ? (
              <><Package className="h-3 w-3 mr-1" /> Recepție</>
            ) : (
              <><Truck className="h-3 w-3 mr-1" /> Livrare</>
            )}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Step {session.step}
          </Badge>
        </div>
      </div>
      
      <div className="mt-2 space-y-1">
        <p className="font-medium text-sm">
          {isInbound ? `PO: ${session.poNo}` : `Comandă: ${session.orderNo}`}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">{session.nrAuto}</span>
          <span>·</span>
          <span className="text-primary font-medium">SC: {session.sessionCode}</span>
        </div>
        {showWaitTime && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>În așteptare: {getWaitTime()}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
