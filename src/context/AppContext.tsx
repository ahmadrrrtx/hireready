// ============================================================
// HIREREADY 2.0 - GLOBAL APPLICATION STATE
// Master context with localStorage persistence
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ProjectIdea, CareerRoadmap, UserProfile } from '../types';

interface QuizProgress {
  quizTopic: string;
  startedAt: string;
  timeRemainingSeconds: number;
  answers: Record<string, number>;
}

interface AppState {
  userProfile: UserProfile | null;
  savedProjects: ProjectIdea[];
  activeRoadmap: CareerRoadmap | null;
  quizProgress: QuizProgress | null;
  verificationKey: string | null;
}

interface AppContextType extends AppState {
  setUserProfile: (profile: UserProfile | null) => void;
  addProject: (project: ProjectIdea) => void;
  removeProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<ProjectIdea>) => void;
  setActiveRoadmap: (roadmap: CareerRoadmap | null) => void;
  setQuizProgress: (progress: QuizProgress | null) => void;
  setVerificationKey: (key: string | null) => void;
  clearAllData: () => void;
}

const STORAGE_KEY = 'hireready_app_state';

const defaultState: AppState = {
  userProfile: null,
  savedProjects: [],
  activeRoadmap: null,
  quizProgress: null,
  verificationKey: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState(parsed);
      }
    } catch (error) {
      console.error('Failed to load app state from localStorage:', error);
    }
  }, []);

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save app state to localStorage:', error);
    }
  }, [state]);

  const setUserProfile = useCallback((profile: UserProfile | null) => {
    setState(prev => ({ ...prev, userProfile: profile }));
  }, []);

  const addProject = useCallback((project: ProjectIdea) => {
    setState(prev => ({
      ...prev,
      savedProjects: [...prev.savedProjects, { ...project, id: crypto.randomUUID() }],
    }));
  }, []);

  const removeProject = useCallback((projectId: string) => {
    setState(prev => ({
      ...prev,
      savedProjects: prev.savedProjects.filter(p => p.id !== projectId),
    }));
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<ProjectIdea>) => {
    setState(prev => ({
      ...prev,
      savedProjects: prev.savedProjects.map(p =>
        p.id === projectId ? { ...p, ...updates } : p
      ),
    }));
  }, []);

  const setActiveRoadmap = useCallback((roadmap: CareerRoadmap | null) => {
    setState(prev => ({ ...prev, activeRoadmap: roadmap }));
  }, []);

  const setQuizProgress = useCallback((progress: QuizProgress | null) => {
    setState(prev => ({ ...prev, quizProgress: progress }));
  }, []);

  const setVerificationKey = useCallback((key: string | null) => {
    setState(prev => ({ ...prev, verificationKey: key }));
  }, []);

  const clearAllData = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value: AppContextType = {
    ...state,
    setUserProfile,
    addProject,
    removeProject,
    updateProject,
    setActiveRoadmap,
    setQuizProgress,
    setVerificationKey,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
