import React from 'react';
import { MODULES_PAGE_CONFIG } from '@/lib/config';
import Footer from '@/components/Footer';
import { getFooterConfig } from '@/lib/content';

export default async function ModulesPage() {
  const footerConfig = await getFooterConfig();
  const { hero, categories } = MODULES_PAGE_CONFIG;

  return (
    <div className="space-y-24 py-12 lg:py-24 px-6 lg:px-0">
      {/* Hero Section */}
      <section className="space-y-8 max-w-3xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-primary tracking-[0.3em] uppercase">
              {hero.eyebrow}
            </span>
            <div className="h-[1px] w-12 bg-primary/30" />
          </div>
          <h1 className="text-5xl lg:text-7xl font-headline font-black text-white leading-[0.9] tracking-tighter uppercase">
            {hero.title}
          </h1>
          <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Module Categories */}
      <div className="space-y-32">
        {categories.map((category) => (
          <section key={category.id} id={category.id} className="space-y-12 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-white/5 pb-12">
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-wider">
                    {category.title}
                  </h2>
                  <div className="px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20">
                    <span className="text-[10px] font-mono text-primary font-bold">
                      CAT_{category.id.toUpperCase().slice(0, 3)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="lg:col-span-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.modules.map((module) => (
                    <div 
                      key={module.id}
                      className="group p-6 bg-surface-container-low hover:bg-surface-container-high transition-all duration-500 rounded-sm relative overflow-hidden"
                    >
                      {/* Background Accents (Kinetic Feel) */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/10 transition-colors" />
                      
                      <div className="relative z-10 flex flex-col h-full space-y-6">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-on-surface-variant/40 tracking-[0.2em]">
                            MOD::{module.tag}
                          </span>
                          <span className="text-[10px] font-mono text-primary/60">
                            {module.progress}%
                          </span>
                        </div>

                        <h3 className="text-xl font-headline font-bold text-white group-hover:text-primary transition-colors pr-8 leading-tight">
                          {module.title}
                        </h3>

                        <div className="mt-auto pt-4 space-y-3">
                          {/* Progress Bar (Minimalist) */}
                          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all duration-1000 ease-out"
                              style={{ width: `${module.progress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <button className="text-[10px] font-black text-white hover:text-primary tracking-widest uppercase flex items-center gap-2 group/btn">
                              {module.progress === 100 ? 'Review Module' : module.progress > 0 ? 'Resume' : 'Begin Access'}
                              <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Footer config={footerConfig} />
    </div>
  );
}
