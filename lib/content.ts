import { 
  DiscoveryItem,
  GlossaryTermRecord,
  MapNodeDefinition, 
  MapEdgeDefinition, 
  MapCategory, 
  KnowledgeArticleRecord,
  KnowledgeCategoryRecord,
  ArticleReference, 
  HomepageBlocks, 
  LinkAction, 
  FooterConfig, 
  UIConfig, 
  SceneConfig 
} from '../types/domain';

import { nodes, edges, categories as mapCategories } from '../data/ecosystem-content';
import { sceneConfig } from '../data/scene-config';
import { homepageBlocks, footerConfig, uiStrings, navLinks, recentArticles } from '../data/home';
import { getGlossaryTermPath, glossaryTermRecords } from '../data/glossary-content';
import {
  getKnowledgeArticlePath,
  getKnowledgeCategoryPath,
  knowledgeArticleRecords,
  knowledgeCategoryRecords,
} from '../data/knowledge-content';

function collectSearchTerms(values: Array<string | undefined>): string[] {
  return Array.from(
    new Set(
      values
        .flatMap((value) => (value || '').split(/[\s,/]+/))
        .map((value) => value.trim())
        .filter(Boolean)
    )
  );
}

export function getMapNodes(): MapNodeDefinition[] {
  return nodes;
}

export function getMapEdges(): MapEdgeDefinition[] {
  return edges;
}

export function getMapCategories(): MapCategory[] {
  return mapCategories;
}

export function getRecentArticles(): ArticleReference[] {
  return recentArticles;
}

export function getHomepageBlocks(): HomepageBlocks {
  return homepageBlocks;
}

export function getNavigation(): LinkAction[] {
  return navLinks;
}

export function getFooterConfig(): FooterConfig {
  return footerConfig;
}

export function getUIConfig(): UIConfig {
  return uiStrings;
}

export function getMapSceneLayout(): SceneConfig {
  return sceneConfig;
}

export function getKnowledgeCategories(): KnowledgeCategoryRecord[] {
  return knowledgeCategoryRecords;
}

export function getKnowledgeCategoryById(id: string): KnowledgeCategoryRecord | undefined {
  return knowledgeCategoryRecords.find((category) => category.id === id);
}

export function getKnowledgeCategoryBySlug(slug: string): KnowledgeCategoryRecord | undefined {
  return knowledgeCategoryRecords.find((category) => category.slug === slug);
}

export function getKnowledgeArticles(): KnowledgeArticleRecord[] {
  return knowledgeArticleRecords;
}

export function getKnowledgeArticleById(id: string): KnowledgeArticleRecord | undefined {
  return knowledgeArticleRecords.find((article) => article.id === id);
}

export function getKnowledgeArticleBySlug(slug: string): KnowledgeArticleRecord | undefined {
  return knowledgeArticleRecords.find((article) => article.slug === slug);
}

export function getKnowledgeArticlesByCategoryId(categoryId: string): KnowledgeArticleRecord[] {
  return knowledgeArticleRecords.filter((article) => article.relatedCategoryId === categoryId);
}

export function getGlossaryTerms(): GlossaryTermRecord[] {
  return glossaryTermRecords;
}

export function getGlossaryTermBySlug(slug: string): GlossaryTermRecord | undefined {
  return glossaryTermRecords.find((term) => term.slug === slug);
}

export function getDiscoveryIndex(): DiscoveryItem[] {
  const categoryNameById = new Map(mapCategories.map((category) => [category.id, category.name]));

  const normalizedCategories = knowledgeCategoryRecords.map<DiscoveryItem>((category) => ({
    id: category.id,
    kind: 'category',
    title: category.title,
    tag: category.tag,
    eyebrow: category.group === 'ecosystem' ? 'ECOSYSTEM GUIDE' : 'KNOWLEDGE AREA',
    summary: category.summary,
    keywords: collectSearchTerms([
      category.title,
      category.slug,
      category.tag,
      category.prefix,
      category.summary,
      category.description,
      category.group,
      ...(category.relatedNodeIds || []),
    ]),
    href: getKnowledgeCategoryPath(category.slug),
    priority: 'high',
  }));

  const normalizedArticles = knowledgeArticleRecords.map<DiscoveryItem>((article) => {
    const relatedCategory = article.relatedCategoryId
      ? knowledgeCategoryRecords.find((category) => category.id === article.relatedCategoryId)
      : undefined;

    return {
      id: article.id,
      kind: 'article',
      title: article.title,
      tag: article.tag,
      eyebrow: article.kind === 'guide' ? 'DEVELOPER GUIDE' : 'REFERENCE ARTICLE',
      summary: article.summary,
      keywords: collectSearchTerms([
        article.title,
        article.slug,
        article.tag,
        article.kind,
        article.summary,
        relatedCategory?.title,
        relatedCategory?.tag,
        ...(article.relatedNodeIds || []),
      ]),
      href: getKnowledgeArticlePath(article.slug),
      priority: article.kind === 'guide' ? 'high' : 'medium',
    };
  });

  const normalizedGlossary = glossaryTermRecords.map<DiscoveryItem>((term) => ({
    id: term.id,
    kind: 'glossary',
    title: term.term,
    tag: term.tag,
    eyebrow: 'GLOSSARY TERM',
    summary: term.summary,
    keywords: collectSearchTerms([
      term.term,
      term.slug,
      term.tag,
      term.summary,
      ...term.aliases,
      ...term.keywords,
    ]),
    href: getGlossaryTermPath(term.slug),
    priority: term.priority,
  }));

  const normalizedNodes = nodes
    .filter((node) => node.kind !== 'category')
    .map<DiscoveryItem>((node) => ({
      id: node.id,
      kind: node.kind,
      title: node.label,
      tag: node.tag,
      eyebrow: node.kind === 'core'
        ? 'PRIVATE COMPUTATION NETWORK'
        : `BUILDER // ${categoryNameById.get(node.categoryId || '') || 'ECOSYSTEM'}`,
      summary: node.beginnerDescription,
      keywords: collectSearchTerms([
        node.label,
        node.technicalLabel,
        node.compactLabel,
        node.tag,
        node.beginnerDescription,
        node.technicalDescription,
        node.whyItMatters,
        categoryNameById.get(node.categoryId || ''),
      ]),
      href: `/map?focus=${node.id}`,
      priority: node.priority,
      secondaryAction: node.action,
      featured: node.featuredOnOverview,
    }));

  return [
    ...normalizedCategories,
    ...normalizedArticles,
    ...normalizedGlossary,
    ...normalizedNodes,
  ];
}
