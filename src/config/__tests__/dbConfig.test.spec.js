import { synchronizeModels } from "../dbConfig.js";

jest.mock("../getDbUrl.js", () => jest.fn());

describe("synchronizeModels", () => {
  it("should synchronize models with Sequelize instance", async () => {
    const modelMock = jest.fn();
    const sequelizeMock = { sync: jest.fn() };

    await synchronizeModels(sequelizeMock, modelMock);

    expect(modelMock).toHaveBeenCalledWith(sequelizeMock);
    expect(sequelizeMock.sync).toHaveBeenCalledWith({ alter: true });
  });
});
