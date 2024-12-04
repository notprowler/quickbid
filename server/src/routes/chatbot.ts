import express, { Request, Response } from 'express';
import Configuration, { OpenAI } from 'openai';
import supabase from "@/config/database";
const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Use the environment variable
});
const openai = new OpenAIApi(configuration);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Fetch data from the listings table using Supabase
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*');

    if (error) {
      throw error;
    }

    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: `You are a chatbot that provides information about current active listings. Here are the listings: ${JSON.stringify(listings)}. ${message}`,
      max_tokens: 150,
    });
    res.json({ response: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

export default router;