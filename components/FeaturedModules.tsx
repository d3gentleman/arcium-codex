'use client';

import React from 'react';

const MODULES = [
  {
    id: '01',
    title: 'Core Cryptography',
    description: 'Fundamental cryptographic primitives powering the Arcium consensus mechanism.',
    tag: 'PRIVACY_CORE'
  },
  {
    id: '02',
    title: 'Node Architecture',
    description: 'Structural blueprint of validator and observer nodes.',
    tag: 'SYSTEM_BLU'
  },
  {
    id: '03',
    title: 'Network Governance',
    description: 'Proposal lifecycle and voting mechanics within the decentralized autonomous structure.',
    tag: 'COORDINATION'
  },
  {
    id: '04',
    title: 'State Synchronization',
    description: 'Mechanisms for maintaining global state consistency across distributed shards.',
    tag: 'SHARD_SYNC'
  }
];

export default function FeaturedModules() {
  return (
    <section className="py-24 border-t border-outline-variant/10">
      <div className="flex items-center gap-6 mb-16">
        <h2 className="text-3xl font-headline font-bold uppercase tracking-widest text-white">
          Featured Modules
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MODULES.map((module) => (
          <div 
            key={module.id}
            className="group relative p-8 bg-surface-container-low hover:bg-surface-container-high transition-all duration-500 overflow-hidden"
          >
            {/* Visual background element */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-primary/5 group-hover:border-primary/20 transition-colors" />
            
            <div className="relative z-10 flex gap-8 items-start">
              <span className="text-4xl font-headline font-bold text-primary/20 group-hover:text-primary transition-colors">
                {module.id}
              </span>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-primary/10 text-[9px] font-mono text-primary uppercase tracking-tighter">
                    {module.tag}
                  </span>
                  <h3 className="text-xl font-headline font-bold text-white group-hover:translate-x-1 transition-transform">
                    {module.title}
                  </h3>
                </div>
                
                <p className="text-on-surface-variant leading-relaxed text-sm max-w-sm">
                  {module.description}
                </p>

                <div className="pt-4 flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 transition-all">
                  <span className="text-[10px] font-mono tracking-widest uppercase">Inspect Module</span>
                  <span className="text-sm">→</span>
                </div>
              </div>
            </div>

            {/* Bottom highlight bar */}
            <div className="absolute bottom-0 left-0 w-1 group-hover:w-full h-0.5 bg-primary transition-all duration-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
