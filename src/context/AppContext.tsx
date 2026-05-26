import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, SavedProject } from '../types';

interface AppState {
  aiProvider: 'gemini' | 'claude' | 'openai' | 'groq' | null;
  apiKey: string;
  skills: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  xp: number;
  streakDays: int;
  lastLoginDate: string | null;
  badges: string[];
}

interface AppContextType {
  state: AppState;
  setAIProvider: (provider: 'gemini' | 'claude' | 'openai' | 'groq') => void;
  setAPIKey: (key: string) => void;
  setSkills: (skills: string) => void;
  setExperienceLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  unlockBadge: (badgeId: string) => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('hireready_v2_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      aiProvider: 'groq',
      apiKey: '',
      skills: '',
      experienceLevel: null,
      xp: 0,
      streakDays: 0,
      lastLoginDate: null,
      badges: [],
    };
  });

  useEffect(() => {
    localStorage.setItem('hireready_v2_state', JSON.stringify(state));
  }, [state]);

  // Streak validation logic
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.lastLoginDate !== today) {
      let nextStreak = state.streakDays;
      if (state.lastLoginDate) {
        const lastDate = new Date(state.lastLoginDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          nextStreak += 1;
        } else if (diffDays > 1) {
          nextStreak = 1;
        }
      } else {
        nextStreak = 1;
      }
      setState(prev => ({
        ...prev,
        lastLoginDate: today,
        streakDays: nextStreak
      }));
    }
  }, [state.lastLoginDate, state.streakDays]);

  const setAIProvider = (provider: 'gemini' | 'claude' | 'openai' | 'groq') => {
    setState((prev) => ({ ...prev, aiProvider: provider }));
  };

  const setAPIKey = (key: string) => {
    setState((prev) => ({ ...prev, apiKey: key }));
  };

  const setSkills = (skills: string) => {
    setState((prev) => ({ ...prev, skills }));
  };

  const setExperienceLevel = (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    setState((prev) => ({ ...prev, experienceLevel: level }));
  };

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const nextXp = prev.xp + amount;
      return { ...prev, xp: nextXp };
    });
  }, []);

  const incrementStreak = useCallback(() => {
    setState(prev => ({ ...prev, streakDays: prev.streakDays + 1 }));
  }, []);

  const unlockBadge = useCallback((badgeId: string) => {
    setState(prev => {
      if (prev.badges.includes(badgeId)) return prev;
      return { ...prev, badges: [...prev.badges, badgeId] };
    });
  }, []);

  const resetState = () => {
    setState({
      aiProvider: 'groq',
      apiKey: '',
      skills: '',
      experienceLevel: null,
      xp: 0,
      streakDays: 0,
      lastLoginDate: null,
      badges: [],
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setAIProvider,
        setAPIKey,
        setSkills,
        setExperienceLevel,
        addXP,
        incrementStreak,
        unlockBadge,
        resetState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
