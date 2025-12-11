import * as React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TableHead } from "@/components/ui/table";

interface TableFilterHeaderProps<T extends string> {
  field: T;
  label: string;
  filterValue: string;
  onFilterChange: (value: string) => void;
  sortField: string;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (field: T, direction: 'asc' | 'desc') => void;
  sortAscLabel?: string;
  sortDescLabel?: string;
}

export function TableFilterHeader<T extends string>({
  field,
  label,
  filterValue,
  onFilterChange,
  sortField,
  sortDirection,
  onSort,
  sortAscLabel = "Cresc.",
  sortDescLabel = "Descresc.",
}: TableFilterHeaderProps<T>) {
  const isActive = sortField === field;
  const direction = isActive ? sortDirection : null;

  return (
    <TableHead className="h-10 text-xs">
      <Popover modal={true}>
        <PopoverTrigger asChild>
          <div className="flex items-center cursor-pointer hover:text-primary">
            <span>{label}</span>
            {direction === 'asc' ? (
              <ArrowUp className="ml-2 h-3 w-3" />
            ) : direction === 'desc' ? (
              <ArrowDown className="ml-2 h-3 w-3" />
            ) : (
              <ArrowUpDown className="ml-2 h-3 w-3" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="space-y-2">
            <Input
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              placeholder={`Caută ${label.toLowerCase()}...`}
              className="h-7 text-xs"
            />
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={direction === 'asc' ? 'default' : 'outline'}
                onClick={() => onSort(field, 'asc')}
                className="flex-1 h-7 text-xs"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                {sortAscLabel}
              </Button>
              <Button
                size="sm"
                variant={direction === 'desc' ? 'default' : 'outline'}
                onClick={() => onSort(field, 'desc')}
                className="flex-1 h-7 text-xs"
              >
                <ArrowDown className="h-3 w-3 mr-1" />
                {sortDescLabel}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableHead>
  );
}
