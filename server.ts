import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const MODEL_NAME = 'gemini-4-hydrogen';

function createAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add it in the Settings > Secrets panel.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getFriendlyError(err: unknown): { status: number; message: string } {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('GEMINI_API_KEY is not configured')) {
    return { status: 500, message: raw };
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED') || raw.includes('403')) {
    return {
      status: 403,
      message:
        'Gemini API authorization failed. Please verify your API key in the Settings > Secrets panel.',
    };
  }
  if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
    return {
      status: 429,
      message:
        'Rate limit or quota reached for the Gemini API. Please retry shortly or check your quota in Settings > Secrets.',
    };
  }
  return {
    status: 500,
    message: raw || 'An unexpected error occurred while processing your AI request.',
  };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.post('/api/generate-plan', async (req: Request, res: Response) => {
    try {
      const { mode, name, skills, projects, target_role, mentor_note } = req.body ?? {};

      if (!mode || !name || !skills || !target_role) {
        res.status(400).json({
          error: 'Mode, name, current skills, and target role are required.',
        });
        return;
      }

      const ai = createAiClient();

      const prompt = `
You are a multi-agent AI Enterprise Learning System operating in '${mode}' mode.

Learner / Cohort Profile:
- Name / Cohort: ${String(name).trim()}
- Current Skills: ${String(skills).trim()}
- Certifications & Projects: ${String(projects || 'None specified').trim()}
- Target Career / Upskilling Goal: ${String(target_role).trim()}

Collaborating Agents Task:
1. Skill Profiler & Gap Analyst Agent:
   Compare current skills and project evidence against real industry expectations for '${String(target_role).trim()}'.
   Tailor the tone and evaluation criteria specifically for '${mode}' mode:
   - Student: academic foundations, internship readiness, portfolio signal, technical interview fundamentals.
   - Individual: career transition leverage, senior architectural depth, production engineering standards.
   - Organization: workforce capability alignment, team delivery KPIs, standardized enablement across a cohort.
   Provide a realistic match_percentage (0-100 integer), concise executive summary, 3-5 concrete strengths, 4-6 prioritized missing_skills, and 3 high-impact recommended_projects.

2. Curriculum Architect Agent:
   Build a tightly sequenced 4-week structured learning roadmap (weeks 1 through 4).
   Each week must target a specific core skill gap, feature a clear module title, list 2-3 specific real-world course/tutorial/documentation topics (clear actionable names without invented URLs), and define one concrete hands-on practical_exercise.

Adaptive AI Mentor Override Instruction:
${mentor_note && String(mentor_note).trim() ? String(mentor_note).trim() : 'Standard 4-week progressive ramp.'}
`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are SkillForge AI, an authoritative technical curriculum and workforce skill analyst. Always return valid JSON conforming strictly to the requested schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              analysis: {
                type: Type.OBJECT,
                properties: {
                  strengths: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Verified existing capabilities relevant to the target role.',
                  },
                  missing_skills: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Prioritized technical or operational skill gaps to close.',
                  },
                  match_percentage: {
                    type: Type.INTEGER,
                    description: 'Realistic readiness match score between 0 and 100.',
                  },
                  summary: {
                    type: Type.STRING,
                    description: 'Clear 2-3 sentence executive assessment tailored to the selected mode.',
                  },
                  recommended_projects: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Concrete capstone, portfolio, or KPI alignment projects.',
                  },
                },
                required: [
                  'strengths',
                  'missing_skills',
                  'match_percentage',
                  'summary',
                  'recommended_projects',
                ],
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    week: {
                      type: Type.INTEGER,
                      description: 'Week number (1 to 4).',
                    },
                    skill: {
                      type: Type.STRING,
                      description: 'Primary skill focus for this week.',
                    },
                    title: {
                      type: Type.STRING,
                      description: 'Concise descriptive module title.',
                    },
                    courses_and_tutorials: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: '2-3 specific recommended study resources or official documentation modules.',
                    },
                    practical_exercise: {
                      type: Type.STRING,
                      description: 'Concrete hands-on build or team deliverable for the week.',
                    },
                  },
                  required: [
                    'week',
                    'skill',
                    'title',
                    'courses_and_tutorials',
                    'practical_exercise',
                  ],
                },
              },
            },
            required: ['analysis', 'roadmap'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        res.status(502).json({ error: 'The AI agent returned an empty response. Please try again.' });
        return;
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err) {
      const { status, message } = getFriendlyError(err);
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/generate-quiz', async (req: Request, res: Response) => {
    try {
      const { skill, mode, target_role } = req.body ?? {};
      if (!skill || !mode) {
        res.status(400).json({ error: 'Skill and mode are required to generate an assessment.' });
        return;
      }

      const ai = createAiClient();

      const prompt = `
As the AI Assessment Agent for '${mode}' learners${target_role ? ` targeting '${String(target_role).trim()}'` : ''},
generate a rigorous 3-question practical multiple-choice assessment on the skill: '${String(skill).trim()}'.

Requirements:
- Focus on real-world applied scenarios, debugging, architecture, or practical decisions rather than trivia.
- Provide exactly 4 distinct options per question.
- Provide the 0-based integer answer_index (0, 1, 2, or 3).
- Provide a concise 1-2 sentence explanation detailing why the correct option is right.
`;

      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          systemInstruction:
            'You are a technical assessment designer creating high-signal practical evaluations. Return valid JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    answer_index: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ['question', 'options', 'answer_index', 'explanation'],
                },
              },
            },
            required: ['questions'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        res.status(502).json({ error: 'Assessment generation returned empty content. Please retry.' });
        return;
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err) {
      const { status, message } = getFriendlyError(err);
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SkillForge AI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
