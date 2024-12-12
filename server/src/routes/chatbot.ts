import { GoogleGenerativeAI } from "@google/generative-ai";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
dotenv.config();

const router = express.Router();

const API_KEY = process.env.GOOGLE_API_KEY;

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

async function geminiChat(userMessage: string) {
  const API_KEY = process.env.GOOGLE_API_KEY;

  const listings_data = await getAllListings();
  //  console.log(listings_data)
  if (!listings_data) {
    console.error("No listings data found.");
    return;
  }

  const listingsText = listings_data
    .map(
      (listing) =>
        `Title: ${listing.title}, Type: ${listing.type}, Price: $${listing.price}, Status: ${listing.status}`
    )
    .join("\n");

    const conversationHistory = [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
      {
        role: "model",
        parts: [
          {
            text: `Here are the current listings: ${listingsText}`,
          },
        ],
      },
    ];
  // @ts-ignore

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const chat = model.startChat({
      history: conversationHistory,
    });
  
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
  
    return fullText;
  }
  // geminiChat("Can you list all the items with a price over $300");
  router.post('/', async (req: Request, res: Response) => {
    const { message } = req.body;
    // console.log('Received message:', message); // Log the received message
    try {
      const response = await geminiChat(message);
      // console.log('AI Response:', response); // Log the AI response
      res.json({ response });
    } catch (error) {
      console.error('Error handling chatbot request:', error);
      res.status(500).send('Server error');
    }
  });
  
  export default router;