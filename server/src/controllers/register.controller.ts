import { Request, Response } from "express";
import bcrypt from "bcrypt";
import supabase from "@/config/database";

const registerVisitor = async (req: Request, res: Response): Promise<void> => {
  const { full_name, email, username, password, address } = req.body;

  if (!full_name || !email || !username || !password || !address) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const { error } = await supabase.from("pending_users").insert({
      full_name,
      email,
      username,
      password_hash: passwordHash,
      address,
    });

    if (error) throw error;

    res.status(201).json({ message: "Application submitted successfully." });
  } catch (err) {
    console.error("Error registering visitor:", err);
    res.status(500).json({ error: "Failed to submit application." });
  }
};

export { registerVisitor };
