import { validationResult } from "express-validator";
import connectDB, { closeConnection } from "../config/dbConfig.js";
import ProductModel from "../models/Product.js";

// Function to handle adding a new product
export const addProduct = async (req, res) => {
  let mainDBConnection;
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract name and description from the request body
    const { name, description } = req.body;

    // Check if a file is uploaded and get the file path
    const productImage = req.file ? req.file.path : null;

    // Get the database name from the company information in the request
    const dbBase = req.company.dbName;

    // Connect to the database using the company database configuration
    mainDBConnection = await connectDB(dbBase);

    // Retrieve the Product model from the database connection
    const Product = ProductModel(mainDBConnection);

    // Create a new product record in the database
    const company = await Product.create({
      name,
      description,
      images: productImage,
    });

    // Return a 201 response with the created product details
    res.status(201).json({
      name: company.name,
      description: company.description,
      images: company.images,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    // Return a 400 response if there is an error during the process
    res.status(400).json({ error: "Bad request" });
  } finally {
    // Ensure the database connection is closed to avoid resource leaks
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
