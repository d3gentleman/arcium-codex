import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getModuleLessonPath, getModuleLessons } from "@/lib/content";
import { getCompletedLessonSlugs, getLessonCommentCountForUser } from "@/lib/lesson-store";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({
      authenticated: false,
    });
  }

  const [completedLessonSlugs, commentCount, lessons] = await Promise.all([
    getCompletedLessonSlugs(session.user.id),
    getLessonCommentCountForUser(session.user.id),
    getModuleLessons(),
  ]);

  const completedSet = new Set(completedLessonSlugs);
  const nextLesson = lessons.find((lesson) => !completedSet.has(lesson.slug)) || null;

  return NextResponse.json({
    authenticated: true,
    user: {
      name: session.user.username || session.user.name || session.user.email,
      email: session.user.email,
    },
    progress: {
      completedLessons: completedLessonSlugs.length,
      totalLessons: lessons.length,
      commentCount,
      nextLesson: nextLesson
        ? {
            title: nextLesson.title,
            href: getModuleLessonPath(nextLesson.slug),
          }
        : null,
    },
  });
}
