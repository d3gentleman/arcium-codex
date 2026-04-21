create table if not exists lesson_quiz_submission (
  id bigint generated always as identity primary key,
  user_id text not null references "user" (id) on delete cascade,
  lesson_slug text not null,
  answers jsonb not null,
  submitted_at timestamptz not null default now()
);

create table if not exists lesson_progress (
  user_id text not null references "user" (id) on delete cascade,
  lesson_slug text not null,
  completed_at timestamptz not null,
  latest_submission_id bigint not null references lesson_quiz_submission (id) on delete cascade,
  primary key (user_id, lesson_slug)
);

create table if not exists lesson_comment (
  id bigint generated always as identity primary key,
  user_id text not null references "user" (id) on delete cascade,
  lesson_slug text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists lesson_quiz_submission_user_id_idx
  on lesson_quiz_submission (user_id);

create index if not exists lesson_quiz_submission_user_lesson_idx
  on lesson_quiz_submission (user_id, lesson_slug);

create index if not exists lesson_comment_user_id_idx
  on lesson_comment (user_id);

create index if not exists lesson_comment_slug_created_idx
  on lesson_comment (lesson_slug, created_at desc);

create index if not exists lesson_progress_latest_submission_idx
  on lesson_progress (latest_submission_id);

create index if not exists lesson_progress_user_lesson_idx
  on lesson_progress (user_id, lesson_slug);
