const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const auth = require('../middleware/authMiddleware');

// --- 1. SETUP UPLOADS ---
const uploadDir = path.join(__dirname, '../uploads'); 
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only .pdf, .jpg, and .png files are allowed!'));
  }
});

// --- 2. SETUP EMAIL (Gmail) ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// --- 3. REGISTER ROUTE ---
router.post('/register', (req, res, next) => {
    upload.single('verificationDoc')(req, res, (err) => {
        if (err) return res.status(400).json({ msg: `Upload Error: ${err.message}` });
        next();
    });
}, async (req, res) => {
    try {
        const { name, email, password, role, state, district, taluka, collegeName, collegeCode, branch, year, cgpa } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();

        // Create User Object
        let newUserObj = {
            name, email, password: hashedPassword, role,
            otp, otpExpires: Date.now() + 10 * 60 * 1000,
            isVerified: false
        };

        // Handle Faculty Specifics
        if (role === 'faculty') {
            if (!req.file) return res.status(400).json({ msg: 'Verification document missing' });
            newUserObj.state = state;
            newUserObj.district = district;
            newUserObj.taluka = taluka;
            newUserObj.collegeName = collegeName;
            newUserObj.collegeCode = 'FAC-' + Math.floor(1000 + Math.random() * 9000);
            newUserObj.verificationDoc = req.file.path;
        } 
        // Handle Student Linking Logic
        else if (role === 'student' && collegeCode) {
             const faculty = await User.findOne({ collegeCode: collegeCode, role: 'faculty' });
             if (!faculty) return res.status(400).json({ msg: "Invalid College Code" });
             
             newUserObj.collegeName = faculty.collegeName;
             newUserObj.collegeCode = collegeCode;
             newUserObj.branch = branch;
             newUserObj.year = year;
             newUserObj.cgpa = cgpa;
        }

        user = new User(newUserObj);
        await user.save();

        // Send OTP Email
        if (process.env.EMAIL_USER) {
            try {
                await transporter.sendMail({
                    from: '"CampusConnect" <' + process.env.EMAIL_USER + '>',
                    to: email,
                    subject: 'Verify Your Account',
                    text: `Your OTP is: ${otp}`
                });
            } catch (err) { console.error("Email failed:", err); }
        }

        res.json({ msg: 'Registration successful!', userId: user._id });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- 4. VERIFY OTP ROUTE ---
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ msg: 'User not found' });
        if (user.otp !== otp) return res.status(400).json({ msg: 'Invalid OTP' });

        user.isVerified = true;
        user.otp = undefined; 
        await user.save();

        const token = jwt.sign({ user: { id: user.id, role: user.role } }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, collegeCode: user.collegeCode });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 5. COMPLETE PROFILE (For Students adding college later) ---
router.post('/complete-profile', async (req, res) => {
    const { userId, collegeCode, branch, year, cgpa } = req.body;
    try {
        const student = await User.findById(userId);
        if (!student) return res.status(404).json({ msg: "User not found" });

        const faculty = await User.findOne({ collegeCode, role: 'faculty' });
        if (!faculty) return res.status(400).json({ msg: "Invalid College Code" });

        student.collegeCode = collegeCode;
        student.collegeName = faculty.collegeName;
        student.branch = branch;
        student.year = year;
        student.cgpa = cgpa;
        await student.save();

        res.json({ msg: "Profile Completed", collegeName: faculty.collegeName });
    } catch (err) { res.status(500).send('Server Error'); }
});

// --- 6. LOGIN ROUTE (RESTORED & FIXED) ---
const OWNER_CREDENTIALS = {
  email: "owner@techfiesta.com", 
  password: "ownerpassword123", 
  role: "owner", 
  name: "Platform Owner"
};

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("🔵 Login Request:", email);

        // 1. Check Owner Login
        if (email === OWNER_CREDENTIALS.email && password === OWNER_CREDENTIALS.password) {
            const token = jwt.sign(
                { user: { id: 'owner_id', role: 'owner' } }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );
            return res.status(200).json({ 
                token, 
                role: 'owner', 
                name: OWNER_CREDENTIALS.name 
            });
        }

        // 2. Check Database for User
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        // 3. Verify Password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ msg: "Invalid Credentials" });

        // 4. Check Verification Status (Faculty only)
        if (user.role === 'faculty' && !user.isVerified) {
            // Note: In our flow, faculty is verified by OTP for email, 
            // but you might want Manual Approval by Owner later.
            // For now, we assume OTP verification is enough to login.
            // If you want manual approval: if(!user.isApproved) ...
        }
        
        // 5. Check Verification (General)
        if (!user.isVerified) {
             return res.status(403).json({ msg: "Please verify your email first." });
        }

        // 6. Generate Token
        const token = jwt.sign(
            { 
              user: { 
                id: user.id, 
                role: user.role, 
                collegeCode: user.collegeCode,
                collegeName: user.collegeName 
              } 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            token, 
            role: user.role, 
            name: user.name,
            collegeName: user.collegeName 
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// 📌 GET CURRENT USER PROFILE
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// 📌 UPDATE PROFILE
router.put('/profile', auth, async (req, res) => {
    try {
        const { about, skills, linkedin, github, resumeLink, branch, year, cgpa } = req.body;
        
        // Find user
        let user = await User.findById(req.user.id);
        if(!user) return res.status(404).json({ msg: "User not found" });

        // Update fields
        if(about) user.about = about;
        if(skills) user.skills = skills.split(',').map(s => s.trim()); // Expect comma string
        if(linkedin) user.linkedin = linkedin;
        if(github) user.github = github;
        if(resumeLink) user.resumeLink = resumeLink;
        if(branch) user.branch = branch;
        if(year) user.year = year;
        if(cgpa) user.cgpa = cgpa;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
module.exports = router;

