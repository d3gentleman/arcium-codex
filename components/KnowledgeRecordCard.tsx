import ActionLink from './ActionLink';
import { LinkAction } from '../types/domain';

interface KnowledgeRecordCardProps {
  action: LinkAction;
  tag: string;
  title: string;
  summary: string;
  meta?: string;
  eyebrow?: string;
}

export default function KnowledgeRecordCard({
  action,
  tag,
  title,
  summary,
  meta,
  eyebrow,
}: KnowledgeRecordCardProps) {
  return (
    <ActionLink
      action={action}
      className="group block h-full bg-surface-container-low/40 p-8 transition-all hover:bg-surface-container-high relative overflow-hidden"
      unavailableClassName="group block h-full bg-surface-container-low/20 p-8 opacity-40 cursor-not-allowed"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-300" />
      
      <article className="flex h-full flex-col gap-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {eyebrow ? (
              <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-secondary">{eyebrow}</div>
            ) : null}
            <div className="text-[10px] font-mono text-on-surface-variant/40 tracking-widest">{tag}</div>
          </div>
          {meta ? (
            <div className="px-2 py-0.5 bg-primary/10 text-[9px] font-mono text-primary uppercase tracking-tighter">
              {meta}
            </div>
          ) : null}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-headline font-bold uppercase leading-tight text-white transition-colors group-hover:text-primary">
            {title}
          </h2>
          <p className="text-sm leading-relaxed text-on-surface-variant font-body">{summary}</p>
        </div>
        
        <div className="mt-auto pt-6 flex items-center gap-3 text-[10px] font-headline font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
          <span>{action.label}</span>
          <span>→</span>
        </div>
      </article>
    </ActionLink>
  );
}
