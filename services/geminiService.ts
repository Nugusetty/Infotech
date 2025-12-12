import { GoogleGenAI } from "@google/genai";

// Initialize Gemini client safely
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCompanyInsight = async (companyName: string, industry: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "AI insights are currently unavailable. Please check your API key configuration.";

  try {
    const prompt = `
      You are an expert business analyst. 
      Write a short, engaging, and professional 2-sentence description for a fictional company named "${companyName}" operating in the "${industry}" sector.
      Focus on why a potential client should book a meeting with them.
      Do not use markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating company insight:", error);
    return "Unable to load AI insights at this moment.";
  }
};