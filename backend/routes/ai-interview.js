const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🛠️ FIX: Use 'gemini-flash-latest' (Safest alias for Free Tier)
// This automatically picks the best stable Flash model you have access to.
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 📌 INTERVIEW CHAT ENDPOINT
router.post('/chat', auth, async (req, res) => {
    try {
        const { topic, currentQuestion, userAnswer } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ msg: "API Key Missing" });
        }

        let prompt = "";

        // SCENARIO 1: STARTING THE INTERVIEW
        if (!currentQuestion) {
            prompt = `
                Act as a strict technical interviewer for the topic: "${topic}".
                Ask me a relevant, beginner-to-intermediate level interview question.
                Return ONLY a JSON object:
                {
                    "feedback": "",
                    "rating": 0,
                    "nextQuestion": "Your question here..."
                }
            `;
        } 
        // SCENARIO 2: EVALUATING ANSWER
        else {
            prompt = `
                Act as a technical interviewer for "${topic}".
                
                I was asked: "${currentQuestion}"
                I answered: "${userAnswer}"

                Task:
                1. Rate my answer (0-10).
                2. Give short feedback (max 2 sentences) on what was good or missing.
                3. Ask the NEXT follow-up question.
                
                Return ONLY a JSON object:
                {
                    "feedback": "Your feedback here...",
                    "rating": 8,
                    "nextQuestion": "Your next question here..."
                }
            `;
        }

        // Generate Content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean JSON (Remove markdown if AI adds it)
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let jsonResponse;
        
        try {
            jsonResponse = JSON.parse(cleanText);
        } catch (e) {
            // Fallback if AI replies with plain text
            jsonResponse = { 
                feedback: "Could not parse AI response.", 
                rating: 0, 
                nextQuestion: text 
            };
        }

        res.json(jsonResponse);

    } catch (err) {
        console.error("Interview Error:", err.message);
        
        // Handle Rate Limit specifically
        if (err.message.includes("429") || err.status === 429) {
            return res.status(429).json({ msg: "AI is busy (Rate Limit). Please wait 30 seconds." });
        }
        res.status(500).json({ msg: "AI Failed to respond." });
    }
});

module.exports = router;