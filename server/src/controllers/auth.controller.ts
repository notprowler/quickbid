import supabase from "@/config/database";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { checkUserExistence, generateAccessToken, validateAccessToken } from "@/util/JWT";
import bcrypt from "bcrypt";

// @notprowler registerUser: RequestHandler typing was giving me pain 
// (because of return statements) so I removed it. 
// @ts-ignore
const registerUser = async (req: Request, res: Response): Promise<Response | void> => {
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


//Same issue here as before using the "RequestHandler" typing on loginUser
// @ts-ignore
const loginUser = async (req: Request, res: Response): Promise<Response | void> => {

  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)

  if (error) {
    return res.status(400).json({ error: "User Doesn't Exist" });
  }

  if (!user) res.status(400).json({ error: "User Doesn't Exist" });

  const dbPassword = user[0]?.password_hash;

  if (!dbPassword) {
    return res.status(400).json({ error: "Error retrieving password hash" });
  }

  bcrypt.compare(password, dbPassword).then((match) => {
    
    if (!match) {
        res.status(400).json({ error: "Wrong email and Password Combination!" });
      } else {
      
        const accessToken = generateAccessToken(dbPassword);
      
        res.cookie("access-token", accessToken, {
          maxAge: 60 * 60 * 24 * 30 * 1000,
          httpOnly: true,
        });

      res.json("LOGGED IN");
    }
  });
}

export default { 
    registerUser, 
    loginUser
};
