import { GoogleGenAI, Modality, GenerateContentResponse, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const editImageWithGemini = async (imageFile: File, prompt: string): Promise<string | null> => {
  const imagePart = await fileToGenerativePart(imageFile);

  const textPart = {
    text: prompt,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [imagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    console.warn("No image data found in the response.");
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw new Error("Failed to process the image with the AI model. Please check the console for more details.");
  }
};

export const getChefsSpecial = async (): Promise<{ name: string; description: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "You are a world-class chef. Create a unique, delicious-sounding, and healthy vegetarian or vegan dish of the day for a corporate canteen menu. Provide a name for the dish and a short, enticing description (max 20 words).",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "The name of the dish." },
            description: { type: Type.STRING, description: "A short, enticing description of the dish." },
          },
          required: ["name", "description"],
        },
      },
    });

    const special = JSON.parse(response.text);
    return {
      name: special.name || "Chef's Surprise",
      description: special.description || "A delightful dish prepared with the freshest ingredients."
    };
  } catch (error) {
    console.error("Error fetching Chef's Special from Gemini:", error);
    // Return a graceful fallback
    return {
      name: "Palak Paneer Delight",
      description: "Creamy spinach curry with soft paneer cubes, spiced to perfection. A comforting and healthy choice."
    };
  }
};