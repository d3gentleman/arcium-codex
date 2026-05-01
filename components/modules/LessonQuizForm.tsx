"use client";

import Link from "next/link";
import { startTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/types/domain";
import {
  AlignLeft,
  AlignJustify,
  ListOrdered,
  HelpCircle,
  Trophy,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Circle,
  Lock,
  XCircle,
  Lightbulb,
  History,
  RotateCcw,
  TrendingUp,
  CheckSquare,
  Square,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface QuestionResult {
  questionId: string;
  correct: boolean;
  points: number;
  earned: number;
  userAnswer: string;
  correctAnswer?: string;
  explanation?: string;
}

interface QuizScore {
  totalPoints: number;
  earnedPoints: number;
  percentage: number;
  passed: boolean;
}

interface LessonQuizFormProps {
  lessonSlug: string;
  questions: QuizQuestion[];
  canSubmit: boolean;
  isCompleted: boolean;
}

interface SubmissionHistory {
  id: number;
  submittedAt: string;
  scorePercent: number | null;
  passed: boolean | null;
}

interface ProgressInfo {
  attemptCount: number;
  bestScorePercent: number | null;
  completedAt: string | null;
}

const QuestionTypeIcon = ({ type }: { type: QuizQuestion["type"] }) => {
  switch (type) {
    case "short_text":
      return <AlignLeft size={14} className="text-primary" />;
    case "long_text":
      return <AlignJustify size={14} className="text-primary" />;
    case "multiple_choice":
      return <ListOrdered size={14} className="text-primary" />;
    case "checkbox":
      return <CheckSquare size={14} className="text-primary" />;
    case "true_false":
      return <ToggleLeft size={14} className="text-primary" />;
    case "code_fill_in":
      return <AlignLeft size={14} className="text-primary" />;
    default:
      return <HelpCircle size={14} className="text-primary" />;
  }
};

export default function LessonQuizForm({
  lessonSlug,
  questions,
  canSubmit,
  isCompleted,
}: LessonQuizFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});
  const [score, setScore] = useState<QuizScore | null>(null);
  const [results, setResults] = useState<QuestionResult[] | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Submission history state
  const [history, setHistory] = useState<SubmissionHistory[]>([]);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<number | null>(null);

  // Load draft answers and submission history on mount
  useEffect(() => {
    const saved = localStorage.getItem(`quiz-draft-${lessonSlug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDraftAnswers(parsed);
        // Initialize char counts
        const counts: Record<string, number> = {};
        Object.entries(parsed).forEach(([id, value]) => {
          counts[id] = String(value).length;
        });
        setCharCounts(counts);
      } catch {
        // Ignore parse errors
      }
    }
    
    // Load submission history
    fetchHistory();
  }, [lessonSlug]);
  
  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/lessons/${lessonSlug}/quiz/history`);
      if (response.ok) {
        const data = await response.json();
        setHistory(data.history || []);
        setProgress(data.progress || null);
      }
    } catch {
      // Silently fail - history is not critical
    }
  };

  // Save draft answers to localStorage
  useEffect(() => {
    if (Object.keys(draftAnswers).length > 0) {
      localStorage.setItem(`quiz-draft-${lessonSlug}`, JSON.stringify(draftAnswers));
    }
  }, [draftAnswers, lessonSlug]);

  async function submitForm(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const answers = Object.fromEntries(
      questions.map((question) => [question.id, String(formData.get(question.id) || "")]),
    );

    try {
      const response = await fetch(`/api/lessons/${lessonSlug}/quiz`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      const payload = (await response.json()) as { 
        error?: string;
        score?: QuizScore;
        results?: QuestionResult[];
        submissionId?: number;
        submittedAt?: string;
      };

      if (!response.ok) {
        setError(payload.error || "Unable to submit your quiz.");
        return;
      }

      // Clear draft on successful submission
      localStorage.removeItem(`quiz-draft-${lessonSlug}`);
      
      // Store score and results for feedback display
      if (payload.score) {
        setScore(payload.score);
      }
      if (payload.results) {
        setResults(payload.results);
      }
      setHasSubmitted(true);
      
      setSuccess(payload.score?.passed 
        ? `Quiz passed! Score: ${payload.score?.earnedPoints ?? 0}/${payload.score?.totalPoints ?? 0} (${payload.score?.percentage ?? 0}%)`
        : `Quiz completed. Score: ${payload.score?.earnedPoints ?? 0}/${payload.score?.totalPoints ?? 0} (${payload.score?.percentage ?? 0}%) - Review recommended`);
      
      // Refresh history after submission
      await fetchHistory();
      router.refresh();
    } catch {
      setError("Unable to submit your quiz right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleInputChange = (questionId: string, value: string, maxLength: number) => {
    setDraftAnswers((prev) => ({ ...prev, [questionId]: value }));
    setCharCounts((prev) => ({ ...prev, [questionId]: value.length }));
  };

  if (!canSubmit) {
    return (
      <div className="rounded-[1.4rem] border border-outline-variant/25 bg-surface-container-lowest p-5">
        <div className="flex items-start gap-3">
          <Lock size={18} className="mt-0.5 text-on-surface-variant/60 shrink-0" />
          <div>
            <p className="text-sm text-on-surface-variant leading-7">
              Sign in with a verified account to submit this lesson quiz and save progress.
            </p>
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(`/modules/${lessonSlug}`)}`}
              className="mt-4 inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02]"
            >
              Sign In to Continue
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => draftAnswers[q.id]?.trim()).length;
  const progressPercent = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  // Find result for a specific question
  const getQuestionResult = (questionId: string): QuestionResult | undefined => {
    return results?.find((r) => r.questionId === questionId);
  };

  return (
    <form
      className="space-y-6"
      action={(formData) => {
        startTransition(() => {
          void submitForm(formData);
        });
      }}
    >
      {/* Score Display (shown after submission) */}
      {score && (
        <div className={`rounded-[1.2rem] border p-6 ${score.passed ? "border-primary/30 bg-primary/10" : "border-error/30 bg-error/10"}`}>
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-3 ${score.passed ? "bg-primary/20" : "bg-error/20"}`}>
              {score.passed ? (
                <Trophy size={28} className="text-primary" />
              ) : (
                <AlertCircle size={28} className="text-error" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className={`text-lg font-bold ${score.passed ? "text-primary" : "text-error"}`}>
                  {score.passed ? "Quiz Passed!" : "Review Recommended"}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/60">
                  {score.percentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${score.passed ? "bg-primary" : "bg-error"}`}
                    style={{ width: `${score.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-on-surface-variant">
                  {score.earnedPoints}/{score.totalPoints}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Stats */}
      {progress && progress.attemptCount > 0 && (
        <div className="rounded-[1rem] border border-outline-variant/20 bg-surface-container-low p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <History size={14} className="text-primary/60" />
                <span className="text-xs text-on-surface-variant">
                  <span className="font-bold text-white">{progress.attemptCount}</span> attempt{progress.attemptCount !== 1 ? 's' : ''}
                </span>
              </div>
              {progress.bestScorePercent !== null && (
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-primary/60" />
                  <span className="text-xs text-on-surface-variant">
                    Best: <span className="font-bold text-primary">{progress.bestScorePercent}%</span>
                  </span>
                </div>
              )}
            </div>
            
            {history.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/70 hover:text-primary transition-colors flex items-center gap-1"
              >
                {showHistory ? 'Hide' : 'View'} History
                <RotateCcw size={12} className={`transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          
          {/* Submission History Dropdown */}
          {showHistory && history.length > 0 && (
            <div className="mt-3 pt-3 border-t border-outline-variant/10 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/50 mb-2">
                Previous Attempts
              </p>
              {history.map((attempt, index) => (
                <div 
                  key={attempt.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-black/20"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-on-surface-variant/50">#{index + 1}</span>
                    <span className="text-xs text-on-surface-variant">
                      {new Date(attempt.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {attempt.scorePercent !== null ? (
                      <span className={`text-xs font-bold ${attempt.passed ? 'text-primary' : 'text-error/80'}`}>
                        {attempt.scorePercent}%
                      </span>
                    ) : (
                      <span className="text-xs text-on-surface-variant/50">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress Header (hidden after submission) */}
      {!hasSubmitted && (
        <div className="rounded-[1rem] border border-outline-variant/20 bg-surface-container-low p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant/60">
              Progress
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              {answeredCount} of {questions.length} answered
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {questions.map((question, index) => {
        const result = getQuestionResult(question.id);
        const showFeedback = hasSubmitted && result;
        
        return (
        <div
          key={question.id}
          className={`rounded-[1.2rem] border p-5 transition-all ${
            showFeedback
              ? result?.correct
                ? "border-primary/30 bg-primary/5"
                : "border-error/30 bg-error/5"
              : "border-outline-variant/20 bg-surface-container-low focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(105,218,255,0.05)]"
          }`}
        >
          <div className="mb-3 flex items-center gap-2">
            <QuestionTypeIcon type={question.type} />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">
              Question {index + 1} of {questions.length}
            </span>
            {question.required && !showFeedback && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-error/80">
                Required
              </span>
            )}
            {showFeedback && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.2em] ${result?.correct ? "text-primary" : "text-error"}`}>
                {result?.correct ? (
                  <><CheckCircle2 size={12} /> Correct</>
                ) : (
                  <><XCircle size={12} /> Incorrect</>
                )}
              </span>
            )}
          </div>
          <label className="mb-3 block text-sm font-semibold leading-7 text-white">
            {question.prompt}
          </label>
          
          {/* Hint (shown before submission if available) */}
          {!hasSubmitted && 'hint' in question && question.hint && (
            <div className="mb-3 flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
              <Lightbulb size={14} className="mt-0.5 text-primary/60 shrink-0" />
              <span className="text-xs text-primary/80">{question.hint}</span>
            </div>
          )}
          {question.type === "short_text" ? (
            <div className="space-y-2">
              <input
                name={question.id}
                maxLength={500}
                required={question.required}
                defaultValue={draftAnswers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value, 500)}
                disabled={hasSubmitted}
                className={`w-full rounded-lg border px-4 py-3 text-sm text-white outline-none transition-all ${
                  hasSubmitted
                    ? result?.correct
                      ? "border-primary/30 bg-primary/10"
                      : "border-error/30 bg-error/10"
                    : "border-outline-variant/30 bg-black/40 focus:border-primary focus:shadow-[0_0_12px_rgba(105,218,255,0.15)]"
                }`}
              />
              {showFeedback && (
                <div className="space-y-1">
                  {!result?.correct && result?.correctAnswer && (
                    <p className="text-xs text-error">
                      Correct answer: <span className="font-semibold">{result.correctAnswer}</span>
                    </p>
                  )}
                  {result?.explanation && (
                    <p className="text-xs text-primary/80 italic">{result.explanation}</p>
                  )}
                </div>
              )}
              {!hasSubmitted && (
                <div className="flex justify-end">
                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      (charCounts[question.id] || 0) > 450 ? "text-error/80" : "text-on-surface-variant/50"
                    }`}
                  >
                    {charCounts[question.id] || 0}/500
                  </span>
                </div>
              )}
            </div>
          ) : null}
          {question.type === "long_text" ? (
            <div className="space-y-2">
              <textarea
                name={question.id}
                maxLength={5000}
                required={question.required}
                rows={5}
                defaultValue={draftAnswers[question.id] || ""}
                onChange={(e) => handleInputChange(question.id, e.target.value, 5000)}
                disabled={hasSubmitted}
                className={`w-full rounded-lg border px-4 py-3 text-sm text-white outline-none transition-all resize-y ${
                  hasSubmitted
                    ? result?.correct
                      ? "border-primary/30 bg-primary/10"
                      : "border-error/30 bg-error/10"
                    : "border-outline-variant/30 bg-black/40 focus:border-primary focus:shadow-[0_0_12px_rgba(105,218,255,0.15)]"
                }`}
              />
              {showFeedback && (
                <div className="space-y-1">
                  {!result?.correct && result?.correctAnswer && (
                    <p className="text-xs text-error">
                      Sample answer: <span className="font-semibold">{result.correctAnswer}</span>
                    </p>
                  )}
                  {result?.explanation && (
                    <p className="text-xs text-primary/80 italic">{result.explanation}</p>
                  )}
                </div>
              )}
              {!hasSubmitted && (
                <div className="flex justify-end">
                  <span
                    className={`text-[10px] font-mono transition-colors ${
                      (charCounts[question.id] || 0) > 4500 ? "text-error/80" : "text-on-surface-variant/50"
                    }`}
                  >
                    {charCounts[question.id] || 0}/5000
                  </span>
                </div>
              )}
            </div>
          ) : null}
          {question.type === "multiple_choice" ? (
            <div className="space-y-2">
              {question.choices.map((choice) => {
                const isSelected = draftAnswers[question.id] === choice;
                const isCorrectChoice = result?.correctAnswer === choice;
                const showCorrect = showFeedback && isCorrectChoice;
                const showIncorrect = showFeedback && isSelected && !result?.correct;
                
                return (
                  <label
                    key={choice}
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all cursor-pointer ${
                      hasSubmitted
                        ? showCorrect
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : showIncorrect
                            ? "border-error/40 bg-error/10 text-error"
                            : "border-outline-variant/20 text-on-surface-variant opacity-60"
                        : "border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={choice}
                      required={question.required}
                      defaultChecked={isSelected}
                      onChange={(e) => handleInputChange(question.id, e.target.value, 0)}
                      disabled={hasSubmitted}
                      className="peer sr-only"
                    />
                    {!hasSubmitted && (
                      <>
                        <Circle
                          size={16}
                          className="text-on-surface-variant/40 transition-all peer-checked:hidden group-hover:text-primary/60"
                        />
                        <CheckCircle2
                          size={16}
                          className="hidden text-primary transition-all peer-checked:block"
                        />
                      </>
                    )}
                    {hasSubmitted && (
                      <>
                        {showCorrect && <CheckCircle2 size={16} className="text-primary" />}
                        {showIncorrect && <XCircle size={16} className="text-error" />}
                        {!isSelected && !isCorrectChoice && <Circle size={16} className="text-on-surface-variant/40" />}
                      </>
                    )}
                    <span className="flex-1">{choice}</span>
                  </label>
                );
              })}
              {showFeedback && result?.explanation && (
                <p className="text-xs text-primary/80 italic mt-2">{result.explanation}</p>
              )}
            </div>
          ) : null}
          {/* Checkbox (Multi-select) */}
          {question.type === "checkbox" ? (
            <div className="space-y-2">
              <p className="text-xs text-on-surface-variant/60 mb-2">Select all that apply</p>
              {question.choices.map((choice) => {
                const selectedArray = draftAnswers[question.id] ? JSON.parse(draftAnswers[question.id]) : [];
                const isSelected = selectedArray.includes(choice);
                const isCorrectChoice = question.correctAnswers?.includes(choice);
                const showCorrect = showFeedback && isCorrectChoice;
                const showIncorrect = showFeedback && isSelected && !isCorrectChoice;
                const showMissed = showFeedback && !isSelected && isCorrectChoice;
                
                return (
                  <label
                    key={choice}
                    className={`group flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all cursor-pointer ${
                      hasSubmitted
                        ? showCorrect
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : showIncorrect
                            ? "border-error/40 bg-error/10 text-error"
                            : showMissed
                              ? "border-primary/30 bg-primary/5 text-primary/70"
                              : "border-outline-variant/20 text-on-surface-variant opacity-60"
                        : "border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      name={`${question.id}[]`}
                      value={choice}
                      checked={isSelected}
                      onChange={(e) => {
                        const current = draftAnswers[question.id] ? JSON.parse(draftAnswers[question.id]) : [];
                        const updated = e.target.checked 
                          ? [...current, choice]
                          : current.filter((c: string) => c !== choice);
                        handleInputChange(question.id, JSON.stringify(updated), 0);
                      }}
                      disabled={hasSubmitted}
                      className="peer sr-only"
                    />
                    {!hasSubmitted && (
                      <>
                        <Square
                          size={16}
                          className="text-on-surface-variant/40 transition-all peer-checked:hidden group-hover:text-primary/60"
                        />
                        <CheckSquare
                          size={16}
                          className="hidden text-primary transition-all peer-checked:block"
                        />
                      </>
                    )}
                    {hasSubmitted && (
                      <>
                        {showCorrect && <CheckSquare size={16} className="text-primary" />}
                        {showIncorrect && <XCircle size={16} className="text-error" />}
                        {showMissed && <CheckSquare size={16} className="text-primary/50" />}
                        {!isSelected && !isCorrectChoice && <Square size={16} className="text-on-surface-variant/40" />}
                      </>
                    )}
                    <span className="flex-1">{choice}</span>
                    {showMissed && <span className="text-[10px] text-primary/50">(Missed)</span>}
                  </label>
                );
              })}
              {showFeedback && result?.explanation && (
                <p className="text-xs text-primary/80 italic mt-2">{result.explanation}</p>
              )}
            </div>
          ) : null}
          {/* True/False */}
          {question.type === "true_false" ? (
            <div className="space-y-3">
              <div className="flex gap-3">
                {([true, false] as const).map((value) => {
                  const isSelected = draftAnswers[question.id] === String(value);
                  const isCorrectValue = question.correctAnswer === value;
                  const showCorrect = showFeedback && isCorrectValue;
                  const showIncorrect = showFeedback && isSelected && !result?.correct;
                  
                  return (
                    <label
                      key={String(value)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-6 py-4 text-sm font-medium transition-all cursor-pointer ${
                        hasSubmitted
                          ? showCorrect
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : showIncorrect
                              ? "border-error/40 bg-error/10 text-error"
                              : "border-outline-variant/20 text-on-surface-variant opacity-60"
                          : isSelected
                            ? "border-primary/40 bg-primary/10 text-primary"
                            : "border-outline-variant/20 text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 hover:text-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={String(value)}
                        required={question.required}
                        checked={isSelected}
                        onChange={(e) => handleInputChange(question.id, e.target.value, 0)}
                        disabled={hasSubmitted}
                        className="peer sr-only"
                      />
                      {hasSubmitted && showCorrect && <CheckCircle2 size={16} className="text-primary" />}
                      {hasSubmitted && showIncorrect && <XCircle size={16} className="text-error" />}
                      {value ? "TRUE" : "FALSE"}
                      {!hasSubmitted && isSelected && <ToggleRight size={16} className="text-primary" />}
                      {!hasSubmitted && !isSelected && <ToggleLeft size={16} className="text-on-surface-variant/40" />}
                    </label>
                  );
                })}
              </div>
              {showFeedback && result?.explanation && (
                <p className="text-xs text-primary/80 italic">{result.explanation}</p>
              )}
            </div>
          ) : null}
          {/* Code Fill-in - Simple version with text inputs */}
          {question.type === "code_fill_in" ? (
            <div className="space-y-3">
              <div className="rounded-lg bg-black/60 border border-outline-variant/20 p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-on-surface-variant whitespace-pre-wrap">
                  {question.codeSnippet.split(/\{BLANK\}/).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <input
                          type="text"
                          name={`${question.id}_blank_${i}`}
                          placeholder={`___${i + 1}___`}
                          defaultValue={draftAnswers[`${question.id}_blank_${i}`] || ""}
                          onChange={(e) => handleInputChange(`${question.id}_blank_${i}`, e.target.value, 100)}
                          disabled={hasSubmitted}
                          className={`inline-block w-24 mx-1 px-2 py-1 text-center text-sm rounded border ${
                            hasSubmitted
                              ? result?.correct
                                ? "border-primary/40 bg-primary/10 text-primary"
                                : "border-error/40 bg-error/10 text-error"
                              : "border-outline-variant/40 bg-black/40 text-white focus:border-primary"
                          }`}
                        />
                      )}
                    </span>
                  ))}
                </pre>
              </div>
              {question.hints?.map((hint, i) => (
                !hasSubmitted && (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-primary/5 border border-primary/20 px-3 py-2">
                    <Lightbulb size={14} className="mt-0.5 text-primary/60 shrink-0" />
                    <span className="text-xs text-primary/80">Hint {i + 1}: {hint}</span>
                  </div>
                )
              ))}
              {showFeedback && (
                <div className="space-y-1">
                  {!result?.correct && question.correctAnswers && (
                    <p className="text-xs text-error">
                      Correct answers: {question.correctAnswers.join(", ")}
                    </p>
                  )}
                  {result?.explanation && (
                    <p className="text-xs text-primary/80 italic">{result.explanation}</p>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      );
      })}

      {error ? (
        <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/10 px-4 py-3">
          <AlertCircle size={16} className="text-error" />
          <p className="text-sm text-error">{error}</p>
        </div>
      ) : null}
      {success && !score && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-4">
          <div className="rounded-full bg-primary/20 p-2">
            <Trophy size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-primary">Success!</p>
            <p className="text-sm text-on-surface-variant">{success}</p>
          </div>
        </div>
      )}

      {!hasSubmitted && (
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary/20 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(105,218,255,0.15)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : isCompleted ? (
            <>
              <CheckCircle2 size={16} />
              Submit Updated Quiz
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Submit Quiz
            </>
          )}
        </button>
      )}
      
      {hasSubmitted && (
        <div className="flex items-center gap-3 rounded-lg border border-outline-variant/25 bg-surface-container-low px-4 py-3">
          <CheckCircle2 size={16} className="text-primary" />
          <span className="text-sm text-on-surface-variant">
            Quiz submitted. Review your answers above.
          </span>
        </div>
      )}
    </form>
  );
}
