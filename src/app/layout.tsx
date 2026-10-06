import type { Metadata } from "next";
import Script from "next/script";
import { MotionConfig } from "framer-motion";

import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], axes: ["opsz"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "nutriBro · Planificador semanal",
  description: "Organiza tu menú semanal y tus recetas en un solo lugar.",
};

const themeScript = `try { const storedTheme = localStorage.getItem("nutribro-theme") ?? localStorage.getItem("nutria-theme"); const preference = storedTheme === "dark" || storedTheme === "light" || storedTheme === "system" ? storedTheme : "system"; const useDarkTheme = preference === "dark" || (preference === "system" && window.matchMedia?.("(prefers-color-scheme: dark)").matches); document.documentElement.dataset.theme = useDarkTheme ? "dark" : "light"; if (storedTheme === "dark" || storedTheme === "light") localStorage.setItem("nutribro-theme", storedTheme); } catch {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn("h-full", "font-sans", inter.variable)} suppressHydrationWarning>
      <body className="min-h-full">
        <Script
          id="nutribro-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <MotionConfig reducedMotion="user">
          <ThemeProvider>{children}</ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
