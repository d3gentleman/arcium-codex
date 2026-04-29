"use client";

import { useState } from "react";
import { saveModuleLesson, deleteModuleLesson } from "./actions";
import { Trash2, Plus, X } from "lucide-react";
import { BodySection } from "@/types/domain";

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

const MODULE_CATEGORIES = [
  { id: "fundamentals", title: "Fundamentals" },
  { id: "architecture", title: "Architecture" },
  { id: "execution", title: "Execution" },
  { id: "security", title: "Security" },
  { id: "economics", title: "Economics" },
];

export default function ModuleForm({
  initialData,
  isEdit = false,
}: {
  initialData?: ModuleData;
  categories?: Category[];
  isEdit?: boolean;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Body Sections State
  const [sections, setSections] = useState<BodySection[]>(
    initialData?.bodySections || []
  );

  // Quiz questions state
  const [quizQuestionsStr, setQuizQuestionsStr] = useState(
    JSON.stringify(initialData?.quizQuestions || [], null, 2)
  );

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
  };

  return (
    <div className="max-w-4xl pb-20">
      <form action={saveModuleLesson} className="space-y-12">
        <input type="hidden" name="isEdit" value={isEdit ? "true" : "false"} />
        <input type="hidden" name="originalSlug" value={initialData?.slug || ""} />
        <input type="hidden" name="bodySections" value={JSON.stringify(sections)} />

        {/* 1. Category */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Category</label>
            <select
              name="categoryId"
              defaultValue={initialData?.categoryId || "fundamentals"}
              required
              className="w-full bg-[#111] border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
            >
              {MODULE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Lesson Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Lesson Title</label>
            <input
              type="text"
              name="title"
              defaultValue={initialData?.title}
              required
              placeholder="Enter lesson title..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
            />
          </div>

          {/* 3. Slug */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Slug</label>
            <input
              type="text"
              name="slug"
              defaultValue={initialData?.slug}
              required
              placeholder="lesson-slug-here"
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white font-mono text-sm"
            />
          </div>

          {/* 4. Summary */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Summary</label>
            <textarea
              name="summary"
              defaultValue={initialData?.summary}
              required
              rows={3}
              placeholder="Short description for the module list..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white resize-y"
            />
          </div>
        </div>

        {/* 5. Introduction Heading & 6. Introduction Body */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Introduction Heading</label>
            <input
              type="text"
              name="introductionHeading"
              defaultValue={initialData?.introductionHeading}
              placeholder="Heading for the introduction section..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-arcium-blue">Introduction Body</label>
            <textarea
              name="introduction"
              defaultValue={initialData?.introduction}
              rows={5}
              placeholder="Main introduction content..."
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white resize-y"
            />
          </div>
        </div>

        {/* Sections Management */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-b border-white/10 pb-4">Content Sections</h2>
          
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-sm p-8 relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Section {index + 1}</span>
                </div>

                <div className="space-y-6">
                  {/* Section x Image */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Section {index + 1} Image URL</label>
                    <input
                      type="text"
                      value={section.visual?.src || ""}
                      onChange={(e) => updateSection(index, 'visual', { src: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
                    />
                  </div>

                  {/* Section x Heading */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Section {index + 1} Heading</label>
                    <textarea
                      value={section.title}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      rows={2}
                      placeholder="Section title..."
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white resize-y"
                    />
                  </div>

                  {/* Section x Body */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Section {index + 1} Body</label>
                    <textarea
                      value={section.body}
                      onChange={(e) => updateSection(index, 'body', e.target.value)}
                      rows={6}
                      placeholder="Section content..."
                      className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white resize-y"
                    />
                  </div>
                </div>

                {/* Remove section button */}
                <div className="pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSection(index)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    <Trash2 size={14} /> Remove Section {index + 1}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={addSection}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-sm transition-colors text-sm font-bold uppercase tracking-wider border border-white/5"
            >
              <Plus size={18} /> Add New Section
            </button>
          </div>
        </div>

        {/* Hidden / Advanced Fields */}
        <div className="bg-white/5 border border-white/10 rounded-sm p-8 space-y-6">
          <h3 className="text-lg font-bold">Metadata & Interactivity</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Visualization ID</label>
              <input
                type="text"
                name="visualizationId"
                defaultValue={initialData?.visualizationId}
                placeholder="Optional ID for custom visuals..."
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-widest">Quiz Questions (JSON)</label>
              <textarea
                name="quizQuestions"
                value={quizQuestionsStr}
                onChange={(e) => setQuizQuestionsStr(e.target.value)}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 focus:outline-none focus:border-arcium-blue text-white font-mono text-sm resize-y"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-12 border-t border-white/10">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="text-red-500 hover:text-red-400 font-medium px-4 py-2 rounded-sm border border-red-500/30 hover:bg-red-500/10 transition-colors flex items-center gap-2 text-sm uppercase tracking-wider"
              >
                <Trash2 size={16} />
                Delete Module
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-arcium-blue text-black px-12 py-4 rounded-sm font-bold hover:bg-arcium-blue/90 transition-colors uppercase tracking-widest shadow-xl shadow-arcium-blue/20 text-lg"
          >
            {isEdit ? "Update Module" : "Create Module"}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {isDeleting && isEdit && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#050505] border border-white/10 p-10 max-w-md w-full animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
            <h3 className="text-2xl font-bold mb-4 text-white">Delete Module?</h3>
            <p className="text-white/60 mb-10 leading-relaxed">
              This will permanently remove <span className="text-white font-bold">{initialData?.title}</span> from the Arcium Codex curriculum.
            </p>
            <div className="flex items-center justify-end gap-6">
              <button
                type="button"
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest text-white/40"
              >
                Cancel
              </button>
              <form action={() => deleteModuleLesson(initialData?.slug || "")}>
                <button
                  type="submit"
                  className="bg-red-600 text-white px-8 py-3 font-bold hover:bg-red-500 transition-colors text-xs uppercase tracking-widest shadow-lg shadow-red-600/20"
                >
                  Confirm Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
