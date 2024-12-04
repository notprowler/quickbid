import express from "express";
import transactionsController from "@/controllers/transactions.Controller";

const router = express.Router();

router.post("/:id", transactionsController.newTransaction);
router.get("/buyer/:id", transactionsController.getTransactionsForBuyer);
router.get("/seller/:id", transactionsController.getTransactionsForSeller);

export default router;
