import { db } from "../lib/db";
import * as dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
  const args = process.argv.slice(2);
  const action = args[0]; // promote, demote, list
  const userId = args[1];
  const role = args[2] || "staff";

  if (action === "list") {
    console.log("Fetching users...");
    const result = await db.query("SELECT id, email, name, role FROM \"user\" ORDER BY role DESC, email ASC");
    console.table(result.rows);
    process.exit(0);
  }

  if (!action || !userId) {
    console.error("Usage: npx tsx scripts/manage-staff.ts <promote|demote|list> [userId] [role]");
    console.error("Example: npx tsx scripts/manage-staff.ts promote 5MINONdp... staff");
    process.exit(1);
  }

  if (action === "promote") {
    const result = await db.query("UPDATE \"user\" SET role = $1 WHERE id = $2 RETURNING id, email, role", [role, userId]);
    if (result.rowCount === 0) {
      console.error(`User with ID ${userId} not found.`);
    } else {
      console.log(`Successfully promoted user ${result.rows[0].email} to ${result.rows[0].role}`);
    }
  } else if (action === "demote") {
    const result = await db.query("UPDATE \"user\" SET role = 'user' WHERE id = $2 RETURNING id, email, role", [userId]);
    if (result.rowCount === 0) {
      console.error(`User with ID ${userId} not found.`);
    } else {
      console.log(`Successfully demoted user ${result.rows[0].email} to user`);
    }
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
