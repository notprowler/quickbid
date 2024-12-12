import express from "express";

import {
  newTransaction,
  getTransactionsForCart,
  getTransactionsForProfile,
  ProfileRatingSubmitted,
  CartRatingSubmitted,
  createTransaction,
  getTransactionsForBuyer,
} from "@/controllers/transactions.Controller";
import { validateAccessToken } from "@/util/JWT";
import SuspensionPolicy from "@/middlewares/suspension";

const router = express.Router();

router.post("/", newTransaction);
router.put(
  "/ProfileRateSubmitted",
  validateAccessToken,
  SuspensionPolicy,
  ProfileRatingSubmitted
);
router.put(
  "/CartRateSubmitted",
  validateAccessToken,
  SuspensionPolicy,
  CartRatingSubmitted
);
router.get(
  "/cart/user",
  validateAccessToken,
  SuspensionPolicy,
  getTransactionsForCart
);
router.get(
  "/profile/user",
  validateAccessToken,
  SuspensionPolicy,
  getTransactionsForProfile
);
router.post("/buy", validateAccessToken, SuspensionPolicy, createTransaction);
router.get(
  "/buyer/user",
  validateAccessToken,
  SuspensionPolicy,
  getTransactionsForBuyer
); // Add this route

// router.post("/", createTransaction);

export default router;
