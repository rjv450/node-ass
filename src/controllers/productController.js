import connectDB from "../config/dbConfig.js";
import ProductModel from "../models/Product.js";

export const addProduct = async (req, res) => {
  let mainDBConnection;
  try {
    const { name, description } = req.body;
    const productImage = req.file ? req.file.path : null;
    const dbBase = req.company.dbName;

    mainDBConnection = await connectDB(dbBase);
    const Product = ProductModel(mainDBConnection);
    const company = await Product.create({
      name,
      description,
      productImage,
    });
    res.status(201).json({
      name: company.name,
      description: company.description,
      productImage: company.productImage,
    });
  } catch (error) {
    res.status(400).json({ error: "Bad request" });
  } finally {
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
