import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-border/50 bg-background/80 px-4 py-3 text-base sm:text-sm",
          "transition-all duration-300 ease-out backdrop-blur-sm touch-manipulation",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          "placeholder:text-muted-foreground/60",
          "focus:outline-none focus:border-primary/50 focus:bg-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "hover:border-primary/30 hover:bg-background",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
