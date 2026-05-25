// ============================================================
// PROJECT VALIDATOR & SANITIZER
// Schema validation and self-healing for AI-generated projects
// ============================================================

import { ProjectIdea, ProjectValidationResult, RecruiterSignal, DifficultyLevel } from '../../types';
import { RECRUITER_SIGNALS, DIFFICULTY_LEVELS } from '../../config/constants';

const VALID_SIGNALS = RECRUITER_SIGNALS as readonly string[];
const VALID_DIFFICULTIES = DIFFICULTY_LEVELS as readonly string[];

export function validateProject(project: Partial<ProjectIdea>): ProjectValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields validation
  if (!project.title || typeof project.title !== 'string' || project.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (!project.description || typeof project.description !== 'string') {
    errors.push('Description is required');
  }

  if (!project.tagline || typeof project.tagline !== 'string') {
    warnings.push('Tagline is missing');
  }

  // Fit score validation
  if (typeof project.fitScore !== 'number') {
    errors.push('fitScore must be a number');
  } else if (project.fitScore < 0 || project.fitScore > 100) {
    errors.push('fitScore must be between 0 and 100');
  }

  // Recruiter signals validation
  if (!Array.isArray(project.recruiterSignals)) {
    errors.push('recruiterSignals must be an array');
  } else {
    const invalidSignals = project.recruiterSignals.filter(
      s => !VALID_SIGNALS.includes(s)
    );
    if (invalidSignals.length > 0) {
      warnings.push(`Invalid recruiter signals: ${invalidSignals.join(', ')}`);
    }
    if (project.recruiterSignals.length === 0) {
      warnings.push('No recruiter signals provided');
    }
    if (project.recruiterSignals.length > 3) {
      warnings.push('Too many recruiter signals (max 3 recommended)');
    }
  }

  // Difficulty validation
  if (!project.difficulty || !VALID_DIFFICULTIES.includes(project.difficulty)) {
    errors.push(`Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
  }

  // Estimated hours validation
  if (typeof project.estimatedHours !== 'number' || project.estimatedHours <= 0) {
    errors.push('estimatedHours must be a positive number');
  } else if (project.estimatedHours > 500) {
    warnings.push('estimatedHours seems unreasonably high (>500 hours)');
  }

  // Tech stack validation
  if (!project.techStack || typeof project.techStack !== 'object') {
    errors.push('techStack is required and must be an object');
  } else {
    const totalTech = [
      ...(project.techStack.frontend || []),
      ...(project.techStack.backend || []),
      ...(project.techStack.database || []),
      ...(project.techStack.deployment || []),
      ...(project.techStack.tools || []),
    ];
    if (totalTech.length === 0) {
      errors.push('techStack must include at least one technology');
    }
  }

  // Steps validation
  if (!Array.isArray(project.steps)) {
    errors.push('steps must be an array');
  } else if (project.steps.length === 0) {
    errors.push('At least one implementation step is required');
  } else {
    project.steps.forEach((step, index) => {
      if (!step.title) {
        errors.push(`Step ${index + 1} is missing a title`);
      }
      if (!step.description) {
        errors.push(`Step ${index + 1} is missing a description`);
      }
      if (typeof step.stepNumber !== 'number') {
        warnings.push(`Step ${index + 1} has invalid stepNumber`);
      }
    });
  }

  // Context fields validation
  const contextFields = [
    'realWorldContext',
    'marketRelevance',
    'whyRecruitersCare',
    'portfolioImpact'
  ] as const;

  contextFields.forEach(field => {
    if (!project[field] || typeof project[field] !== 'string') {
      warnings.push(`${field} is missing or invalid`);
    }
  });

  // If we have errors, return invalid
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // Sanitize and fix the project
  const sanitized = sanitizeProject(project);

  return {
    isValid: true,
    errors: [],
    warnings,
    sanitizedProject: sanitized,
  };
}

/**
 * Sanitize and fix common issues in project data
 */
function sanitizeProject(project: Partial<ProjectIdea>): ProjectIdea {
  // Ensure valid recruiter signals
  const validSignals = (project.recruiterSignals || [])
    .filter(s => VALID_SIGNALS.includes(s))
    .slice(0, 3) as RecruiterSignal[];

  // Default to 'Production Thinking' if no valid signals
  if (validSignals.length === 0) {
    validSignals.push('Production Thinking');
  }

  // Ensure valid difficulty
  let difficulty = project.difficulty as DifficultyLevel;
  if (!VALID_DIFFICULTIES.includes(difficulty)) {
    difficulty = 'Intermediate';
  }

  // Fix step numbers
  const steps = (project.steps || []).map((step, index) => ({
    ...step,
    stepNumber: step.stepNumber || index + 1,
    estimatedHours: step.estimatedHours || Math.ceil((project.estimatedHours || 40) / (project.steps?.length || 5)),
    keyLearnings: step.keyLearnings || [],
  }));

  // Ensure tech stack structure
  const techStack = {
    frontend: project.techStack?.frontend || [],
    backend: project.techStack?.backend || [],
    database: project.techStack?.database || [],
    deployment: project.techStack?.deployment || [],
    tools: project.techStack?.tools || [],
  };

  // Default empty context fields
  const defaultContext = 'To be determined';

  return {
    title: (project.title || 'Untitled Project').trim(),
    tagline: (project.tagline || 'A portfolio project').trim(),
    description: (project.description || '').trim(),
    fitScore: Math.min(100, Math.max(0, project.fitScore || 50)),
    recruiterSignals: validSignals,
    difficulty,
    estimatedHours: Math.max(1, project.estimatedHours || 40),
    techStack,
    steps,
    realWorldContext: project.realWorldContext || defaultContext,
    marketRelevance: project.marketRelevance || defaultContext,
    whyRecruitersCare: project.whyRecruitersCare || defaultContext,
    portfolioImpact: project.portfolioImpact || defaultContext,
    isCompleted: false,
  };
}

/**
 * Validate multiple projects at once
 */
export function validateProjects(projects: Partial<ProjectIdea>[]): {
  valid: ProjectIdea[];
  invalid: Array<{ project: Partial<ProjectIdea>; errors: string[] }>;
} {
  const valid: ProjectIdea[] = [];
  const invalid: Array<{ project: Partial<ProjectIdea>; errors: string[] }> = [];

  projects.forEach(project => {
    const result = validateProject(project);
    if (result.isValid && result.sanitizedProject) {
      valid.push(result.sanitizedProject);
    } else {
      invalid.push({ project, errors: result.errors });
    }
  });

  return { valid, invalid };
}
