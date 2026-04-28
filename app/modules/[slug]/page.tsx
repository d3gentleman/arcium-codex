import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import LessonCommentForm from "@/components/modules/LessonCommentForm";
import LessonQuizForm from "@/components/modules/LessonQuizForm";
import VisualizationRegistry from "@/components/modules/visualizations/VisualizationRegistry";
import {
  getFooterConfig,
  getModuleLessonBySlug,
  getModuleLessonPath,
  getModuleLessons,
} from "@/lib/content";
import { isLessonCompleted, listLessonComments } from "@/lib/lesson-store";
import { getCurrentSession } from "@/lib/session";

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

  const [footerConfig, session, comments] = await Promise.all([
    getFooterConfig(),
    getCurrentSession(),
    listLessonComments(slug),
  ]);

  const canInteract = Boolean(session?.user);
  const completed = session?.user ? await isLessonCompleted(session.user.id, slug) : false;

  return (
    <div className="space-y-16 px-6 py-12 lg:px-0 lg:py-24">
      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              MODULE_LESSON
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant/60">
              {lesson.categoryId}
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
            <div className="space-y-2 text-sm leading-7 text-on-surface-variant">
              <p>{completed ? "Quiz complete. Progress synced to your account." : "Quiz not completed yet."}</p>
              <p>{session?.user ? `Signed in as ${session.user.username || session.user.email}` : "Browsing anonymously."}</p>
            </div>
          </div>
          <Link
            href="/modules"
            className="block rounded-[1.2rem] border border-outline-variant/25 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-outline transition-colors hover:text-primary"
          >
            Back to Modules
          </Link>
          <Link
            href={getModuleLessonPath(slug)}
            className="block rounded-[1.2rem] border border-primary/30 bg-primary/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
          >
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
              <div className="w-full rounded-[1.2rem] border border-outline-variant/20 bg-surface-container overflow-hidden my-6">
                <div className="aspect-[16/9] flex items-center justify-center bg-black/40 relative">
                  {section.visual.src ? (
                    <img 
                      src={section.visual.src} 
                      alt={section.visual.alt || section.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-on-surface-variant uppercase tracking-widest font-mono">
                      [{(section.visual.type || 'IMAGE').toUpperCase()} ASSET PLACEHOLDER]
                    </span>
                  )}
                </div>
                {section.visual.caption && (
                  <div className="border-t border-outline-variant/20 px-4 py-3 text-xs text-on-surface-variant">
                    {section.visual.caption}
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
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
            {completed ? "Status: Complete" : "Status: Pending"}
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
                className="rounded-[1.2rem] border border-outline-variant/20 bg-surface-container-lowest p-5"
              >
                <div className="mb-2 flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  <span>{comment.username}</span>
                  <span>{new Date(comment.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm leading-7 text-on-surface-variant">{comment.body}</p>
              </article>
            ))
          ) : (
            <div className="rounded-[1.2rem] border border-dashed border-outline-variant/25 p-5 text-sm text-on-surface-variant">
              No comments yet. Be the first learner to add one.
            </div>
          )}
        </div>
      </section>

      <Footer config={footerConfig} />
    </div>
  );
}
