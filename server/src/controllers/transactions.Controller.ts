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

const getTransactionsForProfile: RequestHandler = async (req, res) => {
  const userId = req.user?.user_id;
  console.log(userId);

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`*, listings(*)`)
      .order("created_at", { ascending: false })
      .eq("seller_id", userId)
      .in("listings.status", ["sold", "pending"]); // Include pending status

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("Error fetching transactions for profile:", e);
    res
      .status(500)
      .json({ error: "Failed to fetch transactions for profile." });
  }
};

const getTransactionsForBuyer: RequestHandler = async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Unauthorized User" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select(`*, listings(*)`)
      .order("created_at", { ascending: false })
      .eq("buyer_id", userId)
      .in("listings.status", ["sold", "pending"]); // Include pending status

    if (error) throw error;

    res.status(200).json(data);
  } catch (e) {
    console.error("Error fetching transactions for buyer:", e);
    res.status(500).json({ error: "Failed to fetch transactions for buyer." });
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
  const buyer_id = req.user?.user_id; // Get buyer ID from authenticated user's session
  const { seller_id, item_id, transaction_amount } = req.body;

  if (!buyer_id || !seller_id || !item_id || !transaction_amount) {
    res.status(400).json({ error: "All fields are required." });
    return;
  }

  try {
    // Create a pending transaction
    const { data, error: transactionError } = await supabase
      .from("transactions")
      .insert([
        {
          buyer_id,
          seller_id,
          item_id,
          transaction_amount,
          discount_applied: false, // Set as false initially, calculate later if required
        },
      ])
      .select();

    if (transactionError) {
      throw new Error(transactionError.message);
    }

    // Check if the user should be demoted from VIP status
    await demoteVIP(buyer_id);

    // Check if we should promote the user to VIP status
    await promoteToVIP(buyer_id);

    // Update the listing to pending status
    const { error: listingUpdateError } = await supabase
      .from("listings")
      .update({ status: "pending" })
      .eq("item_id", item_id);

    if (listingUpdateError) {
      throw new Error("Failed to update listing status.");
    }

    res.status(200).json({
      message: "Transaction created and listing marked as pending.",
      transaction: data,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction." });
  }
};

export {
  newTransaction,
  getTransactionsForCart,
  getTransactionsForProfile,
  createTransaction,
  CartRatingSubmitted,
  ProfileRatingSubmitted,
  getTransactionsForBuyer,
};
