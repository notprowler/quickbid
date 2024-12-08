import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import 'dotenv';

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


//@ts-ignore
const createListing: RequestHandler = async (req: Request, res: Response) => {
  const upload = multer({ storage: multer.memoryStorage() }).array('images', 5);
  
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: 'File upload error', details: err.message });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { owner_id, type, title, description, price, category } = req.body;
    
    if (!title || !description || !price || !owner_id || !type || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let imageUrls: string[] = [];

    // Handle image uploads to Supabase storage
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map(async (file) => {
        const fileName = `${owner_id}/${uuidv4()}${path.extname(file.originalname)}`;

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('images') 
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: true
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(fileName);

        return publicUrl;
      });
      imageUrls = await Promise.all(uploadPromises);
    }

    // Default image if no images uploaded
    if (imageUrls.length === 0) {
      imageUrls = ["https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"];
    }

    const status = "active";
    const created_at = new Date().toISOString();

    try {
      const { data, error } = await supabase
        .from("listings")
        .insert([{ title, description, price, owner_id, status, type, category, image: imageUrls }])
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
