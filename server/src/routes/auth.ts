import express from "express";
import authController from "@/controllers/auth.controller"
const router = express.Router()

router.post("/register", authController.registerUser);

router.post("/login", (req, res) => {
  res.send("Hello World");
});

export default router;
