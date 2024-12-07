import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const getListings: RequestHandler = async (req: Request, res: Response) => {
  const { category, minPrice, maxPrice } = req.query;

  try {
    let query = supabase.from("listings").select("*");

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

const getListing: RequestHandler = async (req: Request, res: Response) => {

  const id = req.params.id; // `req.params` contains route parameters

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
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const upload = multer({ storage: multer.memoryStorage() });

const createListing: RequestHandler = async (req: Request, res: Response) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Image upload failed" });
    }

    const { owner_id, type, title, description, price, category } = req.body;

    if (!title || !description || !price || !owner_id || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrl = "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"; // Placeholder value

    if (req.file) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${uuidv4()}`, req.file.buffer, {
          cacheControl: "3600",
          upsert: false,
          contentType: req.file.mimetype,
        });

      if (error) {
        return res.status(500).json({ error: "Image upload to storage failed" });
      }

      imageUrl = data?.Key ? `https://your-supabase-url/storage/v1/object/public/images/${data.Key}` : imageUrl;
    }

    const status = "active";
    const created_at = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([{ title, description, price, owner_id, status, type, category, image: imageUrl }])
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

export default {
  getListing,
  getListings,
  createListing,
};
