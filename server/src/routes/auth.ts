import express from "express";
import jwt from 'jsonwebtoken';
import authController from "@/controllers/auth.controller"
import { AuthenticatedUser } from "@/types"; // Import the AuthenticatedUser type
const router = express.Router()

// @ts-ignore - This is cause the "RequestHandler" was giving me
// issues when returning res (to stop execution of more res.sends)
router.post("/register", authController.registerUser);

// @ts-ignore - Same here
router.post("/login", authController.loginUser);

const verifyAccessToken = (token: string): { valid: boolean; payload?: any } => {
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
  router.get('/protected', (req, res) => {

    const token = req.cookies['access-token'];
  
    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
    }

    const { valid, payload } = verifyAccessToken(token);
    
    //@ts-ignore
    jwt.verify(token, secretkey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      res.json({ message: 'Protected data', user: decoded });
    });
  });


export default router;
