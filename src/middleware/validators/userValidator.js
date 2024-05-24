import { body, validationResult } from "express-validator";

//validator for company creations
export const validateUser = [
  // Validate the 'name' field
  body("name").notEmpty().withMessage("Name is required"),

  // Validate the 'email' field
  body("email").isEmail().withMessage("Invalid email format"),

  // Validate the 'user_type' field (optional)
  body("user_type")
    .optional()
    .isIn(["admin", "user"])
    .withMessage('User type must be either "admin" or "user"'),

  // Validate the 'password' field
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]+$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)"
    ),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation errors exist, return a 400 Bad Request response with the errors
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, proceed to the next middleware
    next();
  },
];

//validator for login for company
export const loginValidator = [
  // Validate the 'email' field
  body("email").isEmail().withMessage("Invalid email format"),

  // Validate the 'password' field
  body("password").notEmpty().withMessage("Password is required"),

  // Handle validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If validation errors exist, return a 400 Bad Request response with the errors
      return res.status(400).json({ errors: errors.array() });
    }
    // If validation passes, proceed to the next middleware
    next();
  },
];
