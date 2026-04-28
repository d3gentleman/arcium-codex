"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import { authClient } from "@/lib/auth-client";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/modules";
  const registered = searchParams.get("registered");
  const { data: session, isPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      router.push(callbackUrl);
    }
  }, [callbackUrl, router, session]);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: callbackUrl,
    });

    if (signInError) {
      setError(signInError.message || "Unable to sign in.");
      setIsSubmitting(false);
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <AuthShell title="Learner Login" eyebrow="ACCOUNT_ACCESS_V1" subtitle="Email / Password">
      {registered ? (
        <p className="mb-4 text-sm leading-7 text-primary">
          Account created successfully. You can now sign in.
        </p>
      ) : null}
      {isPending ? (
        <div className="py-8 text-center text-xs uppercase tracking-[0.2em] text-primary">Loading Session...</div>
      ) : (
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
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full border border-outline-variant/30 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-colors focus:border-primary"
          />
          {error ? <p className="text-sm text-red-300">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full border-2 border-primary bg-primary/10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
          <div className="flex justify-between text-[11px] uppercase tracking-[0.18em] text-on-surface-variant/70">
            <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="hover:text-primary">
              Create Account
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthShell title="Learner Login" eyebrow="ACCOUNT_ACCESS_V1" subtitle="Email / Password" />}>
      <LoginPageContent />
    </Suspense>
  );
}
