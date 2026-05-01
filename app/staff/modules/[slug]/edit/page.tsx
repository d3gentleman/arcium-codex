import { requireStaffSession } from "@/lib/session";
import { getKnowledgeCategories, getModuleLessonBySlug } from "@/lib/content";
import ModuleForm from "../../ModuleForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditModulePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireStaffSession();

  const { slug } = await params;

  const [categories, moduleData] = await Promise.all([
    getKnowledgeCategories('knowledge'),
    getModuleLessonBySlug(slug),
  ]);

  if (!moduleData) {
    notFound();
  }
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <Link href="/staff/modules" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-4 transition-colors uppercase text-xs tracking-wider font-bold">
          <ArrowLeft size={14} /> Back to Modules
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Module: {moduleData.title}</h1>
      </div>

      <ModuleForm 
        categories={categories} 
        initialData={moduleData}
        isEdit={true}
      />
    </div>
  );
}
