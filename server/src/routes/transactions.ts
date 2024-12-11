import express from "express";

import {
  newTransaction,
  getTransactionsForCart,
  getTransactionsForProfile,
  ProfileRatingSubmitted,
  CartRatingSubmitted,
  createTransaction,
} from "@/controllers/transactions.Controller";
import { validateAccessToken } from "@/util/JWT";

const router = express.Router();

router.post("/", newTransaction);
router.put(
  "/ProfileRateSubmitted",
  validateAccessToken,
  ProfileRatingSubmitted
);
router.put("/CartRateSubmitted", validateAccessToken, CartRatingSubmitted);
router.get("/cart/user", validateAccessToken, getTransactionsForCart);
router.get("/profile/user", validateAccessToken, getTransactionsForProfile);
router.post("/buy", validateAccessToken, createTransaction);

export default router;
