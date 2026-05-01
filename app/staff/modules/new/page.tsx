import { requireStaffSession } from "@/lib/session";
import { getKnowledgeCategories } from "@/lib/content";
import ModuleForm from "../ModuleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewModulePage() {
  await requireStaffSession();

  const categories = await getKnowledgeCategories('knowledge');
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/staff/modules" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors uppercase text-xs tracking-wider font-bold">
          <ArrowLeft size={14} /> Back to Modules
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Module</h1>
      </div>

      <ModuleForm categories={categories} />
    </div>
  );
}
