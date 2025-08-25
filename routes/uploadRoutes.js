import express from "express";
import upload from "../middleware/multer.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // Direct buffer upload using Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      { folder: "uploads" }, // folder name
      (error, uploadedResult) => {
        if (error) {
          return res.status(500).json({ success: false, message: "Upload failed" });
        }
        res.json({
          success: true,
          url: uploadedResult.secure_url,
        });
      }
    );

   
    result.end(req.file.buffer);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

export default router;
