import express, { Application, Request, Response } from "express";

import "dotenv";
import cors from "cors";
// @ts-ignore
import cookieParser from "cookie-parser";
import multer from "multer";

import listingsRoutes from "@/routes/listings";
import usersRoutes from "@/routes/users";
import bidRouter from "@/routes/bids";
import transactionsRouter from "@/routes/transactions";
import registerRoutes from "@/routes/register";
import authRouter from "@/routes/auth";
import paymentRoutes from "@/routes/payments";
import chatbotRouter from "@/routes/chatbot";

const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// const upload = multer({ storage: multer.memoryStorage() });
// app.use(upload.any());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!  ");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

/* Auth middleware for U actions (TO DO) */

app.use("/api/listings", listingsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/bids", bidRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/auth", authRouter);

app.use("/api/visitors/register", registerRoutes);

app.use("/api/payments", paymentRoutes);
app.use('/api/chatbot', chatbotRouter); 
