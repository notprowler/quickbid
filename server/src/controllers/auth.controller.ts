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

  const { data: user, error } = await supabase
    .from("users")
    .select("user_id, password_hash, username, email, role") // Fetch role
    .eq("email", email)
    .single();

  if (error || !user) {
    res.status(400).json({ error: "User doesn't exist" });
    return;
  }

  bcrypt.compare(password, user.password_hash).then((match) => {
    if (!match) {
      res.status(400).json({ error: "Wrong email and password combination!" });
    } else {
      const accessToken = generateAccessToken(
        user.user_id,
        user.username,
        user.email,
        user.role // Pass role to the token generator
      );

      res.cookie("access-token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30 * 1000,
        path: "/",
      });

      res.json("LOGGED IN");
    }
  });
};

const logOutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("access-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    res.status(200).json({ message: "Successfully logged user out" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: "Failed to log out user" });
  }
};


export default {
  registerUser,
  loginUser,
  logOutUser
};
