"use client";

import { useState, useCallback } from "react";
import { QuizQuestion } from "@/types/domain";
import { 
  Plus, 
  AlignLeft, 
  AlignJustify, 
  ListOrdered, 
  Trash2, 
  Copy, 
  GripVertical,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Lightbulb,
  HelpCircle
} from "lucide-react";

interface QuizBuilderProps {
  initialQuestions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

type BuilderMode = 
  | { type: 'idle' }
  | { type: 'creating'; questionType: QuizQuestion['type'] }
  | { type: 'editing'; questionId: string };

interface DraftQuestion {
  id?: string;
  type: QuizQuestion['type'];
  prompt: string;
  required: boolean;
  points: number;
  hint?: string;
  explanation?: string;
  correctAnswer?: string;
  choices?: string[];
  requiresManualGrading?: boolean;
}

const generateId = () => `q-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

export default function QuizBuilder({ initialQuestions, onChange }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [mode, setMode] = useState<BuilderMode>({ type: 'idle' });
  const [draft, setDraft] = useState<DraftQuestion | null>(null);
  const [previewMode, setPreviewMode] = useState<'learner' | 'staff'>('learner');

  const updateQuestions = useCallback((newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions);
    onChange(newQuestions);
  }, [onChange]);

  const startCreating = (type: QuizQuestion['type']) => {
    setMode({ type: 'creating', questionType: type });
    setDraft({
      type,
      prompt: '',
      required: true,
      points: 1,
      choices: type === 'multiple_choice' ? ['', ''] : undefined,
    });
  };

  const startEditing = (question: QuizQuestion) => {
    setMode({ type: 'editing', questionId: question.id });
    setDraft({
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      required: question.required,
      points: question.points ?? 1,
      hint: question.hint,
      explanation: question.explanation,
      correctAnswer: question.correctAnswer,
      choices: question.type === 'multiple_choice' ? [...question.choices] : undefined,
      requiresManualGrading: question.type === 'long_text' ? question.requiresManualGrading : undefined,
    });
  };

  const cancelEditing = () => {
    setMode({ type: 'idle' });
    setDraft(null);
  };

  const finalizeQuestion = () => {
    if (!draft || !draft.prompt.trim()) return;

    const question: QuizQuestion = {
      id: draft.id || generateId(),
      type: draft.type,
      prompt: draft.prompt.trim(),
      required: draft.required,
      points: draft.points,
      ...(draft.hint && { hint: draft.hint.trim() }),
      ...(draft.explanation && { explanation: draft.explanation.trim() }),
      ...(draft.correctAnswer && { correctAnswer: draft.correctAnswer.trim() }),
      ...(draft.type === 'multiple_choice' && draft.choices && {
        choices: draft.choices.filter(c => c.trim()).map(c => c.trim())
      }),
      ...(draft.type === 'long_text' && { requiresManualGrading: draft.requiresManualGrading }),
    } as QuizQuestion;

    if (mode.type === 'editing') {
      updateQuestions(questions.map(q => q.id === question.id ? question : q));
    } else {
      updateQuestions([...questions, question]);
    }

    setMode({ type: 'idle' });
    setDraft(null);
  };

  const deleteQuestion = (id: string) => {
    updateQuestions(questions.filter(q => q.id !== id));
    if (mode.type === 'editing' && mode.questionId === id) {
      setMode({ type: 'idle' });
      setDraft(null);
    }
  };

  const duplicateQuestion = (question: QuizQuestion) => {
    const newQuestion: QuizQuestion = {
      ...question,
      id: generateId(),
      prompt: `${question.prompt} (Copy)`,
    };
    updateQuestions([...questions, newQuestion]);
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const newQuestions = [...questions];
    const [moved] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, moved);
    updateQuestions(newQuestions);
  };

  const updateDraft = (updates: Partial<DraftQuestion>) => {
    setDraft(prev => prev ? { ...prev, ...updates } : null);
  };

  const isValid = () => {
    if (!draft || !draft.prompt.trim()) return false;
    if (draft.type === 'multiple_choice') {
      const validChoices = (draft.choices || []).filter(c => c.trim());
      return validChoices.length >= 2 && draft.correctAnswer && validChoices.includes(draft.correctAnswer);
    }
    return true;
  };

  const renderQuestionCard = (question: QuizQuestion, index: number) => {
    const isEditing = mode.type === 'editing' && mode.questionId === question.id;
    const isCreating = mode.type === 'creating';
    
    if (isEditing && draft) {
      return (
        <div className="rounded-lg border border-arcium-blue/40 bg-arcium-blue/5 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QuestionTypeIcon type={draft.type} />
              <span className="text-xs font-bold uppercase tracking-widest text-arcium-blue">
                Editing Question {index + 1}
              </span>
            </div>
            <button 
              onClick={cancelEditing}
              className="text-white/40 hover:text-white text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>

          {/* Prompt */}
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-widest text-white/50">Question Prompt</label>
            <textarea
              value={draft.prompt}
              onChange={(e) => updateDraft({ prompt: e.target.value })}
              rows={2}
              className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none resize-none"
              placeholder="Enter your question..."
            />
          </div>

          {/* Multiple Choice Options */}
          {draft.type === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">Choices</label>
              {draft.choices?.map((choice, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={choice}
                    onChange={(e) => {
                      const newChoices = [...(draft.choices || [])];
                      newChoices[i] = e.target.value;
                      updateDraft({ choices: newChoices });
                    }}
                    className="flex-1 bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none"
                    placeholder={`Choice ${i + 1}`}
                  />
                  {draft.choices && draft.choices.length > 2 && (
                    <button
                      onClick={() => {
                        const newChoices = draft.choices?.filter((_, idx) => idx !== i);
                        updateDraft({ choices: newChoices });
                      }}
                      className="text-red-500/50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => updateDraft({ choices: [...(draft.choices || []), ''] })}
                className="text-xs text-arcium-blue hover:text-white uppercase tracking-widest"
              >
                + Add Choice
              </button>
            </div>
          )}

          {/* Correct Answer */}
          {draft.type !== 'long_text' && (
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Correct Answer
              </label>
              {draft.type === 'multiple_choice' ? (
                <select
                  value={draft.correctAnswer || ''}
                  onChange={(e) => updateDraft({ correctAnswer: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none"
                >
                  <option value="">Select correct answer</option>
                  {draft.choices?.filter(c => c.trim()).map((choice) => (
                    <option key={choice} value={choice}>{choice}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={draft.correctAnswer || ''}
                  onChange={(e) => updateDraft({ correctAnswer: e.target.value })}
                  className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none"
                  placeholder="Enter correct answer..."
                />
              )}
            </div>
          )}

          {/* Optional Fields */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Points</label>
                <input
                  type="number"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={draft.points}
                  onChange={(e) => updateDraft({ points: parseFloat(e.target.value) || 1 })}
                  className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/50">Required</label>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={draft.required}
                    onChange={(e) => updateDraft({ required: e.target.checked })}
                    className="accent-arcium-blue"
                  />
                  <span className="text-sm text-white/70">Required question</span>
                </div>
              </div>
            </div>

            {/* Hint */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50 flex items-center gap-1">
                <Lightbulb size={12} /> Hint (shown to learners)
              </label>
              <input
                type="text"
                value={draft.hint || ''}
                onChange={(e) => updateDraft({ hint: e.target.value })}
                className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none"
                placeholder="Optional hint for struggling learners..."
              />
            </div>

            {/* Explanation */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-white/50">
                Explanation (shown after submission)
              </label>
              <textarea
                value={draft.explanation || ''}
                onChange={(e) => updateDraft({ explanation: e.target.value })}
                rows={2}
                className="w-full bg-black border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:border-arcium-blue focus:outline-none resize-none"
                placeholder="Explain why the answer is correct..."
              />
            </div>
          </div>

          {/* Preview Toggle */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setPreviewMode('learner')}
                className={`text-xs uppercase tracking-widest px-3 py-1 rounded-sm transition-colors ${
                  previewMode === 'learner' ? 'bg-arcium-blue text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                Learner View
              </button>
              <button
                onClick={() => setPreviewMode('staff')}
                className={`text-xs uppercase tracking-widest px-3 py-1 rounded-sm transition-colors ${
                  previewMode === 'staff' ? 'bg-arcium-blue text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                Staff View
              </button>
            </div>
            <div className="bg-black/50 rounded-sm p-4 border border-white/10">
              {previewMode === 'learner' ? (
                <QuestionPreviewLearner draft={draft} />
              ) : (
                <QuestionPreviewStaff draft={draft} />
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={cancelEditing}
              className="text-white/50 hover:text-white text-xs uppercase tracking-widest px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={finalizeQuestion}
              disabled={!isValid()}
              className="bg-arcium-blue text-black px-6 py-2 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode.type === 'editing' ? 'Save Changes' : 'Add Question'}
            </button>
          </div>
        </div>
      );
    }

    // Collapsed view
    const hasCorrectAnswer = 'correctAnswer' in question && question.correctAnswer;
    
    return (
      <div className="rounded-lg border border-white/10 bg-black/30 p-4 hover:border-white/20 transition-colors group">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-white/20 group-hover:text-white/40 cursor-move">
            <GripVertical size={16} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <QuestionTypeIcon type={question.type} />
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                Q{index + 1}
              </span>
              {question.required && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-error/70">
                  Required
                </span>
              )}
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                {question.points ?? 1} pt{question.points !== 1 ? 's' : ''}
              </span>
              {hasCorrectAnswer && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Answer set
                </span>
              )}
            </div>
            <p className="text-sm text-white truncate">{question.prompt}</p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => startEditing(question)}
              className="p-1.5 text-white/40 hover:text-arcium-blue transition-colors"
              title="Edit"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => duplicateQuestion(question)}
              className="p-1.5 text-white/40 hover:text-arcium-blue transition-colors"
              title="Duplicate"
            >
              <Copy size={14} />
            </button>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-1.5 text-white/40 hover:text-red-500 transition-colors"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/50">
          Quiz Questions
        </h3>
        <span className="text-xs text-white/30">{questions.length} total</span>
      </div>

      {/* Question Type Buttons */}
      {mode.type === 'idle' && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => startCreating('short_text')}
            className="flex items-center gap-2 bg-white/5 hover:bg-arcium-blue hover:text-black text-white/70 px-4 py-2 rounded-sm transition-all text-xs uppercase tracking-widest font-bold border border-white/10 hover:border-arcium-blue"
          >
            <AlignLeft size={14} />
            Short Text
          </button>
          <button
            onClick={() => startCreating('long_text')}
            className="flex items-center gap-2 bg-white/5 hover:bg-arcium-blue hover:text-black text-white/70 px-4 py-2 rounded-sm transition-all text-xs uppercase tracking-widest font-bold border border-white/10 hover:border-arcium-blue"
          >
            <AlignJustify size={14} />
            Long Text
          </button>
          <button
            onClick={() => startCreating('multiple_choice')}
            className="flex items-center gap-2 bg-white/5 hover:bg-arcium-blue hover:text-black text-white/70 px-4 py-2 rounded-sm transition-all text-xs uppercase tracking-widest font-bold border border-white/10 hover:border-arcium-blue"
          >
            <ListOrdered size={14} />
            Multiple Choice
          </button>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-3">
        {questions.map((q, i) => (
          <div key={q.id}>
            {renderQuestionCard(q, i)}
          </div>
        ))}
        
        {questions.length === 0 && mode.type === 'idle' && (
          <div className="text-center py-8 text-white/30 border border-dashed border-white/10 rounded-lg">
            <HelpCircle size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No questions yet. Click a button above to add one.</p>
          </div>
        )}
      </div>

      {/* Reorder Controls (shown when idle and has questions) */}
      {mode.type === 'idle' && questions.length > 1 && (
        <div className="text-xs text-white/30 text-center">
          Tip: Drag handles (⋮⋮) let you reorder questions
        </div>
      )}
    </div>
  );
}

// Helper Components

function QuestionTypeIcon({ type }: { type: QuizQuestion['type'] }) {
  switch (type) {
    case 'short_text': return <AlignLeft size={14} className="text-arcium-blue" />;
    case 'long_text': return <AlignJustify size={14} className="text-arcium-blue" />;
    case 'multiple_choice': return <ListOrdered size={14} className="text-arcium-blue" />;
    default: return <HelpCircle size={14} className="text-arcium-blue" />;
  }
}

function QuestionPreviewLearner({ draft }: { draft: DraftQuestion }) {
  if (!draft.prompt) {
    return <p className="text-sm text-white/30 italic">Enter a prompt to see preview</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <QuestionTypeIcon type={draft.type} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-arcium-blue">
          Question
        </span>
        {draft.required && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-error/70">
            Required
          </span>
        )}
      </div>
      
      <p className="text-sm text-white font-medium">{draft.prompt}</p>

      {draft.hint && (
        <div className="flex items-start gap-2 text-xs text-arcium-blue/80 bg-arcium-blue/10 rounded-sm px-2 py-1.5">
          <Lightbulb size={12} className="mt-0.5 shrink-0" />
          <span>{draft.hint}</span>
        </div>
      )}

      {draft.type === 'short_text' && (
        <div className="h-9 bg-black/50 border border-white/20 rounded-sm" />
      )}
      
      {draft.type === 'long_text' && (
        <div className="h-24 bg-black/50 border border-white/20 rounded-sm" />
      )}
      
      {draft.type === 'multiple_choice' && draft.choices && (
        <div className="space-y-1.5">
          {draft.choices.filter(c => c.trim()).map((choice, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-white/70">
              <div className="w-4 h-4 rounded-full border border-white/30" />
              {choice}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionPreviewStaff({ draft }: { draft: DraftQuestion }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-black/30 rounded-sm p-2">
          <span className="text-white/40 uppercase tracking-wider">Type</span>
          <p className="text-white capitalize">{draft.type.replace('_', ' ')}</p>
        </div>
        <div className="bg-black/30 rounded-sm p-2">
          <span className="text-white/40 uppercase tracking-wider">Points</span>
          <p className="text-white">{draft.points}</p>
        </div>
      </div>
      
      {draft.correctAnswer && (
        <div className="bg-primary/10 border border-primary/30 rounded-sm p-2">
          <span className="text-primary/70 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 size={10} /> Correct Answer
          </span>
          <p className="text-white mt-0.5">{draft.correctAnswer}</p>
        </div>
      )}
      
      {!draft.correctAnswer && draft.type !== 'long_text' && (
        <div className="bg-error/10 border border-error/30 rounded-sm p-2">
          <span className="text-error/70 uppercase tracking-wider flex items-center gap-1">
            <XCircle size={10} /> No correct answer set
          </span>
        </div>
      )}
      
      {draft.explanation && (
        <div className="bg-black/30 rounded-sm p-2">
          <span className="text-white/40 uppercase tracking-wider">Explanation</span>
          <p className="text-white/70 mt-0.5 italic">{draft.explanation}</p>
        </div>
      )}
      
      {draft.requiresManualGrading && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-sm p-2">
          <span className="text-yellow-500/70 uppercase tracking-wider">
            ⚠️ Requires Manual Grading
          </span>
        </div>
      )}
    </div>
  );
}
