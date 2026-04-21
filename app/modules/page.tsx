import Link from "next/link";
import Footer from "@/components/Footer";
import { getFooterConfig, getModuleLessonPath, getModuleLessons } from "@/lib/content";
import { MODULES_PAGE_CONFIG } from "@/lib/config";
import { getCompletedLessonSlugs } from "@/lib/lesson-store";
import { getCurrentSession } from "@/lib/session";

export default async function ModulesPage() {
  const [footerConfig, lessons, session] = await Promise.all([
    getFooterConfig(),
    getModuleLessons(),
    getCurrentSession(),
  ]);

  const completedLessons = session?.user ? new Set(await getCompletedLessonSlugs(session.user.id)) : new Set<string>();
  const { hero, categories } = MODULES_PAGE_CONFIG;

  return (
    <div className="space-y-24 px-6 py-12 lg:px-0 lg:py-24">
      <section className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.3em] text-primary">
              {hero.eyebrow}
            </span>
            <div className="h-[1px] w-12 bg-primary/30" />
          </div>
          <h1 className="font-headline text-5xl font-black leading-[0.9] tracking-tighter text-white uppercase lg:text-7xl">
            {hero.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">{hero.description}</p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-on-surface-variant/70">
            {session?.user
              ? "Signed in progress sync active."
              : "Sign in to save quiz completions and comment on lessons."}
          </p>
        </div>
      </section>

      <div className="space-y-32">
        {categories.map((category) => {
          const categoryLessons = lessons.filter((lesson) => lesson.categoryId === category.id);

          return (
            <section key={category.id} id={category.id} className="space-y-12 scroll-mt-24">
              <div className="grid grid-cols-1 gap-8 border-b border-white/5 pb-12 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <h2 className="font-headline text-2xl font-bold uppercase tracking-wider text-white">
                      {category.title}
                    </h2>
                    <div className="rounded-sm border border-primary/20 bg-primary/10 px-2 py-0.5">
                      <span className="text-[10px] font-mono font-bold text-primary">
                        CAT_{category.id.toUpperCase().slice(0, 3)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-on-surface-variant">{category.description}</p>
                </div>

                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {categoryLessons.map((lesson) => {
                      const progress = completedLessons.has(lesson.slug) ? 100 : 0;

                      return (
                        <Link
                          key={lesson.slug}
                          href={getModuleLessonPath(lesson.slug)}
                          className="group relative overflow-hidden rounded-sm bg-surface-container-low p-6 transition-all duration-500 hover:bg-surface-container-high"
                        >
                          <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10" />
                          <div className="relative z-10 flex h-full flex-col space-y-6">
                            <div className="flex items-start justify-between">
                              <span className="text-[10px] font-mono tracking-[0.2em] text-on-surface-variant/40">
                                MOD::{lesson.tag}
                              </span>
                              <span className="text-[10px] font-mono text-primary/60">{progress}%</span>
                            </div>

                            <div className="space-y-3">
                              <h3 className="pr-8 font-headline text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
                                {lesson.title}
                              </h3>
                              <p className="text-sm leading-7 text-on-surface-variant">{lesson.summary}</p>
                            </div>

                            <div className="mt-auto space-y-3 pt-4">
                              <div className="relative h-[2px] w-full overflow-hidden bg-white/5">
                                <div
                                  className="h-full bg-primary transition-all duration-1000 ease-out"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>

                              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-white">
                                  {progress === 100 ? "Review Lesson" : "Begin Lesson"}
                                </span>
                                <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {categoryLessons.length === 0 ? (
                      <div className="rounded-sm border border-dashed border-outline-variant/20 p-6 text-sm text-on-surface-variant">
                        No lessons have been published in this category yet.
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <Footer config={footerConfig} />
    </div>
  );
}
