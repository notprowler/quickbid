import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

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
  const { id } = req.body;

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("item_id", id)
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
    }

    if (!data) {
      res.status(404).json({ error: "Listing not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const createListing: RequestHandler = async (req: Request, res: Response) => {
  //TODO
};

export default {
  getListing,
  getListings,
  createListing,
};
