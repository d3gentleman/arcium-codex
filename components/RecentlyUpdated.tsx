import Link from 'next/link';
import { KnowledgeArticleRecord } from '../types/domain';
import { getKnowledgeArticlePath } from '@/lib/content';

export default function RecentlyUpdated({ articles }: { articles: KnowledgeArticleRecord[] }) {
  return (
    <section className="space-y-8">
      <div className="flex items-center gap-4">
        <h3 className="text-xl font-headline font-bold uppercase tracking-widest text-white">Latest Updates</h3>
        <div className="h-[1px] flex-1 bg-outline-variant/20" />
      </div>

      <div className="flex flex-col">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={getKnowledgeArticlePath(article.slug)}
            className="flex justify-between items-center py-6 px-4 bg-surface-container-low/40 hover:bg-surface-container transition-all group border-b border-outline-variant/5 last:border-0"
          >
            <div className="flex items-center gap-6">
              <span className="text-[10px] text-primary font-mono tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">
                {article.tag}
              </span>
              <span className="text-md font-headline font-bold uppercase text-on-surface-variant group-hover:text-white transition-colors">
                {article.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-on-surface-variant/40">{article.date || 'LATEST'}</span>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
