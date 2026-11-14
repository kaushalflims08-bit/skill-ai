import React, { useState } from 'react';
import { ArrowRight, Layers } from 'lucide-react';

interface HeroSectionProps {
  onLaunchStudio: () => void;
}

const HERO_IMAGE_SRC = '/src/assets/images/skillforge_hero_architecture_1794648242607.jpg';

export const HeroSection: React.FC<HeroSectionProps> = ({ onLaunchStudio }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          <div className="flex flex-col justify-between lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-500">
                Skill Intelligence Platform <span aria-hidden="true">·</span> Multi-Agent Curriculum Engine
              </p>

              <h1
                className="mt-4 max-w-2xl font-display font-bold tracking-tight text-slate-900"
                style={{
                  fontSize: 'clamp(2.25rem, 3.6vw, 3.25rem)',
                  lineHeight: 1.12,
                  textWrap: 'balance',
                }}
              >
                Close skill gaps faster with adaptive career roadmaps
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                Static courses ignore what you already know. SkillForge benchmarks existing capabilities against target role standards, isolates priority gaps, and sequences a structured four-week plan with practical skill checks.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onLaunchStudio}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Start Skill Analysis</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>

                <a
                  href="#tracks"
                  className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0"
                >
                  Compare Learning Tracks
                </a>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 border-t border-slate-200 pt-6 sm:grid-cols-3">
              <div>
                <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">4 Weeks</p>
                <p className="mt-1 text-xs text-slate-500">Structured sprint curriculum</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">3 Tracks</p>
                <p className="mt-1 text-xs text-slate-500">Student, Individual & Enterprise</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-slate-900 tabular-nums">Live Mentor</p>
                <p className="mt-1 text-xs text-slate-500">Quiz-driven path recalibration</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative h-full min-h-[260px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src={HERO_IMAGE_SRC}
                  alt="Architectural stepped geometric blocks representing progressive technical skill mastery"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[280px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50 p-8 text-center">
                  <Layers className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  <p className="mt-3 font-display text-sm font-semibold text-slate-800">
                    Adaptive Curriculum Architecture
                  </p>
                  <p className="mt-1 max-w-xs text-xs text-slate-500">
                    Progressive weekly milestones calibrated to role benchmarks.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
