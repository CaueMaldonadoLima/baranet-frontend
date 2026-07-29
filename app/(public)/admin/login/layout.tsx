import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../../globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Baranet Admin — Login",
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={cn(inter.variable, "font-sans antialiased bg-[#CE4257]")}>
        {children}
      </body>
    </html>
  );
}
