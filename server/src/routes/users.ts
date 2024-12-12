// server/src/routes/users.ts
import express from "express";
import {
  getUser,
  updateUser,
  updateUserStatus,
  deleteUser,
  updateUserRating,
  CartUserComplaint,
  ProfileUserComplaint,
  getUserProfile,
  getPendingUsers,
  approvePendingUser,
  rejectPendingUser,
  getPendingComplaints,
  getSuspendedAccounts,
} from "@/controllers/users.controller";
import { validateAccessToken } from "@/util/JWT";

const router = express.Router();

router.get("/profile", validateAccessToken, getUserProfile);
router.get("/:id", getUser);
router.get("/application/pending", validateAccessToken, getPendingUsers);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);
router.put("/status/:id", validateAccessToken, updateUserStatus);
router.put("/rating/:id", validateAccessToken, updateUserRating);
router.post("/approve/:id", validateAccessToken, approvePendingUser);
router.post("/reject/:id", validateAccessToken, rejectPendingUser);
router.post(
  "/profile-complaint/:id",
  validateAccessToken,
  ProfileUserComplaint
);
router.post("/cart-complaint/:id", validateAccessToken, CartUserComplaint);
router.get(
  "/application/complaints",
  validateAccessToken,
  getPendingComplaints
);

router.get("/application/suspended", validateAccessToken, getSuspendedAccounts);

export default router;
