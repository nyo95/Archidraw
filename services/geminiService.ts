
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestSubtasks(taskTitle: string, taskDescription: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `I am an interior architect. Suggest 3-5 subtasks for this task: "${taskTitle}". Description: ${taskDescription}. Format as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    return JSON.parse(response.text.trim()) as string[];
  } catch (error) {
    console.error("Gemini suggestion error:", error);
    return [];
  }
}
