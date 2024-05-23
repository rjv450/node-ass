import { Sequelize } from 'sequelize';
import CompanyModel from '../models/Company.js'; // Adjust the import path accordingly

const dbConnections = {};

const connectDB = async (company) => {
    const uri = process.env[`DB_URI_${company}`];

    if (!uri) {
        throw new Error(`No database URI found for company: ${company}`);
    }

    if (!dbConnections[company]) {
        try {
            const sequelize = new Sequelize(uri, {
                dialect: 'mysql',
                logging: false
            });
            dbConnections[company] = sequelize;
            await synchronizeModels(sequelize);
            console.log(`MySQL Connected: ${company}`);
            sequelize.authenticate()
                .then(() => console.log(`Connection has been established successfully for ${company}.`))
                .catch(err => console.error(`Unable to connect to the database for ${company}:`, err));
        } catch (error) {
            console.error(`Error connecting to ${company} database:`, error);
        }
    }

    return dbConnections[company];
};

const synchronizeModels = async (sequelize) => {
    try {
        const Company = CompanyModel(sequelize);
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
        throw error;
    }
};

export default connectDB;
