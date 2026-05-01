import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getQuizSubmissionHistory, getLessonProgress } from "@/lib/lesson-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: request.headers });
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [history, progress] = await Promise.all([
      getQuizSubmissionHistory(session.user.id, slug),
      getLessonProgress(session.user.id, slug),
    ]);

    return NextResponse.json({
      history,
      progress: progress || {
        attemptCount: 0,
        bestScorePercent: null,
        completedAt: null,
      },
    });
  } catch (error) {
    console.error("Failed to fetch quiz history:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz history" },
      { status: 500 }
    );
  }
}
