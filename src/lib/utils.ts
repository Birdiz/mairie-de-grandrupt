import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Les tailles de la charte (text-h1…text-small, définies dans globals.css) sont des tailles
// de texte, pas des couleurs : sans ça, tailwind-merge effacerait « text-primary » à côté.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["h1", "h2", "h3", "h4", "chapo", "body", "small"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
