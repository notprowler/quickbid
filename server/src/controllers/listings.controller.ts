import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import "dotenv";

const getListings: RequestHandler = async (req: Request, res: Response) => {
  const { category, minPrice, maxPrice } = req.query;

  try {
    let query = supabase
      .from("listings")
      .select("*")
      .neq("status", "sold")
      .neq("status", "pending");

    if (category && category !== "All") {
      query = query.eq("category", category);
    }
    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }

    const { data, error } = await query;

    if (error) {
      throw res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getProductInformation: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid or missing listing ID" });
    return;
  }

  const parsedId = Number(id);

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("item_id", parsedId)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const removeProduct: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }

  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    res.status(400).json({ error: "Invalid or missing listing ID" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .delete()
      .eq("item_id", id)
      .select();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: "Listing not found" });
      return;
    }

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const getProfileListings: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("owner_id", userId)
      .select();

    if (error) {
      throw error;
    }

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

//@ts-ignore
const createListing: RequestHandler = async (req: Request, res: Response) => {
  const upload = multer({ storage: multer.memoryStorage() }).array("images", 5);

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "File upload error", details: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    // console.log('Request body:', req.body);
    // console.log('Request files:', req.files);

    const owner_id = req.user?.user_id;

    const { type, title, description, price, category } = req.body;

    if (!title || !description || !price || !owner_id || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrls: string[] = [];

    // Handle image uploads to Supabase storage
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `${owner_id}/${uuidv4()}${path.extname(
          file.originalname
        )}`;

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileName);

        return publicUrl;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    // Default image if no images uploaded
    if (imageUrls.length === 0) {
      imageUrls = [
        "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg",
      ];
    }

    const status = "active";
    const created_at = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([
          {
            title,
            description,
            price,
            owner_id,
            status,
            type,
            category,
            image: imageUrls,
          },
        ])
        .select();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json(data);
    } catch (err) {
      return res.status(500).json({ error: "An unexpected error occurred" });
    }
  });
};

const approveListing: RequestHandler = async (req, res) => {
  const userId = req.user?.user_id; // Seller's ID
  const { id: item_id } = req.params; // Listing ID

  if (!userId || !item_id) {
    res.status(400).json({ error: "Invalid User or Listing ID." });
    return;
  }

  try {
    // Fetch the pending transaction for the item
    const { data: pendingTransaction, error: pendingError } = await supabase
      .from("transactions")
      .select("transaction_id, buyer_id, transaction_amount, discount_applied")
      .eq("item_id", item_id)
      .eq("status", "pending") // Ensure it's a pending transaction
      .single();

    if (pendingError || !pendingTransaction) {
      throw new Error("Pending transaction not found.");
    }

    const { transaction_id, buyer_id, transaction_amount, discount_applied } =
      pendingTransaction;

    // Mark the transaction as completed
    const { error: transactionUpdateError } = await supabase
      .from("transactions")
      .update({ status: "completed" })
      .eq("transaction_id", transaction_id);

    if (transactionUpdateError) {
      throw transactionUpdateError;
    }

    // Mark the listing as sold
    const { error: listingUpdateError } = await supabase
      .from("listings")
      .update({ status: "sold" })
      .eq("item_id", item_id);

    if (listingUpdateError) {
      throw listingUpdateError;
    }

    res
      .status(200)
      .json({ message: "Listing approved and transaction completed." });
  } catch (err) {
    console.error("Error approving listing:", err);
    res.status(500).json({ error: "Failed to approve listing." });
  }
};

const rejectListing: RequestHandler = async (req, res) => {
  const userId = req.user?.user_id; // Seller's ID
  const { id: item_id } = req.params; // Listing ID

  if (!userId || !item_id) {
    res.status(400).json({ error: "Invalid User or Listing ID." });
    return;
  }

  try {
    // Delete the pending transaction
    const { error: transactionDeleteError } = await supabase
      .from("transactions")
      .delete()
      .eq("item_id", item_id)
      .eq("status", "pending");

    if (transactionDeleteError) {
      throw transactionDeleteError;
    }

    // Reset the listing status to active
    const { error: listingUpdateError } = await supabase
      .from("listings")
      .update({ status: "active" })
      .eq("item_id", item_id);

    if (listingUpdateError) {
      throw listingUpdateError;
    }

    res.status(200).json({ message: "Listing rejected and reset to active." });
  } catch (err) {
    console.error("Error rejecting listing:", err);
    res.status(500).json({ error: "Failed to reject listing." });
  }
};

export default {
  getProductInformation,
  getListings,
  getProfileListings,
  createListing,
  removeProduct,
  approveListing,
  rejectListing,
};
