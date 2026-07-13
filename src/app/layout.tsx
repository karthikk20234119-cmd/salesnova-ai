import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SalesNova AI — AI-Powered Outreach & Sales Operating System",
  description: "Enterprise-grade AI-powered client acquisition platform with live artifacts, CRM workflows, lead intelligence, and team collaboration for agencies and service businesses.",
  keywords: ["AI", "CRM", "outreach", "sales", "lead generation", "automation", "SaaS"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
