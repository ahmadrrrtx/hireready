import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  aiProvider: 'gemini' | 'claude' | 'openai' | 'groq' | null;
  apiKey: string;
  skills: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
}

interface AppContextType {
  state: AppState;
  setAIProvider: (provider: 'gemini' | 'claude' | 'openai' | 'groq') => void;
  setAPIKey: (key: string) => void;
  setSkills: (skills: string) => void;
  setExperienceLevel: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  resetState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    aiProvider: null,
    apiKey: '',
    skills: '',
    experienceLevel: null,
  });

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

  const resetState = () => {
    setState({
      aiProvider: null,
      apiKey: '',
      skills: '',
      experienceLevel: null,
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
