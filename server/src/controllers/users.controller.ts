import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";

const getUserProfile: RequestHandler = async (req, res) => {
  console.log("Accessed /profile endpoint");
  const userId = req.user?.user_id; // Check JWT payload structure

  console.log("Authenticated User ID:", userId);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized. User ID is required." });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("user_id, username, email, vip, balance, average_rating") // MIGHT ADD MORE FIELDS HERE LATER
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Supabase Error:", error);
      res.status(500).json({ error: "Failed to fetch user profile." });
      return;
    }

    console.log("Fetched User Data:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

const getUser: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({
        error: `${e.message}, returning empty data for user`,
        data: {},
      });
    } else if (typeof e === "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};

const updateUser: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  const newInfo = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update(newInfo)
      .eq("user_id", id)
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

const deleteUser: RequestHandler = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", id)
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

/* Only soft delete option we have for TS */
const updateUserStatus: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ status })
      .eq("user_id", id)
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

/* 
Helper to update average ratings column after new update:

Formula: (1 * a + 2 * b + 3 * c + 4 * d + 5 * e) / R WHERE
a, b, c, d, e = number of ratings corresponding to 1-5 AND R = ratings
*/
const updateAverageRating: (userRatings: any) => Promise<void> = async ( userRatings ) => {
  const R =
    userRatings.one_ratings +
    userRatings.two_ratings +
    userRatings.three_ratings +
    userRatings.four_ratings +
    userRatings.five_ratings;

  const sum = (1 * userRatings.one_ratings +
      2 * userRatings.two_ratings +
      3 * userRatings.three_ratings +
      4 * userRatings.four_ratings +
      5 * userRatings.five_ratings) /
    R;

  const { data, error } = await supabase
    .from("users")
    .update({ average_rating: parseFloat(sum.toFixed(1)) })
    .eq("user_id", userRatings.user_id);

  if (error) throw new Error(`${error.message}`);
};

const updateUserRating: RequestHandler = async (
  req: Request,
  res: Response
) => {

  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }

  const { id } = req.params;
  const { rating } = req.body;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  const mapColumns: Record<number, string> = {
    1: "one_ratings",
    2: "two_ratings",
    3: "three_ratings",
    4: "four_ratings",
    5: "five_ratings",
  };

  if (!mapColumns[rating]) {
    res.status(400).json({ error: "Please provide a value ranged from 1-5" });
    return;
  }

  try {
    const { data, error } = await supabase.rpc("increment_rating", {
      column_name: mapColumns[rating],
      user_id: parseInt(id, 10),
    });

    if (error) throw error;

    if (!data) {
      res.status(500).json({ error: "Error updating row" });
      return;
    }
    updateAverageRating(data);
    res.status(200).send(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e == "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};


const ProfileUserComplaint: RequestHandler = async (
  req: Request,
  res: Response
) => {

  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }
  
  const { id } = req.params;
  const { complaints, transaction_id } = req.body;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  try {
    const { data, error } = await supabase

      .from("complaints")
      .insert([
        {
          complaints,
          transaction_id,
          buyer_id: parseInt(id, 10),
          seller_id: userId,
          status: "pending"
        },
      ])
      .select();

    if (error) throw error;

    if (!data) {
      res.status(500).json({ error: "Error updating row" });
      return;
    }
    res.status(200).send(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e == "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};


const CartUserComplaint: RequestHandler = async (
  req: Request,
  res: Response
) => {

  const userId = req.user?.user_id;

  if (!userId) {
    res.status(400).json({ error: "Invalid User ID" });
    return;
  }
  
  const { id } = req.params;
  const { complaints, transaction_id } = req.body;

  if (!id) {
    res.status(400).json({ error: "Please provide a User ID" });
    return;
  }

  try {
    const { data, error } = await supabase

      .from("complaints")
      .insert([
        {
          complaints,
          transaction_id,
          buyer_id: userId,
          seller_id: parseInt(id, 10),
          status: "pending"
        },
      ])
      .select();

    if (error) throw error;

    if (!data) {
      res.status(500).json({ error: "Error updating row" });
      return;
    }
    res.status(200).send(data);
  } catch (e) {
    if (e instanceof Error) {
      res.status(500).json({ error: `${e.message}` });
    } else if (typeof e == "object" && e !== null && "message" in e) {
      res.status(500).json({ error: `${e.message}` });
    }
  }
};



export {
  getUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  updateUserRating,
  ProfileUserComplaint,
  CartUserComplaint,
  getUserProfile,
};
