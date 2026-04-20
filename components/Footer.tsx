import ActionLink from './ActionLink';
import { FooterConfig } from '../types/domain';

export default function Footer({ config }: { config: FooterConfig }) {
  return (
    <footer className="py-24 border-t border-outline-variant/10 flex flex-col items-center">
      <div className="text-3xl font-headline font-bold text-white mb-2 tracking-tighter uppercase">
        ARCIUM <span className="text-primary">CODEX</span>
      </div>
      <div className="text-[10px] font-mono text-on-surface-variant/40 tracking-[0.4em] mb-12 uppercase">
        THE_KINETIC_BLUEPRINT
      </div>

      <div className="flex flex-wrap justify-center gap-12 text-[10px] uppercase font-headline font-bold text-on-surface-variant mb-12 tracking-[0.2em]">
        {config.links.map((link, idx) => (
          <ActionLink
            key={idx}
            action={link}
            className="hover:text-primary transition-colors"
            unavailableClassName="cursor-not-allowed opacity-30"
          >
            {link.label}
          </ActionLink>
        ))}
      </div>

      <div className="space-y-4 text-center">
        <div className="text-[9px] text-on-surface-variant/40 uppercase leading-loose font-mono tracking-widest">
          {config.metadata.copyright} • {config.metadata.coords}
        </div>
        <div className="inline-block px-4 py-1 bg-primary/5 border border-primary/10 text-[9px] font-mono text-primary/60 uppercase tracking-tighter">
          {config.metadata.mission}
        </div>
      </div>
    </footer>
  );
}
