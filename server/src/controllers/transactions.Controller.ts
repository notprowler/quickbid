import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";
import {
  checkVIPStatus,
  applyVIPDiscount,
  demoteVIP,
  promoteToVIP,
} from "../util/VIP";

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
      .eq("buyer_id", userId);

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
      .eq("seller_id", userId);

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
      .update({ rated: rated })
      .eq("seller_id", userId)
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
      .update({ rated: rated })
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
  const buyer_id = req.user?.user_id; // Get buyer ID from the authenticated user's session
  const { seller_id, item_id, transaction_amount } = req.body;

  if (!buyer_id || !seller_id || !item_id || !transaction_amount) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    console.log("Fetching buyer data...");
    const { data: buyerData, error: buyerError } = await supabase
      .from("users")
      .select("balance, vip")
      .eq("user_id", buyer_id)
      .single();

    if (buyerError || !buyerData) {
      console.error(
        "Error fetching buyer:",
        buyerError?.message || "Not found"
      );
      res.status(404).json({ error: "Buyer not found." });
      return;
    }

    const { balance: buyerBalance, vip: is_vip } = buyerData;

    console.log("Fetching seller data...");
    const { data: sellerData, error: sellerError } = await supabase
      .from("users")
      .select("balance")
      .eq("user_id", seller_id)
      .single();

    if (sellerError || !sellerData) {
      console.error(
        "Error fetching seller:",
        sellerError?.message || "Not found"
      );
      res.status(404).json({ error: "Seller not found." });
      return;
    }

    const { balance: sellerBalance } = sellerData;

    // Apply VIP discount if applicable
    const discountApplied = is_vip; // VIP status from backend check
    const finalAmount = discountApplied
      ? transaction_amount * 0.85 // Apply 15% discount
      : transaction_amount;

    if (buyerBalance < finalAmount) {
      console.error("Buyer has insufficient balance.");
      res.status(400).json({ error: "Insufficient balance." });
      return;
    }

    console.log("Updating buyer's balance...");
    const { error: buyerUpdateError } = await supabase
      .from("users")
      .update({ balance: buyerBalance - finalAmount })
      .eq("user_id", buyer_id);

    if (buyerUpdateError) {
      console.error(
        "Error during buyer balance update:",
        buyerUpdateError.message
      );
      throw new Error("Failed to update buyer's balance.");
    }

    console.log("Updating seller's balance...");
    const { error: sellerUpdateError } = await supabase
      .from("users")
      .update({ balance: sellerBalance + finalAmount })
      .eq("user_id", seller_id);

    if (sellerUpdateError) {
      console.error(
        "Error during seller balance update:",
        sellerUpdateError.message
      );
      throw new Error("Failed to update seller's balance.");
    }

    console.log("Marking item as sold...");
    const { error: markSoldError } = await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("item_id", item_id);

    if (markSoldError) {
      console.error("Error marking item as sold:", markSoldError.message);
      throw new Error("Failed to mark item as sold.");
    }

    console.log("Logging transaction...");
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
      console.error("Error logging transaction:", transactionError.message);
      throw new Error("Failed to log transaction.");
    }

    // Check if the user should be demoted from VIP status
    await demoteVIP(buyer_id);

    // Check if we should promote the user to VIP status
    await promoteToVIP(buyer_id);

    res.status(201).json({ message: "Transaction successful." });
  } catch (error) {
    console.error("Error processing transaction:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to process transaction." });
    }
  }
};

export {
  newTransaction,
  getTransactionsForCart,
  getTransactionsForProfile,
  createTransaction,
  CartRatingSubmitted,
  ProfileRatingSubmitted,
};
