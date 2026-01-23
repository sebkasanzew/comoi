import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comoi Vendor Dashboard",
  description: "Manage your mini-market on Comoi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
