import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-card text-foreground file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:border-destructive disabled:bg-muted h-13 w-full min-w-0 rounded-sm border-2 px-3.5 text-[1.1875rem] transition-colors file:inline-flex file:h-8 file:border-0 file:bg-transparent file:font-semibold disabled:cursor-not-allowed aria-invalid:border-3 aria-invalid:px-[13px]",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
