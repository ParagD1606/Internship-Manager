const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// 📌 CHATBOT ENDPOINT
router.post('/ask', auth, async (req, res) => {
    try {
        const { message, history } = req.body; // history allows context

        if (!process.env.GEMINI_API_KEY) return res.status(500).json({ msg: "API Key Missing" });

        // Construct the chat history for context
        // We add a "System Instruction" at the start
        let chatContext = `
            Act as a friendly and helpful "Career Counselor" for a college platform called 'CampusConnect'.
            
            Your Goals:
            1. Answer student queries about careers, skills, and resumes.
            2. If they ask for jobs/internships, tell them to check the "Opportunities" page on this dashboard.
            3. Keep answers concise (max 3-4 sentences) and motivating.
            
            Current Conversation:
        `;

        // Append previous few messages for context (optional but good)
        if (history && history.length > 0) {
            history.forEach(msg => {
                chatContext += `\n${msg.role === 'user' ? 'Student' : 'Counselor'}: ${msg.text}`;
            });
        }

        chatContext += `\nStudent: ${message}\nCounselor:`;

        const result = await model.generateContent(chatContext);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        console.error("Chatbot Error:", err.message);
        if (err.message.includes("429")) {
            return res.status(429).json({ msg: "I'm thinking too hard! Give me 30 seconds." });
        }
        res.status(500).json({ msg: "AI is offline." });
    }
});

module.exports = router;