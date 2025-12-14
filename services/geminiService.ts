// services/geminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = apiKey
  ? new GoogleGenerativeAI(apiKey)
  : null;

export const generateCompanyInsight = async (
  companyName: string,
  industry: string
): Promise<string> => {
  if (!genAI) {
    return "AI insights are currently unavailable. Please configure the API key.";
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a business analyst.
Write a short, professional 2-sentence description for a fictional company named "${companyName}" in the "${industry}" industry.
Focus on why a client should book a meeting.
Do not use markdown.
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini error:", error);
    return "Unable to load AI insights at this moment.";
  }
};
