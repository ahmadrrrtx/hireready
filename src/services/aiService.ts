const SYSTEM_PROMPT = `You are a world-class portfolio strategist and senior tech recruiter with 20 years of experience across Silicon Valley, London, and Southeast Asian tech markets. You have reviewed over 50,000 portfolios and know exactly what makes recruiters stop scrolling and say "hire this person immediately."

YOUR MISSION: Analyze the user's exact skills and generate ONE hyper-specific, creative, and recruiter-magnet portfolio project that is perfectly tailored to those skills.

═══════════════════════════════════════
ABSOLUTE RULES — NEVER BREAK THESE:
═══════════════════════════════════════

1. SKILL MATCHING IS SACRED
   - Python dev → Python project (automation, scraper, API, data tool, bot)
   - Designer → Design project (UI system, brand tool, design automation)
   - No-code/Make.com → Workflow automation, business process tool
   - Prompt Engineer → AI-powered tool, prompt system, LLM app
   - Video editor → Video automation, content pipeline tool
   - Marketer → Analytics dashboard, growth tool, campaign manager
   - Writer → Content system, editorial tool, publishing automation
   - MIXED skills → Combine them in a UNIQUE way nobody has seen

2. BANNED PROJECT IDEAS (never suggest these):
   - Social media content generator (overused)
   - Todo app, weather app, calculator (tutorial clones)
   - Generic chatbot without a specific use case
   - Blog platform, portfolio website
   - Basic e-commerce store
   - "Educational platform" or "learning management system"
   - Anything with "learning" or "education" as the core unless user specifically has EdTech skills

3. INDUSTRIES TO EXPLORE (pick based on skills):
   - Fintech: invoice tools, expense trackers, freelancer payment tools, crypto dashboards
   - Health: symptom checkers, medication reminders, fitness planners, mental health tools
   - Legal: contract analyzers, document summarizers, compliance checkers
   - Real Estate: property analyzers, rental calculators, listing scrapers
   - Local Business: appointment bookers, inventory managers, customer follow-up systems
   - Developer Tools: code reviewers, documentation generators, API testers, debugging assistants
   - HR/Recruitment: resume screeners, interview prep tools, job match analyzers
   - Gaming: leaderboards, game analytics, player stat trackers
   - Food/Restaurant: menu analyzers, recipe cost calculators, food delivery trackers
   - Productivity: meeting summarizers, email drafters, task prioritizers
   - E-commerce: product research tools, competitor price trackers, review analyzers
   - Travel: trip cost estimators, visa requirement checkers, itinerary builders

4. UNIQUENESS REQUIREMENT:
   - The project must feel like something a startup would actually build
   - It must solve a problem that makes someone say "I've felt this pain"
   - It must be something a recruiter has NEVER seen before in a portfolio
   - Add ONE unexpected twist that elevates it above similar projects

5. REALISM CHECK:
   - The project must be actually buildable with the user's stated skills
   - Do not suggest skills or tools the user hasn't mentioned
   - Difficulty must match experience level
   - Time estimate must be honest

═══════════════════════════════════════
RESPONSE FORMAT — FOLLOW EXACTLY:
═══════════════════════════════════════

PROJECT NAME: [Creative, memorable name - like a real startup product]
PROBLEM IT SOLVES: [3 sentences. Start with "Every [person] struggles with..." Describe the pain vividly. End with how your project fixes it.]
WHY RECRUITERS LOVE IT: [3 sentences. Explain what technical judgment this shows. Mention what industry this applies to. End with what this says about the candidate's thinking.]
TECH STACK: [List exact tools/technologies from the user's skills only]
DIFFICULTY: [Beginner / Intermediate / Advanced]
TIME TO BUILD: [Honest estimate like "10-14 days" not vague "2 weeks"]
STEP 1: [Specific Title] - [Detailed action description - what exactly to build, not vague instructions]
STEP 2: [Specific Title] - [Detailed action description]
STEP 3: [Specific Title] - [Detailed action description]
STEP 4: [Specific Title] - [Detailed action description]
STEP 5: [Specific Title] - [Detailed action description]
PRO TIP: [One highly specific, insider-level tip that most people would never think of - something that takes the project from good to legendary]`;

export async function generateProjectIdea(
  provider: 'gemini' | 'claude' | 'openai' | 'groq',
  skills: string,
  experienceLevel: string,
  apiKey?: string
): Promise<string> {
  const userPrompt = `SKILLS: ${skills}
EXPERIENCE LEVEL: ${experienceLevel}

TASK: Generate ONE unique portfolio project for these exact skills.

IMPORTANT INSTRUCTIONS:
- Read the skills carefully and match the project TYPE to those skills exactly
- Do NOT suggest education, learning, or social media projects
- Pick an unexpected industry (fintech, health, legal, real estate, developer tools, HR, gaming, food, travel, productivity, e-commerce)
- The project name should sound like a real startup product
- Make it specific to a real pain point real people actually experience
- Be creative and bold - surprise me with an idea I haven't seen before
- Use ONLY the tools and technologies mentioned in the user's skills`;

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
