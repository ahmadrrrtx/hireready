// ============================================================
// ROADMAP TYPE DEFINITIONS
// Career progression mindmap schemas
// ============================================================

import { Node, Edge } from 'reactflow';

export type CareerPhase = 
  | 'Foundation'
  | 'Skill Building'
  | 'Project Development'
  | 'Specialization'
  | 'Job Ready'
  | 'Continuous Growth';

export type NodeType = 'phase' | 'skill' | 'project' | 'certification' | 'milestone';

export interface RoadmapNode {
  id: string;
  type: NodeType;
  phase: CareerPhase;
  title: string;
  description: string;
  skills: string[];
  estimatedDays: number;
  courseResources?: CourseReference[];
  prerequisites?: string[]; // IDs of prerequisite nodes
  isCompleted?: boolean;
  completedAt?: string;
  position?: { x: number; y: number };
}

export interface CourseReference {
  title: string;
  platform: string;
  url: string;
  duration: string;
  isFree: boolean;
  difficulty: string;
}

export interface RoadmapLink {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
  type?: 'prerequisite' | 'optional' | 'parallel';
}

export interface CareerRoadmap {
  id?: string;
  userId?: string;
  title: string;
  targetRole: string;
  nodes: RoadmapNode[];
  links: RoadmapLink[];
  totalMilestones: number;
  completedMilestones: number;
  progressPercentage: number;
  estimatedTotalDays: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoadmapGenerationParams {
  currentSkills: string[];
  targetRole: string;
  experienceLevel: number;
  timeCommitmentHoursPerWeek?: number;
  preferredLearningStyle?: 'hands-on' | 'theoretical' | 'balanced';
}

// React Flow specific types
export interface CustomNodeData extends RoadmapNode {
  onComplete?: (nodeId: string) => void;
  onExpand?: (nodeId: string) => void;
}

export type RoadmapFlowNode = Node<CustomNodeData>;
export type RoadmapFlowEdge = Edge;

export interface RoadmapViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface MilestoneRecord {
  id: string;
  roadmapId: string;
  userId: string;
  title: string;
  description: string;
  phase: CareerPhase;
  skillFocus: string[];
  estimatedDays: number;
  courseResources: CourseReference[];
  isCompleted: boolean;
  completedAt?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
