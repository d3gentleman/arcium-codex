import { query } from "../lib/db";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const result = await query("SELECT column_name FROM information_schema.columns WHERE table_name = 'module_lesson'");
  console.log(result.rows.map(r => r.column_name));
}

main().catch(console.error);
