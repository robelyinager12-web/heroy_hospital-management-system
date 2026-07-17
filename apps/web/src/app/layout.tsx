import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HEROY Hospital Management System",
  description: "Enterprise-grade hospital management platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
