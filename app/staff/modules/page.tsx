import { query } from "@/lib/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import ModuleListClient from "@/components/staff/ModuleListClient";

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

export default async function StaffModulesPage() {
  const result = await query(`
    SELECT 
      slug, 
      title, 
      category_id, 
      updated_at,
      created_at,
      quiz_questions,
      visualization_id,
      body_sections
    FROM module_lesson 
    ORDER BY updated_at DESC
  `);
  
  const modules: ModuleLesson[] = result.rows.map((row: any) => ({
    slug: row.slug,
    title: row.title,
    category_id: row.category_id,
    updated_at: row.updated_at,
    created_at: row.created_at,
    quiz_questions: row.quiz_questions,
    visualization_id: row.visualization_id,
    body_sections: row.body_sections,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
          <p className="text-white/60 mt-2">
            {modules.length} module{modules.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link 
          href="/staff/modules/new" 
          className="bg-arcium-blue text-black px-5 py-2.5 rounded-sm font-bold hover:bg-arcium-blue/90 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          <Plus size={16} />
          Create Module
        </Link>
      </div>

      {/* Client Component with filters and table */}
      <ModuleListClient modules={modules} />
    </div>
  );
}
