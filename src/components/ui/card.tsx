import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const cardVariants = cva(
  [
    "rounded-xl border bg-card text-card-foreground",
    "transition-all duration-300 ease-out",
    "relative overflow-hidden",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "border-border/50",
          "shadow-sm",
          "hover:shadow-md hover:border-border/70",
          "bg-card/98 backdrop-blur-sm",
        ].join(" "),
        elevated: [
          "border-border/40",
          "shadow-md",
          "hover:shadow-lg hover:border-border/60 hover:-translate-y-0.5",
          "bg-card backdrop-blur-sm",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/[0.03] before:to-transparent before:pointer-events-none",
        ].join(" "),
        flat: [
          "border-border/30",
          "shadow-none",
          "bg-card/80",
        ].join(" "),
        interactive: [
          "border-border/50",
          "shadow-sm",
          "hover:shadow-lg hover:border-primary/30 hover:-translate-y-1",
          "bg-card backdrop-blur-sm cursor-pointer",
          "active:scale-[0.99]",
        ].join(" "),
        ghost: [
          "border-transparent",
          "shadow-none",
          "bg-transparent",
        ].join(" "),
      },
      size: {
        default: "",
        sm: "rounded-lg",
        lg: "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-5", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-base sm:text-lg font-semibold leading-tight tracking-tight text-foreground",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 sm:p-5 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 sm:p-5 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
