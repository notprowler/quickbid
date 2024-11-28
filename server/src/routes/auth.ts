import express from "express";
import authController from "@/controllers/auth.controller"
const router = express.Router()

// @ts-ignore - This is cause the "RequestHandler" was giving me 
// issues when returning res (to stop execution of more res.sends)
router.post("/register", authController.registerUser);

// @ts-ignore - Same here
router.post("/login", authController.loginUser);

export default router;
