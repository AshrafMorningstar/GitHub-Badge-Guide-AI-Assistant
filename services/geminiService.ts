import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MODELS } from '../constants';

// NOTE: Creating instances dynamically to ensure fresh API key if changed by UI logic (specifically for Pro Image)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFastResponse = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODELS.FAST,
    contents: prompt,
  });
  return response.text || "No response generated.";
};

export const generateThinkingResponse = async (prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODELS.THINKING,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },
    },
  });
  return response.text || "No response generated.";
};

export const generateSearchResponse = async (prompt: string): Promise<{ text: string; links: any[] }> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODELS.SEARCH,
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  const text = response.text || "No response generated.";
  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  return { text, links };
};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K'): Promise<string> => {
  const ai = getAiClient();
  // Using generateContent for nano banana / pro image series as per guidelines
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_GEN,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        imageSize: size,
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_EDIT, // gemini-2.5-flash-image
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png', // Assuming PNG for simplicity in this demo context
            data: base64Image.split(',')[1] // remove data url prefix
          }
        },
        { text: prompt }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};