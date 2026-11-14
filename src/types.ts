export type LearningMode = 'Student' | 'Individual' | 'Organization';

export interface AnalyzeRequest {
  mode: LearningMode;
  name: string;
  skills: string;
  projects: string;
  target_role: string;
  mentor_note?: string;
}

export interface SkillAnalysis {
  strengths: string[];
  missing_skills: string[];
  match_percentage: number;
  summary: string;
  recommended_projects: string[];
}

export interface RoadmapStep {
  week: number;
  skill: string;
  title: string;
  courses_and_tutorials: string[];
  practical_exercise: string;
}

export interface FullPipelineOutput {
  analysis: SkillAnalysis;
  roadmap: RoadmapStep[];
}

export interface QuizRequest {
  skill: string;
  mode: LearningMode;
  target_role?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

export interface QuizOutput {
  questions: QuizQuestion[];
}

export interface PipelineEvent {
  id: string;
  agent: string;
  message: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  timestamp: string;
}

export interface TrackPreset {
  mode: LearningMode;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  outcome: string;
  nameLabel: string;
  skillsLabel: string;
  projectsLabel: string;
  targetLabel: string;
  defaultProfile: {
    name: string;
    skills: string;
    projects: string;
    target_role: string;
  };
}

export const TRACK_PRESETS: Record<LearningMode, TrackPreset> = {
  Student: {
    mode: 'Student',
    index: '01',
    title: 'Students & Universities',
    subtitle: 'Academic Foundations · Internship Readiness',
    description:
      'Bridge classroom coursework with current engineering hiring standards through portfolio projects and placement readiness checks.',
    outcome: 'Converts coursework into hiring-ready portfolio milestones',
    nameLabel: 'Student Name',
    skillsLabel: 'Current Coursework & Technical Skills',
    projectsLabel: 'Academic Projects & Certifications',
    targetLabel: 'Target Internship or Entry Role',
    defaultProfile: {
      name: 'Alex Rivera',
      skills: 'Python, SQL, Basic HTML, Git Fundamentals',
      projects: 'Python Basics Certificate, CLI Expense Tracker, University Database Lab',
      target_role: 'Full Stack Software Engineer Intern',
    },
  },
  Individual: {
    mode: 'Individual',
    index: '02',
    title: 'Individual Professionals',
    subtitle: 'Career Transition · Seniority Acceleration',
    description:
      'Close targeted architectural gaps for promotions or role transitions with practical upskilling paths and scenario-based skill checks.',
    outcome: 'Targets high-leverage gaps without repeating known fundamentals',
    nameLabel: 'Professional Name',
    skillsLabel: 'Production Stack & Core Skills',
    projectsLabel: 'Work Deliverables & Credentials',
    targetLabel: 'Target Promotion or Next Role',
    defaultProfile: {
      name: 'Jordan Chen',
      skills: 'JavaScript, React, REST APIs, CSS Grid, Jest',
      projects: 'Customer Billing Portal Redesign, SaaS Analytics Dashboard',
      target_role: 'Senior Frontend Systems Architect',
    },
  },
  Organization: {
    mode: 'Organization',
    index: '03',
    title: 'Enterprise & Teams',
    subtitle: 'Workforce Calibration · Cohort Upskilling',
    description:
      'Benchmark team capabilities against strategic technical initiatives and deploy structured four-week cohort training.',
    outcome: 'Aligns cohort capability gaps with quarterly delivery KPIs',
    nameLabel: 'Cohort or Department Name',
    skillsLabel: 'Current Team Capabilities',
    projectsLabel: 'Active Systems & Prior Enablement',
    targetLabel: 'Target Strategic Capability or KPI',
    defaultProfile: {
      name: 'Platform Engineering Cohort (18 Engineers)',
      skills: 'Java Spring Boot, PostgreSQL, Docker Basics, Jenkins CI',
      projects: 'Monolithic Core Ledger Service, Internal Auth Gateway',
      target_role: 'Cloud-Native Kubernetes & Event-Driven Architecture',
    },
  },
};
