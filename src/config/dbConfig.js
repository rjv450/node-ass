import { Sequelize } from "sequelize";
import CompanyModel from "../models/Company.js";
import getDBUri from "./getDbUrl.js";

const dbConnections = {};

const connectDB = async (company) => {
  const uri = getDBUri(company);

  if (!uri) {
    throw new Error(`No database URI found for company: ${company}`);
  }

  if (!dbConnections[company]) {
    try {
      const sequelize = new Sequelize(uri, {
        dialect: "mysql",
        logging: false,
      });
      dbConnections[company] = sequelize;
      console.log(`MySQL Connected: ${company}`);
      await sequelize.authenticate();
      console.log(
        `Connection has been established successfully for ${company}.`
      );
    } catch (error) {
      console.error(`Error connecting to ${company} database:`, error);
    }
  }

  return dbConnections[company];
};

export const synchronizeModels = async (sequelize, model) => {
  try {
    await model(sequelize);
    await sequelize.sync({ alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing models:", error);
    throw error;
  }
};

export default connectDB;

export const closeConnection = async (company) => {
  const connection = dbConnections[company];
  if (connection) {
    try {
      await connection.close();
      delete dbConnections[company];
      console.log(
        `Connection to ${company} database closed and removed from cache.`
      );
    } catch (error) {
      console.error(`Error closing connection to ${company} database:`, error);
    }
  }
};
