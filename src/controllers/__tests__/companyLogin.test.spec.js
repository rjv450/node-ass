import CompanyModel from "../../models/Company.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB, { closeConnection } from "../../config/dbConfig.js";
import { companyLogin } from "../companyController.js";

jest.mock("../../config/dbConfig.js");
jest.mock("../../models/Company.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("companyLogin", () => {
  let req, res, mockCompanyInstance;

  beforeEach(() => {
    req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockCompanyInstance = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
        dbName: "testCompany",
        status: "active",
      }),
    };
    connectDB.mockResolvedValue("mockDBConnection");
    CompanyModel.mockReturnValue(mockCompanyInstance);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mockToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should authenticate the company and return a token", async () => {
    await companyLogin(req, res);

    expect(connectDB).toHaveBeenCalledWith(process.env.COMPANY_DB);
    expect(CompanyModel).toHaveBeenCalledWith("mockDBConnection");
    expect(mockCompanyInstance.findOne).toHaveBeenCalledWith({
      where: {
        email: "test@example.com",
        status: "active",
      },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "password123",
      "hashedpassword"
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        companyId: 1,
        email: "test@example.com",
        database: "testCompany",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ token: "mockToken" });
  });

  it("should return 400 if company does not exist", async () => {
    mockCompanyInstance.findOne.mockResolvedValue(null);

    await companyLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "User not exists" });
  });

  it("should return 401 if password is incorrect", async () => {
    bcrypt.compare.mockResolvedValue(false);

    await companyLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid email or password",
    });
  });

  it("should handle server errors and return 500", async () => {
    mockCompanyInstance.findOne.mockRejectedValue(new Error("Database error"));

    await companyLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
