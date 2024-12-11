import jwt, { JwtPayload } from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";
import supabase from "@/config/database";
import { AuthenticatedUser } from "@/types"; // Import the AuthenticatedUser type

// Used by @notprowler - generating the TOKEN_SECRET in env
// import crypto from "crypto";
// let envSecret = crypto.randomBytes(64).toString('hex')
// console.log(envSecret);

if (!process.env.TOKEN_SECRET)
  throw new Error("TOKEN_SECRET is not defined in environment variables");

const generateAccessToken = (
  userId: number,
  username: string,
  email: string,
  role: string
) => {
  return jwt.sign(
    { user_id: userId, username, email, role },
    process.env.TOKEN_SECRET as string,
    { expiresIn: "36h" }
  );
};

const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies["access-token"];

  if (!token) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

    // Was flodding the console to commented it for now
    // console.log("Decoded JWT:", decoded);

    if (typeof decoded === "object" && "user_id" in decoded) {
      req.user = decoded as AuthenticatedUser;
      next();
    } else {
      res.status(400).json({ error: "Invalid token format" });
      return;
    }
  } catch (err) {
    console.error("JWT Verification Error:", err);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const checkUserExistence = async (username: string, email: string) => {
  // Query for checking the username and email in the 'users' table
  const { data: usernameData, error: usernameError } = await supabase
    .from("users")
    .select("username")
    .eq("username", username);

  const { data: emailData, error: emailError } = await supabase
    .from("users")
    .select("email")
    .eq("email", email);

  if (usernameError || emailError) {
    return `Error while checking the database: ${
      usernameError?.message || emailError?.message
    }`;
  }

  if (usernameData.length > 0) {
    return "Username is already taken.";
  } else if (emailData.length > 0) {
    return "Email is already registered.";
  } else {
    return "Username and Email are available.";
  }
};

export { checkUserExistence, generateAccessToken, validateAccessToken };
