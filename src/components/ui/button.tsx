import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.97] relative overflow-hidden touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/90 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/0 before:to-white/10 before:pointer-events-none",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:bg-destructive/90 hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/0 before:to-white/10 before:pointer-events-none",
        outline: "border-2 border-border/60 bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/30 hover:shadow-md",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md hover:-translate-y-0.5",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
        success: "bg-[hsl(142_76%_36%)] text-white shadow-md hover:bg-[hsl(142_76%_32%)] hover:shadow-lg hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-t before:from-white/0 before:to-white/10 before:pointer-events-none",
        premium: "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:from-primary/90 hover:to-primary/70",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-10 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
