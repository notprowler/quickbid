import supabase from "@/config/database";
import type { Request, RequestHandler, Response } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
  const userRole = req.user?.role; // Assuming validateAccessToken middleware sets req.user

  // Ensure the request is made by an Admin
  if (userRole !== "Admin") {
    res.status(403).json({ error: "Forbidden: Admin access required." });
    return;
  }

  const { id } = req.params; // Get user ID from request parameters

  // Validate ID presence
  if (!id) {
    res.status(400).json({ error: "User ID is required." });
    return;
  }

  try {
    // Update the user's status to 'active' in the 'users' table
    const { data, error } = await supabase
      .from("users")
      .update({ status: "active" }) // Change status to 'active'
      .eq("user_id", id) // Match the specific user by ID
      .select(); // Return updated data for verification

    // Handle database errors
    if (error) {
      console.error("Database Error:", error);
      res
        .status(500)
        .json({ error: `Failed to update user status: ${error.message}` });
      return;
    }

    // Handle case where no rows are updated (e.g., user not found)
    if (!data || data.length === 0) {
      res.status(404).json({ error: "User not found or already active." });
      return;
    }

    // Respond with success message
    res
      .status(200)
      .json({ message: "User status updated successfully.", data });
  } catch (err) {
    console.error("Unexpected Error in updateUserStatus:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

/* 
Helper to update average ratings column after new update:

Formula: (1 * a + 2 * b + 3 * c + 4 * d + 5 * e) / R WHERE
a, b, c, d, e = number of ratings corresponding to 1-5 AND R = ratings
*/
const updateAverageRating: (userRatings: any) => Promise<void> = async (
  userRatings
) => {
  const R =
    userRatings.one_ratings +
    userRatings.two_ratings +
    userRatings.three_ratings +
    userRatings.four_ratings +
    userRatings.five_ratings;

  const sum =
    (1 * userRatings.one_ratings +
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
          status: "pending",
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
          status: "pending",
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

const getPendingUsers: RequestHandler = async (req, res) => {
  console.log("User Role:", req.user?.role);

  if (req.user?.role !== "Admin") {
    res.status(403).json({ error: "Forbidden: Super-user access required." });
    return;
  }

  try {
    const statusFilter = "pending"; // Explicitly define the filter
    console.log("Executing query with filter: status =", statusFilter);

    const { data, error } = await supabase
      .from("pending_users")
      .select("*")
      .filter("status::text", "eq", "pending"); // Force `status` to text

    console.log("Supabase Response Data:", data);
    console.log("Supabase Response Error:", error);

    if (error) {
      res
        .status(500)
        .json({ error: `Database query failed: ${error.message}` });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected Error in getPendingUsers:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// approve a pending user
const approvePendingUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userRole = req.user?.role;

  if (userRole !== "Admin") {
    res.status(403).json({ error: "Forbidden: Super-user access required." });
    return;
  }

  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: "User ID is required." });
    return;
  }

  try {
    // Fetch the pending user
    const { data: pendingUser, error: fetchError } = await supabase
      .from("pending_users")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !pendingUser) {
      res.status(404).json({ error: "Pending user not found." });
      return;
    }

    // Insert the user into the 'users' table
    const { error: insertError } = await supabase.from("users").insert({
      username: pendingUser.username,
      email: pendingUser.email,
      password_hash: pendingUser.password_hash,
      full_name: pendingUser.full_name,
      address: pendingUser.address,
      role: "user", // Default role
      status: "active",
      created_at: new Date().toISOString(),
      vip: false,
      balance: 0,
      average_rating: null,
    });

    if (insertError) {
      res
        .status(500)
        .json({ error: "Error inserting user into 'users' table." });
      return;
    }

    // Remove the user from 'pending_users'
    const { error: deleteError } = await supabase
      .from("pending_users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      res
        .status(500)
        .json({ error: "Error deleting user from 'pending_users' table." });
      return;
    }

    res.status(200).json({ message: "User approved successfully." });
  } catch (err) {
    console.error("Error approving user:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// reject pending User
const rejectPendingUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  // Verify the ID is provided
  if (!id) {
    res.status(400).json({ error: "User ID is required." });
    return; // Explicit return
  }

  try {
    // Delete the user from the pending_users table
    const { error: deleteError } = await supabase
      .from("pending_users")
      .delete()
      .eq("id", id);

    if (deleteError) {
      res.status(500).json({
        error: `Failed to delete pending user: ${deleteError.message}`,
      });
      return;
    }

    res.status(200).json({ message: "User rejected successfully." });
  } catch (err) {
    console.error("Error rejecting user:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// get pending complaints
const getPendingComplaints: RequestHandler = async (req, res) => {
  console.log("User Role:", req.user?.role);

  if (req.user?.role !== "Admin") {
    res.status(403).json({ error: "Forbidden: Super-user access required." });
    return;
  }

  try {
    const statusFilter = "pending"; // Explicitly define the filter
    console.log("Executing query with filter: status =", statusFilter);

    const { data, error } = await supabase
      .from("complaints")
      .select("*")
      .filter("status::text", "eq", "pending"); // Force `status` to text

    console.log("Supabase Response Data:", data);
    console.log("Supabase Response Error:", error);

    if (error) {
      res
        .status(500)
        .json({ error: `Database query failed: ${error.message}` });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected Error in getPendingUsers:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};

// get all suspended accounts
const getSuspendedAccounts: RequestHandler = async (req, res) => {
  console.log("User Role:", req.user?.role);

  if (req.user?.role !== "Admin") {
    res.status(403).json({ error: "Forbidden: Super-user access required." });
    return;
  }

  try {
    const statusFilter = "suspended"; // Explicitly define the filter
    console.log("Executing query with filter: status =", statusFilter);

    // Include 'id' explicitly in the select statement
    const { data, error } = await supabase
      .from("users")
      .select("user_id, username, email, address, status, created_at") // Add 'id' here
      .filter("status::text", "eq", "suspended"); // Filter by suspended status

    console.log("Supabase Response Data:", data);
    console.log("Supabase Response Error:", error);

    if (error) {
      res
        .status(500)
        .json({ error: `Database query failed: ${error.message}` });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Unexpected Error in getSuspendedAccounts:", err);
    res.status(500).json({ error: "Internal server error." });
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
  getPendingUsers,
  approvePendingUser,
  rejectPendingUser,
  getPendingComplaints,
  getSuspendedAccounts,
};
