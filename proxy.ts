import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

function getAllowedEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/keystatic");
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const allowedEmails = getAllowedEmails();
  const email = session.user.email.toLowerCase();
  const isAuthorized = allowedEmails.includes(email);

  if (isAuthorized) {
    return NextResponse.next();
  }

  if (isApiRoute) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return new NextResponse("Forbidden: your account is not authorized to access this admin panel.", {
    status: 403,
  });
}

export const config = {
  matcher: [
    "/keystatic/:path*",
    "/api/keystatic/:path*",
  ],
};
