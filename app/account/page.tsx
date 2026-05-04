import type { Metadata } from "next";
import { redirect } from "next/navigation";
import ProfileConsoleHeader from "@/components/profile/ProfileConsoleHeader";
import UserProfileDossier, { type AchievementSlot, type CategoryProgressRow } from "@/components/profile/UserProfileDossier";
import { MODULES_PAGE_CONFIG } from "@/lib/config";
import { getModuleLessons } from "@/lib/content";
import { query } from "@/lib/db";
import { getCompletedLessonSlugs, getLessonCommentCountForUser } from "@/lib/lesson-store";
import { getCurrentSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "User Profile | ARCIUM ACADEMY",
  description: "Learner dossier, curriculum telemetry, and mission progress for Arcium Academy.",
};

function operatorHandle(username: string | undefined, email: string | undefined) {
  const raw = (username || email || "operator")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 18);
  return `OPERATOR_${raw || "UNKNOWN"}`;
}

function userInitials(username: string | undefined, email: string | undefined) {
  const source = (username || email || "NA").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (source.length >= 2) {
    return source.slice(0, 2);
  }
  return "OP";
}

function rankLabel(completedCount: number) {
  if (completedCount >= 8) {
    return "ARCHIVIST";
  }
  if (completedCount >= 6) {
    return "CRYPTOGRAPHER_III";
  }
  if (completedCount >= 4) {
    return "CRYPTOGRAPHER_II";
  }
  if (completedCount >= 2) {
    return "CRYPTOGRAPHER_I";
  }
  if (completedCount >= 1) {
    return "LEARNER_I";
  }
  return "INITIATE";
}

function clearanceForRole(role: string | undefined) {
  if (role === "admin") {
    return "LEVEL_5";
  }
  if (role === "staff") {
    return "LEVEL_4+";
  }
  return "LEVEL_4";
}

function buildAchievements(orderedLessons: { slug: string; tag: string }[], completed: Set<string>): AchievementSlot[] {
  const slots: AchievementSlot[] = [];

  for (let i = 0; i < 3; i += 1) {
    const lesson = orderedLessons[i];
    if (!lesson) {
      slots.push({
        id: `slot-${i}`,
        label: "LOCK",
        subtitle: "NO_SLOT",
        unlocked: false,
      });
      continue;
    }

    const unlocked = completed.has(lesson.slug);
    slots.push({
      id: lesson.slug,
      label: `MOD_${String(i + 1).padStart(2, "0")}`,
      subtitle: unlocked ? "COMPLETE" : "PENDING",
      unlocked,
    });
  }

  return slots;
}

export default async function AccountPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=${encodeURIComponent("/account")}`);
  }

  const user = session.user as {
    id: string;
    email: string;
    name?: string | null;
    username?: string | null;
    role?: string;
  };

  const [lessons, completedSlugs, commentCount] = await Promise.all([
    getModuleLessons(),
    getCompletedLessonSlugs(user.id),
    getLessonCommentCountForUser(user.id),
  ]);

  const completed = new Set(completedSlugs);
  const orderedLessons = [...lessons];

  const categoryRows: CategoryProgressRow[] = MODULES_PAGE_CONFIG.categories.map((cat) => {
    const catLessons = lessons.filter((l) => l.categoryId === cat.id);
    const done = catLessons.filter((l) => completed.has(l.slug)).length;
    const total = catLessons.length;
    const percent = total === 0 ? 0 : (done / total) * 100;
    return {
      id: cat.id,
      title: cat.title.toUpperCase(),
      percent,
    };
  });

  const achievements = buildAchievements(
    orderedLessons.map((l) => ({ slug: l.slug, tag: l.tag })),
    completed,
  );

  let joinLabel = "—";
  try {
    const joinRow = await query<{ createdAt: string }>(
      'SELECT "createdAt" as "createdAt" FROM "user" WHERE id = $1 LIMIT 1',
      [user.id],
    );
    const joinRaw = joinRow.rows[0]?.createdAt;
    if (joinRaw) {
      const d = new Date(joinRaw);
      joinLabel = `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
    }
  } catch {
    joinLabel = "—";
  }

  const completedCount = completedSlugs.length;
  const totalXp = completedCount * 1100 + commentCount * 35;
  const handle = operatorHandle(user.username ?? undefined, user.email);
  const displayNameHeading = (
    user.username ||
    user.email.split("@")[0] ||
    "operator"
  ).toUpperCase();
  const initials = userInitials(user.username ?? undefined, user.email);

  const lastAccessIso = new Date().toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");

  return (
    <div className="space-y-8 px-4 py-8 lg:px-0 lg:py-12">
      <ProfileConsoleHeader userLabel={user.email} userInitials={initials} />
      <UserProfileDossier
        operatorHandle={handle}
        displayName={displayNameHeading}
        emailLine={user.email}
        initials={initials}
        rankLabel={rankLabel(completedCount)}
        clearanceLevel={clearanceForRole(user.role)}
        joinLabel={joinLabel}
        regionLabel="REMOTE_NODE"
        lastAccessIso={lastAccessIso}
        totalXp={totalXp.toLocaleString("en-US")}
        categoryRows={categoryRows}
        achievements={achievements}
      />
    </div>
  );
}
