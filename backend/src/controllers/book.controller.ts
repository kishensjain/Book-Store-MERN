import { Request, Response } from "express";
import Book, { IBook } from "../models/book.model.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";

export const getAllBooks = async (req: Request, res: Response) => {
  try {
    const books: IBook[] = await Book.find({});
    res.status(200).json(books);
  } catch (error) {
    console.error("Error in getAllBooks controller", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error in getBookById controller", error);
    res.status(500).json({ message: "Error fetching book" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  const {
    title,
    description,
    author,
    publishedDate,
    genre,
    price,
    stock,
    coverImage,
  } = req.body;
  if (
    !title ||
    !description ||
    !author ||
    !genre ||
    price == null ||
    stock == null
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    // Upload to Cloudinary

    let cloudinaryUrl = null;
    if (coverImage) {
      cloudinaryUrl = await cloudinary.uploader.upload(coverImage, {
        folder: "book_covers",
      });
    }

    const newBook = await Book.create({
      title,
      description,
      author,
      publishedDate,
      genre,
      price,
      stock,
      coverImage: cloudinaryUrl?.secure_url,
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error in createBook controller", error);
    res.status(500).json({ message: "Error creating book" });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }

  const {
    title,
    description,
    author,
    publishedDate,
    genre,
    price,
    stock,
    coverImage,
  } = req.body;

  try {
    let updateData: Partial<IBook> = {
      title,
      description,
      author,
      publishedDate,
      genre,
      price,
      stock,
    };

    // If coverImage is provided, upload to Cloudinary
    if (coverImage) {
      const cloudinaryUrl = await cloudinary.uploader.upload(coverImage, {
        folder: "book_covers",
      });
      updateData.coverImage = cloudinaryUrl.secure_url;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true, // return updated document
      runValidators: true, // apply schema validations
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error in updateBook controller", error);
    res.status(500).json({ message: "Error updating book" });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid book ID" });
  }
  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBook controller", error);
    res.status(500).json({ message: "Error deleting book" });
  }
};
