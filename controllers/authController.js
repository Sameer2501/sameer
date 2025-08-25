import bcrypt from "bcryptjs";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import transporter from "../config/nodeMailer.js";
import crypto from "crypto"; 
// Register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    let profileImage = "";
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "users",
      });
      profileImage = result.secure_url;
    }

    const verificationCode = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      isVerified: false,
      verificationCode,
    });


    const verifyLink = `${process.env.BASE_URL}/api/auth/verify/${verificationCode}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      html: `<p>Hello ${name}, click <a href="${verifyLink}">here</a> to verify your account.</p>`,
    });

    res.status(201).json({ message: "Registered! Check your email for verification." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify user accout
export const verifyUser = async (req, res) => {
  try {
    const { code } = req.params;
    const user = await User.findOne({ verificationCode: code });
    if (!user) return res.status(400).json({ message: "Invalid code" });

    user.isVerified = true;
    user.verificationCode = "";
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (!user.isVerified)
      return res.status(401).json({ message: "Please verify your email " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
