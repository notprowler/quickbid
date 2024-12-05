import express from "express";
import { registerVisitor } from "@/controllers/register.controller";
const router = express.Router();

router.post("/", registerVisitor);

export default router;
