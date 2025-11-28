import * as React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

// Unified Column Header with Filter & Sort
interface DataTableColumnHeaderProps {
  title: string;
  sortKey: string;
  currentSort: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string, direction: "asc" | "desc") => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterPlaceholder?: string;
  sortAscLabel?: string;
  sortDescLabel?: string;
}

export function DataTableColumnHeader({
  title,
  sortKey,
  currentSort,
  onSort,
  filterValue,
  onFilterChange,
  filterPlaceholder = "Caută...",
  sortAscLabel = "Cresc.",
  sortDescLabel = "Descresc.",
}: DataTableColumnHeaderProps) {
  const isActive = currentSort?.key === sortKey;
  const direction = isActive ? currentSort.direction : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 px-2 gap-1.5 font-semibold text-xs hover:bg-primary/10 transition-colors",
            isActive && "text-primary"
          )}
        >
          <span>{title}</span>
          {direction === "asc" ? (
            <ArrowUp className="h-3.5 w-3.5 text-primary" />
          ) : direction === "desc" ? (
            <ArrowDown className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-3" align="start">
        <div className="space-y-3">
          <Input
            placeholder={filterPlaceholder}
            value={filterValue}
            onChange={(e) => onFilterChange(e.target.value)}
            className="h-9 text-sm"
          />
          <div className="flex gap-2">
            <Button
              variant={direction === "asc" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => onSort(sortKey, "asc")}
            >
              <ArrowUp className="h-3.5 w-3.5 mr-1" />
              {sortAscLabel}
            </Button>
            <Button
              variant={direction === "desc" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8 text-xs"
              onClick={() => onSort(sortKey, "desc")}
            >
              <ArrowDown className="h-3.5 w-3.5 mr-1" />
              {sortDescLabel}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Unified Table Wrapper
interface DataTableWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function DataTableWrapper({ children, className }: DataTableWrapperProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      {children}
    </div>
  );
}

// Unified Empty State
interface DataTableEmptyProps {
  colSpan: number;
  message?: string;
}

export function DataTableEmpty({ colSpan, message = "Nu există date disponibile" }: DataTableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground">
          <svg
            className="h-12 w-12 mb-3 opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-sm">{message}</p>
        </div>
      </td>
    </tr>
  );
}

// Unified Loading State
interface DataTableLoadingProps {
  colSpan: number;
}

export function DataTableLoading({ colSpan }: DataTableLoadingProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-32 text-center">
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-primary/20"></div>
            <div className="absolute top-0 left-0 h-10 w-10 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
          </div>
        </div>
      </td>
    </tr>
  );
}

// Unified Pagination Footer
interface DataTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (count: number) => void;
  itemsPerPageOptions?: number[];
}

export function DataTablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50, 100],
}: DataTablePaginationProps) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push("...");
    }
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push("...");
    }
    
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-4 border-t border-border/50">
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          Afișare {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} din {totalItems}
        </span>
        <span className="sm:hidden text-xs">
          {totalItems > 0 ? startIndex + 1 : 0}-{endIndex} / {totalItems}
        </span>
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Per pagină:</Label>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-16 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={cn(
                  "h-8 px-3 text-xs cursor-pointer transition-colors",
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, idx) => (
              <PaginationItem key={idx}>
                {page === "..." ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(page as number)}
                    isActive={currentPage === page}
                    className="h-8 w-8 text-xs cursor-pointer transition-colors"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={cn(
                  "h-8 px-3 text-xs cursor-pointer transition-colors",
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

// Unified Card Header for Tables
interface DataTableCardHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DataTableCardHeader({ title, description, children, className }: DataTableCardHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-6 border-b border-border/50", className)}>
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
