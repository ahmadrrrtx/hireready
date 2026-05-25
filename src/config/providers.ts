// ============================================================
// AI PROVIDER CONFIGURATIONS
// 7-provider fallback chain with priority ordering
// ============================================================

import { AIProviderConfig } from '../types';

export const AI_PROVIDERS: Record<string, AIProviderConfig> = {
  groq: {
    name: 'groq',
    displayName: 'Groq (Llama 3.1 70B)',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    modelId: 'llama-3.1-70b-versatile',
    apiKeyEnvVar: 'VITE_GROQ_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 15000,
    priority: 1,
    supportsJSON: true,
    rateLimitDelay: 1000,
  },
  gemini: {
    name: 'gemini',
    displayName: 'Google Gemini 2.0 Flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent',
    modelId: 'gemini-2.0-flash-exp',
    apiKeyEnvVar: 'VITE_GEMINI_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 20000,
    priority: 2,
    supportsJSON: true,
    rateLimitDelay: 1000,
  },
  cerebras: {
    name: 'cerebras',
    displayName: 'Cerebras (Llama 3.3 70B)',
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    modelId: 'llama-3.3-70b',
    apiKeyEnvVar: 'VITE_CEREBRAS_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 15000,
    priority: 3,
    supportsJSON: true,
    rateLimitDelay: 1000,
  },
  mistral: {
    name: 'mistral',
    displayName: 'Mistral Large',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    modelId: 'mistral-large-latest',
    apiKeyEnvVar: 'VITE_MISTRAL_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 15000,
    priority: 4,
    supportsJSON: true,
    rateLimitDelay: 1000,
  },
  github: {
    name: 'github',
    displayName: 'GitHub Models (GPT-4o)',
    endpoint: 'https://models.inference.ai.azure.com/chat/completions',
    modelId: 'gpt-4o',
    apiKeyEnvVar: 'VITE_GITHUB_TOKEN',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 20000,
    priority: 5,
    supportsJSON: true,
    rateLimitDelay: 2000,
  },
  openrouter: {
    name: 'openrouter',
    displayName: 'OpenRouter (Claude 3.5 Sonnet)',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    modelId: 'anthropic/claude-3.5-sonnet',
    apiKeyEnvVar: 'VITE_OPENROUTER_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 25000,
    priority: 6,
    supportsJSON: true,
    rateLimitDelay: 2000,
  },
  openai: {
    name: 'openai',
    displayName: 'OpenAI GPT-4 Turbo',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    modelId: 'gpt-4-turbo-preview',
    apiKeyEnvVar: 'VITE_OPENAI_API_KEY',
    maxTokens: 8000,
    temperature: 0.7,
    timeout: 20000,
    priority: 7,
    supportsJSON: true,
    rateLimitDelay: 1000,
  },
};

export const PROVIDER_FALLBACK_ORDER: AIProviderConfig[] = Object.values(AI_PROVIDERS)
  .sort((a, b) => a.priority - b.priority);

export const DEFAULT_GENERATION_CONFIG = {
  maxRetries: 3,
  retryDelayMs: 2000,
  cacheEnabled: true,
  cacheTTLMs: 3600000, // 1 hour
  timeoutMs: 30000,
};

export const RATE_LIMIT_CONFIG = {
  maxRequestsPerMinute: 10,
  cooldownPeriodMs: 60000,
};
