import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import RecentlyUpdated from '@/components/RecentlyUpdated';
import StartHereSection from '@/components/StartHereSection';
import EncyclopediaGrid from '@/components/EncyclopediaGrid';
import {
  getFooterConfig,
  getHomepageConfig,
  getNavigation,
  getRecentArticles,
  getUIConfig,
  getKnowledgeCategories,
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
  const knowledgeCategories = categories.filter(c => c.group !== 'ecosystem').slice(0, 6);

  return (
    <>
      <NavBar links={navLinks} />
      
      <main className="col-span-12 space-y-12">
        <Hero
          hero={homepage.hero}
          quickLinks={homepage.quickLinks}
          liveStatusFeed={homepage.liveStatusFeed}
          ui={ui}
        />
        
        <StartHereSection cards={homepage.startHereCards} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <RecentlyUpdated articles={recentArticles} />
            <EncyclopediaGrid categories={knowledgeCategories} />
        </div>
      </main>

      <Footer config={footerConfig} />
    </>
  );
}
