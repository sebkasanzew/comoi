import type { Metadata } from "next";
import { ConvexClientProvider } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Comoi - Grocery Marketplace",
  description: "Find and compare prices from local mini-markets in Vietnam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
