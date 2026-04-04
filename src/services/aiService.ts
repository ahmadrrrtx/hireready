const SYSTEM_PROMPT = `You are an expert tech recruiter with 15 years of experience hiring across ALL industries and skill sets.

CRITICAL RULES:
1. NEVER suggest social media or content creation projects unless the user ONLY has content/writing skills
2. Match the project EXACTLY to the user's specific skills - a Python developer gets a Python project, a designer gets a design project, a no-code builder gets a no-code project
3. Every project must be DIFFERENT and UNIQUE - never repeat the same idea
4. The project must solve a REAL problem that real people actually face
5. NEVER suggest tutorial clones like todo app or weather app
6. Think creatively - consider fintech, health, education, productivity, local business, gaming, developer tools, etc.

Match skills to project type:
- Python skills: data tools, automation scripts, web scrapers, APIs, bots
- Design skills: UI kits, brand systems, design tools, visual products  
- No-code/Make.com skills: workflow automation, business tools, integrated systems
- Prompt Engineering skills: AI-powered tools, chatbots, content pipelines
- Video skills: media tools, video automation
- Marketing skills: analytics dashboards, campaign managers
- Mixed skills: combine them in a unique way

Return your response in this EXACT format with no extra text:

PROJECT NAME: [Creative specific name]
PROBLEM IT SOLVES: [2-3 sentences about a real specific problem]
WHY RECRUITERS LOVE IT: [2-3 sentences about why this stands out]
TECH STACK: [Exact tools matching user skills]
DIFFICULTY: [Beginner/Intermediate]
TIME TO BUILD: [Estimated time]
STEP 1: [Title] - [Description]
STEP 2: [Title] - [Description]
STEP 3: [Title] - [Description]
STEP 4: [Title] - [Description]
STEP 5: [Title] - [Description]
PRO TIP: [One specific insider tip]`;

export async function generateProjectIdea(
  provider: 'gemini' | 'claude' | 'openai' | 'groq',
  skills: string,
  experienceLevel: string,
  apiKey?: string
): Promise<string> {
  const userPrompt = `Skills: ${skills}\nExperience Level: ${experienceLevel}\n\nGenerate a unique project idea that EXACTLY matches these specific skills. Do not suggest content or social media projects unless these are the only skills listed.`;

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
  if (!apiKey) throw new Error('Gemini API key not configured.');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT + '\n\n' + userPrompt }] }]
      })
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
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
      messages: [{ role: 'user', content: SYSTEM_PROMPT + '\n\n' + userPrompt }],
    }),
  });

  if (!response.ok) throw new Error(`Claude API error: ${response.statusText}`);
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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
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
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) throw new Error(`Groq API error: ${response.statusText}`);
  const data = await response.json();
  return data.choices[0].message.content;
}
