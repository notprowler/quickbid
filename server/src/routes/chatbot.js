import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config({ path: "../../.env" });

// import { Database } from "./database.types";
// import "./dotenv";

// Create the supabase client
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error(
    "SUPABASE_URL or SUPABASE_ANON_KEY is not set in environment variables"
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function getAllListings() {
  const { data, error } = await supabase.from("listings").select("*");

  if (error) {
    console.error("Error fetching data from the database");
    return null;
  }
  return data;
}

let conversationHistory = [
  {
    role: "user",
    parts: [{ text: "Hello" }],
  },
  {
    role: "model",
    parts: [
      {
        text: "Hi! I'm your virtual assistant. How can I help you with the current listings today?",
      },
    ],
  },
];

async function geminiChat(userMessage) {
  // Get listings data
  const listings_data = await getAllListings();
  if (!listings_data) {
    console.error("No listings data found.");
    return;
  }

  // Format listings data (only including essential fields)
  const listingsText = listings_data
    .map(
      (listing) =>
        `Title: ${listing.title}, Type: ${listing.type}, Price: $${listing.price}, Status: ${listing.status}`
    )
    .join("\n");

  // Add the new user message to the conversation history
  conversationHistory.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  // Initialize Gemini model
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const chat = model.startChat({
    history: [
      ...conversationHistory,
      {
        role: "model",
        parts: [
          {
            text: `Here are the current listings: ${listingsText}`,
          },
        ],
      },
    ],
  });

  // Send user message to the model and process the response
  let result = await chat.sendMessageStream(userMessage);
  let fullText = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
    fullText += chunkText;
  }

  conversationHistory.push({
    role: "model",
    parts: [{ text: fullText }],
  });
}

geminiChat("Hello what up. My name is Barack Obama");
setTimeout(() => {
  console.log("Waited for 5 seconds");
  geminiChat("What is my name?");
}, 5000);
