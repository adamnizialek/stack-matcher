import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface StackItem {
  name: string;
  role: string;
  reason: string;
}

export interface AiResponse {
  stack: StackItem[];
  summary: string;
  alternatives: string[];
}

const SYSTEM_PROMPT = `You are a senior software architect. Given a project description, recommend the best tech stack.
Respond ONLY with valid JSON in this exact format:
{
  "stack": [
    { "name": "Technology", "role": "What it does in this project", "reason": "Why it's the best choice" }
  ],
  "summary": "One paragraph explaining why this stack works well together for this project",
  "alternatives": ["Alternative1", "Alternative2"]
}
Include 3-6 technologies in the stack. Keep reasons concise (1-2 sentences).`;

export async function generateStackRecommendation(
  description: string
): Promise<AiResponse> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Project: ${description}` },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("Empty AI response");

  return JSON.parse(content) as AiResponse;
}
