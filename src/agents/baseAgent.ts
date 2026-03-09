import OpenAI from "openai";

// Izmantojam import.meta.env Vite videi vai process.env Node videi
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export async function runAgent(task: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Izmantojam stabilāko pieejamo mini modeli
    messages: [
      { role: "system", content: "You are an autonomous business AI agent for Warpala AI Construction OS." },
      { role: "user", content: task }
    ],
    temperature: 0.7
  });

  return response.choices[0].message.content;
}
