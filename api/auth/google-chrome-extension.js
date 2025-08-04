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
    const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${idToken}`);
    const userInfo = response.data;

    if (userInfo.aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: 'Invalid Client ID.' });
    }

    const userId = userInfo.sub;
    const email = userInfo.email;

    const sessionToken = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '1d' });

    return res.status(200).json({ sessionToken });

  } catch (error) {
    console.error('Authentication Error:', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Failed to authenticate.' });
  }
}