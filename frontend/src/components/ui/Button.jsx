import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-slate-900 text-white hover:bg-slate-800": variant === "default",
          "bg-transparent border border-slate-200 hover:bg-slate-100": variant === "outline",
          "bg-transparent hover:bg-slate-100": variant === "ghost",
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3": size === "sm",
          "h-11 px-8": size === "lg"
        },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button }; 