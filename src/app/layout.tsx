import type { Metadata } from "next";
import Script from "next/script";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "nutriBro · Planificador semanal",
  description: "Organiza tu menú semanal y tus recetas en un solo lugar.",
};

const themeScript = `try { const theme = localStorage.getItem("nutribro-theme") ?? localStorage.getItem("nutria-theme"); if (theme === "dark" || theme === "light") { localStorage.setItem("nutribro-theme", theme); document.documentElement.dataset.theme = theme; } } catch {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full" suppressHydrationWarning>
      <body className="min-h-full">
        <Script
          id="nutribro-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
