"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

function ResetPasswordPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (!token) {
      setError("Reset token is missing or invalid.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const newPassword = String(formData.get("password") || "");
    const { error: resetError } = await authClient.resetPassword({
      token,
      newPassword,
    });

    if (resetError) {
      setError(resetError.message || "Unable to reset your password.");
      setIsSubmitting(false);
      return;
    }

    router.push("/login");
  }

  return (
    <AuthShell title="Set New Password" eyebrow="TOKEN_RECOVERY" subtitle="Credential Update">
      <form
        className="space-y-4"
        action={(formData) => {
          startTransition(() => {
            void handleSubmit(formData);
          });
        }}
      >
        <input
          name="password"
          type="password"
          placeholder="New Password"
          required
          minLength={8}
          className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
        />
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full border-2 border-primary bg-primary/10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={<AuthShell title="Set New Password" eyebrow="TOKEN_RECOVERY" subtitle="Credential Update" />}
    >
      <ResetPasswordPageContent />
    </Suspense>
  );
}
