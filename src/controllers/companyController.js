import connectDB, { closeConnection } from "../config/dbConfig.js";
import CompanyModel from "../models/Company.js";
import ProductModel from "../models/Product.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

export const companyLogin = async (req, res) => {
  const { email, password } = req.body;
  let mainDBConnection;
  try {
    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection);
    const companyExists = await Company.findOne({
      where: {
        email: email,
        status: "active",
      },
    });
    if (!companyExists) {
      return res.status(400).json({ message: "User not exists" });
    }
    const isMatch = await bcrypt.compare(password, companyExists.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        companyId: companyExists.id,
        email: companyExists.email,
        database: companyExists.dbName,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (mainDBConnection) {
      try {
        await closeConnection(mainDBConnection.config["database"]);
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    }
  }
};

export const registerCompany = async (req, res) => {
  const { name, password, email, role } = req.body;

  let mainDBConnection;
  try {
    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection);
    const companyExists = await Company.findOne({
      where: {
        [Op.or]: [{ email: email }, { name: name }],
        status: "active",
      },
    });

    if (companyExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10)
    );
    const company = await Company.create({
      name,
      password: hashedPassword,
      email,
      role,
      dbName: name,
    });
    await NewDb(company, mainDBConnection);
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

export async function NewDb(newCompany, sequelize) {
  let mainDBConnection;
  try {
    let dbCreate = await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${newCompany.dbName}`
    );

    if (dbCreate) {
      await closeConnection(sequelize.config["database"]);
    }
    console.log(`Database ${newCompany.dbName} created successfully.`);
    mainDBConnection = await connectDB(newCompany.dbName);
    let product = await ProductModel(mainDBConnection);
    await product.sync({ force: true });
  } catch (error) {
    console.error("Error creating database:", error);
    throw new Error(`Error in NewDb: ${error.message}`);
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
}
