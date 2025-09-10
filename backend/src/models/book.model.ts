import mongoose from "mongoose";

export interface IBook extends mongoose.Document {
  title: string;
  description: string;
  author: string;
  publishedDate: Date;
  genre: string[];
  price: number;
  stock: number;
  coverImage?: string;
}

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    publishedDate: { type: Date },
    pages : { type: Number, min: 1 },
    genre: { type: [String], required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    coverImage: { type: String },
  },
  { timestamps: true }
);

bookSchema.index({ title: 1, author: 1, genre: 1 });

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
