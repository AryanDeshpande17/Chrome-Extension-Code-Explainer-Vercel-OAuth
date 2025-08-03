// api/explain-code.js

import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { code } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is missing.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, JWT_SECRET);

    const geminiResponse = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: `Explain this code: ${code}` }] }],
      },
      {
        headers: { 'x-goog-api-key': GEMINI_API_KEY },
      }
    );

    const explanation = geminiResponse.data.candidates[0].content.parts[0].text;
    res.status(200).json({ explanation });

  } catch (error) {
    console.error('API Call Error:', error.message || error);
    res.status(500).json({ message: 'An error occurred while getting the explanation.' });
  }
}
