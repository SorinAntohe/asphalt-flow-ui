import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";

interface TableFilterPopoverProps {
  label: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (direction: 'asc' | 'desc') => void;
  onReset?: () => void;
  field: string;
}

export const TableFilterPopover = React.memo(({
  label,
  filterValue,
  onFilterChange,
  sortField,
  sortDirection,
  onSort,
  onReset,
  field
}: TableFilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(filterValue);
  
  const isActive = sortField === field;
  const direction = isActive ? sortDirection : null;
  const hasActiveFilter = filterValue !== "" || direction !== null;

  // Sync local value when filter value changes externally
  React.useEffect(() => {
    setLocalValue(filterValue);
  }, [filterValue]);

  // Apply filter when popover closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && localValue !== filterValue) {
      onFilterChange(localValue);
    }
    setOpen(isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleReset = () => {
    setLocalValue("");
    onFilterChange("");
    if (onReset) {
      onReset();
    }
  };

  return (
    <TableHead className="h-10 text-xs">
      <Popover open={open} onOpenChange={handleOpenChange} modal={true}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 hover:bg-muted/50 font-medium gap-1">
            <span>{label}</span>
            {direction === 'asc' ? (
              <ArrowUp className="h-3 w-3 text-primary" />
            ) : direction === 'desc' ? (
              <ArrowDown className="h-3 w-3 text-primary" />
            ) : (
              <ArrowUpDown className="h-3 w-3 opacity-50" />
            )}
            {hasActiveFilter && <span className="ml-1 h-2 w-2 rounded-full bg-primary" />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-2">
            <Input
              value={localValue}
              onChange={handleInputChange}
              placeholder={`Caută ${label.toLowerCase()}...`}
              className="h-7 text-xs"
              autoFocus
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={direction === 'asc' ? 'default' : 'outline'}
                onClick={() => onSort('asc')}
                className="flex-1 h-7 text-xs"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                Cresc.
              </Button>
              <Button
                size="sm"
                variant={direction === 'desc' ? 'default' : 'outline'}
                onClick={() => onSort('desc')}
                className="flex-1 h-7 text-xs"
              >
                <ArrowDown className="h-3 w-3 mr-1" />
                Descresc.
              </Button>
            </div>
            {hasActiveFilter && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-7 text-xs"
                onClick={handleReset}
              >
                <X className="h-3 w-3 mr-1" />
                Resetează
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );
});

TableFilterPopover.displayName = "TableFilterPopover";
