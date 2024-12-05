import supabase from "@/config/database";
import { NextFunction, Request, RequestHandler, Response } from "express";
import {
  checkUserExistence,
  generateAccessToken,
  validateAccessToken,
} from "@/util/JWT";
import bcrypt from "bcrypt";

// @notprowler registerUser: RequestHandler typing was giving me pain
// (because of return statements) so I removed it.
// @ts-ignore
const registerUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { username, password, email, address } = req.body;
  //If frontend gives wrong params
  if (!username || !password || !email || !address) {
    return res.status(400).json({
      error:
        "Please provide all required fields: username, password, email, and address.",
    });
  }

  const availabilityMessage = await checkUserExistence(username, email);

  if (availabilityMessage !== "Username and Email are available.") {
    return res.status(400).json({ error: availabilityMessage });
  }

  bcrypt.hash(password, 10).then(async (hash) => {
    const { data, error } = await supabase.from("users").insert([
      {
        address: address,
        email: email,
        password_hash: hash,
        username: username,
        vip: false,
      },
    ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.json({ message: "User registered" });
    }
  });
};

//Same issue here as before using the "RequestHandler" typing on loginUser
// @ts-ignore
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Fetch the user from the database
  const { data: user, error } = await supabase
    .from("users")
    .select("user_id, password_hash, username, email") // Fetch additional fields
    .eq("email", email)
    .single();

  if (error || !user) {
    console.error("User fetch error:", error);
    res.status(400).json({ error: "User doesn't exist" });
    return;
  }

  if (!user.user_id) {
    console.error("Missing user_id for user:", user);
    res.status(500).json({ error: "Internal server error: user_id not found" });
    return;
  }

  // Compare the provided password with the hashed password
  bcrypt.compare(password, user.password_hash).then((match) => {
    if (!match) {
      res.status(400).json({ error: "Wrong email and password combination!" });
    } else {
      // Generate the token with the user's ID, username, and email
      const accessToken = generateAccessToken(
        user.user_id,
        user.username,
        user.email
      );

      // Set the cookie with the generated token
      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      });

      res.json("LOGGED IN");
    }
  });
};

export default {
  registerUser,
  loginUser,
};
