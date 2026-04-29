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
  } catch (err) {}
}

loadEnv(path.join(process.cwd(), '.env'));
loadEnv(path.join(process.cwd(), '.env.local'));

const connectionString = process.env.ARCIUMCODEX_DATABASE_URL_UNPOOLED || process.env.ARCIUMCODEX_DATABASE_URL;
const pool = new Pool({ connectionString });

async function main() {
  console.log("\n--- MODULE LESSONS ---");
  const lessons = await pool.query("SELECT slug, title, category_id FROM module_lesson");
  console.table(lessons.rows);
  await pool.end();
}

main().catch(err => { console.error(err); process.exit(1); });
