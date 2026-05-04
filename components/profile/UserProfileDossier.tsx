import Link from "next/link";

export interface CategoryProgressRow {
  id: string;
  title: string;
  percent: number;
}

export interface AchievementSlot {
  id: string;
  label: string;
  subtitle: string;
  unlocked: boolean;
}

interface UserProfileDossierProps {
  operatorHandle: string;
  displayName: string;
  emailLine: string;
  initials: string;
  rankLabel: string;
  clearanceLevel: string;
  joinLabel: string;
  regionLabel: string;
  lastAccessIso: string;
  totalXp: string;
  categoryRows: CategoryProgressRow[];
  achievements: AchievementSlot[];
}

function TelemetryBar({ percent, label }: { percent: number; label: string }) {
  const w = Math.max(0, Math.min(100, percent));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-on-surface-variant">
        <span>{label}</span>
        <span className="text-primary">{Math.round(w)}%</span>
      </div>
      <div className="h-[6px] bg-outline-variant/20">
        <div className="h-full bg-primary transition-all" style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

function HexBadge({ unlocked, title, subtitle }: { unlocked: boolean; title: string; subtitle: string }) {
  return (
    <div
      className={`relative flex aspect-square w-[4.75rem] items-center justify-center border-2 p-2 text-center transition-colors ${
        unlocked
          ? "border-primary/55 bg-primary/10 shadow-[0_0_24px_rgba(105,218,255,0.12)]"
          : "border-outline-variant/25 bg-black/40 opacity-50 grayscale"
      }`}
      style={{
        clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)",
      }}
    >
      <div className="max-w-[3.25rem]">
        <div className={`font-mono text-[8px] font-bold uppercase leading-tight tracking-tight ${unlocked ? "text-primary" : "text-on-surface-variant"}`}>
          {title}
        </div>
        <div className="mt-1 font-mono text-[7px] uppercase tracking-tight text-on-surface-variant/70">{subtitle}</div>
      </div>
    </div>
  );
}

export default function UserProfileDossier({
  operatorHandle,
  displayName,
  emailLine,
  initials,
  rankLabel,
  clearanceLevel,
  joinLabel,
  regionLabel,
  lastAccessIso,
  totalXp,
  categoryRows,
  achievements,
}: UserProfileDossierProps) {
  return (
    <div className="space-y-6">
      <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
        USER_DOSSIER <span className="text-outline">/</span> <span className="text-primary">CONFIDENTIAL_READOUT</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="console-window overflow-hidden">
          <div className="console-header px-4 py-2">
            <span>IDENTITY_SIGNATURE</span>
            <span className="text-primary">VERIFIED_LOCAL</span>
          </div>
          <div className="flex flex-col gap-6 border-t border-outline-variant/15 p-6 sm:flex-row sm:items-start">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center border-2 border-outline-variant/30 bg-black/60 font-headline text-3xl font-black uppercase text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <h1 className="font-headline text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                  {displayName}
                </h1>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant/55">{emailLine}</p>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-primary/85">{operatorHandle}</p>
              </div>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                STATUS_ACTIVE
              </div>
              <dl className="grid grid-cols-1 gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant sm:grid-cols-2">
                <div className="border border-outline-variant/20 bg-black/35 p-3">
                  <dt className="text-on-surface-variant/50">Rank</dt>
                  <dd className="mt-1 text-white">{rankLabel}</dd>
                </div>
                <div className="border border-outline-variant/20 bg-black/35 p-3">
                  <dt className="text-on-surface-variant/50">Clearance</dt>
                  <dd className="mt-1 text-error">{clearanceLevel}</dd>
                </div>
                <div className="border border-outline-variant/20 bg-black/35 p-3">
                  <dt className="text-on-surface-variant/50">Join_Date</dt>
                  <dd className="mt-1 text-white">{joinLabel}</dd>
                </div>
                <div className="border border-outline-variant/20 bg-black/35 p-3">
                  <dt className="text-on-surface-variant/50">Region</dt>
                  <dd className="mt-1 text-white">{regionLabel}</dd>
                </div>
              </dl>
              <Link
                href="/modules"
                className="inline-flex border-2 border-primary bg-primary px-6 py-3 font-headline text-[11px] font-bold uppercase tracking-[0.2em] text-surface shadow-[4px_4px_0px_rgba(0,0,0,0.85)] transition-all hover:bg-white hover:text-surface hover:shadow-[2px_2px_0px_rgba(0,0,0,0.6)] active:translate-x-px active:translate-y-px"
              >
                Continue_Modules
              </Link>
            </div>
          </div>
        </div>

        <div className="console-window overflow-hidden">
          <div className="console-header px-4 py-2">
            <span>SYSTEM_TELEMETRY</span>
            <span className="text-primary">READ_ONLY</span>
          </div>
          <div className="flex flex-col justify-between gap-8 border-t border-outline-variant/15 p-6">
            <div className="space-y-6 font-mono text-[11px] uppercase tracking-[0.15em] text-on-surface-variant">
              <div>
                <div className="text-[10px] text-on-surface-variant/50">Last_Render</div>
                <div className="mt-2 text-white">{lastAccessIso}</div>
              </div>
              <div>
                <div className="text-[10px] text-on-surface-variant/50">Session_Link</div>
                <div className="mt-2 text-primary">AES-256-GCM // ARCIUM_TRANSPORT</div>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-on-surface-variant/50">TOTAL_XP</div>
              <div className="mt-3 font-headline text-5xl font-black tracking-tighter text-white md:text-6xl">{totalXp}</div>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
                Progress derived from quiz-backed lesson completions & thread activity.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="console-window overflow-hidden">
          <div className="console-header px-4 py-2">
            <span>MISSION_BADGES</span>
            <span className="text-primary">TRACKED</span>
          </div>
          <div className="flex flex-wrap items-start gap-10 border-t border-outline-variant/15 p-6">
            {achievements.map((a) => (
              <HexBadge key={a.id} unlocked={a.unlocked} title={a.label} subtitle={a.subtitle} />
            ))}
            <div className="flex min-w-[12rem] flex-1 flex-col justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
              <div className="text-primary">ULTIMATE_GOAL</div>
              <div className="text-[11px] font-bold tracking-[0.16em] text-white">ACADEMY_MASTER_PROTOCOL</div>
              <p className="text-[10px] normal-case tracking-normal leading-relaxed text-on-surface-variant/80">
                Complete the core curriculum pathways and engage with glossary and encyclopedia records to certify full coverage.
              </p>
              <Link href="/modules#fundamentals" className="mt-2 w-fit text-primary transition-colors hover:text-white">
                Open_module_path →
              </Link>
            </div>
          </div>
        </div>

        <div className="console-window overflow-hidden">
          <div className="console-header px-4 py-2">
            <span>CURRICULUM_TELEMETRY</span>
            <span className="text-primary">BY_CATEGORY</span>
          </div>
          <div className="grid gap-5 border-t border-outline-variant/15 p-6">
            {categoryRows.map((row) => (
              <TelemetryBar key={row.id} label={row.title} percent={row.percent} />
            ))}
          </div>
        </div>
      </div>

      <div className="console-window overflow-hidden">
        <div className="console-header px-4 py-2">
          <span>RECENT_TRANSMISSIONS</span>
          <span className="text-primary">CLASSIFIED_SUMMARY</span>
        </div>
        <div className="space-y-4 border-t border-outline-variant/15 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/15 pb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">
            <span className="text-primary">LOG // MXE-ISOLATION</span>
            <span>REFERENCE_STREAM</span>
          </div>
          <p className="font-body text-sm leading-7 text-on-surface-variant">
            Confidential execution on Arcium depends on disciplined isolation boundaries: sensitive logic should stay inside execution environments
            where encrypted state can advance without leaking intermediate signals to observers. As you move through the Security and Execution modules,
            treat every diagram as a contract about what must never cross the trust boundary.
          </p>
          <div className="flex flex-wrap gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
            <Link href="/encyclopedia" className="text-primary transition-colors hover:text-white">
              Open_encyclopedia →
            </Link>
            <Link href="/glossary" className="text-outline transition-colors hover:text-primary">
              Open_glossary →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
