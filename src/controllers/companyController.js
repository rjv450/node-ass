import connectDB, { closeConnection } from "../config/dbConfig.js";
import CompanyModel from "../models/Company.js";
import ProductModel from "../models/Product.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

// Function for company login
export const companyLogin = async (req, res) => {
  const { email, password } = req.body;
  let mainDBConnection;
  try {
    // Connecting to the main database
    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection);

    // Checking if the company exists and is active
    const companyExists = await Company.findOne({
      where: {
        email: email,
        status: "active",
      },
    });

    // If company does not exist or is not active, return error
    if (!companyExists) {
      return res.status(400).json({ message: "User not exists" });
    }

    // Checking if the provided password matches the hashed password in the database
    const isMatch = await bcrypt.compare(password, companyExists.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generating JWT token for authentication
    const token = jwt.sign(
      {
        companyId: companyExists.id,
        email: companyExists.email,
        database: companyExists.dbName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Sending the token in the response
    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (mainDBConnection) {
      // Closing the main database connection after processing
      try {
        await closeConnection(mainDBConnection.config["database"]);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    }
  }
};

// Function to register a new company
export const registerCompany = async (req, res) => {
  const { name, password, email, role } = req.body;

  let mainDBConnection;
  try {

    // Connecting to the main database
    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection);

    // Checking if a company with the provided email or name already exists and is active
    const companyExists = await Company.findOne({
      where: {
        [Op.or]: [{ email: email }, { name: name }],
        status: "active",
      },
    });

    // If company already exists, return error
    if (companyExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hashing the provided password
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );

    // Creating a new company record in the database
    const company = await Company.create({
      name,
      password: hashedPassword,
      email,
      role,
      dbName: name,
    });

    // Creating a new database for the company and synchronizing Product model with the new database // Creating a new database for the company and synchronizing Product model with the new database
    await NewDb(company, mainDBConnection);

    // Sending success response with the created company details
    res.status(201).json({
      id: company.id,
      name: company.name,
      email: company.email,
      role: company.role,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Function to create a new database and synchronize Product model with it
export async function NewDb(newCompany, sequelize) {
  let mainDBConnection;
  try {

    // Creating a new database if it doesn't exist
    let dbCreate = await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${newCompany.dbName}`
    );

    // If database creation is successful, close the connection to the main database
    if (dbCreate) {
      await closeConnection(sequelize.config["database"]);
    }
    console.log(`Database ${newCompany.dbName} created successfully.`);
    mainDBConnection = await connectDB(newCompany.dbName);

    // Synchronizing the Product model with the new database
    let product = await ProductModel(mainDBConnection);
    await product.sync({ force: true });
  } catch (error) {
    console.error("Error creating database:", error);
    throw new Error(`Error in NewDb: ${error.message}`);
  } finally {
    if (mainDBConnection) {
      try {
        // Closing the main database connection after processing
        await closeConnection(mainDBConnection.config["database"]);
      } catch (error) {
        console.error("Error closing connection:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  }
}
