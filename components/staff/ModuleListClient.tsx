"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Copy,
  Trash2,
  Target,
  BarChart3,
  FileText,
  Sparkles,
  X
} from "lucide-react";

interface ModuleLesson {
  slug: string;
  title: string;
  category_id: string;
  updated_at: string;
  created_at?: string;
  quiz_questions?: any[];
  visualization_id?: string;
  body_sections?: any[];
}

const CATEGORY_LABELS: Record<string, string> = {
  fundamentals: "Fundamentals",
  architecture: "Architecture",
  execution: "Execution",
  security: "Security",
  economics: "Economics",
};

interface ModuleListClientProps {
  modules: ModuleLesson[];
}

export default function ModuleListClient({ modules }: ModuleListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filteredModules = useMemo(() => {
    return modules.filter((mod) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        mod.title.toLowerCase().includes(searchLower) ||
        mod.slug.toLowerCase().includes(searchLower);
      
      const matchesCategory = 
        categoryFilter === "all" || mod.category_id === categoryFilter;
      
      const hasQuiz = !!(mod.quiz_questions && mod.quiz_questions.length > 0);
      const hasViz = !!mod.visualization_id;
      
      let matchesStatus = true;
      if (statusFilter === "has-quiz") matchesStatus = hasQuiz;
      else if (statusFilter === "has-viz") matchesStatus = hasViz;
      else if (statusFilter === "no-quiz") matchesStatus = !hasQuiz;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [modules, searchQuery, categoryFilter, statusFilter]);

  const getStatusBadges = (mod: ModuleLesson) => {
    const badges = [];
    const hasQuiz = !!(mod.quiz_questions && mod.quiz_questions.length > 0);
    const hasViz = !!mod.visualization_id;
    const hasContent = !!(mod.body_sections && mod.body_sections.length > 0);
    const isNew = mod.created_at && 
      (new Date().getTime() - new Date(mod.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;

    if (hasContent) badges.push({ icon: FileText, label: "Content", color: "text-white/50" });
    if (hasQuiz) badges.push({ icon: Target, label: `${mod.quiz_questions?.length} questions`, color: "text-arcium-blue" });
    if (hasViz) badges.push({ icon: BarChart3, label: "Viz", color: "text-purple-400" });
    if (isNew) badges.push({ icon: Sparkles, label: "New", color: "text-yellow-400" });
    
    return badges;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const hasFilters = searchQuery || categoryFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white focus:border-arcium-blue focus:outline-none"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black border border-white/10 rounded-sm pl-9 pr-8 py-2.5 text-sm text-white focus:border-arcium-blue focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <Target size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black border border-white/10 rounded-sm pl-9 pr-8 py-2.5 text-sm text-white focus:border-arcium-blue focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="has-quiz">Has Quiz</option>
              <option value="has-viz">Has Visualization</option>
              <option value="no-quiz">No Quiz</option>
            </select>
          </div>
        </div>
        
        {/* Active Filters */}
        {hasFilters && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-xs text-white/40">Active filters:</span>
            {searchQuery && (
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-sm flex items-center gap-1">
                Search: &quot;{searchQuery}&quot; 
                <button onClick={() => setSearchQuery("")}><X size={10} /></button>
              </span>
            )}
            {categoryFilter !== "all" && (
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-sm flex items-center gap-1">
                {CATEGORY_LABELS[categoryFilter]}
                <button onClick={() => setCategoryFilter("all")}><X size={10} /></button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-sm flex items-center gap-1">
                {statusFilter.replace('-', ' ')}
                <button onClick={() => setStatusFilter("all")}><X size={10} /></button>
              </span>
            )}
            <button 
              onClick={clearFilters}
              className="text-xs text-arcium-blue hover:text-white ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Module Table */}
      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Module</th>
              <th className="p-4 font-medium hidden md:table-cell">Status</th>
              <th className="p-4 font-medium hidden sm:table-cell">Category</th>
              <th className="p-4 font-medium">Updated</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {filteredModules.map((mod) => (
              <tr key={mod.slug} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-medium text-white">{mod.title}</div>
                  <div className="text-white/40 font-mono text-xs">{mod.slug}</div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    {getStatusBadges(mod).map((badge, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-1 ${badge.color}`}
                        title={badge.label}
                      >
                        <badge.icon size={14} />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-white/50 hidden sm:table-cell">
                  {CATEGORY_LABELS[mod.category_id] || mod.category_id}
                </td>
                <td className="p-4 text-white/50">
                  {formatDate(mod.updated_at)}
                </td>
                <td className="p-4 text-right">
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === mod.slug ? null : mod.slug)}
                      className="p-2 text-white/40 hover:text-white transition-colors"
                    >
                      <MoreVertical size={16} />
                    </button>
                    
                    {openMenu === mod.slug && (
                      <div className="absolute right-0 top-full mt-1 bg-[#0A0A0A] border border-white/10 rounded-sm shadow-xl z-10 min-w-[140px]">
                        <Link
                          href={`/modules/${mod.slug}`}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Eye size={14} /> Preview
                        </Link>
                        <Link
                          href={`/staff/modules/${mod.slug}/edit`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Copy size={14} /> Edit
                        </Link>
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors w-full text-left"
                          onClick={() => {/* Duplicate logic */}}
                        >
                          <Copy size={14} /> Duplicate
                        </button>
                        <div className="border-t border-white/10 my-1" />
                        <button
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full text-left"
                          onClick={() => {/* Delete logic */}}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredModules.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  {hasFilters ? (
                    <div className="flex flex-col items-center gap-3 text-white/50">
                      <Search size={24} className="opacity-50" />
                      <p>No modules match your filters.</p>
                      <button 
                        onClick={clearFilters}
                        className="text-arcium-blue hover:underline"
                      >
                        Clear filters
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-white/50">
                      <p>No modules found.</p>
                      <Link href="/staff/modules/new" className="text-arcium-blue hover:underline">
                        Create your first module
                      </Link>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
