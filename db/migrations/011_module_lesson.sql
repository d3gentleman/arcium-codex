create table if not exists module_lesson (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  category_id text not null,
  tag text not null,
  summary text not null,
  introduction text,
  visualization_id text,
  body_sections jsonb not null default '[]'::jsonb,
  quiz_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists module_lesson_category_idx on module_lesson (category_id);

alter table "user" add column if not exists role text not null default 'user';
