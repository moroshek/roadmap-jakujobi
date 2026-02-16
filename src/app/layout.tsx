import type { Metadata } from "next";
import "./globals.css";
import { AppHeader } from "@/components/layout/AppHeader";

export const metadata: Metadata = {
  title: "Roadmap Engine - Strategic Portfolio Management",
  description:
    "Enterprise roadmap visualization and portfolio governance platform",
  keywords: ["roadmap", "portfolio management", "strategy matrix", "gantt chart"],
  openGraph: {
    title: "Roadmap Engine",
    description: "Strategic Portfolio Management Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
