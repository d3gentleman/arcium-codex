import { ArticleReference, FooterConfig, HomepageBlocks, LinkAction, UIConfig } from '../types/domain';
import {
  getKnowledgeArticlePathById,
  getKnowledgeCategoryPathById,
  knowledgeArticleRecords,
  knowledgeCategoryRecords,
  recentKnowledgeArticleIds,
  startHereGuideIds,
} from './knowledge-content';

export const navLinks: LinkAction[] = [
  { type: 'internal', label: "Map", href: "/map" },
  { type: 'internal', label: "Encyclopedia", href: "/encyclopedia" },
  { type: 'internal', label: "Glossary", href: "/glossary" },
  { type: 'unavailable', label: "Infrastructure", reason: "Infrastructure guides are not published yet." },
  { type: 'unavailable', label: "About", reason: "About page is not published yet." },
];

export const recentArticles: ArticleReference[] = recentKnowledgeArticleIds
  .map((articleId) => knowledgeArticleRecords.find((article) => article.id === articleId))
  .filter((article): article is NonNullable<typeof article> => Boolean(article))
  .map((article) => ({
    id: article.id,
    slug: article.slug,
    tag: article.tag,
    title: article.title,
    date: article.date || 'REFERENCE',
    action: {
      type: 'internal',
      label: 'Read Article',
      href: getKnowledgeArticlePathById(article.id) || '/encyclopedia',
    },
  }));

const startHereMeta: Record<(typeof startHereGuideIds)[number], { prefix: string; tag: string }> = {
  'guide-understanding-arcium': { prefix: 'SYS_A', tag: 'Subsystem_A' },
  'guide-what-are-mxes': { prefix: 'SYS_B', tag: 'Subsystem_B' },
  'guide-ecosystem-overview': { prefix: 'GRID', tag: 'Optimization' },
};

const startHereCards = startHereGuideIds
  .map((articleId) => knowledgeArticleRecords.find((article) => article.id === articleId))
  .filter((article): article is NonNullable<typeof article> => Boolean(article))
  .map((article) => ({
    id: article.id,
    prefix: startHereMeta[article.id as (typeof startHereGuideIds)[number]].prefix,
    tag: startHereMeta[article.id as (typeof startHereGuideIds)[number]].tag,
    title: article.title,
    description: article.summary,
    action: {
      type: 'internal' as const,
      label: article.id === 'guide-ecosystem-overview' ? 'Read Overview' : 'Read Guide',
      href: getKnowledgeArticlePathById(article.id) || '/encyclopedia',
    },
  }));

const homepageKnowledgeCategories = knowledgeCategoryRecords
  .filter((category) => category.group === 'knowledge')
  .map((category) => ({
    id: category.id,
    slug: category.slug,
    tag: category.tag,
    prefix: category.prefix,
    title: category.title,
    description: category.description,
    action: {
      type: 'internal' as const,
      label: 'Open Category',
      href: getKnowledgeCategoryPathById(category.id) || '/encyclopedia',
    },
  }));

export const homepageBlocks: HomepageBlocks = {
  hero: {
    subtitle: "Core Functionality: Exploration",
    titleLine1: "NAVIGATE THE",
    titleLine2: "ECOSYSTEM_ATLAS",
    description: "Explore the builders, guides, and private computation concepts that make the Arcium network legible.",
    primaryCta: { type: 'internal', label: "Launch Atlas Matrix", href: "/map" },
    secondaryCta: { type: 'command', command: 'open-discovery', label: "Search Builders & Guides" }
  },
  startHereCards,
  encyclopediaCategories: homepageKnowledgeCategories,
  quickLinks: [
    { type: 'internal', label: "Open Ecosystem Atlas", href: "/map" },
    { type: 'command', command: 'open-discovery', label: "Search Builders & Docs" },
    { type: 'unavailable', label: "View MPC Node Specs", reason: "Infrastructure specs are not published yet." },
  ],
  liveStatusFeed: [
    { status: "OK", text: "Atlas_Sync: Complete" },
    { status: "OK", text: "MXE_Engines: Active" },
    { status: "OK", text: "MPC_Nodes: 4,092 Online" },
  ]
};

export const footerConfig: FooterConfig = {
  links: [
    { type: 'external', label: "Official Docs", href: "https://docs.arcium.com" },
    { type: 'external', label: "X/Twitter", href: "https://twitter.com/ArciumHQ" },
    { type: 'external', label: "Discord", href: "https://discord.gg/arcium" },
  ],
  metadata: {
    copyright: "(C) 2024 ARCIUM PROTOCOL_GROUP",
    coords: "LAT: 37.7749 // LONG: -122.4194 // CRC_HASH: 0x8842A_V3",
    mission: "--- MISSION_OBJECTIVE: DECENTRALIZE_THE_GRID ---"
  }
};

export const uiStrings: UIConfig = {
  mapPanelHeader: "NODE_DATA",
  mapBeginnerToggle: "Beginner",
  mapTechnicalToggle: "Technical",
  mapClose: "Close Panel",
  mapReadArticle: "Read Full Article →",
  mapSpecTechnical: "Technical_Spec",
  mapSpecOverview: "Overview",
  mapPanelOverviewTitle: "Overview",
  mapPanelWhyItMatters: "Why It Matters",
  mapPanelTechnicalTitle: "Technical Detail",
  mapPanelActionTitle: "Action",
  mapTechnicalHint: "Switch to technical mode to reveal implementation detail, protocol language, and relationship semantics.",
  heroControlEXE: "CONTROL_UNIT.EXE",
  heroArchivistID: "ID: ARCHIVIST_01",
  heroNavShortcuts: "Navigation_Shortcuts",
  heroLiveStatus: "LIVE_STATUS_FEED:",
  heroWaitingQuery: "_WAITING_FOR_QUERY...",
  heroSysTools: "System_Tools:",
  heroGenReport: "Generate_System_Report",
  heroViewport: "VIEWPORT_PRIMARY: ECOSYSTEM_ATLAS",
  heroMode: "MODE: INTERACTIVE_MAPPING",
  heroRenderActive: "REALTIME_RENDER_ACTIVE",
  heroZoom: "ZOOM: 1.0X",
  heroAtlasTerritories: "Territories",
  heroFeaturedSystems: "Featured Systems",
  filterLegendDesc: "ACTIVE_FILTERS",
  filterAllStr: "View All",
  legendHeader: "SYSTEM_LEGEND",
  searchPlaceholder: "Search protocols...",
  mapSearchResults: "Matching Systems",
  mapSearchNoResults: "No systems match this query yet.",
  mapOverviewState: "Atlas Overview",
  mapFocusState: "Focused Territory",
  backToAtlas: "← Back to Hub",
  discoveryOpen: "Open Atlas Search",
  discoveryClose: "Close Search",
  discoverySearchPlaceholder: "Search builders, glossary terms, MXEs, and guides...",
  discoverySearchHint: "CTRL/CMD + K // ESC to close",
  discoveryInitialState: "Search Arcium builders, glossary terms, developer guides, and category pages.",
  discoveryNoResultsTitle: "No atlas records matched this query.",
  discoveryNoResultsBody: "Try a glossary term, builder, MXE topic, or category name.",
  discoveryGroupCore: "Core Network",
  discoveryGroupProjects: "Builders",
  discoveryGroupCategories: "Knowledge Areas",
  discoveryGroupGlossary: "Glossary Terms",
  discoveryGroupArticles: "Guides & Articles",
  discoveryOpenResult: "Open Record",
  discoverySecondaryAction: "Panel Action"
};
