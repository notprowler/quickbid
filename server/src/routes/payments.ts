import express, { Request, Response } from "express";
import Stripe from "stripe";
import supabase from "@/config/database";
import { validateAccessToken } from "@/util/JWT";

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

router.post("/create-payment-intent", async (req: Request, res: Response) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({ error: "Invalid amount." });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in cents
      currency: "usd",
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent." });
  }
});

router.post(
  "/update-balance",
  validateAccessToken,
  async (req: Request, res: Response) => {
    const { user_id } = req.user!; // Assuming `validateAccessToken` adds user info
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      res.status(400).json({ error: "Invalid amount." });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("users")
        .select("balance")
        .eq("user_id", user_id)
        .single();

      if (error || !data) {
        console.error("Error fetching user balance:", error);
        res.status(404).json({ error: "User not found." });
        return;
      }

      const newBalance = (data.balance || 0) + amount / 100; // Convert cents to dollars

      const { error: updateError } = await supabase
        .from("users")
        .update({ balance: newBalance })
        .eq("user_id", user_id);

      if (updateError) {
        console.error("Error updating balance:", updateError);
        res.status(500).json({ error: "Failed to update balance." });
        return;
      }

      res.status(200).json({ message: "Balance updated successfully." });
    } catch (error) {
      console.error("Error handling balance update:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  }
);

export default router;
