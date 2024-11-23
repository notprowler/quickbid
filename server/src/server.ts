import express, { Application, Request, Response } from "express";
import 'dotenv';
import listingsRoutes from '@/routes/listings';
import usersRoutes from '@/routes/users'; 

const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!  ");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api/listings', listingsRoutes);
app.use('/api/users', usersRoutes);
