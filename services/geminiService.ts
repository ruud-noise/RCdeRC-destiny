
import { GoogleGenAI } from "@google/genai";
import { TripParameters } from "../types";

export const findOptimalLocation = async (params: TripParameters): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Try to get current location for better grounding
  let userLocation = null;
  try {
    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    userLocation = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude
    };
  } catch (e) {
    console.warn("Could not get user location, defaulting to Rotterdam coordinates.");
    userLocation = { latitude: 51.9225, longitude: 4.47917 };
  }

  const prompt = `
    You are the official trip planner for RCdeRC (Rotterdamse Club de Retro Cyclisme), a cycling club based in Rotterdam.
    Find the absolute best 1-week cycling trip destination based on these parameters:
    - Distance from Rotterdam: ${params.distanceToRotterdam} km (Approximate)
    - Terrain Type (0=Flat, 10=Mountains): ${params.terrain}
    - Budget Level (0=Budget/Low Big Mac Index, 20=Luxury/High Index): ${params.bigMacIndex}
    - Sunny Weather Preference: ${params.sunnyWeatherChance}% chance minimum.
    - Additional Notes: "${params.additionalInput}"

    Please provide:
    1. A single specific destination (Region or Town).
    2. A detailed explanation of why it fits the club RCdeRC's needs.
    3. Suggested routes or climbs in that area.
    4. Use Google Maps grounding to provide a link to the destination.

    Format the response in Markdown with a clear, enthusiastic tone.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: userLocation
        }
      }
    },
  });

  return response.text || "No suggestion found.";
};

export const extractGroundingLinks = (response: any) => {
    return response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
};
