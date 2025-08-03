import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;

  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: `Explain this code:\n${code}` }] }],
    });

    console.log("RAW RESPONSE:", result);
    
    const explanation = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!explanation) {
    return res.status(502).json({ message: 'No explanation returned by Gemini.' });
    }

    return res.status(200).json({ explanation });


  } catch (error) {
    console.error("API Call Error:", error);
    return res.status(500).json({ message: 'Error while getting explanation.' });
  }
}
