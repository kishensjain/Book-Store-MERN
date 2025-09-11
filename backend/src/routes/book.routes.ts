import express from 'express';
import { getAllBooks, createBook, getBookById, updateBook, deleteBook } from '../controllers/book.controller.js';
import { adminRoute,authMiddleware } from '../middlewares/auth.middleware.js';
import { upload } from '../config/multer.js';   

const router = express.Router();

router.get("/", getAllBooks);
router.get("/:id", getBookById);


router.post("/createBook", authMiddleware,adminRoute, upload.single("coverImage"), createBook);

router.put("/updateBook/:id", authMiddleware,adminRoute, upload.single("coverImage"), updateBook);

router.delete("/deleteBook/:id", authMiddleware,adminRoute, deleteBook);

export default router;