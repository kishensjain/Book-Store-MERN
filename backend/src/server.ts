import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { connectDB } from './config/db.js';
import cookieParser from "cookie-parser";

import authRoutes from './routes/auth.routes.js';
import bookRoutes from './routes/book.routes.js';
import cartRoutes from './routes/cart.routes.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/books/", bookRoutes);
app.use("/api/cart/", cartRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});