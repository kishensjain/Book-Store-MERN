import { Request, Response } from "express";
import Book, { IBook } from "../models/book.model.js";
import mongoose from "mongoose";

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
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid book ID"});
    }
    try{
        const book = await Book.findById(id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        res.status(200).json(book);
    }catch(error){
        console.error("Error in getBookById controller", error);
        res.status(500).json({message: "Error fetching book"});
    }
};

export const createBook = async (req: Request, res: Response) => {};

export const updateBook = async (req: Request, res: Response) => {};

export const deleteBook = async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({message: "Invalid book ID"});
    }
    try{
        const book = await Book.findByIdAndDelete(id);
        if(!book){
            return res.status(404).json({message: "Book not found"});
        }
        res.status(200).json({message: "Book deleted successfully"});
    }catch(error){
        console.error("Error in deleteBook controller", error);
        res.status(500).json({message: "Error deleting book"});
    }
};
