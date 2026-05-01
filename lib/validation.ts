import { z } from "zod";
import type { ModuleLessonRecord, QuizQuestion } from "@/types/domain";

export interface QuizScore {
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
  questionResults: {
    questionId: string;
    correct: boolean;
    points: number;
    earned: number;
    userAnswer: string;
    correctAnswer?: string;
    explanation?: string;
  }[];
}

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

export function scoreQuizAnswers(
  lesson: ModuleLessonRecord,
  answers: Record<string, string>
): QuizScore {
  const results: QuizScore["questionResults"] = [];
  let totalPoints = 0;
  let earnedPoints = 0;

  for (const question of lesson.quizQuestions) {
    const userAnswer = answers[question.id] || "";
    const points = question.points ?? 1;
    totalPoints += points;

    // Handle different question types
    if (question.type === "checkbox") {
      const result = scoreCheckboxQuestion(question, userAnswer, points);
      earnedPoints += result.earned;
      results.push({
        questionId: question.id,
        correct: result.correct,
        points,
        earned: result.earned,
        userAnswer,
        correctAnswer: question.correctAnswers?.join(", ") || "",
        explanation: question.explanation,
      });
      continue;
    }

    if (question.type === "true_false") {
      const correct = question.correctAnswer !== undefined && 
        userAnswer === String(question.correctAnswer);
      const earned = correct ? points : 0;
      earnedPoints += earned;
      results.push({
        questionId: question.id,
        correct,
        points,
        earned,
        userAnswer,
        correctAnswer: String(question.correctAnswer),
        explanation: question.explanation,
      });
      continue;
    }

    if (question.type === "code_fill_in") {
      const result = scoreCodeFillInQuestion(question, answers, points);
      earnedPoints += result.earned;
      results.push({
        questionId: question.id,
        correct: result.correct,
        points,
        earned: result.earned,
        userAnswer: result.userAnswer,
        correctAnswer: result.correctAnswer,
        explanation: question.explanation,
      });
      continue;
    }

    // Skip grading if no correct answer defined (open-ended)
    if (!question.correctAnswer) {
      results.push({
        questionId: question.id,
        correct: false, // Unknown until manually graded
        points,
        earned: 0,
        userAnswer,
        correctAnswer: undefined,
        explanation: question.explanation,
      });
      continue;
    }

    const correct = isAnswerCorrect(userAnswer, question.correctAnswer, question.type);
    const earned = correct ? points : 0;
    earnedPoints += earned;

    results.push({
      questionId: question.id,
      correct,
      points,
      earned,
      userAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
    });
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const passed = percentage >= 70; // Configurable threshold

  return {
    totalPoints,
    earnedPoints,
    percentage,
    passed,
    questionResults: results,
  };
}

function scoreCheckboxQuestion(
  question: { correctAnswers?: string[] },
  userAnswer: string,
  points: number
): { correct: boolean; earned: number } {
  if (!question.correctAnswers || question.correctAnswers.length === 0) {
    return { correct: false, earned: 0 };
  }

  const correctAnswers = question.correctAnswers;
  let userAnswers: string[] = [];
  
  try {
    userAnswers = JSON.parse(userAnswer || "[]");
  } catch {
    userAnswers = userAnswer ? [userAnswer] : [];
  }

  // Calculate partial credit
  const correctSelected = userAnswers.filter(a => correctAnswers.includes(a)).length;
  const incorrectSelected = userAnswers.filter(a => !correctAnswers.includes(a)).length;
  const correctMissed = correctAnswers.filter(a => !userAnswers.includes(a)).length;

  // All-or-nothing scoring: must get all correct and no incorrect
  const allCorrect = correctSelected === correctAnswers.length && incorrectSelected === 0;
  
  // Partial credit option: weight correct selections, penalize incorrect
  // Formula: (correctSelected - incorrectSelected) / totalCorrectAnswers, min 0
  const pointsPerCorrect = question.correctAnswers?.length ? 
    Math.max(0, (correctSelected - incorrectSelected * 0.5) / correctAnswers.length) : 0;
  
  const earned = Math.round(points * pointsPerCorrect * 10) / 10;
  
  return { correct: allCorrect, earned: allCorrect ? points : earned };
}

function scoreCodeFillInQuestion(
  question: { correctAnswers?: string[]; blankCount: number; id: string },
  answers: Record<string, string>,
  points: number
): { correct: boolean; earned: number; userAnswer: string; correctAnswer: string } {
  const blankAnswers: string[] = [];
  const correctAnswers = question.correctAnswers || [];
  
  for (let i = 0; i < question.blankCount; i++) {
    blankAnswers.push(answers[`${question.id}_blank_${i}`] || "");
  }

  let correctCount = 0;
  for (let i = 0; i < question.blankCount; i++) {
    const user = normalizeAnswer(blankAnswers[i]);
    const correct = normalizeAnswer(correctAnswers[i] || "");
    if (user === correct) correctCount++;
  }

  const earned = Math.round((correctCount / question.blankCount) * points * 10) / 10;
  const allCorrect = correctCount === question.blankCount;

  return {
    correct: allCorrect,
    earned,
    userAnswer: blankAnswers.join(", "),
    correctAnswer: correctAnswers.join(", "),
  };
}

function isAnswerCorrect(userAnswer: string, correctAnswer: string, type: QuizQuestion["type"]): boolean {
  const normalizedUser = normalizeAnswer(userAnswer);
  const normalizedCorrect = normalizeAnswer(correctAnswer);

  // Exact match (case-insensitive, whitespace normalized)
  if (normalizedUser === normalizedCorrect) return true;

  // For short text, allow minor typos (Levenshtein distance ≤ 2 for answers > 5 chars)
  if (type === "short_text" && normalizedUser.length > 5) {
    const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
    if (distance <= 2) return true;
  }

  return false;
}

function normalizeAnswer(answer: string): string {
  return answer
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[\u2018\u2019]/g, "'") // Smart quotes
    .replace(/[\u201C\u201D]/g, '"')
    .normalize("NFC");
}

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
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

  if (question.type === "checkbox") {
    let selected: string[] = [];
    try {
      selected = JSON.parse(raw);
    } catch {
      selected = raw ? [raw] : [];
    }
    // Validate each selected choice is valid
    for (const choice of selected) {
      if (!question.choices.includes(choice)) {
        return {
          ok: false as const,
          error: `Invalid answer for "${question.prompt}".`,
        };
      }
    }
  }

  if (question.type === "true_false") {
    if (raw !== "true" && raw !== "false") {
      return {
        ok: false as const,
        error: `Invalid answer for "${question.prompt}". Must be true or false.`,
      };
    }
  }

  if (question.type === "code_fill_in") {
    // Code fill-in answers are stored per blank
    // We'll validate at submission time
    return {
      ok: true as const,
      value: raw,
    };
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
