import express, { Application, Request, Response } from "express";
import "dotenv";
import listingsRoutes from "@/routes/listings";
import usersRoutes from "@/routes/users";
import bidRouter from "@/routes/bids";

import authRouter from "@/routes/auth";

const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;

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

app.use("/auth", authRouter);
