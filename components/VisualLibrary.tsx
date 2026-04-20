'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const VISUALS = [
  {
    title: 'Consensus Topology',
    type: '2D Diagram • Interactive',
    description: 'Visualization of the multi-party computation nodes and their communication layers.',
    icon: '⬢'
  },
  {
    title: 'Block Propagation',
    type: 'Animation Sequence',
    description: 'Real-time simulation of encrypted state fragments moving through the validator grid.',
    icon: '◈'
  },
  {
    title: 'Time-Lock Encryption',
    type: 'Schematic Blueprint',
    description: 'Technical breakdown of the temporal commitment schemes used in secure execution.',
    icon: '✦'
  }
];

export default function VisualLibrary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        gsap.fromTo(item, 
          { 
            opacity: 0, 
            y: 50,
            clipPath: 'inset(100% 0% 0% 0%)'
          },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            },
            delay: index * 0.1
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 border-t border-outline-variant/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div>
          <h2 className="text-3xl font-headline font-bold uppercase tracking-[0.2em] text-white underline decoration-primary decoration-4 underline-offset-8">
            The Visual Library
          </h2>
          <p className="text-on-surface-variant mt-6 max-w-md font-body">
            interactive technical blueprints for exploring the Arcium network architecture.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-primary bg-primary/5 px-4 py-2 border border-primary/20">
          <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
          RENDERING_ENGINE_STABLE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {VISUALS.map((visual, idx) => (
          <div 
            key={idx}
            ref={el => { itemsRef.current[idx] = el; }}
            className="flex flex-col group cursor-pointer"
          >
            <div className="aspect-video bg-surface-container-low mb-6 relative overflow-hidden flex items-center justify-center border border-outline-variant/10 group-hover:border-primary/40 transition-colors">
              <div className="text-6xl text-primary/10 group-hover:text-primary/30 transition-all group-hover:scale-110">
                {visual.icon}
              </div>
              
              {/* Decorative technical lines */}
              <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-outline-variant/20" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-outline-variant/20" />
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-headline font-bold text-white group-hover:text-primary transition-colors">
                  {visual.title}
                </h3>
                <span className="text-[10px] font-mono text-secondary">
                  {visual.type}
                </span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed font-body">
                {visual.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
