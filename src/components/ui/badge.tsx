import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 ease-out shadow-sm",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/15 text-destructive hover:bg-destructive/25 backdrop-blur-sm",
        outline: "text-foreground border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/50",
        success: "border-transparent bg-[hsl(142_76%_36%)]/15 text-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_36%)]/25 backdrop-blur-sm",
        warning: "border-transparent bg-[hsl(38_92%_50%)]/15 text-[hsl(38_92%_50%)] hover:bg-[hsl(38_92%_50%)]/25 backdrop-blur-sm",
        info: "border-transparent bg-[hsl(199_89%_48%)]/15 text-[hsl(199_89%_48%)] hover:bg-[hsl(199_89%_48%)]/25 backdrop-blur-sm",
        premium: "border-transparent bg-gradient-to-r from-primary/20 to-primary/10 text-primary backdrop-blur-sm hover:from-primary/30 hover:to-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
