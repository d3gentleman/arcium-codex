const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.ARCIUMCODEX_DATABASE_URL
});

async function main() {
  const result = await pool.query("SELECT id, title FROM knowledge_category");
  console.log(JSON.stringify(result.rows));
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
