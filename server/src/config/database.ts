import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import * as dotenv from "dotenv";
dotenv.config();

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_ANON_KEY ||
  !process.env.SUPABASE_SERVICE_ROLE_SECRET
) {
  throw new Error(
    "SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables"
  );
}

const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_SECRET // Use the service role key here
);

export default supabase;
