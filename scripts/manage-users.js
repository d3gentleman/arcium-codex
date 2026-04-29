const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

function loadEnv(filePath) {
  try {
    const contents = fs.readFileSync(filePath, 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const rawValue = trimmed.slice(index + 1).trim();
      if (!key || process.env[key]) continue;
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
  } catch (err) {
    // Ignore
  }
}

loadEnv(path.join(process.cwd(), '.env'));
loadEnv(path.join(process.cwd(), '.env.local'));

const connectionString = process.env.ARCIUMCODEX_DATABASE_URL_UNPOOLED || process.env.ARCIUMCODEX_DATABASE_URL;

if (!connectionString) {
  console.error("No connection string found in environment.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: connectionString
});

async function main() {
  const args = process.argv.slice(2);
  const action = args[0]; // promote, demote, list
  const userId = args[1];
  const role = args[2] || "staff";

  if (action === "list") {
    const result = await pool.query("SELECT id, email, name, role FROM \"user\" ORDER BY role DESC, email ASC");
    console.table(result.rows);
    await pool.end();
    process.exit(0);
  }

  if (!userId) {
    console.error("Usage: node scripts/manage-users.js <promote|demote|list> [userId] [role]");
    await pool.end();
    process.exit(1);
  }

  if (action === "promote") {
    await pool.query("UPDATE \"user\" SET role = $1 WHERE id = $2", [role, userId]);
    console.log(`Promoted user ${userId} to ${role}`);
  } else if (action === "demote") {
    await pool.query("UPDATE \"user\" SET role = 'user' WHERE id = $2", [userId]);
    console.log(`Demoted user ${userId} to user`);
  } else {
    console.error("Unknown action. Use promote, demote, or list.");
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
