import React from 'react';

interface HeaderProps {
  onOpenStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenStudio }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6">
        <a
          href="#"
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          SkillForge
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#tracks"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4"
          >
            Tracks
          </a>
          <a
            href="#workspace"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4"
          >
            Workspace
          </a>
          <a
            href="#assessment"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4"
          >
            Assessment
          </a>
          <a
            href="#methodology"
            className="whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-slate-900 hover:underline hover:underline-offset-4"
          >
            Methodology
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenStudio}
            className="inline-flex min-h-[40px] items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Studio
          </button>
        </div>
      </div>
    </header>
  );
};
