import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div 
      className="relative w-full overflow-x-auto rounded-xl border border-border/50 bg-card shadow-sm -mx-1 px-1 sm:mx-0 sm:px-0"
      tabIndex={-1}
    >
      <table ref={ref} className={cn("w-full caption-bottom text-sm min-w-[500px] sm:min-w-[600px]", className)} {...props} />
    </div>
  ),
);
Table.displayName = "Table";

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  sticky?: boolean;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ className, sticky = false, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={cn(
        "[&_tr]:border-b [&_tr]:border-border/50 bg-muted/50",
        sticky && "sticky top-0 z-10 bg-card shadow-sm",
        className
      )} 
      {...props} 
    />
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t border-border/50 bg-muted/30 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-border/40 transition-colors duration-200",
        "data-[state=selected]:bg-primary/5",
        "hover:bg-muted/50",
        className
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 sm:h-14 px-2 sm:px-4 md:px-5 text-left align-middle font-semibold text-foreground/80 text-[10px] sm:text-xs uppercase tracking-wide whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td 
      ref={ref} 
      className={cn(
        "px-2 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-4 align-middle text-xs sm:text-sm text-foreground",
        "[&:has([role=checkbox])]:pr-0",
        className
      )} 
      {...props} 
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
);
TableCaption.displayName = "TableCaption";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
