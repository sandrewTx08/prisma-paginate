import { Model } from "./prismaPaginate";
import { jest } from "@jest/globals";

describe("return value", () => {
  const model = {
    findMany: jest.fn(),
    count: jest.fn(),
  } as unknown as Model;

  it("callback", () => {});

  it("callbackWithoutPagination", () => {});

  it("paginationWithoutCallback", () => {});
});
