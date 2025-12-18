const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const auth = require('../middleware/authMiddleware');

// --- SETUP UPLOAD ---
const uploadDir = path.join(__dirname, '../uploads/temp_resumes');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- ANALYZE ENDPOINT ---
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ msg: "Server Config Error: API Key Missing" });
        }
        if (!req.file) return res.status(400).json({ msg: "Please upload a PDF resume." });

        console.log("📄 Processing Resume:", req.file.originalname);
        const filePath = req.file.path;

        // 1. Extract Text
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        const resumeText = data.text;

        if(!resumeText || resumeText.length < 50) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ msg: "Resume text is empty or unreadable." });
        }

        // 2. AI Analysis
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // ✅ USING THE MODEL WE CONFIRMED EXISTS
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
            Act as an expert Resume Reviewer. Analyze this resume text.
            Return ONLY a raw JSON object (no markdown, no backticks).
            JSON Structure:
            {
                "score": 0-100 (integer),
                "summary": "2 sentence professional summary",
                "strengths": ["strength 1", "strength 2", "strength 3"],
                "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
                "suggestions": ["improvement 1", "improvement 2"]
            }
            
            Resume Text:
            ${resumeText.substring(0, 10000)}
        `;

        console.log("🤖 Sending to Gemini 2.0...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log("✅ AI Response Received");

        // 3. Clean & Parse JSON
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        let analysis;
        
        try {
            analysis = JSON.parse(cleanText);
        } catch (e) {
            console.error("JSON Parse Error. AI returned:", text);
            return res.status(500).json({ msg: "AI analysis failed. Please try again." });
        }

        // 4. Cleanup
        fs.unlinkSync(filePath);
        res.json(analysis);

    } catch (err) {
        console.error("🔥 SERVER ERROR:", err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        
        // Detailed Error
        const errMsg = err.message || "Unknown Error";
        res.status(500).json({ msg: "Analysis Failed: " + errMsg });
    }
});

module.exports = router;