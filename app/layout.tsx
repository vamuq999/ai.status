import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIStatus",
  description: "Gamified mission tracking with live AI status updates."
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