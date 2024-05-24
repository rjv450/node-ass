import connectDB, { closeConnection } from "../config/dbConfig.js";
import CompanyModel from "./../models/Company.js";
import jwt from "jsonwebtoken";
export const validateCompany = async (req, res, next) => {
  let mainDBConnection;
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const companyId = decodedToken.companyId;

    mainDBConnection = await connectDB(process.env.COMPANY_DB);
    const Company = CompanyModel(mainDBConnection);
    const company = await Company.findOne({
      where: {
        id: companyId,
        status: "active",
      },
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    req.company = company;

    next();
  } catch (error) {
    console.error("Error validating company:", error);
    return res.status(401).json({ message: "Unauthorized" });
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
