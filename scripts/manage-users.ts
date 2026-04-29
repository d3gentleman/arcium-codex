import { db } from "../lib/db";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables from .env or .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  const args = process.argv.slice(2);
  const action = args[0]; // promote, demote, list
  const userId = args[1];
  const role = args[2] || "staff";

  if (action === "list") {
    const result = await db.query("SELECT id, email, name, role FROM \"user\" ORDER BY role DESC, email ASC");
    console.table(result.rows);
    process.exit(0);
  }

  if (!userId) {
    console.error("Usage: npx ts-node scripts/manage-users.ts <promote|demote|list> [userId] [role]");
    process.exit(1);
  }

  if (action === "promote") {
    await db.query("UPDATE \"user\" SET role = $1 WHERE id = $2", [role, userId]);
    console.log(`Promoted user ${userId} to ${role}`);
  } else if (action === "demote") {
    await db.query("UPDATE \"user\" SET role = 'user' WHERE id = $2", [userId]);
    console.log(`Demoted user ${userId} to user`);
  } else {
    console.error("Unknown action. Use promote, demote, or list.");
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
