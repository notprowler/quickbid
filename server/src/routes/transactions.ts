import express from "express";
import { createTransaction } from "@/controllers/transactions.Controller";

const router = express.Router();

router.post("/", createTransaction);

export default router;
