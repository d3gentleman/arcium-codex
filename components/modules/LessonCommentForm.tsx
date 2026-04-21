"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface LessonCommentFormProps {
  lessonSlug: string;
  canComment: boolean;
}

export default function LessonCommentForm({ lessonSlug, canComment }: LessonCommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitComment() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/lessons/${lessonSlug}/comments`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ body }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error || "Unable to post your comment.");
        return;
      }

      setBody("");
      router.refresh();
    } catch {
      setError("Unable to post your comment right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!canComment) {
    return (
      <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5 text-sm text-on-surface-variant">
        <p className="leading-7">Sign in with a verified account to join this lesson discussion.</p>
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/modules/${lessonSlug}`)}`}
          className="mt-4 inline-flex border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-colors hover:bg-primary/20"
        >
          Sign In to Comment
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Add a lesson note or question..."
        className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={() =>
          startTransition(() => {
            void submitComment();
          })
        }
        className="inline-flex border border-primary/30 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Posting..." : "Post Comment"}
      </button>
    </div>
  );
}
