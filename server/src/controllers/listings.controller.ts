import supabase from "@/config/database";
import type { NextFunction, Request, RequestHandler, Response } from "express";

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

const getProductInformation: RequestHandler = async (req: Request, res: Response) => {
  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }
  const { id }  = req.params

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

  const { id }  = req.params

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

}


const getProfileListings: RequestHandler = async (req: Request, res: Response) => {
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

    if (error) {throw error};

    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const createListing: RequestHandler = async (req: Request, res: Response) => {
  //TODO
};

export {
  getProductInformation,
  getListings,
  getProfileListings,
  createListing,
  removeProduct
};
