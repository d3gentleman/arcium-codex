"use client";

import { Bell, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useDiscovery } from "@/components/DiscoveryShell";

interface ProfileConsoleHeaderProps {
  userLabel: string;
  userInitials: string;
}

export default function ProfileConsoleHeader({ userLabel, userInitials }: ProfileConsoleHeaderProps) {
  const { toggleDiscovery } = useDiscovery();

  return (
    <div className="console-window col-span-12 overflow-hidden">
      <div className="console-header px-4 py-2">
        <span className="font-mono text-[10px] text-on-surface-variant">SYSTEM_ROOT/HUB</span>
        <span className="font-mono text-[10px] text-primary">LIVE_FEED</span>
      </div>
      <div className="flex flex-col gap-4 border-t border-outline-variant/15 bg-black/35 p-4 md:flex-row md:items-center md:justify-between md:gap-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
          ARCIUM_CONSOLE_V1.0
        </div>
        <div className="flex flex-1 items-center justify-center md:max-w-xl">
          <button
            type="button"
            onClick={(e) => toggleDiscovery(e.currentTarget)}
            className="group flex w-full items-center gap-3 border border-outline-variant/35 bg-[#05070a] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-outline transition-colors hover:border-primary/35 hover:text-primary"
          >
            <Search size={14} className="shrink-0 text-primary/80 group-hover:text-primary" />
            <span className="flex-1 text-left">SEARCH_TERMINAL</span>
            <kbd className="hidden rounded border border-outline-variant/30 bg-black/40 px-1.5 py-0.5 text-[9px] text-on-surface-variant sm:inline-block">
              CTRL_K
            </kbd>
          </button>
        </div>
        <div className="flex items-center justify-center gap-4 md:justify-end">
          <button
            type="button"
            className="text-on-surface-variant transition-colors hover:text-primary"
            title="Alerts"
            aria-label="Alerts"
          >
            <Bell size={18} />
          </button>
          <Link
            href="/modules"
            className="text-on-surface-variant transition-colors hover:text-primary"
            title="Curriculum settings"
            aria-label="Go to curriculum"
          >
            <Settings size={18} />
          </Link>
          <div
            className="flex h-10 w-10 items-center justify-center border border-primary/35 bg-primary/10 font-mono text-xs font-black uppercase text-primary"
            title={userLabel}
          >
            {userInitials}
          </div>
        </div>
      </div>
    </div>
  );
}
