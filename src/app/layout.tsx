import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Football 5 A Side | Elite Booking & League Management",
  description: "The ultimate 5-a-side booking platform. Book matches, track stats, and join the local league elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
