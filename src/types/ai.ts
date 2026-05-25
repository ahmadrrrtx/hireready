// ============================================================
// AI PROVIDER TYPE DEFINITIONS
// Fallback chain configuration and request/response types
// ============================================================

export type AIProviderName = 
  | 'groq'
  | 'gemini'
  | 'cerebras'
  | 'mistral'
  | 'github'
  | 'openrouter'
  | 'openai';

export interface AIProviderConfig {
  name: AIProviderName;
  displayName: string;
  endpoint: string;
  modelId: string;
  apiKeyEnvVar: string;
  maxTokens: number;
  temperature: number;
  timeout: number; // milliseconds
  priority: number; // Lower = higher priority in fallback chain
  supportsJSON: boolean;
  rateLimitDelay?: number; // ms to wait before retry
}

export interface GenerationRequest {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'json' | 'text';
}

export interface GenerationResponse {
  content: string;
  provider: AIProviderName;
  tokensUsed?: number;
  latencyMs: number;
  cached: boolean;
}

export interface FallbackMetrics {
  attemptedProviders: AIProviderName[];
  successfulProvider: AIProviderName | null;
  totalAttempts: number;
  totalLatencyMs: number;
  errors: Array<{
    provider: AIProviderName;
    error: string;
    timestamp: number;
  }>;
}

export interface AIError {
  provider: AIProviderName;
  message: string;
  code?: string;
  statusCode?: number;
  retryable: boolean;
}

export interface ProviderHealthStatus {
  provider: AIProviderName;
  isHealthy: boolean;
  lastChecked: number;
  consecutiveFailures: number;
  averageLatencyMs: number;
}

// Cache entry structure
export interface CacheEntry {
  key: string;
  response: GenerationResponse;
  timestamp: number;
  expiresAt: number;
}

// Provider-specific response formats
export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    total_tokens: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
  usageMetadata?: {
    totalTokenCount: number;
  };
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    total_tokens: number;
  };
}
