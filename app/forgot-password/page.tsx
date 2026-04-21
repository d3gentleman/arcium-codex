"use client";

import Link from "next/link";
import { useState } from "react";
import { startTransition } from "react";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error: resetError } = await authClient.requestPasswordReset({
      email,
      redirectTo,
    });

    if (resetError) {
      setError(resetError.message || "Unable to send a reset email.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Reset email sent. Check Mailpit for the reset link.");
    setIsSubmitting(false);
  }

  return (
    <AuthShell title="Reset Password" eyebrow="RECOVERY_CHANNEL" subtitle="Mailpit Development Flow">
      {success ? <p className="mb-4 text-sm leading-7 text-primary">{success}</p> : null}
      <form
        className="space-y-4"
        action={(formData) => {
          startTransition(() => {
            void handleSubmit(formData);
          });
        }}
      >
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-2 border-primary bg-primary/10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send Reset Email"}
        </button>
        <div className="text-center text-[11px] uppercase tracking-[0.18em] text-on-surface-variant/70">
          <Link href="/login" className="hover:text-primary">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}
