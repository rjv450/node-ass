
/**
 * Function to generate a database URI based on the provided parameters.
 * @param {string} dbName - The name of the database.
 * @returns {string} - The generated database URI.
 */
const getDBUri = (dbName) => {
  // Get database connection parameters from environment variables or use defaults.
  const user = process.env.DB_USER || "user";
  const password = process.env.DB_PASSWORD || "password";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";


  // Construct and return the database URI.
  return `mysql://${user}:${password}@${host}:${port}/${dbName}`;
};

export default getDBUri;
