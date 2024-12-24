import express from "express"
import { AuthController } from "@/controllers/auth"
import { authenticate } from "@/middlewares/auth"


const router = express.Router()
const authController = new AuthController()

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/me", authenticate ,authController.me)

export default router