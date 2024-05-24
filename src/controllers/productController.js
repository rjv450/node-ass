import connectDB from "../config/dbConfig.js";
import ProductModel from "../models/Product.js";

// Function to add a new product
export const addProduct = async (req, res) => {
  let mainDBConnection;
  try {
    const { name, description } = req.body;
    const productImage = req.file ? req.file.path : null;
    const dbBase = req.company.dbName;

    // Establishing connection to the main database
    mainDBConnection = await connectDB(dbBase);

    // Creating a Product model instance using the main database connection
    const Product = ProductModel(mainDBConnection);

    // Creating a new product record in the database
    const company = await Product.create({
      name,
      description,
      productImage,
    });

    // Sending success response with the created product details
    res.status(201).json({
      name: company.name,
      description: company.description,
      productImage: company.productImage,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  } finally {
    if (mainDBConnection) {
      // Closing the main database connection after processing
      try {
        await closeConnection(mainDBConnection.config["database"]);
      } catch (error) {
        console.error("Error closing connection:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  }
};
