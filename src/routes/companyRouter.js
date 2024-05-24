import express from "express";
import {
  loginValidator,
  validateUser,
} from "../middleware/validators/userValidator.js";
import {
  companyLogin,
  registerCompany,
} from "../controllers/companyController.js";

const router = express.Router();
// Register a new company
router.post("/register", validateUser, registerCompany);

// Login a company
router.post("/login", loginValidator, companyLogin);

export default router;
