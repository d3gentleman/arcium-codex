"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/modules";
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const username = String(formData.get("username") || "").trim().toLowerCase();
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const { error: signUpError } = await authClient.signUp.email({
      name: username,
      username,
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (signUpError) {
      setError(signUpError.message || "Unable to create your account.");
      setIsSubmitting(false);
      return;
    }

    setSuccess("Account created successfully.");
    setIsSubmitting(false);
    router.push(`/login?registered=1&callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <AuthShell title="Create Account" eyebrow="LEARNER_REGISTRY" subtitle="Username / Email / Password">
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
          name="username"
          placeholder="Username"
          required
          minLength={3}
          maxLength={30}
          pattern="^[a-z0-9_]+$"
          className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
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
          {isSubmitting ? "Creating..." : "Create Account"}
        </button>
        <div className="text-center text-[11px] uppercase tracking-[0.18em] text-on-surface-variant/70">
          <Link href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="hover:text-primary">
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={<AuthShell title="Create Account" eyebrow="LEARNER_REGISTRY" subtitle="Username / Email / Password" />}
    >
      <RegisterPageContent />
    </Suspense>
  );
}
