import { requireStaffSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireStaffSession();
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-arcium-blue/30 selection:text-white">
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-8">
          <span className="font-bold text-xl tracking-tighter text-arcium-blue">ARCIUM // STAFF</span>
          <nav className="flex gap-6 text-sm text-white/70">
            <Link href="/staff/modules" className="hover:text-white transition-colors">Modules</Link>
            <Link href="/staff/modules/new" className="hover:text-white transition-colors">New Module</Link>
            <Link href="/" className="hover:text-white transition-colors">Exit to App</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
