// ============================================================
// AI FALLBACK CHAIN SERVICE
// 7-provider sequential retry orchestrator with health monitoring
// ============================================================

import {
  AIProviderConfig,
  GenerationRequest,
  GenerationResponse,
  FallbackMetrics,
  AIError,
  CacheEntry,
  OpenAIResponse,
  GeminiResponse,
} from '../../types';
import { PROVIDER_FALLBACK_ORDER, DEFAULT_GENERATION_CONFIG } from '../../config/providers';

class AIFallbackChain {
  private cache: Map<string, CacheEntry> = new Map();
  private healthStatus: Map<string, number> = new Map(); // Provider -> consecutive failures
  private lastRequestTime: Map<string, number> = new Map();

  /**
   * Generate content with automatic fallback across all providers
   */
  async generate(request: GenerationRequest): Promise<GenerationResponse> {
    const metrics: FallbackMetrics = {
      attemptedProviders: [],
      successfulProvider: null,
      totalAttempts: 0,
      totalLatencyMs: 0,
      errors: [],
    };

    // Check cache first
    if (DEFAULT_GENERATION_CONFIG.cacheEnabled) {
      const cached = this.getCachedResponse(request);
      if (cached) {
        return cached;
      }
    }

    // Try each provider in priority order
    for (const provider of PROVIDER_FALLBACK_ORDER) {
      metrics.totalAttempts++;
      metrics.attemptedProviders.push(provider.name);

      try {
        // Rate limiting check
        await this.enforceRateLimit(provider);

        const startTime = Date.now();
        const response = await this.callProvider(provider, request);
        const latencyMs = Date.now() - startTime;

        metrics.totalLatencyMs += latencyMs;
        metrics.successfulProvider = provider.name;

        // Reset health status on success
        this.healthStatus.set(provider.name, 0);

        const generationResponse: GenerationResponse = {
          content: response,
          provider: provider.name,
          latencyMs,
          cached: false,
        };

        // Cache successful response
        if (DEFAULT_GENERATION_CONFIG.cacheEnabled) {
          this.cacheResponse(request, generationResponse);
        }

        console.log(`✅ Success with ${provider.displayName} (${latencyMs}ms)`);
        return generationResponse;

      } catch (error: any) {
        const aiError: AIError = {
          provider: provider.name,
          message: error.message || 'Unknown error',
          statusCode: error.statusCode,
          retryable: this.isRetryable(error),
        };

        metrics.errors.push({
          provider: provider.name,
          error: aiError.message,
          timestamp: Date.now(),
        });

        // Increment failure count
        const failures = (this.healthStatus.get(provider.name) || 0) + 1;
        this.healthStatus.set(provider.name, failures);

        console.warn(`❌ Failed with ${provider.displayName}: ${aiError.message}`);

        // If not retryable or last provider, throw
        if (!aiError.retryable && metrics.totalAttempts >= PROVIDER_FALLBACK_ORDER.length) {
          throw new Error(`All providers failed. Last error: ${aiError.message}`);
        }

        // Add delay before next retry
        if (provider.rateLimitDelay && metrics.totalAttempts < PROVIDER_FALLBACK_ORDER.length) {
          await this.sleep(provider.rateLimitDelay);
        }

        // Continue to next provider
        continue;
      }
    }

    // All providers exhausted
    throw new Error(
      `All ${PROVIDER_FALLBACK_ORDER.length} providers failed. ` +
      `Errors: ${metrics.errors.map(e => `${e.provider}: ${e.error}`).join('; ')}`
    );
  }

  /**
   * Call individual provider with proper formatting
   */
  private async callProvider(
    provider: AIProviderConfig,
    request: GenerationRequest
  ): Promise<string> {
    const apiKey = import.meta.env[provider.apiKeyEnvVar];
    
    if (!apiKey) {
      throw new Error(`API key not found for ${provider.displayName} (${provider.apiKeyEnvVar})`);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), provider.timeout);

    try {
      let response: Response;

      // Special handling for Gemini (different API structure)
      if (provider.name === 'gemini') {
        response = await this.callGemini(provider, request, apiKey, controller);
      } else {
        // OpenAI-compatible providers
        response = await this.callOpenAICompatible(provider, request, apiKey, controller);
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw {
          message: `HTTP ${response.status}: ${errorText}`,
          statusCode: response.status,
        };
      }

      const data = await response.json();
      return this.extractContent(provider, data);

    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw { message: `Request timeout after ${provider.timeout}ms`, statusCode: 408 };
      }
      throw error;
    }
  }

  /**
   * Call Gemini API (Google's format)
   */
  private async callGemini(
    provider: AIProviderConfig,
    request: GenerationRequest,
    apiKey: string,
    controller: AbortController
  ): Promise<Response> {
    const url = `${provider.endpoint}?key=${apiKey}`;
    
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${request.systemPrompt}\n\n${request.userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: request.temperature ?? provider.temperature,
          maxOutputTokens: request.maxTokens ?? provider.maxTokens,
          responseMimeType: request.responseFormat === 'json' ? 'application/json' : 'text/plain',
        },
      }),
    });
  }

  /**
   * Call OpenAI-compatible providers
   */
  private async callOpenAICompatible(
    provider: AIProviderConfig,
    request: GenerationRequest,
    apiKey: string,
    controller: AbortController
  ): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    };

    // OpenRouter requires HTTP-Referer
    if (provider.name === 'openrouter') {
      headers['HTTP-Referer'] = 'https://hireready-chi.vercel.app';
      headers['X-Title'] = 'HireReady 2.0';
    }

    const body: any = {
      model: provider.modelId,
      messages: [
        { role: 'system', content: request.systemPrompt },
        { role: 'user', content: request.userPrompt },
      ],
      temperature: request.temperature ?? provider.temperature,
      max_tokens: request.maxTokens ?? provider.maxTokens,
    };

    // Add JSON mode if supported and requested
    if (provider.supportsJSON && request.responseFormat === 'json') {
      if (provider.name === 'openai' || provider.name === 'github') {
        body.response_format = { type: 'json_object' };
      } else {
        // For other providers, rely on prompt engineering
        body.messages[0].content += '\n\nIMPORTANT: Return ONLY valid JSON. No markdown, no explanations.';
      }
    }

    return fetch(provider.endpoint, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify(body),
    });
  }

  /**
   * Extract content from provider-specific response
   */
  private extractContent(provider: AIProviderConfig, data: any): string {
    if (provider.name === 'gemini') {
      const geminiData = data as GeminiResponse;
      return geminiData.candidates[0]?.content?.parts[0]?.text || '';
    } else {
      // OpenAI-compatible format
      const openaiData = data as OpenAIResponse;
      return openaiData.choices[0]?.message?.content || '';
    }
  }

  /**
   * Determine if error is retryable
   */
  private isRetryable(error: any): boolean {
    const statusCode = error.statusCode;
    
    // Retry on rate limits, server errors, timeouts
    if (!statusCode) return true; // Network errors
    if (statusCode === 408) return true; // Timeout
    if (statusCode === 429) return true; // Rate limit
    if (statusCode >= 500) return true; // Server errors
    
    return false;
  }

  /**
   * Enforce rate limiting between requests
   */
  private async enforceRateLimit(provider: AIProviderConfig): Promise<void> {
    const lastTime = this.lastRequestTime.get(provider.name) || 0;
    const elapsed = Date.now() - lastTime;
    const minDelay = provider.rateLimitDelay || 0;

    if (elapsed < minDelay) {
      await this.sleep(minDelay - elapsed);
    }

    this.lastRequestTime.set(provider.name, Date.now());
  }

  /**
   * Cache management
   */
  private getCacheKey(request: GenerationRequest): string {
    return `${request.systemPrompt.substring(0, 100)}-${request.userPrompt.substring(0, 100)}`;
  }

  private getCachedResponse(request: GenerationRequest): GenerationResponse | null {
    const key = this.getCacheKey(request);
    const entry = this.cache.get(key);

    if (entry && Date.now() < entry.expiresAt) {
      console.log('✨ Cache hit');
      return { ...entry.response, cached: true };
    }

    // Clean expired entry
    if (entry) {
      this.cache.delete(key);
    }

    return null;
  }

  private cacheResponse(request: GenerationRequest, response: GenerationResponse): void {
    const key = this.getCacheKey(request);
    const entry: CacheEntry = {
      key,
      response,
      timestamp: Date.now(),
      expiresAt: Date.now() + DEFAULT_GENERATION_CONFIG.cacheTTLMs,
    };

    this.cache.set(key, entry);

    // Limit cache size to 100 entries
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
  }

  /**
   * Utility: Sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get health status of all providers
   */
  getHealthStatus() {
    return Object.fromEntries(this.healthStatus);
  }

  /**
   * Clear cache (useful for testing)
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const aiFallbackChain = new AIFallbackChain();
