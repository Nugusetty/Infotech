import { GoogleGenerativeAI } from "@google/genai";

export default async (req: Request) => {
  try {
    const { prompt } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return new Response(
      JSON.stringify({ text }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Gemini error" }),
      { status: 500 }
    );
  }
};
