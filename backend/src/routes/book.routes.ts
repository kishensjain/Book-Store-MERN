import express from 'express';
import { getAllBooks, createBook, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';
const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.post("/createBook", createBook);

router.put("/updateBook/:id", updateBook);

router.delete("/deleteBook/:id", deleteBook);

export default router;