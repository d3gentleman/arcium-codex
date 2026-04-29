import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireVerifiedSession() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return null;
  }

  return session;
}

export async function requireStaffSession() {
  const session = await getCurrentSession();

  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
    throw new Error("Unauthorized");
  }

  return session;
}
