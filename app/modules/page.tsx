import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ModuleCategoryNav from "@/components/ModuleCategoryNav";
import { getFooterConfig, getModuleLessonPath, getModuleLessons } from "@/lib/content";
import { MODULES_PAGE_CONFIG, MODULE_CATEGORY_ART } from "@/lib/config";
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
      <section data-modules-hero className="max-w-3xl space-y-8">
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

      <ModuleCategoryNav
        categories={categories.map((category) => {
          const catLessons = lessons.filter((l) => l.categoryId === category.id);
          return {
            id: category.id,
            title: category.title,
            completed: catLessons.filter((l) => completedLessons.has(l.slug)).length,
            total: catLessons.length,
          };
        })}
      />

      <div className="space-y-32">
        {categories.map((category) => {
          const categoryLessons = lessons.filter((lesson) => lesson.categoryId === category.id);
          const completedCategoryLessons = categoryLessons.filter((lesson) => completedLessons.has(lesson.slug)).length;
          const categoryArt = MODULE_CATEGORY_ART[category.id];

          return (
            <section key={category.id} id={category.id} className="space-y-8 scroll-mt-24">
              {/* ── Category Art Banner ── */}
              <div className="overflow-hidden rounded-[1.7rem] border border-outline-variant/20 bg-surface-container-low shadow-[0_16px_60px_rgba(0,0,0,0.35)]">
                <div className="relative aspect-[16/7] overflow-hidden lg:aspect-[16/6]">
                  {categoryArt ? (
                    <Image
                      src={categoryArt.src}
                      alt={categoryArt.alt}
                      fill
                      priority={category.id === "fundamentals"}
                      sizes="(max-width: 1024px) 100vw, 72vw"
                      className="object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,10,0.08)_0%,rgba(4,7,10,0.18)_30%,rgba(4,7,10,0.72)_72%,rgba(4,7,10,0.96)_100%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(105,218,255,0.06)_0%,transparent_24%,transparent_76%,rgba(105,218,255,0.04)_100%)]" />
                  <div className="absolute inset-0 opacity-50" style={{
                    backgroundImage:
                      "linear-gradient(rgba(105,218,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(105,218,255,0.08) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                    maskImage: "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.9))",
                  }} />

                  <div className="absolute left-5 top-5 inline-flex border border-primary/20 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary backdrop-blur-sm">
                    CAT_{category.id.toUpperCase().slice(0, 3)}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                    <div className="max-w-3xl space-y-4">
                      <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.22em] text-primary/85">
                        <span className="border border-primary/20 bg-black/30 px-3 py-1 backdrop-blur-sm">
                          {category.title}
                        </span>
                        <span>{categoryLessons.length} lessons</span>
                        <span>{completedCategoryLessons}/{categoryLessons.length} complete</span>
                      </div>
                      <div className="space-y-3">
                        <h2 className="max-w-2xl font-headline text-3xl font-black uppercase tracking-tight text-white lg:text-5xl">
                          {category.title}
                        </h2>
                        <p className="max-w-2xl text-sm leading-7 text-on-surface-variant lg:text-base">
                          {category.description}
                        </p>
                      </div>
                      <div className="pt-1">
                        <Link
                          href={categoryLessons[0] ? getModuleLessonPath(categoryLessons[0].slug) : "/modules"}
                          className="inline-flex items-center gap-2.5 border border-primary/30 bg-primary/10 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-sm transition-all hover:bg-primary/20"
                        >
                          {completedCategoryLessons === categoryLessons.length && categoryLessons.length > 0
                            ? "Review Sequence"
                            : "Start Sequence"}
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Lesson Cards ── */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {categoryLessons.map((lesson, i) => {
                  const isComplete = completedLessons.has(lesson.slug);
                  const progress = isComplete ? 100 : 0;

                  return (
                    <Link
                      key={lesson.slug}
                      href={getModuleLessonPath(lesson.slug)}
                      className={`mod-card group relative overflow-hidden rounded-[1.3rem] border p-6 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_8px_32px_rgba(105,218,255,0.06)] ${
                        isComplete
                          ? "border-primary/12 bg-primary/[0.03]"
                          : "border-outline-variant/18 bg-surface-container-low"
                      }`}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(105,218,255,0.10),transparent_28%)] opacity-70 transition-opacity group-hover:opacity-100" />
                      <div className="absolute right-0 top-0 -mr-12 -mt-12 h-24 w-24 rounded-full bg-primary/5 blur-3xl transition-colors group-hover:bg-primary/10" />
                      <div className="relative z-10 flex h-full flex-col space-y-6">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-mono tracking-[0.2em] text-on-surface-variant/40">
                            MOD::{lesson.tag}
                          </span>
                          {isComplete ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-mono text-primary">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Done
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-on-surface-variant/30">{progress}%</span>
                          )}
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
                              {isComplete ? "Review Lesson" : "Begin Lesson"}
                            </span>
                            <span className="text-primary transition-transform group-hover:translate-x-1">→</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {categoryLessons.length === 0 ? (
                  <div className="rounded-[1.3rem] border border-dashed border-outline-variant/20 p-10 text-center md:col-span-2">
                    <div className="space-y-2">
                      <div className="text-2xl text-on-surface-variant/20">◇</div>
                      <p className="text-sm text-on-surface-variant/60">
                        No lessons published in this category yet.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>

      <Footer config={footerConfig} />
    </div>
  );
}
