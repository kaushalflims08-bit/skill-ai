import React from 'react';

const AGENTS = [
  {
    index: '01',
    name: 'Skill Profiler',
    mechanism: 'Parses existing stack, projects, and credentials against target role expectations.',
    outcome: 'Establishes a verified capability baseline without redundant onboarding.',
  },
  {
    index: '02',
    name: 'Gap Analyst',
    mechanism: 'Computes readiness percentage and ranks missing competencies by impact.',
    outcome: 'Surfaces concrete portfolio or KPI gaps tailored to your selected track.',
  },
  {
    index: '03',
    name: 'Curriculum Architect',
    mechanism: 'Sequences four weekly modules pairing curated study guides with applied builds.',
    outcome: 'Produces an actionable weekly schedule rather than a generic reading list.',
  },
  {
    index: '04',
    name: 'Assessment & Adaptive Mentor',
    mechanism: 'Runs 3-question scenario evaluations and accepts direct pacing overrides.',
    outcome: 'Recalibrates future weeks based on real comprehension gaps or constraints.',
  },
];

export const MethodologySection: React.FC = () => {
  return (
    <section id="methodology" className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium text-slate-500">System Architecture</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            Four collaborating agents behind every plan
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Rather than returning a static syllabus, SkillForge executes a structured analytical pipeline that connects profile diagnostics directly to weekly exercises and skill verification.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.index}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6"
            >
              <div>
                <p className="font-mono text-xs font-semibold text-blue-700 tabular-nums">
                  {agent.index}. Agent
                </p>
                <h3 className="mt-2 font-display text-base font-bold text-slate-900">
                  {agent.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {agent.mechanism}
                </p>
              </div>
              <p className="mt-5 border-t border-slate-200 pt-4 text-xs font-medium leading-relaxed text-slate-700">
                {agent.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
