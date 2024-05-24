import express from "express";
import upload from "../middleware/uploadFile.js";
import { validateCompany } from "../middleware/validateAuth.js";
import { addProduct } from "../controllers/productController.js";

const router = express.Router();

router.post("/add", validateCompany, upload.single("ProductImage"), addProduct);

export default router;
