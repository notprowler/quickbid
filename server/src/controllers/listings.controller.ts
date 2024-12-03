import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const getListings: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("listings").select("*");

    if (error) {
      res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

const getListing: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("owner_id", id)
      .select();

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
