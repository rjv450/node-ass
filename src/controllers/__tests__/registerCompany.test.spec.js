import connectDB, { closeConnection } from "../../config/dbConfig.js";
import { registerCompany, NewDb } from "../companyController.js";
import CompanyModel from "../../models/Company.js";
import ProductModel from "../../models/Product.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

jest.mock("../../config/dbConfig.js");
jest.mock("../../models/Company.js");
jest.mock("../../models/Product.js", () => {
  const mockSync = jest.fn().mockResolvedValue();
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      sync: mockSync,
    }),
  };
});
jest.mock("bcrypt");

describe("registerCompany", () => {
  let req, res, mockCompanyInstance;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Company",
        password: "password123",
        email: "test@example.com",
        role: "admin",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockCompanyInstance = {
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: "Test Company",
        email: "test@example.com",
        role: "admin",
        dbName: "TestCompany",
      }),
    };
    connectDB.mockResolvedValue("mockDBConnection");
    CompanyModel.mockReturnValue(mockCompanyInstance);
    bcrypt.hash.mockResolvedValue("hashedpassword");
    bcrypt.genSalt.mockResolvedValue("salt");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if company already exists", async () => {
    mockCompanyInstance.findOne.mockResolvedValue({
      id: 1,
      name: "Test Company",
      email: "test@example.com",
      role: "admin",
      dbName: "TestCompany",
    });

    await registerCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
  });

  it("should handle server errors and return 500", async () => {
    mockCompanyInstance.findOne.mockRejectedValue(new Error("Database error"));

    await registerCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });

  it("should create a new database and synchronize models", async () => {
    const newCompany = { dbName: "testDbName" };
    const sequelizeMock = {
      query: jest.fn().mockResolvedValue(),
      config: { database: "mockDB" },
    };
    const mainDBConnectionMock = { config: { database: "mockDB" } };

    connectDB.mockResolvedValue(mainDBConnectionMock);

    await NewDb(newCompany, sequelizeMock);
    expect(sequelizeMock.query).toHaveBeenCalledWith(
      expect.stringContaining("CREATE DATABASE IF NOT EXISTS testDbName")
    );
    expect(connectDB).toHaveBeenCalledWith("testDbName");
    expect(ProductModel).toHaveBeenCalledWith(mainDBConnectionMock);
    expect(ProductModel().sync).toHaveBeenCalledWith({ force: true });
    expect(closeConnection).toHaveBeenCalledWith("mockDB");
  });
});
