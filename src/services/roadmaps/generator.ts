// ============================================================
// ROADMAP GENERATOR SERVICE
// AI-powered career progression roadmap creator
// ============================================================

import { CareerRoadmap, RoadmapGenerationParams, RoadmapNode, RoadmapLink } from '../../types';
import { aiFallbackChain } from '../ai/fallback-chain';
import { ROADMAP_AGENT_SYSTEM_PROMPT } from '../../config/prompts';
import { matchCourses } from './matcher';

export async function generateRoadmap(
  params: RoadmapGenerationParams
): Promise<CareerRoadmap> {
  const {
    currentSkills,
    targetRole,
    experienceLevel,
    timeCommitmentHoursPerWeek = 10,
    preferredLearningStyle = 'balanced',
  } = params;

  // Build user prompt
  const userPrompt = buildRoadmapPrompt(
    currentSkills,
    targetRole,
    experienceLevel,
    timeCommitmentHoursPerWeek,
    preferredLearningStyle
  );

  // Generate roadmap structure from AI
  const response = await aiFallbackChain.generate({
    systemPrompt: ROADMAP_AGENT_SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 8000,
    responseFormat: 'json',
  });

  // Parse roadmap
  const rawRoadmap = parseRoadmapFromResponse(response.content);

  // Enrich nodes with matched courses
  const enrichedNodes = await enrichNodesWithCourses(rawRoadmap.nodes);

  // Calculate totals
  const totalMilestones = enrichedNodes.length;
  const estimatedTotalDays = enrichedNodes.reduce((sum, node) => sum + (node.estimatedDays || 0), 0);

  const roadmap: CareerRoadmap = {
    title: rawRoadmap.title || `${targetRole} Career Path`,
    targetRole,
    nodes: enrichedNodes,
    links: rawRoadmap.links || generateDefaultLinks(enrichedNodes),
    totalMilestones,
    completedMilestones: 0,
    progressPercentage: 0,
    estimatedTotalDays,
    isActive: true,
  };

  return roadmap;
}

/**
 * Build detailed roadmap generation prompt
 */
function buildRoadmapPrompt(
  currentSkills: string[],
  targetRole: string,
  experienceLevel: number,
  hoursPerWeek: number,
  learningStyle: string
): string {
  const experienceLabel =
    experienceLevel === 0 ? 'complete beginner' :
    experienceLevel <= 2 ? 'junior level' :
    experienceLevel <= 4 ? 'mid-level' :
    'senior level';

  return `Create a comprehensive career roadmap for someone targeting: ${targetRole}

CURRENT PROFILE:
- Experience Level: ${experienceLabel} (${experienceLevel} years)
- Current Skills: ${currentSkills.join(', ')}
- Time Commitment: ${hoursPerWeek} hours per week
- Learning Style: ${learningStyle}

ROADMAP REQUIREMENTS:
- Generate 15-25 progressive learning nodes
- Organize into logical phases (Foundation → Job Ready)
- Each node should include specific skills to learn
- Estimate realistic time (in days) for each node
- Include prerequisite relationships between nodes
- Suggest free learning resources (YouTube, freeCodeCamp, etc.)
- End with interview prep and job search strategies

IMPORTANT:
- Nodes should build on each other progressively
- Include hands-on projects at each major phase
- Balance theory with practical application
- Consider their current skill level (don't repeat what they know)
- Make it achievable within 3-12 months

Return ONLY the JSON roadmap object. No markdown formatting.`;
}

/**
 * Parse roadmap from AI response
 */
function parseRoadmapFromResponse(content: string): any {
  try {
    let cleaned = content.trim();
    cleaned = cleaned.replace(/```json\n?/g, '');
    cleaned = cleaned.replace(/```\n?/g, '');
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    // Handle nested roadmap object
    if (parsed.roadmap) {
      return parsed.roadmap;
    }

    return parsed;

  } catch (error: any) {
    console.error('Failed to parse roadmap:', error);
    console.error('Raw content:', content);
    throw new Error(`Failed to parse roadmap response: ${error.message}`);
  }
}

/**
 * Enrich nodes with matched free courses
 */
async function enrichNodesWithCourses(nodes: RoadmapNode[]): Promise<RoadmapNode[]> {
  const enriched: RoadmapNode[] = [];

  for (const node of nodes) {
    try {
      // Match courses for this node's skills
      const matches = await matchCourses({
        skills: node.skills,
        maxResults: 3,
      });

      enriched.push({
        ...node,
        courseResources: matches.map(m => m.course),
      });
    } catch (error) {
      console.warn(`Failed to match courses for node ${node.title}:`, error);
      enriched.push(node);
    }
  }

  return enriched;
}

/**
 * Generate default prerequisite links based on node order
 */
function generateDefaultLinks(nodes: RoadmapNode[]): RoadmapLink[] {
  const links: RoadmapLink[] = [];

  for (let i = 1; i < nodes.length; i++) {
    links.push({
      id: `link-${i}`,
      source: nodes[i - 1].id,
      target: nodes[i].id,
      type: 'prerequisite',
    });
  }

  return links;
}

/**
 * Update roadmap progress based on completed milestones
 */
export function calculateRoadmapProgress(roadmap: CareerRoadmap): number {
  if (roadmap.totalMilestones === 0) return 0;
  
  const completedCount = roadmap.nodes.filter(n => n.isCompleted).length;
  return Math.round((completedCount / roadmap.totalMilestones) * 100);
}
