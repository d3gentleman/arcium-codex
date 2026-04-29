import { query } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit2 } from "lucide-react";

export default async function StaffModulesPage() {
  const result = await query('SELECT slug, title, category_id, updated_at FROM module_lesson ORDER BY updated_at DESC');
  const modules = result.rows;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Module Management</h1>
          <p className="text-white/60 mt-2">Manage the curriculum and lessons available in the Arcium Codex.</p>
        </div>
        <Link 
          href="/staff/modules/new" 
          className="bg-arcium-blue text-black px-5 py-2.5 rounded-sm font-bold hover:bg-arcium-blue/90 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
        >
          <Plus size={16} />
          Create Module
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Title</th>
              <th className="p-4 font-medium hidden sm:table-cell">Slug</th>
              <th className="p-4 font-medium hidden md:table-cell">Category</th>
              <th className="p-4 font-medium">Updated</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {modules.map((mod) => (
              <tr key={mod.slug} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 font-medium">{mod.title}</td>
                <td className="p-4 text-white/50 font-mono text-xs hidden sm:table-cell">{mod.slug}</td>
                <td className="p-4 text-white/50 hidden md:table-cell">{mod.category_id}</td>
                <td className="p-4 text-white/50">{new Date(mod.updated_at).toLocaleDateString()}</td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/staff/modules/${mod.slug}/edit`} 
                    className="inline-flex items-center gap-1.5 text-arcium-blue hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </Link>
                </td>
              </tr>
            ))}
            {modules.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-white/50">
                  <div className="flex flex-col items-center gap-3">
                    <p>No modules found.</p>
                    <Link href="/staff/modules/new" className="text-arcium-blue hover:underline">
                      Create your first module
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
