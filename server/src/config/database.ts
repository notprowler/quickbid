import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import "./dotenv";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables");
  }

const supabase = createClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

export default supabase;

