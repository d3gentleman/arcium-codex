import type { Metadata } from 'next';
import GlossaryExplorer from '@/components/GlossaryExplorer';
import KnowledgePageFrame from '@/components/KnowledgePageFrame';
import { getKnowledgeCategoryPath } from '@/data/knowledge-content';
import { getGlossaryTerms, getKnowledgeCategories, getMapNodes } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Glossary | ARCIUM ATLAS',
  description: 'An A-Z reference for Arcium terms, with local summaries and source links back to the official docs.',
};

export default function GlossaryPage() {
  const terms = getGlossaryTerms();
  const categories = getKnowledgeCategories();
  const mapNodes = getMapNodes();

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const nodeById = new Map(mapNodes.map((node) => [node.id, node]));

  const enrichedTerms = terms.map((term) => {
    const relatedCategoryLinks = (term.relatedCategoryIds || [])
      .map((categoryId) => {
        const category = categoryById.get(categoryId);

        if (!category) {
          return null;
        }

        return {
          kind: 'Category' as const,
          label: category.title,
          href: getKnowledgeCategoryPath(category.slug),
        };
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link));

    const relatedNodeLinks = (term.relatedNodeIds || [])
      .map((nodeId) => {
        const node = nodeById.get(nodeId);

        if (!node) {
          return null;
        }

        return {
          kind: 'Map' as const,
          label: node.label,
          href: `/map?focus=${node.id}`,
        };
      })
      .filter((link): link is NonNullable<typeof link> => Boolean(link));

    return {
      ...term,
      relatedLinks: [...relatedCategoryLinks, ...relatedNodeLinks],
    };
  });

  return (
    <KnowledgePageFrame
      eyebrow="GLOSSARY_INDEX"
      title="Arcium Reference Glossary"
      summary="A top-level reference surface for the atlas: browse Arcium terminology alphabetically, search aliases and keywords, and jump from each term into deeper encyclopedia or map context."
      statusLabel="GLOSSARY_LINKED"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Glossary', href: '/glossary' },
      ]}
      meta={
        <>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            TERMS // {terms.length}
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            FILTERS // A-Z + SEARCH
          </div>
          <div className="rounded-[1rem] border border-outline-variant/25 bg-surface-container-lowest/70 px-4 py-3">
            SOURCES // ARCIUM DOCS
          </div>
        </>
      }
    >
      <GlossaryExplorer terms={enrichedTerms} />
    </KnowledgePageFrame>
  );
}
