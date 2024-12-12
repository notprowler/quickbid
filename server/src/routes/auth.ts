import express from "express";
import jwt from "jsonwebtoken";
import authController from "@/controllers/auth.controller";
import { validateAccessToken } from "@/util/JWT";
import { AuthenticatedUser } from "@/types"; // Import the AuthenticatedUser type
const router = express.Router();

// @ts-ignore - This is cause the "RequestHandler" was giving me
// issues when returning res (to stop execution of more res.sends)
router.post("/register", authController.registerUser);

// @ts-ignore - Same here
router.post("/login", authController.loginUser);

router.post("/logout", authController.logOutUser);

const verifyAccessToken = (
  token: string
): { valid: boolean; payload?: any } => {
  try {
    if (!process.env.TOKEN_SECRET)
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    const payload = jwt.verify(token, process.env.TOKEN_SECRET); // Replace 'your-secret-key' with your actual secret key
    return { valid: true, payload };
  } catch (err) {
    return { valid: false };
  }
};

//@ts-ignore
router.get("/protected", validateAccessToken, (req, res) => {
  console.log("Accessing protected route. User:", req.user);

  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  res.json({ message: "Protected data", user: req.user });
});

router.get("/verify", validateAccessToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

export default router;
