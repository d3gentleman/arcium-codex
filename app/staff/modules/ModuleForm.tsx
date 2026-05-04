"use client";

import { useState, useCallback, useEffect } from "react";
import { saveModuleLesson, deleteModuleLesson } from "./actions";
import { Trash2, Plus, ArrowLeft, Save } from "lucide-react";
import { BodySection, QuizQuestion } from "@/types/domain";
import Link from "next/link";
import QuizBuilder from "@/components/staff/QuizBuilder";
import { CldUploadWidget } from "next-cloudinary";

type ModuleData = {
  slug?: string;
  title?: string;
  categoryId?: string;
  tag?: string;
  summary?: string;
  introductionHeading?: string;
  introduction?: string;
  visualizationId?: string;
  bodySections?: BodySection[];
  quizQuestions?: any[];
};

type Category = {
  id: string;
  title: string;
};

type CloudinaryUploadResultInfo = {
  secure_url?: string;
};

const DEFAULT_CATEGORIES: Category[] = [
  { id: "fundamentals", title: "Fundamentals" },
  { id: "architecture", title: "Architecture" },
  { id: "execution", title: "Execution" },
  { id: "security", title: "Security" },
  { id: "economics", title: "Economics" },
];

export default function ModuleForm({
  initialData,
  isEdit = false,
  categories,
}: {
  initialData?: ModuleData;
  isEdit?: boolean;
  categories?: Category[];
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const categoriesList = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  // Initialize with at least one section if creating new
  const [sections, setSections] = useState<BodySection[]>(
    initialData?.bodySections && initialData.bodySections.length > 0
      ? initialData.bodySections 
      : [{ title: "", body: "", visual: { type: "image", src: "" } }]
  );

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(
    initialData?.quizQuestions || []
  );
  
  // Autosave state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const addSection = () => {
    setSections([...sections, { title: "", body: "", visual: { type: "image", src: "" } }]);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const updateSection = (index: number, field: keyof BodySection, value: any) => {
    const newSections = [...sections];
    if (field === 'visual') {
      newSections[index].visual = { ...newSections[index].visual, ...value };
    } else {
      (newSections[index] as any)[field] = value;
    }
    setSections(newSections);
    setIsDirty(true);
  };

  const handleQuizChange = useCallback((newQuestions: QuizQuestion[]) => {
    setQuizQuestions(newQuestions);
    setIsDirty(true);
  }, []);

  // Load draft on mount
  useEffect(() => {
    const draftKey = `module-draft-${initialData?.slug || 'new'}`;
    const saved = localStorage.getItem(draftKey);
    if (saved && !isEdit) {
      try {
        const draft = JSON.parse(saved);
        // Could show a "restore draft?" modal here
        // For now, just log that draft exists
        console.log('Draft found:', draft);
      } catch {
        // Invalid draft, ignore
      }
    }
  }, [initialData?.slug, isEdit]);

  // Autosave effect
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(() => {
      const draft = {
        title: (document.querySelector('input[name="title"]') as HTMLInputElement)?.value,
        slug: (document.querySelector('input[name="slug"]') as HTMLInputElement)?.value,
        categoryId: (document.querySelector('select[name="categoryId"]') as HTMLSelectElement)?.value,
        summary: (document.querySelector('textarea[name="summary"]') as HTMLTextAreaElement)?.value,
        introductionHeading: (document.querySelector('input[name="introductionHeading"]') as HTMLInputElement)?.value,
        introduction: (document.querySelector('textarea[name="introduction"]') as HTMLTextAreaElement)?.value,
        visualizationId: (document.querySelector('input[name="visualizationId"]') as HTMLInputElement)?.value,
        bodySections: sections,
        quizQuestions,
      };
      localStorage.setItem(`module-draft-${initialData?.slug || 'new'}`, JSON.stringify(draft));
      setLastSaved(new Date());
      setIsDirty(false);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [isDirty, sections, quizQuestions, initialData?.slug]);

  const handleSubmit = () => {
    // Clear draft on submit (assume success; restore on error page if needed)
    localStorage.removeItem(`module-draft-${initialData?.slug || 'new'}`);
  };

  return (
    <div className="max-w-4xl pb-20 mx-auto">
      <form action={saveModuleLesson} onSubmit={handleSubmit} className="space-y-10">
        <input type="hidden" name="isEdit" value={isEdit ? "true" : "false"} />
        <input type="hidden" name="originalSlug" value={initialData?.slug || ""} />
        <input type="hidden" name="bodySections" value={JSON.stringify(sections)} />
        <input type="hidden" name="quizQuestions" value={JSON.stringify(quizQuestions)} />

        {/* --- CORE METADATA --- */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-8 space-y-8 shadow-2xl">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Category</label>
              <select
                name="categoryId"
                defaultValue={initialData?.categoryId || "fundamentals"}
                required
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white appearance-none cursor-pointer hover:border-white/20 transition-colors"
              >
                {categoriesList.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Lesson Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Lesson Title</label>
              <input
                type="text"
                name="title"
                defaultValue={initialData?.title}
                required
                placeholder="e.g. Redefining Privacy"
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Slug</label>
              <input
                type="text"
                name="slug"
                defaultValue={initialData?.slug}
                required
                placeholder="privacy-paradigm"
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white font-mono text-sm"
              />
            </div>

            {/* Tag (Optional in user request, but needed in DB) */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30">Tag (Internal)</label>
              <input
                type="text"
                name="tag"
                defaultValue={initialData?.tag || "Module"}
                placeholder="Module"
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-white/30 text-white/50"
              />
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Summary</label>
            <textarea
              name="summary"
              defaultValue={initialData?.summary}
              required
              rows={3}
              placeholder="Provide a concise summary for the module list..."
              className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white resize-none"
            />
          </div>
        </div>

        {/* --- INTRODUCTION --- */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-8 space-y-8 shadow-2xl">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-4">Introduction Section</h2>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Introduction Heading</label>
            <input
              type="text"
              name="introductionHeading"
              defaultValue={initialData?.introductionHeading}
              placeholder="e.g. Setting the Stage"
              className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-arcium-blue">Introduction Body</label>
            <textarea
              name="introduction"
              defaultValue={initialData?.introduction}
              rows={6}
              placeholder="The main introduction text for this module..."
              className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
            />
          </div>
        </div>

        {/* --- DYNAMIC SECTIONS --- */}
        <div className="space-y-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-white/40">Content Sections</h2>
            <span className="text-xs font-mono text-white/20">{sections.length} Section{sections.length !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="group relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-arcium-blue/20 group-hover:bg-arcium-blue transition-colors rounded-full" />
                
                <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-8 space-y-8 shadow-2xl relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Section {index + 1}</span>
                    {sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-[10px] font-bold text-red-500/50 hover:text-red-500 transition-colors uppercase tracking-widest border border-red-500/10 hover:border-red-500/50 px-3 py-1 rounded-sm"
                      >
                        Remove Section
                      </button>
                    )}
                  </div>

                  <div className="space-y-8">
                    {/* Section x Image */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Section {index + 1} Image (Optional)</label>
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <CldUploadWidget
                            signatureEndpoint="/api/cloudinary/sign"
                            uploadPreset={cloudinaryUploadPreset}
                            options={{
                              multiple: false,
                              maxFiles: 1,
                              sources: ["local", "url", "camera"],
                              resourceType: "image",
                              folder: "staff/modules",
                            }}
                            onSuccess={(result) => {
                              if (typeof result.info === "object" && result.info !== null) {
                                const info = result.info as CloudinaryUploadResultInfo;
                                if (info.secure_url) {
                                  updateSection(index, "visual", { type: "image", src: info.secure_url });
                                }
                              }
                            }}
                          >
                            {({ open }) => (
                              <button
                                type="button"
                                onClick={() => open()}
                                disabled={!cloudinaryUploadPreset}
                                className="flex-1 bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white text-sm font-mono hover:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {section.visual?.src ? "Replace image in Cloudinary" : "Upload image to Cloudinary"}
                              </button>
                            )}
                          </CldUploadWidget>
                          {section.visual?.src && (
                            <button
                              type="button"
                              onClick={() => updateSection(index, "visual", { type: "image", src: "" })}
                              className="bg-black border border-red-500/30 rounded-sm px-4 py-3 text-red-300 text-xs font-bold uppercase tracking-widest hover:bg-red-500/10 hover:border-red-400 transition-colors"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>
                        {section.visual?.src ? (
                          <div className="space-y-2">
                            <img
                              src={section.visual.src}
                              alt={`Section ${index + 1} preview`}
                              className="w-full max-h-48 object-cover rounded-sm border border-white/10"
                            />
                            <p className="text-xs text-white/50 break-all font-mono">{section.visual.src}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-white/30">
                            {cloudinaryUploadPreset
                              ? "No image selected yet."
                              : "Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads."}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Section x Heading */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Section {index + 1} Heading</label>
                      <textarea
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        rows={2}
                        placeholder="Headline for this section..."
                        className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white font-bold text-lg"
                      />
                    </div>

                    {/* Section x Body */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Section {index + 1} Body</label>
                      <textarea
                        value={section.body}
                        onChange={(e) => updateSection(index, 'body', e.target.value)}
                        rows={8}
                        placeholder="Detailed content for this section..."
                        className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={addSection}
              className="group flex items-center gap-3 bg-white/5 hover:bg-arcium-blue text-white hover:text-black px-10 py-4 rounded-sm transition-all duration-300 font-bold uppercase tracking-widest border border-white/10 hover:border-arcium-blue shadow-lg"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Add New Section
            </button>
          </div>
        </div>

        {/* --- ADVANCED / QUIZ --- */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-sm p-8 space-y-8 shadow-2xl opacity-60 hover:opacity-100 transition-opacity">
          <h2 className="text-xl font-bold uppercase tracking-widest text-white/40 border-b border-white/5 pb-4">Advanced Configuration</h2>
          
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Visualization ID (Advanced)</label>
              <input
                type="text"
                name="visualizationId"
                defaultValue={initialData?.visualizationId}
                placeholder="e.g. privacy-paradigm-anim"
                className="w-full bg-black border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white font-mono"
              />
            </div>

            <QuizBuilder 
              initialQuestions={quizQuestions} 
              onChange={handleQuizChange} 
            />
          </div>
        </div>

        {/* --- FORM ACTIONS --- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/10">
          <div className="flex items-center gap-4">
            {isEdit && (
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="text-red-500 hover:text-white px-6 py-3 rounded-sm border border-red-500/20 hover:bg-red-600 transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Module
              </button>
            )}
            {/* Autosave Indicator */}
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Save size={12} />
              {lastSaved ? (
                <span>Autosaved {formatTimeAgo(lastSaved)}</span>
              ) : (
                <span>Changes autosave every 30s</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <Link href="/staff/modules" className="text-white/40 hover:text-white transition-colors uppercase text-xs tracking-widest font-bold">
               Cancel
             </Link>
             <button
              type="submit"
              className="bg-arcium-blue text-black px-16 py-5 rounded-sm font-black hover:bg-white transition-all uppercase tracking-[0.2em] shadow-2xl shadow-arcium-blue/20 text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isEdit ? "Save Changes" : "Publish Module"}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {isDeleting && isEdit && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] border border-white/10 p-12 max-w-md w-full animate-in fade-in zoom-in-95 duration-200 shadow-2xl rounded-sm">
            <h3 className="text-3xl font-black mb-6 text-white uppercase tracking-tighter italic">Confirm Deletion</h3>
            <p className="text-white/50 mb-10 leading-relaxed font-medium">
              Are you sure you want to permanently delete <span className="text-arcium-blue font-bold underline">{initialData?.title}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-8">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="font-bold text-xs uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors"
              >
                Back
              </button>
              <form action={() => deleteModuleLesson(initialData?.slug || "")}>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-10 py-4 font-black hover:bg-red-500 transition-all text-xs uppercase tracking-[0.3em] shadow-xl shadow-red-600/20"
                >
                  Delete Forever
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
