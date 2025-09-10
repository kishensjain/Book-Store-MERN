import express from 'express';
import { getAllBooks, createBook, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';
import { adminRoute,authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);


router.post("/createBook", authMiddleware,adminRoute, createBook);

router.put("/updateBook/:id", authMiddleware,adminRoute, updateBook);

router.delete("/deleteBook/:id", authMiddleware,adminRoute, deleteBook);

export default router;