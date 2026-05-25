// ============================================================
// PROJECT TYPE DEFINITIONS
// Portfolio project schemas with recruiter signals
// ============================================================

export type RecruiterSignal = 
  | 'Production Thinking'
  | 'System Design'
  | 'User Empathy'
  | 'Technical Depth'
  | 'Innovation'
  | 'Scalability';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Step {
  stepNumber: number;
  title: string;
  description: string;
  technicalDetails?: string;
  estimatedHours?: number;
  keyLearnings?: string[];
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  deployment?: string[];
  tools?: string[];
}

export interface ProjectIdea {
  id?: string;
  title: string;
  tagline: string;
  description: string;
  fitScore: number; // 0-100
  recruiterSignals: RecruiterSignal[];
  difficulty: DifficultyLevel;
  estimatedHours: number;
  techStack: TechStack;
  steps: Step[];
  realWorldContext: string;
  marketRelevance: string;
  whyRecruitersCare: string;
  portfolioImpact: string;
  isCompleted?: boolean;
  completedAt?: string;
  createdAt?: string;
}

export interface ProjectGenerationParams {
  skills: string[];
  targetRole: string;
  experience: number;
  interests?: string[];
  numProjects?: number; // Default 3-5
}

export interface ProjectValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sanitizedProject?: ProjectIdea;
}

export interface SavedProject {
  id: string;
  userId: string;
  projectData: ProjectIdea;
  title: string;
  fitScore: number;
  recruiterSignals: string[];
  difficultyLevel: DifficultyLevel;
  estimatedHours: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
