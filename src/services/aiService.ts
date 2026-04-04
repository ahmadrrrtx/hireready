import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are an expert tech recruiter and career coach. A user has shared their skills. Your job is to suggest ONE unique, specific portfolio project idea that will genuinely impress recruiters. The project must solve a real problem, not be a tutorial clone. Return your response in this EXACT format:

PROJECT NAME: [Creative name]
PROBLEM IT SOLVES: [2-3 sentences about the real problem]
WHY RECRUITERS LOVE IT: [2-3 sentences about why this stands out]
TECH STACK: [List the exact tools/technologies needed]
DIFFICULTY: [Beginner/Intermediate]
TIME TO BUILD: [Estimated time]
STEP 1: [Title] - [Description]
STEP 2: [Title] - [Description]
STEP 3: [Title] - [Description]
STEP 4: [Title] - [Description]
STEP 5: [Title] - [Description]
PRO TIP: [One insider tip to make this project stand out even more]`;

export async function generateProjectIdea(
  provider: 'gemini' | 'claude' | 'openai' | 'groq',
  skills: string,
  experienceLevel: string,
  apiKey?: string
): Promise<string> {
  const userPrompt = `Skills: ${skills}\nExperience Level: ${experienceLevel}\n\nGenerate a project idea that matches these skills and experience level.`;

  switch (provider) {
    case 'gemini':
      return generateWithGemini(userPrompt);

    case 'claude':
      if (!apiKey) throw new Error('API key required for Claude');
      return generateWithClaude(userPrompt, apiKey);

    case 'openai':
      if (!apiKey) throw new Error('API key required for OpenAI');
      return generateWithOpenAI(userPrompt, apiKey);

    case 'groq':
      if (!apiKey) throw new Error('API key required for Groq');
      return generateWithGroq(userPrompt, apiKey);

    default:
      throw new Error('Invalid AI provider');
  }
}

async function generateWithGemini(userPrompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your environment.');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(SYSTEM_PROMPT + '\n\n' + userPrompt);
  const response = await result.response;
  return response.text();
}

async function generateWithClaude(userPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: SYSTEM_PROMPT + '\n\n' + userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function generateWithOpenAI(userPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function generateWithGroq(userPrompt: string, apiKey: string): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
