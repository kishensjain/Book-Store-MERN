import express from 'express';
import { getAllBooks } from '../controllers/book.controller.js';
const router = express.Router();

router.get("/", getAllBooks); //need to add auth middleware here later

export default router;