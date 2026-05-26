// ============================================================
// APPLICATION CONSTANTS
// Career paths, difficulty levels, and global configuration
// ============================================================

export const CAREER_PATHS = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Mobile Developer (iOS/Android)',
  'DevOps Engineer',
  'Cloud Architect',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI/ML Engineer',
  'Data Engineer',
  'Data Analyst',
  'Business Intelligence Analyst',
  'Product Manager (Technical)',
  'UX/UI Designer',
  'Game Developer',
  'Blockchain Developer',
  'Cybersecurity Engineer',
  'QA/Test Automation Engineer',
  'Site Reliability Engineer (SRE)',
  'Systems Architect',
  'Database Administrator',
  'Technical Writer',
  'Solutions Architect',
  'Platform Engineer',
  'Embedded Systems Engineer',
  'Computer Vision Engineer',
  'NLP Engineer',
  'Robotics Engineer',
  'AR/VR Developer',
  'Web3 Developer',
  'Growth Engineer',
  'Developer Advocate',
] as const;

export type CareerPath = typeof CAREER_PATHS[number];

export const EXPERIENCE_LEVELS = [
  { value: 0, label: 'Complete Beginner (0-1 year)' },
  { value: 1, label: 'Junior (1-2 years)' },
  { value: 2, label: 'Mid-Level (2-4 years)' },
  { value: 4, label: 'Senior (4-7 years)' },
  { value: 7, label: 'Expert (7+ years)' },
] as const;

export const POPULAR_SKILLS = [
  // Frontend
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
  'Next.js', 'Svelte', 'Tailwind CSS', 'Material UI', 'Redux', 'Zustand',
  
  // Backend
  'Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby',
  'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET',
  
  // Database
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Cassandra',
  'DynamoDB', 'Supabase', 'Firebase', 'Prisma', 'TypeORM',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform',
  'GitHub Actions', 'Jenkins', 'CircleCI', 'Nginx', 'Linux',
  
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'SwiftUI', 'Jetpack Compose',
  
  // Data & AI
  'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'Jupyter',
  'Langchain', 'OpenAI API', 'Hugging Face', 'LLMs', 'RAG',
  
  // Tools
  'Git', 'VS Code', 'Figma', 'Postman', 'Jira', 'Notion',
] as const;

export const RECRUITER_SIGNALS = [
  'Production Thinking',
  'System Design',
  'User Empathy',
  'Technical Depth',
  'Innovation',
  'Scalability',
] as const;

export const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const LEARNING_STYLES = [
  { value: 'hands-on', label: 'Hands-On (Learn by Building)' },
  { value: 'theoretical', label: 'Theoretical (Understand Concepts First)' },
  { value: 'balanced', label: 'Balanced (Mix of Both)' },
] as const;

export const TIME_COMMITMENTS = [
  { value: 5, label: '5 hours/week (Casual)' },
  { value: 10, label: '10 hours/week (Part-Time)' },
  { value: 20, label: '20 hours/week (Serious)' },
  { value: 40, label: '40+ hours/week (Full-Time)' },
] as const;

export const FREE_COURSE_PLATFORMS = [
  'YouTube',
  'freeCodeCamp',
  'The Odin Project',
  'Full Stack Open',
  'MIT OpenCourseWare',
  'Harvard CS50',
  'Coursera (Audit)',
  'edX (Audit)',
  'Google Developers',
  'Microsoft Learn',
  'AWS Training',
  'Scrimba',
  'Codecademy (Free)',
  'Khan Academy',
  'MDN Web Docs',
] as const;

export const APP_CONFIG = {
  name: 'HireReady 2.0',
  tagline: 'The Ultimate AI-Powered Career OS',
  version: '2.0.0',
  minPasswordLength: 8,
  maxProjectsPerGeneration: 5,
  defaultProjectCount: 3,
  quizDurationMinutes: 45,
  passingScore: 70,
  streakResetHours: 48,
  cacheExpirationHours: 24,
} as const;

export const ROUTES = {
  landing: '/',
  dashboard: '/dashboard',
  generator: '/generator',
  roadmap: '/roadmap',
  courses: '/courses',
  certify: '/certify',
  verify: '/verify',
  profile: '/profile',
  login: '/login',
  signup: '/signup',
} as const;
