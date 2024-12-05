import express, { Request, Response } from "express";
import {
  getUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  updateUserRating,
  newUserComment,
  getUserProfile,
} from "@/controllers/users.controller";
import { validateAccessToken } from "@/util/JWT";

const router = express.Router();

router.get("/profile", validateAccessToken, getUserProfile);

router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.put("/status/:id", updateUserStatus);
router.put("/rating/:id", updateUserRating);
router.post("/comment/:id", newUserComment);

export default router;

// GET /api/users/:id - Fetches profile data for a specific user by their ID.
// PUT /api/users/:id - Updates user profile information, such as username or balance. (CRUD: Update)
// DELETE /api/users/:id - Soft-deletes a user’s account (for deactivation or suspension).
