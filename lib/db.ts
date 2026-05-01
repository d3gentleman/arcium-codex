import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var __learnarciumPool: Pool | undefined;
}

function getConnectionString() {
  const connectionString = process.env.ARCIUMCODEX_DATABASE_URL;

  if (!connectionString) {
    throw new Error("ARCIUMCODEX_DATABASE_URL is not set.");
  }

  return connectionString;
}

let pool: Pool | undefined;

function getPool() {
  if (globalThis.__learnarciumPool) {
    return globalThis.__learnarciumPool;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: getConnectionString(),
    });

    if (process.env.NODE_ENV !== "production") {
      globalThis.__learnarciumPool = pool;
    }
  }

  return pool;
}

// Export a proxy or a wrapper to maintain the existing API
export const db = {
  query: <T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]) => getPool().query<T>(text, params),
  connect: () => getPool().connect(),
  on: (event: "error" | "release" | "connect" | "acquire" | "remove", listener: (...args: any[]) => void) => getPool().on(event, listener),
  end: () => pool?.end(),
} as unknown as Pool;

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  return db.query<T>(text, params);
}

export async function withTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
