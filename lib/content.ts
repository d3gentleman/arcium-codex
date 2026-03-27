import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { 
  KnowledgeCategoryRecord, 
  KnowledgeArticleRecord, 
  GlossaryTermRecord,
  EcosystemProjectRecord,
  NavigationLink,
  FooterConfig,
  UIConfig
} from '../types/domain';
import { CATEGORY_COLORS, NAVIGATION_CONFIG, FOOTER_CONFIG, UI_STRINGS } from './config';

const reader = createReader(process.cwd(), keystaticConfig);

// --- CATEGORIES ---

export async function getKnowledgeCategories(): Promise<KnowledgeCategoryRecord[]> {
  const categories = await reader.collections.knowledgeCategories.all();
  return categories.map(cat => ({
    ...cat.entry,
    slug: cat.slug,
  })) as KnowledgeCategoryRecord[];
}

export async function getKnowledgeCategoryBySlug(slug: string): Promise<KnowledgeCategoryRecord | null> {
  const category = await reader.collections.knowledgeCategories.read(slug);
  if (!category) return null;
  return { ...category, slug };
}

export async function getKnowledgeCategoryById(id: string): Promise<KnowledgeCategoryRecord | null> {
  const categories = await getKnowledgeCategories();
  return categories.find(c => c.id === id) || null;
}

// --- ARTICLES ---

export async function getKnowledgeArticles(): Promise<KnowledgeArticleRecord[]> {
  const articles = await reader.collections.knowledgeArticles.all();
  return articles.map(art => ({
    ...art.entry,
    slug: art.slug,
  })) as KnowledgeArticleRecord[];
}

export async function getKnowledgeArticleBySlug(slug: string): Promise<KnowledgeArticleRecord | null> {
  const article = await reader.collections.knowledgeArticles.read(slug);
  if (!article) return null;
  return { ...article, slug };
}

export async function getKnowledgeArticlesByCategoryId(categoryId: string | undefined): Promise<KnowledgeArticleRecord[]> {
  if (!categoryId) return [];
  const articles = await getKnowledgeArticles();
  const category = await getKnowledgeCategoryBySlug(categoryId) || await getKnowledgeCategoryById(categoryId);
  
  return articles.filter((article) => 
    article.relatedCategoryId === categoryId || 
    (category && article.relatedCategoryId === category.id) ||
    (category && article.relatedCategoryId === category.slug)
  );
}

// --- GLOSSARY ---

export async function getGlossaryTerms(): Promise<GlossaryTermRecord[]> {
  const terms = await reader.collections.glossaryTerms.all();
  return terms.map(t => ({
    ...t.entry,
    slug: t.slug,
  })) as GlossaryTermRecord[];
}

export async function getGlossaryTermBySlug(slug: string): Promise<GlossaryTermRecord | null> {
  const term = await reader.collections.glossaryTerms.read(slug);
  if (!term) return null;
  return { ...term, slug };
}

// --- ECOSYSTEM ---

export async function getEcosystemProjects(): Promise<EcosystemProjectRecord[]> {
  const projects = await reader.collections.ecosystemProjects.all();
  return projects.map(p => ({
    ...p.entry,
    slug: p.slug,
  })) as EcosystemProjectRecord[];
}

export async function getEcosystemProjectBySlug(slug: string): Promise<EcosystemProjectRecord | null> {
  const project = await reader.collections.ecosystemProjects.read(slug);
  if (!project) return null;
  return { ...project, slug };
}

// --- AGGREGATORS & SEARCH ---

export async function getDiscoveryIndex() {
  const [categories, articles, terms, projects] = await Promise.all([
    getKnowledgeCategories(),
    getKnowledgeArticles(),
    getGlossaryTerms(),
    getEcosystemProjects()
  ]);

  return [
    ...categories.map(c => ({ id: c.id, slug: c.slug, title: c.title, type: 'category' as const, group: 'Knowledge Areas' })),
    ...articles.map(a => ({ id: a.id, slug: a.slug, title: a.title, type: 'article' as const, group: 'Guides & Articles' })),
    ...terms.map(t => ({ id: t.id, slug: t.slug, title: t.term, type: 'glossary' as const, group: 'Glossary Terms' })),
    ...projects.map(p => ({ id: p.id, slug: p.slug, title: p.title, type: 'project' as const, group: 'Builders' }))
  ];
}

// --- CONFIG & UI ---

export async function getNavigation(): Promise<NavigationLink[]> {
  return NAVIGATION_CONFIG;
}

export async function getFooterConfig(): Promise<FooterConfig> {
  return FOOTER_CONFIG;
}

export async function getUIConfig(): Promise<UIConfig> {
  return UI_STRINGS;
}

export async function getCategoryColors(): Promise<Record<string, string>> {
  return CATEGORY_COLORS;
}

export async function getHomepageConfig() {
  return HOMEPAGE_CONFIG;
}

export async function getRecentArticles(count: number = 3): Promise<KnowledgeArticleRecord[]> {
  const articles = await getKnowledgeArticles();
  return articles.slice(0, count);
}
