// ============================================================
// useProjects HOOK
// CRUD operations for portfolio projects
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { ProjectIdea, SavedProject, ProjectGenerationParams } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { generateProjects } from '../services/projects/generator';
import { useAuth } from './useAuth';

interface UseProjectsReturn {
  projects: SavedProject[];
  isLoading: boolean;
  isGenerating: boolean;
  error: string | null;
  generate: (params: ProjectGenerationParams) => Promise<ProjectIdea[]>;
  save: (project: ProjectIdea) => Promise<void>;
  update: (id: string, updates: Partial<SavedProject>) => Promise<void>;
  delete: (id: string) => Promise<void>;
  markComplete: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useProjects(): UseProjectsReturn {
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects from database
  const fetchProjects = useCallback(async () => {
    if (!user) {
      setProjects([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('saved_projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProjects(data || []);
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      console.error('Failed to fetch projects:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load projects on mount
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Generate new projects
  const generate = useCallback(async (params: ProjectGenerationParams): Promise<ProjectIdea[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const newProjects = await generateProjects(params);
      return newProjects;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate projects';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Save project to database
  const save = useCallback(async (project: ProjectIdea) => {
    if (!user) throw new Error('Must be logged in to save projects');

    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('saved_projects')
        .insert({
          user_id: user.id,
          project_data: project,
          title: project.title,
          fit_score: project.fitScore,
          recruiter_signals: project.recruiterSignals,
          difficulty_level: project.difficulty,
          estimated_hours: project.estimatedHours,
          is_completed: false,
        });

      if (insertError) throw insertError;

      await fetchProjects();
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user, fetchProjects]);

  // Update project
  const update = useCallback(async (id: string, updates: Partial<SavedProject>) => {
    if (!user) throw new Error('Must be logged in');

    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('saved_projects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      await fetchProjects();
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user, fetchProjects]);

  // Delete project
  const deleteProject = useCallback(async (id: string) => {
    if (!user) throw new Error('Must be logged in');

    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('saved_projects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      await fetchProjects();
    } catch (err: any) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [user, fetchProjects]);

  // Mark project as complete
  const markComplete = useCallback(async (id: string) => {
    await update(id, {
      is_completed: true,
      completed_at: new Date().toISOString(),
    });
  }, [update]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    projects,
    isLoading,
    isGenerating,
    error,
    generate,
    save,
    update,
    delete: deleteProject,
    markComplete,
    refresh: fetchProjects,
    clearError,
  };
}
