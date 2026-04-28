import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addLessonComment } from "@/lib/lesson-store";
import { commentSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const body = (await request.json()) as { body?: string };
  const parsed = commentSchema.safeParse(body.body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Comment must be between 1 and 2000 characters." }, { status: 400 });
  }

  await addLessonComment({
    userId: session.user.id,
    lessonSlug: slug,
    body: parsed.data,
  });

  return NextResponse.json({ ok: true });
}
