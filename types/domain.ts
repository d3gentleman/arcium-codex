export type LinkAction = 
  | { type: 'internal'; label: string; href: string; icon?: string; section?: string }
  | { type: 'external'; label: string; href: string; icon?: string; section?: string }
  | { type: 'command'; label: string; command: string; icon?: string; section?: string }
  | { type: 'unavailable'; label: string; reason: string; icon?: string; section?: string };

export type NavigationLink = LinkAction;

export interface FooterConfig {
  links: LinkAction[];
  metadata: {
    copyright: string;
    coords: string;
    mission: string;
  };
}

export interface UIConfig {
  [key: string]: string;
}

export interface VisualAsset {
  type: 'image' | 'diagram' | 'code';
  src?: string;
  alt?: string;
  caption?: string;
  codeSnippet?: string;
  language?: string;
}

export interface BodySection {
  title: string;
  body: string;
  visual?: VisualAsset;
}

export type QuizQuestion =
  | {
      id: string;
      type: "short_text";
      prompt: string;
      required: boolean;
      hint?: string;
      explanation?: string;
      correctAnswer?: string;
      points?: number;
    }
  | {
      id: string;
      type: "long_text";
      prompt: string;
      required: boolean;
      hint?: string;
      explanation?: string;
      correctAnswer?: string;
      points?: number;
      requiresManualGrading?: boolean;
    }
  | {
      id: string;
      type: "multiple_choice";
      prompt: string;
      required: boolean;
      choices: string[];
      hint?: string;
      explanation?: string;
      correctAnswer?: string;
      points?: number;
    }
  | {
      id: string;
      type: "checkbox";
      prompt: string;
      required: boolean;
      choices: string[];
      hint?: string;
      explanation?: string;
      correctAnswers?: string[];
      points?: number;
      pointsPerCorrect?: number;
    }
  | {
      id: string;
      type: "true_false";
      prompt: string;
      required: boolean;
      hint?: string;
      explanation?: string;
      correctAnswer?: boolean;
      points?: number;
    }
  | {
      id: string;
      type: "code_fill_in";
      prompt: string;
      required: boolean;
      codeSnippet: string;
      language: string;
      blankCount: number;
      hints?: string[];
      correctAnswers?: string[];
      explanation?: string;
      points?: number;
    };

export interface KnowledgeCategoryRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  bodySections: BodySection[];
  prefix?: string;
  description?: string;
  group?: 'knowledge' | 'ecosystem';
}

export interface KnowledgeArticleRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  bodySections: BodySection[];
  kind: 'guide' | 'update' | 'article';
  date?: string;
  relatedCategoryId: string;
}

export interface ModuleLessonRecord {
  slug: string;
  title: string;
  categoryId: string;
  tag: string;
  summary: string;
  introductionHeading?: string;
  introduction?: string;
  bodySections: BodySection[];
  visualizationId?: string;
  quizQuestions: QuizQuestion[];
}

export interface GlossaryTermRecord {
  id: string;
  slug: string;
  term: string;
  tag: string;
  summary: string;
  aliases?: string[];
  keywords?: string[];
  priority: 'high' | 'medium' | 'low';
  source?: {
    label: string;
    href: string;
  };
  relatedCategoryIds: string[];
}

export interface EcosystemProjectRecord {
  id: string;
  slug: string;
  title: string;
  tag: string;
  summary: string;
  logo?: string;
  website?: string;
  status: 'sync_ok' | 'coming_soon' | 'maintenance';
  categoryId: string;
  isFeatured: boolean;
}

export type DiscoveryItemKind = 'core' | 'project' | 'category' | 'glossary' | 'article';

export interface DiscoveryItem {
  id: string;
  kind: DiscoveryItemKind;
  title: string;
  summary: string;
  tag: string;
  href: string;
  eyebrow: string;
  priority: 'high' | 'medium' | 'low';
  featured: boolean;
  keywords: string[];
}
