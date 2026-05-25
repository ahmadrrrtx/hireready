// ============================================================
// CENTRAL TYPE EXPORT HUB
// Single import source for all application types
// ============================================================

export * from './ai';
export * from './project';
export * from './roadmap';
export * from './course';

// Authentication types
export interface UserProfile {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  primarySkills: string[];
  targetRole: string;
  yearsExperience: number;
  activeRoadmapId?: string;
  streakDays: number;
  lastActivityDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Certificate types
export interface Certificate {
  id: string;
  verificationHash: string;
  userId: string;
  userName: string;
  topic: string;
  score: number;
  roadmapTitle?: string;
  totalHoursInvested?: number;
  issuedAt: string;
  createdAt: string;
}

export interface CertificateVerificationResult {
  isValid: boolean;
  certificate?: Certificate;
  error?: string;
}

// Quiz types
export interface QuizAttempt {
  id: string;
  userId: string;
  roadmapId?: string;
  quizTopic: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTakenSeconds: number;
  answersData?: any;
  passed: boolean;
  attemptedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

// Global app state
export interface AppState {
  auth: AuthState;
  projects: SavedProject[];
  activeRoadmap: CareerRoadmap | null;
  isGenerating: boolean;
  error: string | null;
}
