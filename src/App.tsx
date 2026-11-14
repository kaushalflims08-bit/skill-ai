import React, { useRef, useState } from 'react';
import { AlertCircle, ClipboardCheck, Compass, Play, RotateCcw } from 'lucide-react';
import { AgentPipelineFeed } from './components/AgentPipelineFeed';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AssessmentModal } from './components/AssessmentModal';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MethodologySection } from './components/MethodologySection';
import { RoadmapTimeline } from './components/RoadmapTimeline';
import { TrackSelectorCards } from './components/TrackSelectorCards';
import {
  FullPipelineOutput,
  LearningMode,
  PipelineEvent,
  TRACK_PRESETS,
} from './types';

function formatTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function createStandbyEvents(): PipelineEvent[] {
  const now = formatTime();
  return [
    {
      id: 'profiler',
      agent: 'Skill Profiler',
      message: 'Ready to evaluate baseline skills and project deliverables.',
      status: 'pending',
      timestamp: now,
    },
    {
      id: 'analyst',
      agent: 'Gap Analyst',
      message: 'Standing by for target role benchmarking.',
      status: 'pending',
      timestamp: now,
    },
    {
      id: 'architect',
      agent: 'Curriculum Architect',
      message: 'Standing by to sequence 4-week roadmap.',
      status: 'pending',
      timestamp: now,
    },
  ];
}

export default function App() {
  const workspaceRef = useRef<HTMLElement | null>(null);

  const [mode, setMode] = useState<LearningMode>('Student');
  const [name, setName] = useState(TRACK_PRESETS.Student.defaultProfile.name);
  const [skills, setSkills] = useState(TRACK_PRESETS.Student.defaultProfile.skills);
  const [projects, setProjects] = useState(TRACK_PRESETS.Student.defaultProfile.projects);
  const [targetRole, setTargetRole] = useState(
    TRACK_PRESETS.Student.defaultProfile.target_role
  );
  const [mentorNote, setMentorNote] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pipelineResult, setPipelineResult] = useState<FullPipelineOutput | null>(null);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);
  const [pipelineEvents, setPipelineEvents] = useState<PipelineEvent[]>(() =>
    createStandbyEvents()
  );

  const [customQuizSkill, setCustomQuizSkill] = useState('TypeScript Generics & Type Narrowing');
  const [quizModalSkill, setQuizModalSkill] = useState<string | null>(null);

  const activePreset = TRACK_PRESETS[mode];

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleModeSwitch = (nextMode: LearningMode, scroll = false) => {
    const prevDefaults = TRACK_PRESETS[mode].defaultProfile;
    const isUsingUnmodifiedPreset =
      name === prevDefaults.name &&
      skills === prevDefaults.skills &&
      projects === prevDefaults.projects &&
      targetRole === prevDefaults.target_role;

    setMode(nextMode);
    if (isUsingUnmodifiedPreset) {
      const nextDefaults = TRACK_PRESETS[nextMode].defaultProfile;
      setName(nextDefaults.name);
      setSkills(nextDefaults.skills);
      setProjects(nextDefaults.projects);
      setTargetRole(nextDefaults.target_role);
    }

    if (scroll) {
      scrollToWorkspace();
    }
  };

  const handleLoadTrackPreset = () => {
    const defaults = TRACK_PRESETS[mode].defaultProfile;
    setName(defaults.name);
    setSkills(defaults.skills);
    setProjects(defaults.projects);
    setTargetRole(defaults.target_role);
    setMentorNote('');
    setError(null);
  };

  const runPipeline = async (overrideMentorNote?: string) => {
    const trimmedName = name.trim();
    const trimmedSkills = skills.trim();
    const trimmedTarget = targetRole.trim();

    if (!trimmedName || !trimmedSkills || !trimmedTarget) {
      setError('Please complete your name, existing skills, and target role before running.');
      return;
    }

    const effectiveNote =
      typeof overrideMentorNote === 'string' ? overrideMentorNote : mentorNote;

    setIsLoading(true);
    setError(null);

    const startTime = formatTime();
    setPipelineEvents([
      {
        id: 'profiler',
        agent: 'Skill Profiler',
        message: `Parsing ${mode} profile for ${trimmedName}...`,
        status: 'running',
        timestamp: startTime,
      },
      {
        id: 'analyst',
        agent: 'Gap Analyst',
        message: `Benchmarking capabilities against ${trimmedTarget}.`,
        status: 'running',
        timestamp: startTime,
      },
      {
        id: 'architect',
        agent: 'Curriculum Architect',
        message: effectiveNote.trim()
          ? 'Applying Adaptive AI Mentor directive to 4-week sequence.'
          : 'Sequencing 4-week courses and practical deliverables.',
        status: 'running',
        timestamp: startTime,
      },
    ]);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          name: trimmedName,
          skills: trimmedSkills,
          projects: projects.trim(),
          target_role: trimmedTarget,
          mentor_note: effectiveNote.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute AI pipeline.');
      }

      const finishedTime = formatTime();
      setPipelineResult(data as FullPipelineOutput);
      setCompletedWeeks([]);
      setPipelineEvents([
        {
          id: 'profiler',
          agent: 'Skill Profiler',
          message: `Verified ${(data as FullPipelineOutput).analysis.strengths.length} core strengths.`,
          status: 'completed',
          timestamp: finishedTime,
        },
        {
          id: 'analyst',
          agent: 'Gap Analyst',
          message: `Computed ${(data as FullPipelineOutput).analysis.match_percentage}% role match and ${(data as FullPipelineOutput).analysis.missing_skills.length} gaps.`,
          status: 'completed',
          timestamp: finishedTime,
        },
        {
          id: 'architect',
          agent: 'Curriculum Architect',
          message: `Generated ${(data as FullPipelineOutput).roadmap.length}-week structured roadmap.`,
          status: 'completed',
          timestamp: finishedTime,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to generate roadmap.';
      const failTime = formatTime();
      setError(message);
      setPipelineEvents((prev) =>
        prev.map((ev) => ({
          ...ev,
          status: 'error',
          message: ev.id === 'architect' ? message : ev.message,
          timestamp: failTime,
        }))
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWeek = (week: number) => {
    setCompletedWeeks((prev) =>
      prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]
    );
  };

  const handleMentorFeedback = (feedbackNote: string) => {
    setMentorNote(feedbackNote);
    runPipeline(feedbackNote);
    scrollToWorkspace();
  };

  const handleExportMarkdown = () => {
    if (!pipelineResult) return;
    const { analysis, roadmap } = pipelineResult;
    const lines = [
      `# SkillForge AI Learning Plan`,
      ``,
      `- **Track:** ${mode}`,
      `- **Learner / Cohort:** ${name}`,
      `- **Target Role:** ${targetRole}`,
      `- **Readiness Score:** ${analysis.match_percentage}%`,
      ``,
      `## Executive Summary`,
      analysis.summary,
      ``,
      `## Verified Strengths`,
      ...analysis.strengths.map((s) => `- ${s}`),
      ``,
      `## Priority Skill Gaps`,
      ...analysis.missing_skills.map((g) => `- ${g}`),
      ``,
      `## Recommended Projects`,
      ...analysis.recommended_projects.map((p, idx) => `${idx + 1}. ${p}`),
      ``,
      `## 4-Week Learning Roadmap`,
      ...roadmap
        .sort((a, b) => a.week - b.week)
        .flatMap((step) => [
          ``,
          `### Week ${step.week}: ${step.title} (${step.skill})`,
          `**Courses & Study Guides:**`,
          ...step.courses_and_tutorials.map((c) => `- ${c}`),
          ``,
          `**Practical Exercise:** ${step.practical_exercise}`,
        ]),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `skillforge-${mode.toLowerCase()}-roadmap.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const quickAssessmentSkills = pipelineResult
    ? Array.from(
        new Set([
          ...pipelineResult.analysis.missing_skills.slice(0, 3),
          ...pipelineResult.roadmap.map((r) => r.skill).slice(0, 2),
        ])
      )
    : [
        'System Design & Caching',
        'SQL Indexing & Query Plans',
        'Docker & CI/CD Pipelines',
        'React State Architecture',
      ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onOpenStudio={scrollToWorkspace} />

      <main>
        <HeroSection onLaunchStudio={scrollToWorkspace} />

        <TrackSelectorCards
          selectedMode={mode}
          onSelectTrack={(nextMode) => handleModeSwitch(nextMode, true)}
        />

        <section
          id="workspace"
          ref={workspaceRef}
          className="mx-auto max-w-7xl px-6 pb-14 pt-2"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Interactive Workspace <span aria-hidden="true">·</span> {activePreset.title}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                  Career & Skill Intelligence Studio
                </h2>
              </div>

              <div
                className="inline-flex rounded-lg bg-slate-100 p-1"
                role="tablist"
                aria-label="Learning Track Mode"
              >
                {(['Student', 'Individual', 'Organization'] as LearningMode[]).map((tabMode) => {
                  const active = mode === tabMode;
                  return (
                    <button
                      key={tabMode}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleModeSwitch(tabMode, false)}
                      className={`min-h-[40px] rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tabMode}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-sm font-bold text-slate-900">
                    Learner Profile
                  </h3>
                  <button
                    type="button"
                    onClick={handleLoadTrackPreset}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Reset Sample</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      {activePreset.nameLabel}
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-skills"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      {activePreset.skillsLabel}
                    </label>
                    <textarea
                      id="profile-skills"
                      rows={2}
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-projects"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      {activePreset.projectsLabel}
                    </label>
                    <textarea
                      id="profile-projects"
                      rows={2}
                      value={projects}
                      onChange={(e) => setProjects(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="profile-target"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      {activePreset.targetLabel}
                    </label>
                    <input
                      id="profile-target"
                      type="text"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="mt-1.5 min-h-[42px] w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => runPipeline()}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    <span>{isLoading ? 'Running AI Agents...' : 'Generate Gap & Roadmap'}</span>
                  </button>
                </div>

                <AgentPipelineFeed events={pipelineEvents} />
              </div>

              <div className="space-y-6 lg:col-span-8">
                {error && (
                  <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">Pipeline execution halted</p>
                      <p className="mt-0.5 text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {isLoading && !pipelineResult && (
                  <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50/50 p-6 sm:p-8">
                    <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />
                    <div className="h-20 w-full animate-pulse rounded bg-slate-200" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="h-36 animate-pulse rounded bg-slate-200" />
                      <div className="h-36 animate-pulse rounded bg-slate-200" />
                    </div>
                  </div>
                )}

                {!isLoading && !pipelineResult && (
                  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-blue-600">
                      <Compass className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                      Ready to generate your capability plan
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                      Review the {mode.toLowerCase()} profile details on the left and run the four-agent pipeline to inspect verified strengths, priority skill gaps, and a weekly roadmap.
                    </p>
                    <button
                      type="button"
                      onClick={() => runPipeline()}
                      className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <Play className="h-4 w-4" aria-hidden="true" />
                      <span>Run Sample {mode} Analysis</span>
                    </button>
                  </div>
                )}

                {pipelineResult && (
                  <>
                    <AnalysisDashboard
                      analysis={pipelineResult.analysis}
                      learnerName={name}
                      targetRole={targetRole}
                      mode={mode}
                      onAssessSkill={(skill) => setQuizModalSkill(skill)}
                    />

                    <RoadmapTimeline
                      roadmap={pipelineResult.roadmap}
                      completedWeeks={completedWeeks}
                      onToggleWeek={handleToggleWeek}
                      onStartQuiz={(skill) => setQuizModalSkill(skill)}
                      mentorNote={mentorNote}
                      onMentorNoteChange={setMentorNote}
                      onAdaptRoadmap={runPipeline}
                      isLoading={isLoading}
                      onExportMarkdown={handleExportMarkdown}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="assessment" className="mx-auto max-w-7xl px-6 pb-14">
          <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="text-xs font-medium text-slate-500">
                  AI Assessment Agent <span aria-hidden="true">·</span> Applied Skill Verification
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900">
                  Test any skill with scenario questions
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Launch a focused three-question practical evaluation tailored to {mode} expectations. Results feed directly into the Adaptive AI Mentor to reinforce weak areas.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {quickAssessmentSkills.map((skillItem) => (
                    <button
                      key={skillItem}
                      type="button"
                      onClick={() => {
                        setCustomQuizSkill(skillItem);
                        setQuizModalSkill(skillItem);
                      }}
                      className="min-h-[40px] rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {skillItem}
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <label
                    htmlFor="quick-quiz-skill"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    Target Skill or Technical Topic
                  </label>
                  <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="quick-quiz-skill"
                      type="text"
                      value={customQuizSkill}
                      onChange={(e) => setCustomQuizSkill(e.target.value)}
                      placeholder="e.g., Kubernetes Pod Networking or Python AsyncIO"
                      className="min-h-[44px] flex-1 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      disabled={!customQuizSkill.trim()}
                      onClick={() => setQuizModalSkill(customQuizSkill.trim())}
                      className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
                      <span>Start Check</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MethodologySection />
      </main>

      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs text-slate-500">
          <p className="font-medium text-slate-700">SkillForge AI</p>
          <div className="flex items-center gap-6">
            <a href="#tracks" className="hover:text-slate-900">
              Tracks
            </a>
            <a href="#workspace" className="hover:text-slate-900">
              Workspace
            </a>
            <a href="#assessment" className="hover:text-slate-900">
              Assessment
            </a>
            <a href="#methodology" className="hover:text-slate-900">
              Methodology
            </a>
          </div>
        </div>
      </footer>

      <AssessmentModal
        isOpen={Boolean(quizModalSkill)}
        skill={quizModalSkill ?? ''}
        mode={mode}
        targetRole={targetRole}
        onClose={() => setQuizModalSkill(null)}
        onSendToMentor={handleMentorFeedback}
      />
    </div>
  );
}
