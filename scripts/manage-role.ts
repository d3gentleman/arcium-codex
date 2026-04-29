import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

async function loadEnvFile(filePath: string) {
  try {
    const contents = await fs.readFile(filePath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const index = trimmed.indexOf("=");
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const rawValue = trimmed.slice(index + 1).trim();
      if (!key || process.env[key]) continue;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Ignore missing env files.
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error("Usage: npx tsx manage-role.ts <userId> <role>");
    process.exit(1);
  }

  const userId = args[0];
  const newRole = args[1];

  await loadEnvFile(path.join(repoRoot, ".env"));
  await loadEnvFile(path.join(repoRoot, ".env.local"));

  const connectionString = process.env.ARCIUMCODEX_DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error("ARCIUMCODEX_DATABASE_URL_UNPOOLED is not set.");
  }

  const { Client } = pg;
  const client = new Client({ connectionString });

  await client.connect();

  try {
    const result = await client.query(
      `UPDATE "user" SET role = $1 WHERE id = $2 RETURNING id, username, email, role`,
      [newRole, userId]
    );

    if (result.rowCount === 0) {
      console.log(`No user found with ID: ${userId}`);
    } else {
      console.log(`Successfully updated user ${result.rows[0].username || result.rows[0].email} to role '${newRole}'.`);
    }
  } finally {
    await client.end();
  }
}

main().catch(console.error);
