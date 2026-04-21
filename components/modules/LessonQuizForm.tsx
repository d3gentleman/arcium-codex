"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/types/domain";

interface LessonQuizFormProps {
  lessonSlug: string;
  questions: QuizQuestion[];
  canSubmit: boolean;
  isCompleted: boolean;
}

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

      setSuccess("Quiz submitted. This lesson is now marked complete.");
      router.refresh();
    } catch {
      setError("Unable to submit your quiz right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!canSubmit) {
    return (
      <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5 text-sm text-on-surface-variant">
        <p className="leading-7">
          Sign in with a verified account to submit this lesson quiz and save progress.
        </p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/modules/${lessonSlug}`)}`}
          className="mt-4 inline-flex border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
        >
          Sign In to Continue
        </Link>
      </div>
    );
  }

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        startTransition(() => {
          void submitForm(formData);
        });
      }}
    >
      {questions.map((question, index) => (
        <div
          key={question.id}
          className="rounded-[1.2rem] border border-outline-variant/20 bg-surface-container-low p-5"
        >
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
            Question {index + 1}
          </div>
          <label className="mb-3 block text-sm font-semibold leading-7 text-white">{question.prompt}</label>
          {question.type === "short_text" ? (
            <input
              name={question.id}
              maxLength={500}
              required={question.required}
              className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
            />
          ) : null}
          {question.type === "long_text" ? (
            <textarea
              name={question.id}
              maxLength={5000}
              required={question.required}
              rows={5}
              className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
            />
          ) : null}
          {question.type === "multiple_choice" ? (
            <div className="space-y-3">
              {question.choices.map((choice) => (
                <label
                  key={choice}
                  className="flex items-center gap-3 border border-outline-variant/20 px-4 py-3 text-sm text-on-surface-variant transition-colors hover:border-primary/40 hover:text-white"
                >
                  <input type="radio" name={question.id} value={choice} required={question.required} />
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          ) : null}
        </div>
      ))}

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      {success ? <p className="text-sm text-primary">{success}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex border border-primary/30 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Submitting..." : isCompleted ? "Submit Updated Quiz" : "Submit Quiz"}
      </button>
    </form>
  );
}
