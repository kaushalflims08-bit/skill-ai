import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Loader2, X, XCircle } from 'lucide-react';
import { LearningMode, QuizOutput } from '../types';

interface AssessmentModalProps {
  isOpen: boolean;
  skill: string;
  mode: LearningMode;
  targetRole: string;
  onClose: () => void;
  onSendToMentor: (feedbackNote: string) => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  skill,
  mode,
  targetRole,
  onClose,
  onSendToMentor,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizOutput | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError(null);
    setQuiz(null);
    setSelectedAnswers({});
    setSubmitted(false);

    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill,
          mode,
          target_role: targetRole,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate skill assessment.');
      }
      setQuiz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load assessment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && skill) {
      fetchQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, skill, mode]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalQuestions = quiz?.questions.length ?? 0;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount =
    quiz?.questions.reduce((acc, q, idx) => {
      return acc + (selectedAnswers[idx] === q.answer_index ? 1 : 0);
    }, 0) ?? 0;

  const handleApplyToMentor = () => {
    const scoreText = `${correctCount}/${totalQuestions}`;
    const note =
      correctCount < totalQuestions
        ? `Assessment result on '${skill}': scored ${scoreText}. Reinforce foundational concepts and debugging exercises for '${skill}' in the updated roadmap.`
        : `Assessment result on '${skill}': scored ${scoreText} (passed). Accelerate past basics of '${skill}' and introduce advanced production scenarios.`;
    onSendToMentor(note);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assessment-modal-title"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              AI Assessment Agent <span aria-hidden="true">·</span> {mode} Track
            </p>
            <h3
              id="assessment-modal-title"
              className="mt-0.5 font-display text-lg font-bold text-slate-900"
            >
              Practical Check: {skill}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assessment"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="h-7 w-7 animate-spin text-blue-600" aria-hidden="true" />
              <p className="mt-3 text-sm font-semibold text-slate-800">
                Generating scenario-based questions for {skill}...
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Calibrating difficulty to {mode} mode
              </p>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-red-900">Assessment unavailable</p>
                  <p className="mt-1 text-sm text-red-700">{error}</p>
                  <button
                    type="button"
                    onClick={fetchQuiz}
                    className="mt-3 min-h-[40px] rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 cursor-pointer"
                  >
                    Retry Generation
                  </button>
                </div>
              </div>
            </div>
          )}

          {quiz && !loading && !error && (
            <div className="space-y-6">
              {submitted && (
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500">Evaluation Score</p>
                    <p className="mt-0.5 font-mono text-xl font-bold text-slate-900 tabular-nums">
                      {correctCount} / {totalQuestions} Correct (
                      {Math.round((correctCount / Math.max(1, totalQuestions)) * 100)}%)
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyToMentor}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Send Result to Adaptive Mentor</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}

              {quiz.questions.map((q, qIdx) => {
                const chosen = selectedAnswers[qIdx];
                const isCorrect = submitted && chosen === q.answer_index;

                return (
                  <div key={qIdx} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                    <p className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                      Question 0{qIdx + 1} of 0{totalQuestions}
                    </p>
                    <p className="mt-1.5 text-sm font-semibold leading-relaxed text-slate-900">
                      {q.question}
                    </p>

                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = chosen === oIdx;
                        const isAnswer = oIdx === q.answer_index;

                        let stateClasses =
                          'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';
                        if (!submitted && isSelected) {
                          stateClasses =
                            'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600';
                        } else if (submitted && isAnswer) {
                          stateClasses =
                            'border-emerald-600 bg-emerald-50 text-emerald-950';
                        } else if (submitted && isSelected && !isAnswer) {
                          stateClasses =
                            'border-red-500 bg-red-50 text-red-950';
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            disabled={submitted}
                            onClick={() =>
                              setSelectedAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))
                            }
                            className={`flex min-h-[44px] w-full items-center justify-between gap-3 rounded-lg border px-4 py-2.5 text-left text-sm transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${stateClasses} ${
                              submitted ? 'cursor-default' : 'cursor-pointer'
                            }`}
                          >
                            <span>{opt}</span>
                            {submitted && isAnswer && (
                              <CheckCircle2
                                className="h-4 w-4 shrink-0 text-emerald-600"
                                aria-hidden="true"
                              />
                            )}
                            {submitted && isSelected && !isAnswer && (
                              <XCircle
                                className="h-4 w-4 shrink-0 text-red-600"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {submitted && (
                      <div
                        className={`mt-3 rounded-lg border px-3.5 py-2.5 text-xs leading-relaxed ${
                          isCorrect
                            ? 'border-emerald-200 bg-emerald-50/60 text-emerald-900'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="font-semibold">
                          {isCorrect ? 'Correct: ' : 'Rationale: '}
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {quiz ? `${answeredCount} of ${totalQuestions} answered` : 'Standby'}
          </span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Close
            </button>

            {quiz && !submitted && (
              <button
                type="button"
                disabled={answeredCount < totalQuestions}
                onClick={() => setSubmitted(true)}
                className="min-h-[40px] rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Submit Assessment
              </button>
            )}

            {quiz && submitted && (
              <button
                type="button"
                onClick={fetchQuiz}
                className="min-h-[40px] rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                New Questions
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
