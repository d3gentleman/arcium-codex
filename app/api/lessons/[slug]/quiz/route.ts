import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getModuleLessonBySlug } from "@/lib/content";
import { recordLessonQuizSubmission } from "@/lib/lesson-store";
import { scoreQuizAnswers, validateQuizAnswers } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const lesson = await getModuleLessonBySlug(slug);

  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found." }, { status: 404 });
  }

  const body = (await request.json()) as { answers?: Record<string, unknown> };
  const validation = validateQuizAnswers(lesson, body.answers || {});

  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Calculate score
  const score = scoreQuizAnswers(lesson, validation.data);

  const submission = await recordLessonQuizSubmission({
    userId: session.user.id,
    lessonSlug: slug,
    answers: validation.data,
    score: {
      totalPoints: score.totalPoints,
      earnedPoints: score.earnedPoints,
      percentage: score.percentage,
      passed: score.passed,
    },
  });

  return NextResponse.json({
    ok: true,
    score: {
      totalPoints: score.totalPoints,
      earnedPoints: score.earnedPoints,
      percentage: score.percentage,
      passed: score.passed,
    },
    results: score.questionResults,
    submissionId: submission.id,
    submittedAt: submission.submitted_at,
  });
}
