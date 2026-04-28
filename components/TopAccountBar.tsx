"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface AccountSummary {
  authenticated: boolean;
  user?: {
    name: string;
    email: string;
  };
  progress?: {
    completedLessons: number;
    totalLessons: number;
    commentCount: number;
    nextLesson: {
      title: string;
      href: string;
    } | null;
  };
}

const HIDDEN_PREFIXES = ["/keystatic", "/login", "/register"];

export default function TopAccountBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [summary, setSummary] = useState<AccountSummary | null>(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      setSummary(null);
      return;
    }

    let cancelled = false;

    async function loadSummary() {
      setIsSummaryLoading(true);

      try {
        const response = await fetch("/api/account/summary", {
          credentials: "include",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as AccountSummary;

        if (!cancelled) {
          setSummary(data);
        }
      } finally {
        if (!cancelled) {
          setIsSummaryLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      cancelled = true;
    };
  }, [session?.user]);

  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  const callbackUrl = encodeURIComponent(pathname || "/");

  return (
    <div className="sticky top-0 z-30 border-b border-white/8 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-on-surface-variant lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="hidden border border-primary/25 bg-primary/8 px-2 py-1 font-mono text-[10px] text-primary sm:inline-flex">
            LEARNER_LINK
          </span>
          {session?.user ? (
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <span className="truncate text-white">
                Welcome, {summary?.user?.name || session.user.username || session.user.email}
              </span>
              <span>{summary?.progress?.completedLessons ?? 0}/{summary?.progress?.totalLessons ?? 0} lessons complete</span>
              <span>{summary?.progress?.commentCount ?? 0} comments</span>
              {summary?.progress?.nextLesson ? (
                <Link href={summary.progress.nextLesson.href} className="text-primary transition-colors hover:text-white">
                  Continue: {summary.progress.nextLesson.title}
                </Link>
              ) : (
                <Link href="/modules" className="text-primary transition-colors hover:text-white">
                  Review modules
                </Link>
              )}
            </div>
          ) : (
            <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
              <span>Save quiz progress and join lesson discussions.</span>
              <Link
                href={`/login?callbackUrl=${callbackUrl}`}
                className="text-primary transition-colors hover:text-white"
              >
                Log in
              </Link>
              <Link
                href={`/register?callbackUrl=${callbackUrl}`}
                className="text-primary transition-colors hover:text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {session?.user ? (
            <>
              <Link href="/modules" className="transition-colors hover:text-white">
                Modules
              </Link>
              <button
                type="button"
                disabled={isPending || isSummaryLoading}
                onClick={async () => {
                  await authClient.signOut();
                  setSummary(null);
                  router.refresh();
                  router.push("/");
                }}
                className="border border-white/10 px-3 py-1 text-on-surface-variant transition-colors hover:border-primary/35 hover:text-primary disabled:opacity-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/modules" className="transition-colors hover:text-white">
              Browse lessons
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
