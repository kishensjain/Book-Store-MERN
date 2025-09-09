import {Request, Response} from 'express';
import Book, { IBook } from '../models/book.model.js';

export const getAllBooks = async (req: Request, res: Response) => {
    try{
        const books: IBook[] = await Book.find({});
        res.status(200).json(books);
    }catch(error){
        console.error("Error in getAllBooks controller", error);
        res.status(500).json({ message: "Error fetching books" });
    }
}