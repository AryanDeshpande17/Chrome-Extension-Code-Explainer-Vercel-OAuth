# ExplainThisCode 🧠💻

A Chrome Extension that explains code snippets using Google’s Gemini AI. Just select any code on a webpage, right-click, and get an AI-generated explanation instantly. Ideal for beginners, students, and developers reviewing unfamiliar codebases.

---

## 🚀 Features

- ✅ **One-click explanation** of selected code using Gemini 1.5 via a Node.js backend.
- ✅ Built with **Manifest V3**, the latest standard for Chrome Extensions.
- ✅ Fully **hosted on Vercel** for fast and scalable backend deployments.
- ✅ Secure **Google OAuth2 authentication** for access control.
- ✅ Sleek, scrollable popup UI to view AI-generated results.

---

## 🛠️ Tech Stack

- **Frontend**: Chrome Extension (Manifest V3), HTML, JavaScript
- **Backend**: Node.js, Express, Google Generative AI (Gemini API)
- **Auth**: Google OAuth2
- **Hosting**: Vercel

---

## 🧪 How It Works

1. Select a block of code on any webpage.
2. Right-click and choose **"Explain this code"**.
3. The extension sends the code snippet to the backend.
4. The backend uses **Google Gemini API** to generate an explanation.
5. The explanation is sent back and displayed in a styled popup.

---

## 🔐 Authentication

- Login with your Google account using the **OAuth2 flow**.
- Tokens are securely exchanged and verified before API calls.

---
