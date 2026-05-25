// ============================================================
// PROJECT GENERATOR SERVICE
// LLM-powered portfolio project idea generator
// ============================================================

import { ProjectIdea, ProjectGenerationParams } from '../../types';
import { aiFallbackChain } from '../ai/fallback-chain';
import { RECRUITER_AGENT_SYSTEM_PROMPT } from '../../config/prompts';
import { validateProject } from './validator';

export async function generateProjects(
  params: ProjectGenerationParams
): Promise<ProjectIdea[]> {
  const { skills, targetRole, experience, interests, numProjects = 3 } = params;

  // Build user prompt
  const userPrompt = buildUserPrompt(skills, targetRole, experience, interests, numProjects);

  // Call AI with fallback chain
  const response = await aiFallbackChain.generate({
    systemPrompt: RECRUITER_AGENT_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.8, // Higher creativity for diverse projects
    maxTokens: 8000,
    responseFormat: 'json',
  });

  // Parse and validate response
  const projects = parseProjectsFromResponse(response.content);
  
  // Validate and sanitize each project
  const validatedProjects: ProjectIdea[] = [];
  
  for (const project of projects) {
    const validation = validateProject(project);
    if (validation.isValid && validation.sanitizedProject) {
      validatedProjects.push(validation.sanitizedProject);
    } else {
      console.warn(`Invalid project skipped: ${validation.errors.join(', ')}`);
    }
  }

  if (validatedProjects.length === 0) {
    throw new Error('No valid projects were generated. Please try again.');
  }

  return validatedProjects;
}

/**
 * Build detailed user prompt
 */
function buildUserPrompt(
  skills: string[],
  targetRole: string,
  experience: number,
  interests: string[] = [],
  numProjects: number
): string {
  const experienceLevel = 
    experience === 0 ? 'complete beginner' :
    experience <= 2 ? 'junior developer' :
    experience <= 4 ? 'mid-level developer' :
    'senior developer';

  return `Generate ${numProjects} portfolio project ideas for a ${experienceLevel} targeting the role: ${targetRole}.

CURRENT SKILLS:
${skills.map(s => `- ${s}`).join('\n')}

${interests.length > 0 ? `INTERESTS:\n${interests.map(i => `- ${i}`).join('\n')}` : ''}

REQUIREMENTS:
- Projects must be buildable with their current skills (+ reasonable learning curve)
- Difficulty should match their experience level
- Each project should demonstrate 2-3 different recruiter signals
- Include modern, in-demand technologies
- Focus on real-world problems that companies care about
- Provide specific, actionable implementation steps

Return ONLY the JSON object with the projects array. No markdown formatting.`;
}

/**
 * Parse projects from AI response
 */
function parseProjectsFromResponse(content: string): Partial<ProjectIdea>[] {
  try {
    // Remove markdown code blocks if present
    let cleaned = content.trim();
    cleaned = cleaned.replace(/```json\n?/g, '');
    cleaned = cleaned.replace(/```\n?/g, '');
    cleaned = cleaned.trim();

    // Parse JSON
    const parsed = JSON.parse(cleaned);

    // Handle different response structures
    if (Array.isArray(parsed)) {
      return parsed;
    }
    
    if (parsed.projects && Array.isArray(parsed.projects)) {
      return parsed.projects;
    }

    if (typeof parsed === 'object' && !Array.isArray(parsed)) {
      // Single project object
      return [parsed];
    }

    throw new Error('Unexpected response structure');

  } catch (error: any) {
    console.error('Failed to parse projects:', error);
    console.error('Raw content:', content);
    throw new Error(`Failed to parse AI response: ${error.message}`);
  }
}

/**
 * Refine a single project based on user feedback
 */
export async function refineProject(
  project: ProjectIdea,
  feedback: string
): Promise<ProjectIdea> {
  const userPrompt = `Original Project:
${JSON.stringify(project, null, 2)}

User Feedback:
${feedback}

Provide an updated version of this project that addresses the feedback while maintaining quality and recruiter appeal.

Return ONLY the updated project JSON object.`;

  const response = await aiFallbackChain.generate({
    systemPrompt: RECRUITER_AGENT_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 6000,
    responseFormat: 'json',
  });

  const projects = parseProjectsFromResponse(response.content);
  if (projects.length === 0) {
    throw new Error('Failed to refine project');
  }

  const validation = validateProject(projects[0]);
  if (!validation.isValid || !validation.sanitizedProject) {
    throw new Error(`Invalid refined project: ${validation.errors.join(', ')}`);
  }

  return validation.sanitizedProject;
}
