const getDBUri = (dbName) => {
  const user = process.env.DB_USER || "user";
  const password = process.env.DB_PASSWORD || "password";
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || "3306";
  return `mysql://${user}:${password}@${host}:${port}/${dbName}`;
};

export default getDBUri;
