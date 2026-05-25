// ============================================================
// useRoadmap HOOK
// Roadmap generation and milestone tracking
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { CareerRoadmap, RoadmapGenerationParams, MilestoneRecord } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { generateRoadmap, calculateRoadmapProgress } from '../services/roadmaps/generator';
import { useAuth } from './useAuth';

interface UseRoadmapReturn {
  activeRoadmap: CareerRoadmap | null;
  milestones: MilestoneRecord[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  generate: (params: RoadmapGenerationParams) => Promise<CareerRoadmap>;
  save: (roadmap: CareerRoadmap) => Promise<void>;
  completeMilestone: (milestoneId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useRoadmap(): UseRoadmapReturn {
  const { user, profile } = useAuth();
  const [activeRoadmap, setActiveRoadmap] = useState<CareerRoadmap | null>(null);
  const [milestones, setMilestones] = useState<MilestoneRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active roadmap
  const fetchActiveRoadmap = useCallback(async () => {
    if (!user) {
      setActiveRoadmap(null);
      setMilestones([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get active roadmap
      const { data: roadmapData, error: roadmapError } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (roadmapError && roadmapError.code !== 'PGRST116') { // PGRST116 = no rows
        throw roadmapError;
      }

      if (roadmapData) {
        setActiveRoadmap(roadmapData.roadmap_data as CareerRoadmap);

        // Fetch milestones
        const { data: milestonesData, error: milestonesError } = await supabase
          .from('milestones')
          .select('*')
          .eq('roadmap_id', roadmapData.id)
          .order('sort_order', { ascending: true });

        if (milestonesError) throw milestonesError;
        setMilestones(milestonesData || []);
      }
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      console.error('Failed to fetch roadmap:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load roadmap on mount
  useEffect(() => {
    fetchActiveRoadmap();
  }, [fetchActiveRoadmap]);

  // Generate new roadmap
  const generate = useCallback(async (params: RoadmapGenerationParams): Promise<CareerRoadmap> => {
    setIsGenerating(true);
    setError(null);

    try {
      const newRoadmap = await generateRoadmap(params);
      return newRoadmap;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate roadmap';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Save roadmap to database
  const save = useCallback(async (roadmap: CareerRoadmap) => {
    if (!user) throw new Error('Must be logged in to save roadmap');

    setError(null);

    try {
      // Deactivate existing roadmaps
      await supabase
        .from('roadmaps')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Insert new roadmap
      const { data: roadmapRecord, error: roadmapError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: user.id,
          title: roadmap.title,
          target_role: roadmap.targetRole,
          roadmap_data: roadmap,
          total_milestones: roadmap.totalMilestones,
          completed_milestones: 0,
          progress_percentage: 0,
          is_active: true,
        })
        .select()
        .single();

      if (roadmapError) throw roadmapError;

      // Insert milestones
      const milestoneInserts = roadmap.nodes.map((node, index) => ({
        roadmap_id: roadmapRecord.id,
        user_id: user.id,
        title: node.title,
        description: node.description,
        phase: node.phase,
        skill_focus: node.skills,
        estimated_days: node.estimatedDays,
        course_resources: node.courseResources || [],
        is_completed: false,
        sort_order: index,
      }));

      const { error: milestonesError } = await supabase
        .from('milestones')
        .insert(milestoneInserts);

      if (milestonesError) throw milestonesError;

      await fetchActiveRoadmap();
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user, fetchActiveRoadmap]);

  // Complete milestone
  const completeMilestone = useCallback(async (milestoneId: string) => {
    if (!user) throw new Error('Must be logged in');

    setError(null);

    try {
      // Mark milestone as complete
      const { error: updateError } = await supabase
        .from('milestones')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', milestoneId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      // Recalculate roadmap progress
      if (activeRoadmap) {
        const { data, error } = await supabase.rpc('calculate_roadmap_progress', {
          roadmap_uuid: activeRoadmap.id,
        });

        if (error) console.error('Failed to calculate progress:', error);
      }

      await fetchActiveRoadmap();
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user, activeRoadmap, fetchActiveRoadmap]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    activeRoadmap,
    milestones,
    isLoading,
    isGenerating,
    error,
    generate,
    save,
    completeMilestone,
    refresh: fetchActiveRoadmap,
    clearError,
  };
}
