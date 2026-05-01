-- Add scoring support to quiz submissions and progress tracking

-- Add score tracking to submissions
alter table lesson_quiz_submission
  add column if not exists score_percent integer,
  add column if not exists passed boolean,
  add column if not exists grading_status text default 'auto',
  add column if not exists graded_by text references "user"(id),
  add column if not exists graded_at timestamptz,
  add column if not exists grader_notes text;

-- Add best score tracking to progress
alter table lesson_progress
  add column if not exists best_score_percent integer,
  add column if not exists first_completed_at timestamptz,
  add column if not exists attempt_count integer not null default 1;

-- Backfill first_completed_at from completed_at
update lesson_progress
  set first_completed_at = completed_at
  where first_completed_at is null;

-- Create analytics table for quiz question stats

-- Create index for analytics queries
create index if not exists lesson_quiz_submission_score_idx
  on lesson_quiz_submission (lesson_slug, score_percent);
