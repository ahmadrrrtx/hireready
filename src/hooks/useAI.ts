// ============================================================
// useAI HOOK
// Reactive wrapper for AI fallback chain with loading states
// ============================================================

import { useState, useCallback } from 'react';
import { GenerationRequest, GenerationResponse } from '../types';
import { aiFallbackChain } from '../services/ai/fallback-chain';

interface UseAIReturn {
  generate: (request: GenerationRequest) => Promise<GenerationResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  lastResponse: GenerationResponse | null;
}

export function useAI(): UseAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<GenerationResponse | null>(null);

  const generate = useCallback(async (request: GenerationRequest): Promise<GenerationResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiFallbackChain.generate(request);
      setLastResponse(response);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate AI response';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    generate,
    isLoading,
    error,
    clearError,
    lastResponse,
  };
}
