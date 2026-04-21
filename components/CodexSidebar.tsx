'use client';

import React from 'react';
import Link from 'next/link';
import { NavigationLink } from '@/types/domain';
import { usePathname } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

interface CodexSidebarProps {
  links: NavigationLink[];
  version?: string;
}

export default function CodexSidebar({ links, version = "V1.0.4-BETA" }: CodexSidebarProps) {
  const pathname = usePathname();

  // Group links by section
  const sections = links.reduce((acc, link) => {
    const section = link.section || 'OTHER';
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {} as Record<string, NavigationLink[]>);

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-low border-r border-outline-variant/10 z-50 flex flex-col p-6 hidden lg:flex overflow-y-auto shadow-2xl">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 bg-primary rounded-sm" />
          <h2 className="text-sm font-headline font-black text-white tracking-[0.2em] uppercase">
            ARCIUM CODEX
          </h2>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono text-primary/40">
            INDEX::{version}
          </p>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent ml-4" />
        </div>
      </div>

      <nav className="flex-1 space-y-8">
        {Object.entries(sections).map(([sectionName, sectionLinks]) => (
          <div key={sectionName} className="space-y-3">
            <h3 className="text-[9px] font-bold text-on-surface-variant/40 tracking-[0.3em] px-3 uppercase">
              {sectionName}
            </h3>
            <div className="space-y-1">
              {sectionLinks.map((link, idx) => {
                const isActive = 'href' in link ? pathname === link.href : false;
                const isUnavailable = link.type === 'unavailable';
                
                // Dynamically get the icon component
                const IconComponent = link.icon ? (LucideIcons[link.icon as keyof typeof LucideIcons] as React.FC<any>) : null;

                if (isUnavailable) {
                  return (
                    <div 
                      key={idx} 
                      className="group flex items-center gap-3 p-3 opacity-30 cursor-not-allowed grayscale"
                      title={link.reason}
                    >
                      {IconComponent && <IconComponent size={14} className="text-on-surface-variant" />}
                      <div className="flex flex-col">
                        <span className="text-[11px] font-headline font-bold uppercase tracking-widest text-on-surface-variant">
                          {link.label}
                        </span>
                      </div>
                    </div>
                  );
                }

                const content = (
                  <>
                    {IconComponent && (
                      <IconComponent 
                        size={14} 
                        className={`transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'}`} 
                      />
                    )}
                    <span className={`text-[11px] font-headline font-bold uppercase tracking-widest transition-colors ${
                      isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'
                    }`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1 h-1 rounded-full bg-primary animate-pulse" />
                    )}
                  </>
                );

                const commonClasses = `group flex items-center gap-3 p-3 transition-all duration-300 rounded-sm ${
                  isActive 
                    ? 'bg-primary/10 border-l-2 border-primary' 
                    : 'hover:bg-white/5 border-l-2 border-transparent'
                }`;

                if (link.type === 'command') {
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`w-full text-left appearance-none border-0 bg-transparent ${commonClasses}`}
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <Link
                    key={idx}
                    href={'href' in link ? link.href : '#'}
                    target={link.type === 'external' ? '_blank' : undefined}
                    rel={link.type === 'external' ? 'noreferrer noopener' : undefined}
                    className={commonClasses}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t border-outline-variant/10">
        <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-md border border-primary/10">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-primary relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-primary/80 leading-none">SYSTEM_STATUS</span>
            <span className="text-[10px] font-black text-white mt-1">OPERATIONAL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
