import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const newTransaction: RequestHandler = async (req: Request, res: Response) => {
  const { sellerID, buyerID, itemID, transaction_amount, discount_applied } =
    req.body;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          buyer_id: buyerID,
          seller_id: sellerID,
          item_id: itemID,
          transaction_amount: transaction_amount,
          discount_applied: discount_applied,
        },
      ])
      .select();

    if (error) throw error;
    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const getTransactionsForCart: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`*, listings("*")`)
      .order("created_at", { ascending: false })
      .eq("buyer_id", 28);

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const getTransactionsForProfile: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`*, listings("*")`)
      .order("created_at", { ascending: false })
      .eq("seller_id", 28);

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

/* updating the buyer rating, from user as seller perspective sets rated to true where seller_id is the user */
const ProfileRatingSubmitted: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  const { transaction_id, rated } = req.body;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({rated: rated})
      .eq("seller_id",userId)
      .eq("transaction_id", transaction_id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

/* updating the seller rating, from user as buyer perspective sets rated to true where buyer_id is the user */
const CartRatingSubmitted: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  const { transaction_id, rated } = req.body;

  try {
    const { data, error } = await supabase
      .from("transactions")
      .update({rated : rated})
      .eq("buyer_id", userId)
      .eq("transaction_id", transaction_id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

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

export {
  newTransaction,
  getTransactionsForCart,
  getTransactionsForProfile,
  createTransaction,
  CartRatingSubmitted,
  ProfileRatingSubmitted
};