import supabase from "@/config/database";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { checkUserExistence, generateAccessToken, validateAccessToken } from "@/util/JWT";
import bcrypt from "bcrypt";

// @notprowler registerUser: RequestHander typing was giving me pain 
// (because of return statements) so I removed it. 
const registerUser = async (req: Request, res: Response) => {
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
        Address: address,
        email: email,
        password_hash: hash,
        username: username,
        vip: false,
      },
    ]);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    else{
      return res.json({ message: "User registered" });
    }
  });
};

const loginUser: RequestHandler = async (req: Request, res: Response) => {
    res.send("Hello") //TODO
}

export default { 
    registerUser, 
    loginUser
};
