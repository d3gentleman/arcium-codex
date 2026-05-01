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
    const contentDir = path.join(repoRoot, "content", "module-lessons");
    const files = await fs.readdir(contentDir);

    let count = 0;
    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      const filePath = path.join(contentDir, file);
      const jsonContent = await fs.readFile(filePath, "utf8");
      const data = JSON.parse(jsonContent);

      await client.query(
        `INSERT INTO module_lesson (
          slug, title, category_id, tag, summary, introduction, introduction_heading, visualization_id, body_sections, quiz_questions
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        ) ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          category_id = EXCLUDED.category_id,
          tag = EXCLUDED.tag,
          summary = EXCLUDED.summary,
          introduction = EXCLUDED.introduction,
          introduction_heading = EXCLUDED.introduction_heading,
          visualization_id = EXCLUDED.visualization_id,
          body_sections = EXCLUDED.body_sections,
          quiz_questions = EXCLUDED.quiz_questions,
          updated_at = now()
        `,
        [
          data.slug,
          data.title,
          data.categoryId,
          data.tag,
          data.summary,
          data.introduction || null,
          data.introductionHeading || null,
          data.visualizationId || null,
          JSON.stringify(data.bodySections || []),
          JSON.stringify(data.quizQuestions || []),
        ]
      );
      count++;
    }
    console.log(`Successfully seeded ${count} module lessons into the database.`);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
