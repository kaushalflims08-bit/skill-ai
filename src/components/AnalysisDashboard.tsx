import React from 'react';
import { Check, ClipboardCheck } from 'lucide-react';
import { LearningMode, SkillAnalysis } from '../types';

interface AnalysisDashboardProps {
  analysis: SkillAnalysis;
  learnerName: string;
  targetRole: string;
  mode: LearningMode;
  onAssessSkill: (skill: string) => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  analysis,
  learnerName,
  targetRole,
  mode,
  onAssessSkill,
}) => {
  const score = Math.max(0, Math.min(100, Math.round(analysis.match_percentage)));

  const tier =
    score >= 75
      ? { label: 'Strong Alignment', barClass: 'bg-emerald-600', textClass: 'text-emerald-700' }
      : score >= 50
        ? { label: 'Competitive Readiness', barClass: 'bg-blue-600', textClass: 'text-blue-700' }
        : { label: 'Foundational Match', barClass: 'bg-amber-600', textClass: 'text-amber-700' };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-slate-500">
            Skill Gap Analysis <span aria-hidden="true">·</span> {mode} Track{' '}
            <span aria-hidden="true">·</span> {learnerName}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-bold tracking-tight text-slate-900">
            Benchmark against {targetRole}
          </h3>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{analysis.summary}</p>
        </div>

        <div className="shrink-0 sm:min-w-[200px] sm:text-right">
          <p className="text-xs font-medium text-slate-500">Role Readiness Score</p>
          <div className="mt-1 flex items-baseline gap-2 sm:justify-end">
            <span className="font-mono text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {score}%
            </span>
            <span className={`text-xs font-semibold ${tier.textClass}`}>{tier.label}</span>
          </div>
          <div
            className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Role readiness ${score}%`}
          >
            <div
              className={`h-full transition-all duration-300 ${tier.barClass}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <h4 className="font-display text-sm font-bold text-slate-900">
            Verified Strengths
          </h4>
          <p className="mt-0.5 text-xs text-slate-500">
            Capabilities validated from your current skills and deliverables
          </p>
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {analysis.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 py-2.5 text-sm text-slate-700">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold text-slate-900">
            Priority Skill Gaps
          </h4>
          <p className="mt-0.5 text-xs text-slate-500">
            Select any gap to run an immediate 3-question diagnostic check
          </p>
          <ul className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
            {analysis.missing_skills.map((skill, idx) => (
              <li
                key={idx}
                className="flex items-center justify-between gap-3 py-2 text-sm text-slate-800"
              >
                <span className="font-medium">{skill}</span>
                <button
                  type="button"
                  onClick={() => onAssessSkill(skill)}
                  className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors duration-150 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Assess</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <h4 className="font-display text-sm font-bold text-slate-900">
          Recommended Projects & Deliverables
        </h4>
        <p className="mt-0.5 text-xs text-slate-500">
          High-signal builds aligned with {targetRole} expectations
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {analysis.recommended_projects.map((proj, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-700"
            >
              <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                0{idx + 1}. Project
              </span>
              <p className="mt-1.5 leading-relaxed">{proj}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
