import React from 'react';
import { BookOpen, CheckCircle2, Circle, ClipboardCheck, Download, RefreshCw } from 'lucide-react';
import { RoadmapStep } from '../types';

interface RoadmapTimelineProps {
  roadmap: RoadmapStep[];
  completedWeeks: number[];
  onToggleWeek: (week: number) => void;
  onStartQuiz: (skill: string) => void;
  mentorNote: string;
  onMentorNoteChange: (note: string) => void;
  onAdaptRoadmap: (overrideNote?: string) => void;
  isLoading: boolean;
  onExportMarkdown: () => void;
}

const MENTOR_DIRECTIVES = [
  {
    label: 'Hands-on Labs Focus',
    note: 'Prioritize practical implementation exercises and debugging drills over reading theory.',
  },
  {
    label: 'Foundational Reinforcement',
    note: 'Slow down Weeks 1 and 2 to build deeper foundational confidence before advanced topics.',
  },
  {
    label: 'Interview & System Design',
    note: 'Include architecture trade-offs, scalability scenarios, and technical interview prep in each week.',
  },
];

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  roadmap,
  completedWeeks,
  onToggleWeek,
  onStartQuiz,
  mentorNote,
  onMentorNoteChange,
  onAdaptRoadmap,
  isLoading,
  onExportMarkdown,
}) => {
  const sortedSteps = [...roadmap].sort((a, b) => a.week - b.week);
  const completedCount = sortedSteps.filter((step) => completedWeeks.includes(step.week)).length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Curriculum Architect <span aria-hidden="true">·</span> 4-Week Progression
            </p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-slate-900">
              Structured Learning Roadmap
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
              {completedCount} of {sortedSteps.length} weeks complete
            </span>
            <button
              type="button"
              onClick={onExportMarkdown}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Export Plan</span>
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {sortedSteps.map((step) => {
            const isDone = completedWeeks.includes(step.week);

            return (
              <div
                key={step.week}
                className={`rounded-xl border p-5 transition-colors duration-150 sm:p-6 ${
                  isDone
                    ? 'border-emerald-200 bg-emerald-50/30'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                      Week 0{step.week} <span aria-hidden="true">·</span> {step.skill}
                    </p>
                    <h4 className="mt-1 font-display text-lg font-bold text-slate-900">
                      {step.title}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onStartQuiz(step.skill)}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-blue-600 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Take Skill Check</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleWeek(step.week)}
                      aria-pressed={isDone}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      <span>{isDone ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-6 border-t border-slate-200/80 pt-4 md:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                      <BookOpen className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                      <span>Courses & Study Guides</span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5 text-sm text-slate-600">
                      {step.courses_and_tutorials.map((course, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden="true" />
                          <span>{course}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-800">Practical Exercise</p>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {step.practical_exercise}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Adaptive AI Mentor <span aria-hidden="true">·</span> Curriculum Recalibration
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-slate-900">
              Adjust pacing or focus areas
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Provide a directive to regenerate the four-week roadmap around specific bottlenecks, assessment feedback, or team priorities.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {MENTOR_DIRECTIVES.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onMentorNoteChange(preset.note)}
              className="min-h-[40px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors duration-150 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={mentorNote}
            onChange={(e) => onMentorNoteChange(e.target.value)}
            placeholder="e.g., Slow down Week 2 and focus on PostgreSQL indexing and query plans..."
            aria-label="Adaptive AI Mentor override instruction"
            className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onAdaptRoadmap()}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            <span>{isLoading ? 'Adapting Plan...' : 'Adapt Roadmap'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
