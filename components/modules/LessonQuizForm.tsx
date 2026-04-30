"use client";

import Link from "next/link";
import { startTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/types/domain";
import {
  AlignLeft,
  AlignJustify,
  ListOrdered,
  HelpCircle,
  Trophy,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";

interface LessonQuizFormProps {
  lessonSlug: string;
  questions: QuizQuestion[];
  canSubmit: boolean;
  isCompleted: boolean;
}

const QuestionTypeIcon = ({ type }: { type: QuizQuestion["type"] }) => {
  switch (type) {
    case "short_text":
      return <AlignLeft size={14} className="text-primary" />;
    case "long_text":
      return <AlignJustify size={14} className="text-primary" />;
    case "multiple_choice":
      return <ListOrdered size={14} className="text-primary" />;
    default:
      return <HelpCircle size={14} className="text-primary" />;
  }
};

export default function LessonQuizForm({
  lessonSlug,
  questions,
  canSubmit,
  isCompleted,
}: LessonQuizFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  // Load draft answers from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(`quiz-draft-${lessonSlug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraftAnswers(parsed);
        // Initialize char counts
        const counts: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, value]) => {
          counts[id] = String(value).length;
        });
        setCharCounts(counts);
      } catch {
        // Ignore parse errors
      }
    }
  }, [lessonSlug]);

  // Save draft answers to localStorage
  useEffect(() => {
    if (Object.keys(draftAnswers).length > 0) {
      localStorage.setItem(`quiz-draft-${lessonSlug}`, JSON.stringify(draftAnswers));
    }
  }, [draftAnswers, lessonSlug]);

  async function submitForm(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const answers = Object.fromEntries(
      questions.map((question) => [question.id, String(formData.get(question.id) || "")]),
    );

    try {
      const response = await fetch(`/api/lessons/${lessonSlug}/quiz`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Unable to submit your quiz.");
        return;
      }

      // Clear draft on successful submission
      localStorage.removeItem(`quiz-draft-${lessonSlug}`);
      setSuccess("Quiz submitted. This lesson is now marked complete.");
      router.refresh();
    } catch {
      setError("Unable to submit your quiz right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (questionId: string, value: string, maxLength: number) => {
    setDraftAnswers((prev) => ({ ...prev, [questionId]: value }));
    setCharCounts((prev) => ({ ...prev, [questionId]: value.length }));
  };

  if (!canSubmit) {
    return (
      <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
        <div className="flex items-start gap-3">
          <Lock size={18} className="mt-0.5 text-on-surface-variant/60 shrink-0" />
          <div>
            <p className="text-sm text-on-surface-variant leading-7">
              Sign in with a verified account to submit this lesson quiz and save progress.
            </p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/modules/${lessonSlug}`)}`}
              className="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02]"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => draftAnswers[q.id]?.trim()).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        startTransition(() => {
          void submitForm(formData);
        });
      }}
    >
      {/* Progress Header */}
      <div className="rounded-[1rem] border border-outline-variant/20 bg-surface-container-low p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/60">
            Progress
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            {answeredCount} of {questions.length} answered
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {questions.map((question, index) => (
        <div
          key={question.id}
          className="rounded-[1.2rem] border border-outline-variant/20 bg-surface-container-low p-5 transition-all focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(105,218,255,0.05)]"
        >
          <div className="mb-3 flex items-center gap-2">
            <QuestionTypeIcon type={question.type} />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Question {index + 1} of {questions.length}
            </span>
            {question.required && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error/80">
                Required
              </span>
            )}
          </div>
          <label className="mb-3 block text-sm font-semibold leading-7 text-white">
            {question.prompt}
          </label>
          {question.type === "short_text" ? (
            <div className="space-y-2">
              <input
                name={question.id}
                maxLength={500}
                required={question.required}
                defaultValue={draftAnswers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value, 500)}
                className="w-full rounded-lg border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary focus:shadow-[0_0_12px_rgba(105,218,255,0.15)]"
              />
              <div className="flex justify-end">
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    (charCounts[question.id] || 0) > 450 ? "text-error/80" : "text-on-surface-variant/50"
                  }`}
                >
                  {charCounts[question.id] || 0}/500
                </span>
              </div>
            </div>
          ) : null}
          {question.type === "long_text" ? (
            <div className="space-y-2">
              <textarea
                name={question.id}
                maxLength={5000}
                required={question.required}
                rows={5}
                defaultValue={draftAnswers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value, 5000)}
                className="w-full rounded-lg border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary focus:shadow-[0_0_12px_rgba(105,218,255,0.15)] resize-y"
              />
              <div className="flex justify-end">
                <span
                  className={`text-[10px] font-mono transition-colors ${
                    (charCounts[question.id] || 0) > 4500 ? "text-error/80" : "text-on-surface-variant/50"
                  }`}
                >
                  {charCounts[question.id] || 0}/5000
                </span>
              </div>
            </div>
          ) : null}
          {question.type === "multiple_choice" ? (
            <div className="space-y-2">
              {question.choices.map((choice) => (
                <label
                  key={choice}
                  className="group flex items-center gap-3 rounded-lg border border-outline-variant/20 px-4 py-3 text-sm text-on-surface-variant transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-white cursor-pointer"
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={choice}
                    required={question.required}
                    defaultChecked={draftAnswers[question.id] === choice}
                    onChange={(e) => handleInputChange(question.id, e.target.value, 0)}
                    className="peer sr-only"
                  />
                  <Circle
                    size={16}
                    className="text-on-surface-variant/40 transition-all peer-checked:hidden group-hover:text-primary/60"
                  />
                  <CheckCircle2
                    size={16}
                    className="hidden text-primary transition-all peer-checked:block"
                  />
                  <span className="flex-1">{choice}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3">
          <AlertCircle size={16} className="text-error" />
          <p className="text-sm text-error">{error}</p>
        </div>
      ) : null}
      {success ? (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-4">
          <div className="rounded-full bg-primary/20 p-2">
            <Trophy size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">Success!</p>
            <p className="text-sm text-on-surface-variant">{success}</p>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(105,218,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting...
          </>
        ) : isCompleted ? (
          <>
            <CheckCircle2 size={16} />
            Submit Updated Quiz
          </>
        ) : (
          <>
            <CheckCircle2 size={16} />
            Submit Quiz
          </>
        )}
      </button>
    </form>
  );
}
