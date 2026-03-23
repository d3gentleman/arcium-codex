'use client';
import type { MouseEvent as ReactMouseEvent } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useReducedMotion } from 'framer-motion';
import { generateReactFlowEdges, generateReactFlowNodes } from '../utils/map-layout';
import {
  MapCanvasNodeData,
  MapCategory,
  MapEdgeDefinition,
  MapMode,
  MapNodeDefinition,
  MapVariant,
  SceneConfig,
  UIConfig,
} from '../types/domain';
import CustomNode from './CustomNode';
import SlideInPanel from './SlideInPanel';

const nodeTypes = {
  customNode: CustomNode,
};

export interface EcosystemMapProps {
  domainNodes: MapNodeDefinition[];
  domainEdges: MapEdgeDefinition[];
  mapCategories: MapCategory[];
  sceneConfig: SceneConfig;
  ui: UIConfig;
  variant?: MapVariant;
  defaultMode?: MapMode;
  initialFocusNodeId?: string | null;
}

function isDomainNodeData(data: MapCanvasNodeData): data is MapNodeDefinition & { color: string } {
  return data.kind !== 'region';
}

function MapInternal({
  domainNodes,
  domainEdges,
  mapCategories,
  sceneConfig,
  ui,
  variant = 'full',
  defaultMode = 'beginner',
  initialFocusNodeId = null,
}: EcosystemMapProps) {
  const shouldReduceMotion = useReducedMotion();
  const { fitBounds, setCenter } = useReactFlow();
  const isPreview = variant === 'preview';
  const [mode, setMode] = useState<MapMode>(defaultMode);
  const [activeNode, setActiveNode] = useState<MapNodeDefinition | null>(null);
  const [focusedCategory, setFocusedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const lastFocusedNodeRef = useRef<string | null>(null);

  const initialNodes = useMemo(
    () => generateReactFlowNodes(domainNodes, sceneConfig, mapCategories),
    [domainNodes, sceneConfig, mapCategories]
  );
  const initialEdges = useMemo(
    () => generateReactFlowEdges(domainEdges, domainNodes, sceneConfig, !!shouldReduceMotion),
    [domainEdges, domainNodes, sceneConfig, shouldReduceMotion]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const categoryLookup = useMemo(
    () => new Map(mapCategories.map((category) => [category.id, category])),
    [mapCategories]
  );
  const projectNodes = useMemo(
    () => domainNodes.filter((node) => node.kind === 'project'),
    [domainNodes]
  );
  const featuredProjectIds = useMemo(
    () => new Set(projectNodes.filter((node) => node.featuredOnOverview).map((node) => node.id)),
    [projectNodes]
  );
  const categoryProjectCounts = useMemo(
    () => projectNodes.reduce<Record<string, number>>((acc, node) => {
      if (node.categoryId) {
        acc[node.categoryId] = (acc[node.categoryId] || 0) + 1;
      }
      return acc;
    }, {}),
    [projectNodes]
  );
  const isTechnical = mode === 'technical';

  useEffect(() => {
    if (focusedCategory) {
      return;
    }

    const viewport = isPreview ? sceneConfig.previewViewport : sceneConfig.overviewViewport;
    setCenter(viewport.centerX, viewport.centerY, {
      zoom: viewport.zoom,
      duration: shouldReduceMotion ? 0 : 700,
    });
  }, [focusedCategory, isPreview, sceneConfig, setCenter, shouldReduceMotion]);

  useEffect(() => {
    if (!activeNode) {
      return;
    }

    if (activeNode.kind === 'project' && !focusedCategory && !activeNode.featuredOnOverview) {
      setActiveNode(null);
    }

    if (activeNode.kind === 'project' && focusedCategory && activeNode.categoryId !== focusedCategory) {
      setActiveNode(null);
    }
  }, [activeNode, focusedCategory]);

  const executeFocus = useCallback((categoryId: string | null) => {
    setFocusedCategory(categoryId);
    if (!categoryId) {
      setSearchQuery('');
      return;
    }

    const regionNode = nodes.find((node) => node.id === `region-${categoryId}`);
    if (regionNode) {
      fitBounds(
        {
          x: regionNode.position.x,
          y: regionNode.position.y,
          width: (regionNode.style?.width as number) || 900,
          height: (regionNode.style?.height as number) || 900,
        },
        { padding: 0.18, duration: shouldReduceMotion ? 0 : 900 }
      );
    }
  }, [fitBounds, nodes, shouldReduceMotion]);

  const focusProject = useCallback((projectNode: MapNodeDefinition) => {
    if (projectNode.categoryId) {
      executeFocus(projectNode.categoryId);
    }
    setActiveNode(projectNode);
    setSearchQuery('');
  }, [executeFocus]);

  useEffect(() => {
    if (!initialFocusNodeId) {
      lastFocusedNodeRef.current = null;
      return;
    }

    if (lastFocusedNodeRef.current === initialFocusNodeId) {
      return;
    }

    const targetNode = domainNodes.find((node) => node.id === initialFocusNodeId);

    if (!targetNode) {
      return;
    }

    lastFocusedNodeRef.current = initialFocusNodeId;

    if (targetNode.kind === 'category') {
      executeFocus(targetNode.id);
    } else if (targetNode.kind === 'project' && targetNode.categoryId) {
      executeFocus(targetNode.categoryId);
    } else {
      executeFocus(null);
    }

    setActiveNode(targetNode);
    setSearchQuery('');
  }, [domainNodes, executeFocus, initialFocusNodeId]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (isPreview || query.length < 2) {
      return [];
    }

    return projectNodes
      .filter((node) => {
        const haystack = [
          node.label,
          node.technicalLabel || '',
          node.compactLabel || '',
          node.tag,
          node.whyItMatters,
        ].join(' ').toLowerCase();

        return haystack.includes(query);
      })
      .sort((left, right) => {
        const score = (node: MapNodeDefinition) => {
          const exact = node.label.toLowerCase().startsWith(query) ? 3 : 0;
          const featured = node.featuredOnOverview ? 2 : 0;
          const priority = node.priority === 'high' ? 2 : node.priority === 'medium' ? 1 : 0;
          return exact + featured + priority;
        };

        return score(right) - score(left);
      })
      .slice(0, 6);
  }, [isPreview, projectNodes, searchQuery]);

  const onNodeClick = useCallback((event: ReactMouseEvent, node: Node<MapCanvasNodeData>) => {
    if (isPreview || !isDomainNodeData(node.data)) {
      return;
    }

    if (node.data.kind === 'category') {
      executeFocus(node.data.id);
    }

    setActiveNode(node.data);
  }, [executeFocus, isPreview]);

  const displayNodes = useMemo(() => {
    return nodes.map((node) => {
      const selected = activeNode?.id === node.id;

      if (node.data.kind === 'region') {
        const dimmed = Boolean(focusedCategory && node.data.categoryId !== focusedCategory);
        return {
          ...node,
          hidden: false,
          data: {
            ...node.data,
            dimmed,
            focused: focusedCategory === node.data.categoryId,
            variant,
            mode,
          },
          style: {
            ...node.style,
            opacity: dimmed ? 0.22 : (isPreview ? 0.72 : 0.92),
            zIndex: focusedCategory === node.data.categoryId ? -1 : -2,
          },
        };
      }

      if (node.data.kind === 'core') {
        return {
          ...node,
          hidden: false,
          data: {
            ...node.data,
            displayLabel: node.data.label,
            displayTag: node.data.tag,
            dimmed: false,
            focused: Boolean(focusedCategory),
            selected,
            variant,
            mode,
          },
          style: {
            ...node.style,
            zIndex: 30,
          },
        };
      }

      if (node.data.kind === 'category') {
        const dimmed = Boolean(focusedCategory && node.id !== focusedCategory);
        const projectCount = categoryProjectCounts[node.id] || 0;
        return {
          ...node,
          hidden: false,
          data: {
            ...node.data,
            displayLabel: isTechnical && node.data.technicalLabel
              ? node.data.technicalLabel
              : (isPreview && node.data.compactLabel ? node.data.compactLabel : node.data.label),
            displayTag: node.data.tag,
            projectCount,
            dimmed,
            focused: focusedCategory === node.id,
            expanded: focusedCategory === node.id,
            selected,
            variant,
            mode,
          },
          style: {
            ...node.style,
            opacity: dimmed ? 0.35 : 1,
            zIndex: focusedCategory === node.id ? 26 : 20,
          },
        };
      }

      const isFeatured = node.data.featuredOnOverview;
      const shouldShowProject = focusedCategory
        ? node.data.categoryId === focusedCategory
        : isFeatured;

      return {
        ...node,
        hidden: !shouldShowProject,
        position: focusedCategory
          ? node.position
          : (sceneConfig.featuredProjectAnchors[node.id] || node.position),
        data: {
          ...node.data,
          displayLabel: focusedCategory
            ? (isTechnical && node.data.technicalLabel ? node.data.technicalLabel : node.data.label)
            : (node.data.compactLabel || node.data.label),
          displayTag: node.data.tag,
          featured: !focusedCategory && isFeatured,
          expanded: Boolean(focusedCategory),
          selected,
          variant,
          mode,
        },
        style: {
          ...node.style,
          opacity: shouldShowProject ? 1 : 0,
          zIndex: selected ? 28 : (!focusedCategory && isFeatured ? 18 : 16),
        },
      };
    });
  }, [activeNode, categoryProjectCounts, focusedCategory, isPreview, isTechnical, mode, nodes, sceneConfig.featuredProjectAnchors, variant]);

  const displayEdges = useMemo(() => {
    return edges.map((edge) => {
      const primary = Boolean(edge.data?.primary);
      const isFeaturedProjectEdge = featuredProjectIds.has(edge.source);
      const belongsToFocusedCategory = focusedCategory
        ? edge.target === focusedCategory || edge.source === focusedCategory
        : false;

      let hidden = false;
      let dimmed = false;

      if (isPreview) {
        hidden = !primary;
      } else if (!focusedCategory) {
        hidden = primary ? false : (!isTechnical || !isFeaturedProjectEdge);
      } else {
        hidden = primary ? false : !belongsToFocusedCategory;
        dimmed = primary && edge.source !== focusedCategory;
      }

      const accentColor = edge.data?.accentColor || '#3b494b';
      const label = isPreview
        ? undefined
        : isTechnical
          ? edge.data?.technicalCaption
          : (focusedCategory && !primary ? edge.data?.beginnerCaption : undefined);

      return {
        ...edge,
        hidden,
        label,
        animated: !shouldReduceMotion && !hidden && (primary || Boolean(focusedCategory && !dimmed)),
        style: {
          ...edge.style,
          stroke: primary
            ? accentColor
            : `${accentColor}${dimmed ? '40' : 'aa'}`,
          strokeWidth: primary ? (dimmed ? 2.4 : 3.4) : 2.2,
          opacity: dimmed ? 0.35 : 0.96,
          filter: dimmed ? 'none' : edge.style?.filter,
        },
        labelStyle: {
          ...(edge.labelStyle || {}),
          fill: dimmed ? '#93a0a1' : '#d7faff',
          opacity: dimmed ? 0.65 : 1,
        },
        labelBgStyle: {
          ...(edge.labelBgStyle || {}),
          stroke: `${accentColor}${dimmed ? '18' : '38'}`,
          fill: dimmed ? 'rgba(12,14,18,0.68)' : 'rgba(12,14,18,0.88)',
        },
      };
    });
  }, [edges, featuredProjectIds, focusedCategory, isPreview, isTechnical, shouldReduceMotion]);

  return (
    <div className={`relative h-full w-full ${isPreview ? 'pointer-events-none' : ''}`}>
      {!isPreview && (
        <div className="absolute left-4 top-4 z-50 flex flex-col gap-4 md:left-6 md:top-6">
          <div className="flex flex-wrap items-center gap-3">
            {focusedCategory && (
              <button
                onClick={() => executeFocus(null)}
                className="rounded-full border border-outline-variant/30 bg-[#0a0c0e]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg transition-colors hover:bg-surface-container"
              >
                {ui.backToAtlas}
              </button>
            )}

            <div className="flex rounded-full border border-outline-variant/30 bg-[#0a0c0e]/90 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.65)] backdrop-blur-md">
              <button
                aria-pressed={mode === 'beginner'}
                className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${mode === 'beginner' ? 'bg-primary text-on-primary' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setMode('beginner')}
              >
                {ui.mapBeginnerToggle}
              </button>
              <button
                aria-pressed={mode === 'technical'}
                className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-all ${mode === 'technical' ? 'bg-primary text-on-primary' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setMode('technical')}
              >
                {ui.mapTechnicalToggle}
              </button>
            </div>

            <div className="rounded-full border border-outline-variant/30 bg-[#0a0c0e]/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-outline shadow-lg">
              {focusedCategory ? ui.mapFocusState : ui.mapOverviewState}
            </div>
          </div>

          <div className="relative w-full max-w-[22rem]">
            <input
              type="text"
              placeholder={ui.searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-[1.2rem] border border-outline-variant/30 bg-[#0a0c0e]/90 px-4 py-3 text-sm text-white shadow-lg backdrop-blur-md focus:border-primary focus:outline-none"
            />

            {searchQuery.trim().length >= 2 && (
              <div className="atlas-search-results absolute top-[calc(100%+0.75rem)] w-full overflow-hidden rounded-[1.2rem] border border-outline-variant/30 bg-[#0a0c0e]/95 shadow-[0_20px_40px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                <div className="border-b border-outline-variant/20 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-outline">
                  {ui.mapSearchResults}
                </div>
                {searchResults.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {searchResults.map((projectNode) => {
                      const category = projectNode.categoryId ? categoryLookup.get(projectNode.categoryId) : null;
                      return (
                        <button
                          key={projectNode.id}
                          onClick={() => focusProject(projectNode)}
                          className="flex w-full items-start justify-between gap-4 border-b border-outline-variant/15 px-4 py-3 text-left transition-colors hover:bg-white/5"
                        >
                          <div>
                            <div className="text-[11px] font-black uppercase tracking-[0.16em] text-white">
                              {projectNode.label}
                            </div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-outline">
                              {category?.name || projectNode.tag}
                            </div>
                          </div>
                          <div className="rounded-full border border-outline-variant/20 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-primary">
                            {projectNode.compactLabel || 'Open'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-outline">
                    {ui.mapSearchNoResults}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!isPreview && (
        <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-2 rounded-[1.4rem] border border-outline-variant/30 bg-[#0a0c0e]/92 p-4 shadow-[0_10px_32px_rgba(0,0,0,0.65)] backdrop-blur-md">
          <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-outline">{ui.legendHeader}</div>

          <button
            onClick={() => executeFocus(null)}
            className={`flex items-center justify-between gap-4 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${!focusedCategory ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <span className="flex items-center gap-3">
              <span className="inline-block h-2 w-2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              {ui.filterAllStr}
            </span>
            <span className="text-outline">{projectNodes.length}</span>
          </button>

          {mapCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => executeFocus(focusedCategory === category.id ? null : category.id)}
              className={`flex items-center justify-between gap-4 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition-colors ${focusedCategory === category.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="flex items-center gap-3">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{
                    backgroundColor: sceneConfig.categoryColors[category.id],
                    boxShadow: `0 0 8px ${sceneConfig.categoryColors[category.id]}`,
                  }}
                />
                {category.name}
              </span>
              <span className="text-outline">{categoryProjectCounts[category.id] || 0}</span>
            </button>
          ))}
        </div>
      )}

      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        onNodesChange={isPreview ? undefined : onNodesChange}
        onEdgesChange={isPreview ? undefined : onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView={false}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={!isPreview}
        nodesConnectable={false}
        zoomOnScroll={!isPreview}
        panOnDrag={!isPreview}
        translateExtent={[[-900, -900], [1900, 1900]]}
        minZoom={isPreview ? 0.4 : 0.35}
        maxZoom={isPreview ? 0.9 : 1.8}
        className="atlas-flow"
        aria-label="Interactive Map of the Arcium Ecosystem"
      >
        <Background gap={isPreview ? 52 : 44} color={isPreview ? 'rgba(59, 73, 75, 0.12)' : 'rgba(59, 73, 75, 0.18)'} />
        {!isPreview && <Controls className="!mb-6 border border-outline-variant/30 bg-surface-container-high fill-primary md:!mb-0" />}
      </ReactFlow>

      {!isPreview && (
        <SlideInPanel
          activeNode={activeNode}
          mode={mode}
          onClose={() => setActiveNode(null)}
          ui={ui}
        />
      )}
    </div>
  );
}

export default function EcosystemMap(props: EcosystemMapProps) {
  return (
    <ReactFlowProvider>
      <MapInternal {...props} />
    </ReactFlowProvider>
  );
}
