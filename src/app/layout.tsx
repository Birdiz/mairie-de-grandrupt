import type { ReactNode } from "react";

// Intentionally minimal — <html> and <body> are provided by [locale]/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
