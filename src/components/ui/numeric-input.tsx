import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number;
  onChange: (value: string) => void;
  allowNegative?: boolean;
  allowDecimal?: boolean;
}

const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ className, value, onChange, allowNegative = false, allowDecimal = true, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      
      // Allow empty string for clearing
      if (inputValue === "") {
        onChange("");
        return;
      }
      
      // Build regex based on options
      let pattern = allowNegative ? "^-?" : "^";
      pattern += allowDecimal ? "\\d*\\.?\\d*$" : "\\d*$";
      const regex = new RegExp(pattern);
      
      if (regex.test(inputValue)) {
        onChange(inputValue);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        className={cn(className)}
        value={value}
        onChange={handleChange}
        {...props}
      />
    );
  }
);

NumericInput.displayName = "NumericInput";

export { NumericInput };
