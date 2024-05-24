import { body } from "express-validator";
import path from "path";

// Define validation rules for product input
export const productValidationRules = [
  // Validate that the 'name' field is not empty
  body("name").notEmpty().withMessage("Name is required"),

  // Validate that the 'description' field is not empty
  body("description").notEmpty().withMessage("Description is required"),

  // Custom validation for the 'productImage' field
  body("productImage").custom((value, { req }) => {
    // Check if a file is uploaded
    if (!req.file) {
      throw new Error("Product image is required");
    }

    // Define allowed file types using regular expression
    const fileTypes = /jpeg|jpg|png/;

    // Check if the file extension matches the allowed types
    const extname = fileTypes.test(
      path.extname(req.file.originalname).toLowerCase()
    );

    // Check if the MIME type matches the allowed types
    const mimeType = fileTypes.test(req.file.mimetype);

    // If either the file extension or MIME type check fails, throw an error
    if (!extname || !mimeType) {
      throw new Error("Only images are allowed (jpeg, jpg, png)");
    }

    // If all checks pass, return true to indicate successful validation
    return true;
  }),
];
