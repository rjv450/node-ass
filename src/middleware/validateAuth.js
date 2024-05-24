import connectDB, { closeConnection } from "../config/dbConfig.js";
import CompanyModel from "./../models/Company.js";
import jwt from "jsonwebtoken";

// Middleware function to validate the company based on the JWT token
export const validateCompany = async (req, res, next) => {
  let mainDBConnection; // Variable to store the main database connection
  try {
    // Checking if Authorization header is present in the request
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header is missing" });
    }

    // Extracting the JWT token from the Authorization header
    const token = req.headers.authorization.split(" ")[1];

    // Verifying and decoding the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Extracting the company ID from the decoded token
    const companyId = decodedToken.companyId;

    // Connecting to the main database
    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection); // Creating a Company model instance
    // Finding the company in the database based on the company ID and status
    const company = await Company.findOne({
      where: {
        id: companyId,
        status: "active",
      },
    });

    // If company is not found, return error
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Adding the company object to the request for further processing
    req.company = company;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error validating company:", error);
    return res.status(401).json({ message: "Unauthorized" });
  } finally {
    // Closing the main database connection after processing
    if (mainDBConnection) {
      try {
        await closeConnection(mainDBConnection.config["database"]);
      } catch (error) {
        console.error("Error closing connection:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  }
};
