import express, { Application, Request, Response } from "express";

import "dotenv";
import cors from "cors";
import Stripe from "stripe";
// @ts-ignore
import cookieParser from "cookie-parser";
import listingsRoutes from "@/routes/listings";
import usersRoutes from "@/routes/users";
import bidRouter from "@/routes/bids";
import transactionsRouter from "@/routes/transactions";
import transactionsController from "./controllers/transactions.Controller";

import authRouter from "@/routes/auth";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());

app.use(cookieParser());
app.use(express.json());

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

// // Stripe API for adding funds to account
// app.post("/create-payment-intent", async (req, res) => {
//   const { amount } = req.body; // uses amount in cents

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       payment_method_types: ["card"],
//     });

//     res.status(200).json({
//       clientSecret: paymentIntent.client_secret, // Send back the client secret
//     });
//   } catch (error: any) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// });
