// ============================================================
// COURSE TYPE DEFINITIONS
// Free learning resource schemas
// ============================================================

export type FreeCoursePlatform = 
  | 'YouTube'
  | 'freeCodeCamp'
  | 'Coursera (Audit)'
  | 'edX (Audit)'
  | 'MIT OpenCourseWare'
  | 'Harvard CS50'
  | 'The Odin Project'
  | 'Full Stack Open'
  | 'Google Developers'
  | 'Microsoft Learn'
  | 'AWS Training'
  | 'Scrimba'
  | 'Codecademy (Free)'
  | 'Khan Academy';

export interface CourseRef {
  id: string;
  title: string;
  platform: FreeCoursePlatform;
  url: string;
  instructor?: string;
  duration: string; // e.g., "8 hours", "4 weeks"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skills: string[]; // Skills covered
  description: string;
  rating?: number;
  isFree: boolean;
  language: string;
  lastUpdated?: string;
}

export interface CourseMatchRequest {
  skills: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  maxResults?: number;
  preferredPlatforms?: FreeCoursePlatform[];
}

export interface CourseMatchResult {
  course: CourseRef;
  matchScore: number; // 0-100
  matchedSkills: string[];
}
