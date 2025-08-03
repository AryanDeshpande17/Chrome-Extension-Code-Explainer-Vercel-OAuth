// api/auth/google-chrome-extension.js

import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'ID Token is required.' });
  }

  try {
    const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    const userInfo = response.data;

    if (userInfo.aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Invalid Client ID.' });
    }

    const userId = userInfo.sub;
    const sessionToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ sessionToken });

  } catch (error) {
    console.error('Authentication Error:', error.message || error);
    res.status(500).json({ message: 'Failed to authenticate.' });
  }
}
