import express from 'express'
import { registerUser,verifyUser,loginUser } from '../controllers/authController'
import upload from '../middleware/multer.js'
const router = express.Router()
router.post('/register',upload.single('profileImage'),registerUser)
router.get('/verify/:code',verifyUser)
router.get('/login',loginUser)
export default router