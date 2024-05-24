import getDBUri from "../getDbUrl.js";

describe("getDBUri", () => {
  it("should return the correct DB URI when all environment variables are set", () => {
    process.env.DB_USER = "testuser";
    process.env.DB_PASSWORD = "testpassword";
    process.env.DB_HOST = "testhost";
    process.env.DB_PORT = "1234";
    const dbName = "testdb";
    const expectedUri = "mysql://testuser:testpassword@testhost:1234/testdb";
    expect(getDBUri(dbName)).toEqual(expectedUri);
  });

  it("should use default values for missing environment variables", () => {
    delete process.env.DB_USER;
    delete process.env.DB_PASSWORD;
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    const dbName = "testdb";
    const expectedUri = "mysql://user:password@localhost:3306/testdb";
    expect(getDBUri(dbName)).toEqual(expectedUri);
  });
});
