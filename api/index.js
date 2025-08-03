// ====================================================================
// api/index.js - Backend for AI Code Explainer, ready for Vercel
// ====================================================================

const express = require('express');
const serverless = require('serverless-http');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Use environment variables for secrets
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Enable CORS to allow requests from your Chrome extension's origin
// In production, you might want to restrict this to a specific origin
app.use(cors());
app.use(express.json());

// --- 1. Authentication Endpoint ---
// This endpoint verifies the Google token and issues a session token
app.post('/auth/google-chrome-extension', async (req, res) => {
    const { idToken } = req.body;

    if (!idToken) {
        return res.status(400).json({ message: 'ID Token is required.' });
    }

    try {
        // Verify the ID Token with Google's API
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        const userInfo = response.data;

        // Check if the token is valid for your client
        if (userInfo.aud !== GOOGLE_CLIENT_ID) {
            return res.status(401).json({ message: 'Invalid Client ID.' });
        }

        const userId = userInfo.sub;

        // Generate a new JWT session token
        const sessionToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });

        res.json({ sessionToken });
    } catch (error) {
        console.error('Authentication Error:', error);
        res.status(500).json({ message: 'Failed to authenticate.' });
    }
});

// --- 2. AI Explanation Endpoint ---
// This endpoint authenticates the user and proxies the request to the Gemini API
app.post('/api/explain-code', async (req, res) => {
    const { code } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify the session token
        jwt.verify(token, JWT_SECRET);

        // Make the Gemini API call using the server's key
        const geminiResponse = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            {
                contents: [{ parts: [{ text: `Explain this code: ${code}` }] }]
            },
            {
                headers: { 'x-goog-api-key': GEMINI_API_KEY }
            }
        );

        const explanation = geminiResponse.data.candidates[0].content.parts[0].text;
        res.json({ explanation });
    } catch (error) {
        console.error('API Call Error:', error);
        res.status(500).json({ message: 'An error occurred while getting the explanation.' });
    }
});

// Export the Express app instance so Vercel can run it as a serverless function
module.exports = serverless(app);