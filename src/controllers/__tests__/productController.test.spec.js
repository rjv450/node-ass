import connectDB, { closeConnection } from "../../config/dbConfig.js";
import ProductModel from "../../models/Product.js";
import { addProduct } from "../productController.js";

jest.mock("../../config/dbConfig.js");
jest.mock("../../models/Product.js");

describe("addProduct", () => {
  let req, res, mockProductInstance;

  beforeEach(() => {
    req = {
      body: {
        name: "Test Product",
        description: "This is a test product",
      },
      file: {
        path: "test/path/to/image.jpg",
      },
      company: {
        dbName: "testCompany",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockProductInstance = {
      create: jest.fn().mockResolvedValue({
        name: "Test Product",
        description: "This is a test product",
        productImage: "test/path/to/image.jpg",
      }),
    };
    connectDB.mockResolvedValue("mockDBConnection");
    ProductModel.mockReturnValue(mockProductInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a product and return 201 status", async () => {
    await addProduct(req, res);

    expect(connectDB).toHaveBeenCalledWith("testCompany");
    expect(ProductModel).toHaveBeenCalledWith("mockDBConnection");
    expect(mockProductInstance.create).toHaveBeenCalledWith({
      name: "Test Product",
      description: "This is a test product",
      productImage: "test/path/to/image.jpg",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      name: "Test Product",
      description: "This is a test product",
      productImage: "test/path/to/image.jpg",
    });
  });

  it("should handle errors and return 400 status", async () => {
    mockProductInstance.create.mockRejectedValue(new Error("Create failed"));

    await addProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Bad request" });
  });

  it("should handle connection close errors and return 500 status", async () => {
    mockProductInstance.create.mockRejectedValue(new Error("Create failed"));
    closeConnection.mockRejectedValue(new Error("Close failed"));

    await addProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
