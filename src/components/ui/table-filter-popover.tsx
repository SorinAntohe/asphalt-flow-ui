import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableHead } from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

interface TableFilterPopoverProps {
  label: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (direction: 'asc' | 'desc') => void;
  field: string;
}

export const TableFilterPopover = React.memo(({
  label,
  filterValue,
  onFilterChange,
  sortField,
  sortDirection,
  onSort,
  field
}: TableFilterPopoverProps) => {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(filterValue);

  // Sync local value when filter value changes externally
  React.useEffect(() => {
    setLocalValue(filterValue);
  }, [filterValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onFilterChange(newValue);
  };

  return (
    <TableHead className="h-10 text-xs">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer hover:text-primary">
            <span>{label}</span>
            <ArrowUpDown className="ml-2 h-3 w-3" />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-56 p-2" 
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
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
                variant={sortField === field && sortDirection === 'asc' ? 'default' : 'outline'}
                onClick={() => onSort('asc')}
                className="flex-1 h-7 text-xs"
              >
                Cresc.
              </Button>
              <Button
                size="sm"
                variant={sortField === field && sortDirection === 'desc' ? 'default' : 'outline'}
                onClick={() => onSort('desc')}
                className="flex-1 h-7 text-xs"
              >
                Descresc.
              </Button>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="w-full h-7 text-xs"
            >
              Închide
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );
});

TableFilterPopover.displayName = "TableFilterPopover";
