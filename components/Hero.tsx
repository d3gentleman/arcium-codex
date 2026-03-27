import ActionLink from './ActionLink';

interface HeroProps {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: any;
    secondaryCta: any;
  };
  quickLinks: any[];
  liveStatusFeed: any[];
  ui: any;
}

export default function Hero({ hero, quickLinks, liveStatusFeed, ui }: HeroProps) {
  return (
    <section className="col-span-12 lg:col-span-12 mb-12 relative overflow-hidden bg-surface-container-low/30 border border-outline-variant/20 p-8 md:p-12 shadow-[12px_12px_0px_rgba(0,0,0,0.4)]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 space-y-8">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-1 w-1 bg-primary animate-pulse" />
              {hero.subtitle}
            </div>
            <h1 className="font-space text-5xl font-black uppercase tracking-tight text-white md:text-7xl leading-[0.9]">
              {hero.titleLine1}<br />
              <span className="text-primary">{hero.titleLine2}</span>
            </h1>
          </div>

          <p className="max-w-xl font-jetbrains text-lg leading-relaxed text-on-surface-variant/80">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <ActionLink action={hero.primaryCta} className="bg-primary text-black px-8 py-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors" />
            <ActionLink action={hero.secondaryCta} className="border border-outline-variant/30 text-white px-8 py-3 font-bold uppercase tracking-[0.2em] text-xs hover:bg-surface-container-high transition-colors" />
          </div>
        </div>

        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="border border-outline-variant/20 bg-black/40 p-6 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 border-b border-outline-variant/20 pb-2">
              System_Status:
            </h3>
            <div className="space-y-3">
              {liveStatusFeed.map((item, i) => (
                <div key={i} className="flex items-center justify-between font-mono text-[10px]">
                  <span className="text-on-surface-variant/60 uppercase">{item.text}</span>
                  <span className="text-primary">[{item.status}]</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-outline-variant/20 bg-black/40 p-6 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 border-b border-outline-variant/20 pb-2">
              Quick_Access:
            </h3>
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, i) => (
                <ActionLink 
                  key={i} 
                  action={link} 
                  className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant/80 hover:text-primary transition-colors flex items-center justify-between"
                >
                  <span className="pointer-events-none">_</span>
                </ActionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
