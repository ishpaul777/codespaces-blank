CREATE TABLE prompts (
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