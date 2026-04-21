import { z } from "zod";
import type { ModuleLessonRecord, QuizQuestion } from "@/types/domain";

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[a-z0-9_]+$/, "Username must contain only lowercase letters, numbers, and underscores.")
  .transform((value) => value.toLowerCase());

export const emailSchema = z.email().transform((value) => value.trim().toLowerCase());

export const passwordSchema = z.string().min(8).max(128);

export const commentSchema = z.string().trim().min(1).max(2000);

export function validateQuizAnswers(lesson: ModuleLessonRecord, answers: Record<string, unknown>) {
  const normalized: Record<string, string> = {};

  for (const question of lesson.quizQuestions) {
    const answer = answers[question.id];
    const result = validateAnswer(question, answer);

    if (!result.ok) {
      return {
        ok: false as const,
        error: result.error,
      };
    }

    if (result.value !== undefined) {
      normalized[question.id] = result.value;
    }
  }

  return {
    ok: true as const,
    data: normalized,
  };
}

function validateAnswer(question: QuizQuestion, answer: unknown) {
  const raw = typeof answer === "string" ? answer.trim() : "";

  if (!raw) {
    if (question.required) {
      return {
        ok: false as const,
        error: `${question.prompt} is required.`,
      };
    }

    return {
      ok: true as const,
      value: undefined,
    };
  }

  if (question.type === "multiple_choice") {
    if (!question.choices.includes(raw)) {
      return {
        ok: false as const,
        error: `Invalid answer for "${question.prompt}".`,
      };
    }
  }

  if (question.type === "short_text" && raw.length > 500) {
    return {
      ok: false as const,
      error: `"${question.prompt}" exceeds 500 characters.`,
    };
  }

  if (question.type === "long_text" && raw.length > 5000) {
    return {
      ok: false as const,
      error: `"${question.prompt}" exceeds 5000 characters.`,
    };
  }

  return {
    ok: true as const,
    value: raw,
  };
}
