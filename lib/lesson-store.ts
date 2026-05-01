import type { PoolClient } from "pg";
import { query, withTransaction } from "@/lib/db";

export interface LessonComment {
  id: number;
  lessonSlug: string;
  body: string;
  createdAt: string;
  username: string;
}

export async function getCompletedLessonSlugs(userId: string): Promise<string[]> {
  const result = await query<{ lesson_slug: string }>(
    `select lesson_slug
       from lesson_progress
      where user_id = $1`,
    [userId],
  );

  return result.rows.map((row) => row.lesson_slug);
}

export async function isLessonCompleted(userId: string, lessonSlug: string): Promise<boolean> {
  const result = await query(
    `select 1
       from lesson_progress
      where user_id = $1
        and lesson_slug = $2
      limit 1`,
    [userId, lessonSlug],
  );

  return (result.rowCount ?? 0) > 0;
}

export interface QuizSubmissionInput {
  userId: string;
  lessonSlug: string;
  answers: Record<string, string>;
  score?: {
    totalPoints: number;
    earnedPoints: number;
    percentage: number;
    passed: boolean;
  };
}

export async function recordLessonQuizSubmission(input: QuizSubmissionInput) {
  return withTransaction(async (client) => {
    const submission = await insertSubmission(client, input);

    await client.query(
      `insert into lesson_progress (user_id, lesson_slug, completed_at, latest_submission_id, best_score_percent)
       values ($1, $2, now(), $3, $4)
       on conflict (user_id, lesson_slug)
       do update set
         completed_at = excluded.completed_at,
         latest_submission_id = excluded.latest_submission_id,
         best_score_percent = greatest(lesson_progress.best_score_percent, excluded.best_score_percent)`,
      [input.userId, input.lessonSlug, submission.id, input.score?.percentage ?? null],
    );

    return submission;
  });
}

async function insertSubmission(
  client: PoolClient,
  input: QuizSubmissionInput,
) {
  const result = await client.query<{ id: number; submitted_at: string }>(
    `insert into lesson_quiz_submission (user_id, lesson_slug, answers, score_percent, passed)
     values ($1, $2, $3::jsonb, $4, $5)
     returning id, submitted_at`,
    [
      input.userId,
      input.lessonSlug,
      JSON.stringify(input.answers),
      input.score?.percentage ?? null,
      input.score?.passed ?? null,
    ],
  );

  return result.rows[0];
}

export async function listLessonComments(lessonSlug: string): Promise<LessonComment[]> {
  const result = await query<{
    id: number;
    lesson_slug: string;
    body: string;
    created_at: string;
    username: string | null;
  }>(
    `select
        c.id,
        c.lesson_slug,
        c.body,
        c.created_at,
        u.username
       from lesson_comment c
       join "user" u
         on u.id = c.user_id
      where c.lesson_slug = $1
      order by c.created_at desc`,
    [lessonSlug],
  );

  return result.rows.map((row) => ({
    id: row.id,
    lessonSlug: row.lesson_slug,
    body: row.body,
    createdAt: row.created_at,
    username: row.username || "learner",
  }));
}

export async function addLessonComment(input: {
  userId: string;
  lessonSlug: string;
  body: string;
}) {
  await query(
    `insert into lesson_comment (user_id, lesson_slug, body)
     values ($1, $2, $3)`,
    [input.userId, input.lessonSlug, input.body],
  );
}

export async function getLessonCommentCountForUser(userId: string): Promise<number> {
  const result = await query<{ count: string }>(
    `select count(*)::text as count
       from lesson_comment
      where user_id = $1`,
    [userId],
  );

  return Number(result.rows[0]?.count || "0");
}

export interface QuizSubmission {
  id: number;
  lessonSlug: string;
  answers: Record<string, string>;
  scorePercent: number | null;
  passed: boolean | null;
  submittedAt: string;
}

export async function getQuizSubmissionHistory(
  userId: string,
  lessonSlug: string
): Promise<QuizSubmission[]> {
  const result = await query<{
    id: number;
    lesson_slug: string;
    answers: Record<string, string>;
    score_percent: number | null;
    passed: boolean | null;
    submitted_at: string;
  }>(
    `select id, lesson_slug, answers, score_percent, passed, submitted_at
       from lesson_quiz_submission
      where user_id = $1
        and lesson_slug = $2
      order by submitted_at desc`,
    [userId, lessonSlug],
  );

  return result.rows.map((row) => ({
    id: row.id,
    lessonSlug: row.lesson_slug,
    answers: row.answers,
    scorePercent: row.score_percent,
    passed: row.passed,
    submittedAt: row.submitted_at,
  }));
}

export async function getLessonProgress(userId: string, lessonSlug: string) {
  const result = await query<{
    attempt_count: number;
    best_score_percent: number | null;
    completed_at: string | null;
  }>(
    `select attempt_count, best_score_percent, completed_at
       from lesson_progress
      where user_id = $1
        and lesson_slug = $2`,
    [userId, lessonSlug],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return {
    attemptCount: result.rows[0].attempt_count,
    bestScorePercent: result.rows[0].best_score_percent,
    completedAt: result.rows[0].completed_at,
  };
}
