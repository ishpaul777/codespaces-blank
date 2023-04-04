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


-- user database schema
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY
);


-- CREATE TABLE "document_authors" ("user_id" bigint,"document_id" bigint,PRIMARY KEY ("user_id","document_id"),CONSTRAINT "fk_document_authors_document" FOREIGN KEY ("document_id") REFERENCES "documents"("id"),CONSTRAINT "fk_document_authors_user" FOREIGN KEY ("user_id") REFERENCES "users"("id"))