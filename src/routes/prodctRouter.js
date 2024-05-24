import express from "express";
import upload from "../middleware/uploadFile.js";
import { validateCompany } from "../middleware/validateAuth.js";
import { addProduct } from "../controllers/productController.js";
import { productValidationRules } from "../middleware/validators/productValidator.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.post(
  "/add",
  validateCompany,
  upload.single("productImage"),
  productValidationRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addProduct
);

export default router;
