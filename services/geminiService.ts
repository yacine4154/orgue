import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedMelody } from "../types";

const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateMelody = async (mood: string): Promise<GeneratedMelody | null> => {
  if (!apiKey) {
    console.warn("API Key not found.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a simple, short piano melody (sequence of notes) that feels "${mood}". 
      Limit to 8-12 notes. Use standard note names like "C4", "D#4", etc. that are within the range C4 to E5.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            notes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  note: { type: Type.STRING },
                  duration: { type: Type.NUMBER, description: "Duration in milliseconds, usually between 300 and 800" },
                },
                required: ["note", "duration"]
              }
            }
          },
          required: ["title", "notes"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeneratedMelody;
  } catch (error) {
    console.error("Error generating melody:", error);
    return null;
  }
};
