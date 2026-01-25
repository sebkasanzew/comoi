import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Dashboard - Comoi",
  description: "Manage your mini-market on Comoi",
};

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
