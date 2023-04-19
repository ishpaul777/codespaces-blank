-- prompts database schema
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  created_by_id INTEGER NOT NULL,
  updated_by_id INTEGER NOT NULL,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  finish_reason TEXT NOT NULL
);
-- documents database schema
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  created_by_id INTEGER NOT NULL,
  updated_by_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT NOT NULL
)

-- CREATE TABLE "chats" ("id" bigserial,"created_at" timestamptz,"updated_at" timestamptz,"deleted_at" timestamptz,"created_by_id" bigint,"updated_by_id" bigint,"messages" jsonb,"usage" jsonb,"model" text,PRIMARY KEY ("id"))