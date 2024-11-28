import jwt from "jsonwebtoken"
import express, {Request, Response, NextFunction} from "express";
import supabase from "@/config/database";

// Used by @notprowler - generating the TOKEN_SECRET in env
// import crypto from "crypto";
// let envSecret = crypto.randomBytes(64).toString('hex')
// console.log(envSecret);

if (!process.env.TOKEN_SECRET)
    throw new Error("TOKEN_SECRET is not defined in environment variables");

const generateAccessToken = (password: string) => {

    //Make sure to give payload in JSON!! @notprowler
    return jwt.sign({ password: password }, process.env.TOKEN_SECRET as string, {
      expiresIn: "36h",
    });
  };
  
  const validateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    // const accessToken = req.cookies["access-token"];
  
    // if (!accessToken) return res.json({ error: "User not Authenticated!" });
  
    // try {
    //   const validToken = jwt.verify(accessToken, process.env.TOKEN_SECRET as string);
    //   if (validToken){
    //       req.authenticated = true;
    //       return next();
    //   }
    // } catch (error) {
    //   res.status(400).send({ erro: error});
    // }
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
      return `Error while checking the database: ${ usernameError?.message || emailError?.message }`;
    }
  
    if (usernameData.length > 0) {
      return "Username is already taken.";
    } else if (emailData.length > 0) {
      return "Email is already registered.";
    } else {
      return "Username and Email are available.";
    }
  };
  
export {
    checkUserExistence,
    generateAccessToken,
    validateAccessToken
}