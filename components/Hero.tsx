import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

interface HeroProps {
  hero: {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    primaryCta: LinkAction;
    secondaryCta: LinkAction;
  };
  quickLinks: LinkAction[];
  liveStatusFeed: any[];
}

export default function Hero({ hero, quickLinks, liveStatusFeed }: HeroProps) {
  return (
    <section className="relative overflow-hidden mb-24 px-6 lg:px-0">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="flex-1 space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono tracking-[0.4em] text-secondary uppercase">
                {hero.subtitle}
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-secondary/40 to-transparent" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-headline font-bold leading-[0.85] tracking-tighter text-white uppercase">
              MASTERING
              <span className="block text-primary">INFRASTRUCTURE</span>
            </h1>
          </header>

          <p className="text-xl text-on-surface-variant leading-relaxed max-w-xl font-body">
            {hero.description}
          </p>

          <div className="flex flex-wrap gap-6 pt-4">
            <ActionLink
              action={hero.primaryCta}
              className="px-10 py-5 bg-primary text-surface font-headline font-bold uppercase tracking-widest text-[11px] transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98]"
            >
              PROJECT_DATABASE
            </ActionLink>
            
            <ActionLink
              action={hero.secondaryCta}
              className="px-10 py-5 border border-outline/20 bg-surface-container-high/40 text-on-surface font-headline font-bold uppercase tracking-widest text-[11px] backdrop-blur-sm transition-all hover:bg-surface-container-highest"
            >
              TECHNICAL_SEARCH
            </ActionLink>
          </div>
        </div>

        <div className="w-full lg:w-[400px] space-y-8">
          {/* Terminal Block */}
          <div className="bg-surface-container-lowest p-6 border-l-2 border-primary/40 relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 space-y-4 font-mono text-[10px]">
              <div className="flex justify-between text-on-surface-variant/40 border-b border-outline-variant/10 pb-2">
                <span>SYSTEM_STATUS</span>
                <span>ID: ARCH-01</span>
              </div>
              <div className="space-y-2 text-primary">
                <div className="flex gap-3">
                  <span className="opacity-40">{'>'}</span>
                  <span className="animate-[pulse_2s_infinite]">init_node --type=validator</span>
                </div>
                <div className="flex gap-3">
                  <span className="opacity-40">{'>'}</span>
                  <span>syncing_blocks...</span>
                </div>
                <div className="flex gap-3 justify-between">
                  <span className="opacity-40">PROGRESS:</span>
                  <div className="flex-1 mx-4 bg-outline-variant/20 h-[6px] mt-1 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-primary w-[88%] animate-[pulse_1.5s_infinite]" />
                  </div>
                  <span>88%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-on-surface-variant/40 uppercase">
              Quick_Access_Nodes
            </h3>
            <div className="grid grid-cols-1 gap-1">
              {quickLinks.map((link, i) => (
                <ActionLink
                  key={i}
                  action={link}
                  className="p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors group flex items-center justify-between"
                >
                  <span className="text-[11px] font-headline font-bold uppercase tracking-widest text-on-surface">
                    {link.label}
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                    →
                  </span>
                </ActionLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

