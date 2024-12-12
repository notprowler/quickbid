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
  LiftUserSuspension,
  AccountTerminationRequest,

} from "@/controllers/users.controller";
import { validateAccessToken } from "@/util/JWT";
import SuspensionPolicy from "@/middlewares/suspension";

const router = express.Router();

router.get("/profile", validateAccessToken, SuspensionPolicy, getUserProfile);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);
router.put("/:id", updateUser);

router.put("/status/:id", updateUserStatus);

/* Pending user form and SUPER USER responses*/
router.get(
  "/application/pending",
  validateAccessToken,
  SuspensionPolicy,
  getPendingUsers
);
router.post("/approve/:id", validateAccessToken, approvePendingUser);
router.post("/reject/:id", validateAccessToken, rejectPendingUser);
router.post(
  "/termination/:id",
  validateAccessToken,
  SuspensionPolicy,
  AccountTerminationRequest
);

/* Complaints and Rating*/
router.put(
  "/rating/:id",
  validateAccessToken,
  SuspensionPolicy,
  updateUserRating
);
router.post(
  "/profile-complaint/:id",
  validateAccessToken,
  SuspensionPolicy,
  ProfileUserComplaint
);
router.post(
  "/cart-complaint/:id",
  validateAccessToken,
  SuspensionPolicy,
  CartUserComplaint
);
router.put("/rating/:id", validateAccessToken, SuspensionPolicy, updateUser);

/* User's status */
router.put("/status/:id", validateAccessToken, updateUserStatus);
router.put(
  "/lift-suspension/:id",
  validateAccessToken,
  SuspensionPolicy,
  LiftUserSuspension
);
router.get("/application/suspended", validateAccessToken, getSuspendedAccounts);

router.get(
  "/application/complaints",
  validateAccessToken,
  getPendingComplaints
);


export default router;
