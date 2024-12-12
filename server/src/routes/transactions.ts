import express from "express";
import SuspensionPolicy from "@/middlewares/suspension";
import { newTransaction, getTransactionsForCart, getTransactionsForProfile, ProfileRatingSubmitted, CartRatingSubmitted, createTransaction } from "@/controllers/transactions.Controller";
import { validateAccessToken } from "@/util/JWT";

const router = express.Router();

router.post("/", newTransaction);
router.put("/ProfileRateSubmitted", validateAccessToken, SuspensionPolicy, ProfileRatingSubmitted);
router.put("/CartRateSubmitted", validateAccessToken, SuspensionPolicy, CartRatingSubmitted);
router.get("/cart/user", validateAccessToken, SuspensionPolicy, getTransactionsForCart);
router.get("/profile/user", validateAccessToken, SuspensionPolicy, getTransactionsForProfile);
router.post("/buy", validateAccessToken, SuspensionPolicy, createTransaction);

// router.post("/", createTransaction);

export default router;
