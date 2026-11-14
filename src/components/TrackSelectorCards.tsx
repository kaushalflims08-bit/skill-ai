import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { LearningMode, TRACK_PRESETS } from '../types';

interface TrackSelectorCardsProps {
  selectedMode: LearningMode;
  onSelectTrack: (mode: LearningMode) => void;
}

const MODES: LearningMode[] = ['Student', 'Individual', 'Organization'];

export const TrackSelectorCards: React.FC<TrackSelectorCardsProps> = ({
  selectedMode,
  onSelectTrack,
}) => {
  return (
    <section id="tracks" className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">Calibrated Evaluation Modes</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
            Select a learning track
          </h2>
        </div>
        <p className="max-w-md text-sm text-slate-600">
          Each mode tunes how the Skill Analyst evaluates baseline experience and structures weekly deliverables.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {MODES.map((mode) => {
          const track = TRACK_PRESETS[mode];
          const isActive = selectedMode === mode;

          return (
            <button
              key={mode}
              type="button"
              onClick={() => onSelectTrack(mode)}
              className={`group flex flex-col justify-between rounded-xl border p-6 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer ${
                isActive
                  ? 'border-blue-600 bg-white ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                    {track.index}. {track.mode}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  >
                    {isActive ? 'Selected' : 'Select track'}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-lg font-bold text-slate-900">
                  {track.title}
                </h3>

                <p className="mt-1 text-xs font-medium text-slate-500">{track.subtitle}</p>

                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {track.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs font-medium text-slate-700">
                <span>{track.outcome}</span>
                <ArrowUpRight
                  className={`h-4 w-4 shrink-0 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}
                  aria-hidden="true"
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
