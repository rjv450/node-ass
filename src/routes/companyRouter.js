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

router.post("/register", validateUser, registerCompany);
router.post("/login", loginValidator, companyLogin);

export default router;
