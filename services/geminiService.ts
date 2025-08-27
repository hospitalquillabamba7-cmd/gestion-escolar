import { GoogleGenAI } from "@google/genai";

// Fix: Per coding guidelines, the API key must be obtained exclusively from `process.env.API_KEY`
// and used directly. The availability of the key is assumed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "Eres un asistente de IA útil para administradores y profesores de escuelas. Sé conciso, amigable y profesional. Responde en español.",
        temperature: 0.7,
        topP: 0.9,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error generating text from Gemini:", error);
    return "Lo siento, no pude procesar tu solicitud en este momento. Por favor, inténtalo de nuevo más tarde.";
  }
};

export const generateImage = async (): Promise<string> => {
  const prompt = "Logo profesional y moderno para un sistema de gestión escolar. Estilo minimalista y vectorial. El diseño debe combinar un libro abierto con un circuito digital sutil. Paleta de colores: azul primario (#3b82f6) y gris oscuro (#374151). Fondo blanco.";
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
    throw new Error("No se generó ninguna imagen.");
  } catch (error) {
    console.error("Error generating image from Gemini:", error);
    throw new Error("No se pudo generar el logo. Por favor, inténtalo de nuevo.");
  }
};
