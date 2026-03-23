import EcosystemMap from '@/components/EcosystemMap';
import NavBar from '@/components/NavBar';
import {
  getMapCategories,
  getMapEdges,
  getMapNodes,
  getMapSceneLayout,
  getNavigation,
  getUIConfig,
} from '@/lib/content';

interface MapPageProps {
  searchParams?: {
    focus?: string;
  };
}

export default function MapPage({ searchParams }: MapPageProps) {
  const navLinks = getNavigation();
  const mapProps = {
    domainNodes: getMapNodes(),
    domainEdges: getMapEdges(),
    mapCategories: getMapCategories(),
    sceneConfig: getMapSceneLayout(),
    ui: getUIConfig(),
    initialFocusNodeId: searchParams?.focus || null,
  };

  return (
    <>
      <div className="col-span-12 z-50 pointer-events-auto shrink-0 relative">
        <NavBar links={navLinks} />
      </div>
      <div className="col-span-12 relative w-full h-[calc(100vh-140px)] border-2 border-outline-variant/30 overflow-hidden shadow-[4px_4px_0px_rgba(0,0,0,0.5)]">
        <EcosystemMap {...mapProps} variant="full" defaultMode="beginner" />
      </div>
    </>
  );
}
