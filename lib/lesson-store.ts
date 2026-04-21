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

export async function recordLessonQuizSubmission(input: {
  userId: string;
  lessonSlug: string;
  answers: Record<string, string>;
}) {
  return withTransaction(async (client) => {
    const submission = await insertSubmission(client, input);

    await client.query(
      `insert into lesson_progress (user_id, lesson_slug, completed_at, latest_submission_id)
       values ($1, $2, now(), $3)
       on conflict (user_id, lesson_slug)
       do update set
         completed_at = excluded.completed_at,
         latest_submission_id = excluded.latest_submission_id`,
      [input.userId, input.lessonSlug, submission.id],
    );

    return submission.id;
  });
}

async function insertSubmission(
  client: PoolClient,
  input: {
    userId: string;
    lessonSlug: string;
    answers: Record<string, string>;
  },
) {
  const result = await client.query<{ id: number }>(
    `insert into lesson_quiz_submission (user_id, lesson_slug, answers)
     values ($1, $2, $3::jsonb)
     returning id`,
    [input.userId, input.lessonSlug, JSON.stringify(input.answers)],
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
