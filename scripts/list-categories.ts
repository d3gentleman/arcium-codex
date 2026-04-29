import { db } from "../lib/db";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  const result = await db.query("SELECT id, title FROM knowledge_category");
  console.log(JSON.stringify(result.rows));
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
