import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mela The Winter Arc",
  description: "A minimal, premium 45-day movement arc."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
