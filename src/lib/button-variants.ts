import { cva } from "class-variance-authority";

// Charte v2 : boutons de 52 px (cible ≥ 44 px), texte 19 px. Le survol ajoute un
// soulignement en plus du changement de fond ; le focus est l'anneau marine global.
export const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border-2 border-transparent font-semibold whitespace-nowrap no-underline underline-offset-4 transition-colors select-none hover:underline disabled:pointer-events-none disabled:border-dashed disabled:border-[#8a93a3] disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline: "border-secondary-foreground bg-card text-secondary-foreground hover:bg-secondary",
        secondary:
          "border-secondary-foreground bg-card text-secondary-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-muted",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        link: "text-primary underline decoration-[1.5px] hover:decoration-[3px]",
      },
      size: {
        default: "min-h-13 gap-2.5 px-6 text-[1.1875rem]",
        xs: "min-h-11 gap-1.5 px-3 text-base",
        sm: "min-h-11 gap-2 px-4 text-[1.0625rem]",
        lg: "min-h-13 gap-2.5 px-7 text-[1.1875rem]",
        icon: "size-11",
        "icon-xs": "size-11",
        "icon-sm": "size-11",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
