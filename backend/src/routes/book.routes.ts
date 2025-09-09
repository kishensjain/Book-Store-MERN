import express from 'express';
import { getAllBooks, createBook, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';
import { adminRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);

router.post("/createBook", adminRoute, createBook);

router.put("/updateBook/:id", adminRoute, updateBook);

router.delete("/deleteBook/:id", adminRoute, deleteBook);

export default router;