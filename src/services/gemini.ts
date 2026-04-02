import { GoogleGenAI } from "@google/genai";
import { PERSONALITIES } from "../data/personalities";

export async function generatePersonalityImage(personalityCode: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  const personality = PERSONALITIES[personalityCode];
  
  const prompt = personality?.imagePrompt || `A highly artistic, symbolic representation of the MBTI personality type ${personalityCode}. 
  The style should be clean, modern, and professional, using a symbolic character or abstract scene that reflects the core traits of this type. 
  No text in the image. High quality digital art style.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
  return null;
}
