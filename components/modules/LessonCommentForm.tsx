"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface LessonCommentFormProps {
  lessonSlug: string;
  canComment: boolean;
}

export default function LessonCommentForm({ lessonSlug, canComment }: LessonCommentFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const charCount = body.length;
  const isNearLimit = charCount > 1800;

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
      <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
        <div className="flex items-start gap-3">
          <Lock size={18} className="mt-0.5 text-on-surface-variant/60 shrink-0" />
          <div>
            <p className="text-sm text-on-surface-variant leading-7">
              Sign in with a verified account to join this lesson discussion.
            </p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/modules/${lessonSlug}`)}`}
              className="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02]"
            >
              Sign In to Comment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          rows={4}
          maxLength={2000}
          placeholder="Add a lesson note or question..."
          className="w-full rounded-lg border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:border-primary focus:shadow-[0_0_12px_rgba(105,218,255,0.15)] resize-y"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/50">
            <MessageSquare size={12} />
            <span>Markdown supported: **bold** *italic* `code`</span>
          </div>
          <span
            className={`text-[10px] font-mono transition-colors ${
              isNearLimit ? "text-error/80" : "text-on-surface-variant/50"
            }`}
          >
            {charCount}/2000
          </span>
        </div>
      </div>
      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3">
          <AlertCircle size={16} className="text-error" />
          <p className="text-sm text-error">{error}</p>
        </div>
      ) : null}
      <button
        type="button"
        disabled={isSubmitting || !body.trim()}
        onClick={() =>
          startTransition(() => {
            void submitComment();
          })
        }
        className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(105,218,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Posting...
          </>
        ) : (
          <>
            <Send size={16} />
            Post Comment
          </>
        )}
      </button>
    </div>
  );
}
