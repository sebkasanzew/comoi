export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <main className="max-w-md mx-auto min-h-screen bg-background">{children}</main>;
}
