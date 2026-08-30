import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

/** The shape both drivers below are adapted to: a tagged template returning rows. */
export type Sql = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let client: Sql | null = null;

/** Neon's HTTP driver is used for neon.tech URLs; anything else goes through node-postgres. */
function isNeonUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

/** `select … where id = ${id}` becomes `select … where id = $1` with [id]. */
function toPositional(strings: TemplateStringsArray): string {
  return strings.reduce(
    (text, part, i) =>
      text + part + (i < strings.length - 1 ? `$${i + 1}` : ""),
    "",
  );
}

function createClient(url: string): Sql {
  if (isNeonUrl(url)) {
    const sql = neon(url);
    return (strings, ...values) =>
      sql(strings, ...values) as Promise<Record<string, unknown>[]>;
  }

  // Local development against a plain Postgres server.
  const pool = new Pool({ connectionString: url });
  return (strings, ...values) =>
    pool
      .query(toPositional(strings), values as unknown[])
      .then((res) => res.rows as Record<string, unknown>[]);
}

/**
 * Lazily created database client. Building it lazily keeps `next build`
 * working on a machine with no DATABASE_URL, and keeps the error message
 * useful when the variable really is missing at request time.
 */
export function db(): Sql {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Copy .env.example to .env.local and put your Neon connection string in it.",
      );
    }
    client = createClient(url);
  }
  return client;
}
