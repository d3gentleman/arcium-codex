import Link from "next/link";
import type { ReactNode } from "react";

interface AuthShellProps {
  title: string;
  eyebrow: string;
  subtitle: string;
  children?: ReactNode;
}

export default function AuthShell({ title, eyebrow, subtitle, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 py-16 font-jetbrains">
      <div className="w-full max-w-md border border-outline-variant/30 bg-surface-container-high/40 p-8 shadow-[8px_8px_0px_rgba(0,0,0,0.5)]">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
            {eyebrow}
          </div>
          <h1 className="mb-2 font-space text-3xl font-black uppercase tracking-tight text-white">{title}</h1>
          <p className="text-sm uppercase tracking-widest text-on-surface-variant/60">{subtitle}</p>
        </div>
        {children}
        <div className="mt-8 border-t border-outline-variant/20 pt-4 text-center text-[10px] uppercase tracking-[0.18em] text-on-surface-variant/50">
          <Link href="/" className="transition-colors hover:text-primary">
            Return to Academy
          </Link>
        </div>
      </div>
      <div className="pointer-events-none fixed inset-0 z-[100] opacity-20 scanline-effect" />
    </div>
  );
}
