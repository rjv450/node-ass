import { Sequelize } from "sequelize";
import CompanyModel from "../models/Company.js";
import getDBUri from "./getDbUrl.js";

// Object to store database connections
const dbConnections = {};

// Function to connect to the database
const connectDB = async (company) => {

    // Get the URI for the specified company's database
    const uri = getDBUri(company);

    // If no URI is found, throw an error
    if (!uri) {
        throw new Error(`No database URI found for company: ${company}`);
    }
    // If there's no existing connection for the company, establish a new one
    if (!dbConnections[company]) {
        try {
            // Create a new Sequelize instance with the provided URI
            const sequelize = new Sequelize(uri, {
                dialect: "mysql",
                logging: false,
            });
            dbConnections[company] = sequelize;
            console.log(`MySQL Connected: ${company}`);

            // Authenticate the connection
            await sequelize.authenticate();
            console.log(
                `Connection has been established successfully for ${company}.`
            );
        } catch (error) {
            console.error(`Error connecting to ${company} database:`, error);
        }
    }

    // Return the Sequelize instance for the specified company
    return dbConnections[company];
};

// Function to synchronize models with the database
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

// Function to close the connection to a specific company's database
export const closeConnection = async (company) => {
    const connection = dbConnections[company];
    if (connection) {
        try {

            // Close the connection
            await connection.close();

            // Remove the connection from the dbConnections object
            delete dbConnections[company];
            console.log(
                `Connection to ${company} database closed and removed from cache.`
            );
        } catch (error) {
            console.error(`Error closing connection to ${company} database:`, error);
        }
    }
};
