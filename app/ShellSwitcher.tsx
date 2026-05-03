'use client';

import { usePathname } from 'next/navigation';
import DiscoveryShell from '@/components/DiscoveryShell';
import CodexSidebar from '@/components/CodexSidebar';
import TopAccountBar from '@/components/TopAccountBar';
import { DiscoveryItem, UIConfig, NavigationLink } from '@/types/domain';

interface ShellSwitcherProps {
  children: React.ReactNode;
  discoveryItems: DiscoveryItem[];
  navLinks: NavigationLink[];
  ui: UIConfig;
}

/**
 * ShellSwitcher conditionally renders the DiscoveryShell based on the current path.
 * This prevents the global academy UI (grid, scanlines, discovery) from interfering
 * with the Keystatic Admin dashboard and login pages.
 */
export default function ShellSwitcher({ children, discoveryItems, navLinks, ui }: ShellSwitcherProps) {
  const pathname = usePathname();
  
  // Define paths that should NOT have the global DiscoveryShell
  const isAdminPath =
    pathname.startsWith('/keystatic') ||
    pathname.startsWith('/staff') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <DiscoveryShell items={discoveryItems} ui={ui}>
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
      <div className="absolute inset-0 scanline-effect z-40 pointer-events-none opacity-20" />
      
      <CodexSidebar links={navLinks} />

      <div className="flex-1 w-full relative z-10 lg:pl-72">
        <TopAccountBar />
        <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 lg:px-8">
          <main className="col-span-12 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </DiscoveryShell>
  );
}
