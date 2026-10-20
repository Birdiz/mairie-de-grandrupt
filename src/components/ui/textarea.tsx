import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-ring aria-invalid:border-destructive disabled:bg-muted flex field-sizing-content min-h-32 w-full rounded-sm border-2 px-3.5 py-3 text-[1.1875rem] leading-relaxed transition-colors disabled:cursor-not-allowed aria-invalid:border-3 aria-invalid:px-[13px]",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
