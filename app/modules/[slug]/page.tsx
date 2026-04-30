import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import LessonCommentForm from "@/components/modules/LessonCommentForm";
import LessonQuizForm from "@/components/modules/LessonQuizForm";
import ReadingProgress from "@/components/modules/ReadingProgress";
import VisualizationRegistry from "@/components/modules/visualizations/VisualizationRegistry";
import {
  getFooterConfig,
  getModuleLessonBySlug,
  getModuleLessonPath,
  getModuleLessons,
} from "@/lib/content";
import { isLessonCompleted, listLessonComments } from "@/lib/lesson-store";
import { getCurrentSession } from "@/lib/session";
import {
  BookOpen,
  Clock,
  Tag,
  CheckCircle2,
  User,
  ChevronLeft,
  ChevronRight,
  Home,
  RotateCcw,
  ImageOff,
  MessageSquareOff,
} from "lucide-react";

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Helper to estimate reading time
function estimateReadingTime(lesson: { introduction?: string; bodySections: { body: string }[] }): number {
  const wordsPerMinute = 200;
  let totalWords = 0;
  
  if (lesson.introduction) {
    totalWords += lesson.introduction.split(/\s+/).length;
  }
  
  lesson.bodySections.forEach((section) => {
    totalWords += section.body.split(/\s+/).length;
  });
  
  return Math.max(1, Math.ceil(totalWords / wordsPerMinute));
}

interface ModuleLessonPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const lessons = await getModuleLessons();
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}

export default async function ModuleLessonPage({ params }: ModuleLessonPageProps) {
  const { slug } = await params;
  const lesson = await getModuleLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const [footerConfig, session, comments, allLessons] = await Promise.all([
    getFooterConfig(),
    getCurrentSession(),
    listLessonComments(slug),
    getModuleLessons(),
  ]);

  const canInteract = Boolean(session?.user);
  const completed = session?.user ? await isLessonCompleted(session.user.id, slug) : false;

  // Get prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const readingTime = estimateReadingTime(lesson);

  return (
    <>
      <ReadingProgress />
      <div className="space-y-16 px-6 py-12 lg:px-0 lg:py-24">

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
            <Link href="/modules" className="hover:text-primary transition-colors">Modules</Link>
            <ChevronRight size={12} />
            <Link href={`/modules#${lesson.categoryId}`} className="hover:text-primary transition-colors">{lesson.categoryId}</Link>
            <ChevronRight size={12} />
            <span className="text-primary/80">{lesson.tag}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              <BookOpen size={12} />
              Lesson
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
              <Tag size={10} />
              {lesson.categoryId}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
              <Clock size={10} />
              {readingTime} min read
            </span>
          </div>
          <h1 className="max-w-4xl font-headline text-4xl font-black uppercase tracking-tight text-white lg:text-6xl">
            {lesson.title}
          </h1>
          <p className="max-w-3xl text-lg leading-8 text-on-surface-variant font-medium">{lesson.summary}</p>
        </div>
        <aside className="space-y-4">
          <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
            <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Lesson Status
            </div>
            <div className="space-y-3 text-sm leading-7 text-on-surface-variant">
              <div className="flex items-center gap-2">
                {completed ? (
                  <>
                    <CheckCircle2 size={14} className="text-primary" />
                    <span>Quiz complete. Progress synced.</span>
                  </>
                ) : (
                  <>
                    <Clock size={14} className="text-on-surface-variant/60" />
                    <span>Quiz not completed yet.</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-on-surface-variant/60" />
                <span>{session?.user ? `Signed in as ${session.user.username || session.user.email}` : "Browsing anonymously."}</span>
              </div>
            </div>
          </div>
          <Link
            href="/modules"
            className="flex items-center gap-2 rounded-[1.2rem] border border-outline-variant/25 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-all hover:text-primary hover:border-primary/30"
          >
            <Home size={14} />
            Back to Modules
          </Link>
          <Link
            href={getModuleLessonPath(slug)}
            className="flex items-center gap-2 rounded-[1.2rem] border border-primary/30 bg-primary/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02]"
          >
            <RotateCcw size={14} />
            Refresh Lesson
          </Link>
        </aside>
      </section>

      <div className="mx-auto max-w-[65ch] space-y-12">
        {lesson.introduction && (
          <section className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-primary">Introduction</h2>
            <p className="text-lg leading-relaxed text-white/90">{lesson.introduction}</p>
          </section>
        )}

        {lesson.bodySections.map((section) => (
          <article key={section.title} className="space-y-6">
            <h3 className="font-headline text-2xl font-bold uppercase tracking-wide text-white">{section.title}</h3>
            
            {section.visual && (
              <div className="w-full rounded-[1.2rem] border border-outline-variant/20 bg-surface-container overflow-hidden my-6 transition-all hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <div className="aspect-[16/9] flex items-center justify-center bg-black/40 relative overflow-hidden">
                  {section.visual.src ? (
                    <img
                      src={section.visual.src}
                      alt={section.visual.alt || section.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-on-surface-variant/50">
                      <ImageOff size={32} />
                      <span className="text-xs uppercase tracking-widest font-mono">
                        {(section.visual.type || 'image').toUpperCase()} coming soon
                      </span>
                    </div>
                  )}
                </div>
                {section.visual.caption && (
                  <div className="border-t border-outline-variant/20 px-4 py-3">
                    <p className="text-xs text-on-surface-variant/80 italic">
                      {section.visual.caption}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 text-base leading-8 text-on-surface-variant">
              {section.body.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}
      </div>

      {lesson.visualizationId && (
        <section className="mx-auto max-w-5xl">
          <VisualizationRegistry id={lesson.visualizationId} />
        </section>
      )}

      <section className="rounded-[1.6rem] border border-outline-variant/25 bg-surface-container-high/30 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Lesson Quiz</div>
            <h2 className="font-headline text-2xl font-bold uppercase text-white">
              Submit Your Completion Check
            </h2>
          </div>
          <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${completed ? "text-primary" : "text-on-surface-variant/60"}`}>
            {completed ? (
              <>
                <CheckCircle2 size={12} />
                Complete
              </>
            ) : (
              <>
                <Clock size={12} />
                Pending
              </>
            )}
          </div>
        </div>
        <LessonQuizForm
          lessonSlug={slug}
          questions={lesson.quizQuestions}
          canSubmit={canInteract}
          isCompleted={completed}
        />
      </section>

      <section className="rounded-[1.6rem] border border-outline-variant/25 bg-surface-container-high/30 p-6">
        <div className="mb-6">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Lesson Comments</div>
          <h2 className="font-headline text-2xl font-bold uppercase text-white">Discussion</h2>
        </div>

        <LessonCommentForm lessonSlug={slug} canComment={canInteract} />

        <div className="mt-8 space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-[1.2rem] border border-outline-variant/20 bg-surface-container-lowest p-5 transition-all hover:border-primary/20 hover:shadow-[0_4px_20px_rgba(105,218,255,0.04)]"
              >
                <div className="mb-2 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  <span className="inline-flex items-center gap-1.5">
                    <User size={12} />
                    {comment.username}
                  </span>
                  <span className="text-on-surface-variant/40">|</span>
                  <span>{formatRelativeTime(comment.createdAt)}</span>
                </div>
                <p className="text-sm leading-7 text-on-surface-variant">{comment.body}</p>
              </article>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-[1.2rem] border border-dashed border-outline-variant/25 p-8 text-center">
              <MessageSquareOff size={24} className="text-on-surface-variant/30" />
              <p className="text-sm text-on-surface-variant/60">
                No comments yet. Be the first learner to add one.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Prev/Next Navigation */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {prevLesson ? (
          <Link
            href={getModuleLessonPath(prevLesson.slug)}
            className="group flex items-center gap-4 rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-low p-5 transition-all hover:border-primary/30 hover:bg-surface-container-high"
          >
            <ChevronLeft size={20} className="text-on-surface-variant/60 transition-colors group-hover:text-primary" />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                Previous Lesson
              </div>
              <div className="truncate text-sm font-semibold text-white transition-colors group-hover:text-primary">
                {prevLesson.title}
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-outline-variant/25 bg-surface-container-low/50 p-5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
              First Lesson
            </div>
          </div>
        )}
        {nextLesson ? (
          <Link
            href={getModuleLessonPath(nextLesson.slug)}
            className="group flex items-center gap-4 rounded-[1.2rem] border border-outline-variant/25 bg-surface-container-low p-5 text-right transition-all hover:border-primary/30 hover:bg-surface-container-high"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                Next Lesson
              </div>
              <div className="truncate text-sm font-semibold text-white transition-colors group-hover:text-primary">
                {nextLesson.title}
              </div>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant/60 transition-colors group-hover:text-primary" />
          </Link>
        ) : (
          <div className="rounded-[1.2rem] border border-dashed border-outline-variant/25 bg-surface-container-low/50 p-5 text-right">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">
              Last Lesson
            </div>
          </div>
        )}
      </div>

      <Footer config={footerConfig} />
    </div>
    </>
  );
}
