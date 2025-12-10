import { LucideIcon, Inbox, FileX, Search, Database, Users, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: "default" | "compact";
}

const defaultIcons: Record<string, LucideIcon> = {
  default: Inbox,
  search: Search,
  data: Database,
  users: Users,
  products: Package,
  files: FileX,
};

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
  variant = "default",
}: EmptyStateProps) {
  const isCompact = variant === "compact";
  
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "py-8 px-4" : "py-16 px-6",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full bg-muted flex items-center justify-center mb-4",
          isCompact ? "w-12 h-12" : "w-16 h-16"
        )}
      >
        <Icon
          className={cn(
            "text-muted-foreground",
            isCompact ? "w-6 h-6" : "w-8 h-8"
          )}
        />
      </div>
      <h3
        className={cn(
          "font-semibold text-foreground",
          isCompact ? "text-sm" : "text-lg"
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            "text-muted-foreground mt-1 max-w-sm",
            isCompact ? "text-xs" : "text-sm"
          )}
        >
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          size={isCompact ? "sm" : "default"}
          className="mt-4"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Pre-configured empty states for common use cases
export function EmptyTableState({
  onAdd,
  entityName = "înregistrări",
}: {
  onAdd?: () => void;
  entityName?: string;
}) {
  return (
    <EmptyState
      icon={Database}
      title={`Nu există ${entityName}`}
      description={`Nu au fost găsite ${entityName}. ${onAdd ? "Adaugă prima înregistrare pentru a începe." : ""}`}
      actionLabel={onAdd ? `Adaugă ${entityName.slice(0, -1) || "înregistrare"}` : undefined}
      onAction={onAdd}
      variant="compact"
    />
  );
}

export function EmptySearchState({ searchTerm }: { searchTerm?: string }) {
  return (
    <EmptyState
      icon={Search}
      title="Niciun rezultat găsit"
      description={
        searchTerm
          ? `Nu am găsit rezultate pentru "${searchTerm}". Încearcă alți termeni.`
          : "Încearcă să modifici filtrele sau termenul de căutare."
      }
      variant="compact"
    />
  );
}
