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
  const { title, description, author, publishedDate, genre, price, stock } = req.body;

  if (!title || !description || !author || !genre || price == null || stock == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Convert genre string to array if necessary
  const genreArray = typeof genre === "string" ? genre.split(",").map(g => g.trim()) : genre;

  try {
    let coverImageUrl: string | undefined;

    if (req.file) {
      coverImageUrl = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "book_covers" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result?.secure_url as string);
          }
        );
        stream.end(req.file?.buffer);
      });
    }

    const newBook = await Book.create({
      title,
      description,
      author,
      publishedDate,
      genre: genreArray,
      price,
      stock,
      coverImage: coverImageUrl,
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

  const {title,description,author,publishedDate,genre, price,stock} = req.body;

  let genreArray : string[];
  if(typeof genre === "string"){
    genreArray = genre.split(",").map((g:string) => g.trim());
  } else {
    genreArray = genre;
  }

  try{
    const book = await Book.findById(id);
    if(!book) return res.status(404).json({message:"Book not found"});

    if(req.file?.buffer){
      if(book.coverImage?.public_id){
        await cloudinary.uploader.destroy(book.coverImage.public_id);
      }
      
      //upload new image
      const result = await new Promise<any>((resolve,reject)=>{
        const stream = cloudinary.uploader.upload_stream(
          {folder:"book_covers"},
          (error, result) =>{
            if(error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file?.buffer);
      });

      book.coverImage = {
        url : result.secure_url,
        public_id:result.public_id
      };
    }

    // Update other fields
    book.title = title || book.title;
    book.description = description || book.description;
    book.author = author || book.author;
    book.publishedDate = publishedDate || book.publishedDate;
    book.genre = genreArray || book.genre;
    book.price = price || book.price;
    book.stock = stock || book.stock;

    await book.save();
    res.status(200).json(book);
  }catch (error) {
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
    // Delete cover image from Cloudinary
    if (book.coverImage?.public_id) {
      await cloudinary.uploader.destroy(book.coverImage.public_id);
    }

    await book.deleteOne();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBook controller", error);
    res.status(500).json({ message: "Error deleting book" });
  }
};
