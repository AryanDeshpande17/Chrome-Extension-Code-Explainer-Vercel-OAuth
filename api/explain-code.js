import { GoogleGenAI } from "@google/genai";

//const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;
//  const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'Authorization header is missing.' });
//   }

//  const token = authHeader.split(' ')[1];

  try {
    //jwt.verify(token, JWT_SECRET);

    const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

    const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: `Explain this code: ${code}` }] }],
  });

    const explanation = result.text;

    if (!explanation) {
      return res.status(502).json({ message: 'No explanation returned by Gemini.' });
    }

    return res.status(200).json({ explanation });

  } catch (error) {
    console.error('API Call Error:', error.message || error);
    return res.status(500).json({ message: 'An error occurred while getting the explanation.' });
  }
};
