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

export const db =
  globalThis.__learnarciumPool ??
  new Pool({
    connectionString: getConnectionString(),
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__learnarciumPool = db;
}

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
