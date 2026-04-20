import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedModules from '@/components/FeaturedModules';
import VisualLibrary from '@/components/VisualLibrary';
import RecentlyUpdated from '@/components/RecentlyUpdated';
import KnowledgeRecordCard from '@/components/KnowledgeRecordCard';
import {
  getFooterConfig,
  getHomepageConfig,
  getNavigation,
  getRecentArticles,
  getUIConfig,
  getKnowledgeCategories,
  getKnowledgeCategoryPath,
} from '@/lib/content';

export default async function Home() {
  const [
    navLinks,
    homepage,
    recentArticles,
    footerConfig,
    ui,
    categories
  ] = await Promise.all([
    getNavigation(),
    getHomepageConfig(),
    getRecentArticles(),
    getFooterConfig(),
    getUIConfig(),
    getKnowledgeCategories()
  ]);

  // Filter for knowledge areas to show on homepage
  const knowledgeCategories = categories.filter(c => c.group !== 'ecosystem').slice(0, 4);

  return (
    <div className="space-y-24 py-12 lg:py-24 px-6 lg:px-0">
      <Hero
        hero={homepage.hero}
        quickLinks={homepage.quickLinks}
        liveStatusFeed={homepage.liveStatusFeed}
      />
      
      <FeaturedModules />

      <VisualLibrary />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 items-start">
          <RecentlyUpdated articles={recentArticles} />
          
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-headline font-bold uppercase tracking-widest text-white">Knowledge Areas</h3>
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {knowledgeCategories.map((category) => (
                <KnowledgeRecordCard
                  key={category.id}
                  action={{
                    type: 'internal',
                    href: getKnowledgeCategoryPath(category.slug),
                    label: 'Open Area',
                  }}
                  tag={category.tag}
                  title={category.title}
                  summary={category.summary}
                  eyebrow={category.prefix}
                  meta="Category"
                />
              ))}
            </div>
          </section>
      </div>
      <Footer config={footerConfig} />
    </div>
  );
}
