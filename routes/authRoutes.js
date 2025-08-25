import express from 'express'
import { registerUser,verifyUser,loginUser } from '../controllers/authController.js'
import upload from '../middleware/multer.js'
const router = express.Router()
router.post('/register',upload.single('profileImage'),registerUser)
router.get('/verify/:code',verifyUser)
router.post('/login',loginUser)
export default router