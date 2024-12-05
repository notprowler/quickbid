import { RequestHandler } from "express";
import supabase from "@/config/database";

const createTransaction: RequestHandler = async (req, res) => {
  const { buyer_id, seller_id, item_id, transaction_amount, is_vip } = req.body;

  if (!buyer_id || !seller_id || !item_id || !transaction_amount) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    const { data: buyerData, error: buyerError } = await supabase
      .from("users")
      .select("balance, vip")
      .eq("user_id", buyer_id)
      .single();

    if (buyerError || !buyerData) {
      res.status(404).json({ error: "Buyer not found." });
      return;
    }

    const { balance: buyerBalance, vip } = buyerData;

    const { data: sellerData, error: sellerError } = await supabase
      .from("users")
      .select("balance")
      .eq("user_id", seller_id)
      .single();

    if (sellerError || !sellerData) {
      res.status(404).json({ error: "Seller not found." });
      return;
    }

    const { balance: sellerBalance } = sellerData;

    const discountApplied = is_vip && vip;
    const finalAmount = discountApplied
      ? transaction_amount * 0.85
      : transaction_amount;

    if (buyerBalance < finalAmount) {
      res.status(400).json({ error: "Insufficient balance." });
      return;
    }

    const { error: buyerUpdateError } = await supabase
      .from("users")
      .update({ balance: buyerBalance - finalAmount })
      .eq("user_id", buyer_id);

    if (buyerUpdateError) {
      throw new Error("Failed to update buyer's balance.");
    }

    const { error: sellerUpdateError } = await supabase
      .from("users")
      .update({ balance: sellerBalance + finalAmount })
      .eq("user_id", seller_id);

    if (sellerUpdateError) {
      throw new Error("Failed to update seller's balance.");
    }

    const { error: transactionError } = await supabase
      .from("transactions")
      .insert({
        buyer_id,
        seller_id,
        item_id,
        transaction_amount: finalAmount,
        discount_applied: discountApplied,
      });

    if (transactionError) {
      throw new Error("Failed to log transaction.");
    }

    res.status(201).json({ message: "Transaction successful." });
  } catch (error) {
    console.error("Error processing transaction:", error);
    res.status(500).json({ error: "Failed to process transaction." });
  }
};

export { createTransaction };
