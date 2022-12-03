import { prismaPaginate, PrismaPaginate } from "../src";
import { data, model } from "./utils";

describe("return value", () => {
  it("callback", () => {
    prismaPaginate(model, { where: { id: 1 } }, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBe(data[0]);
    });
  });

  it("callbackWithoutPagination", () => {
    prismaPaginate(model, { where: { id: 1 } }, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBe(data[0]);
    });
  });

  it("paginationWithoutCallback", () => {
    expect(
      prismaPaginate(model, { where: { id: 1 } }, { page: 1, limit: 1 }).then(
        (result) => {
          expect(result).toBe(data[0]);
        }
      )
    ).toBeInstanceOf(Promise);
  });

  it("withoutPagination", () => {
    expect(
      prismaPaginate(model, { where: { id: 1 } }).then((result) => {
        expect(result).toBe(data[0]);
      })
    ).toBeInstanceOf(Promise);
  });

  it("PrismaPaginationWithoutCallback", () => {
    expect(
      new PrismaPaginate(model, { where: { id: 1 } }).query()
    ).toBeInstanceOf(Promise);
  });

  it("PrismaPaginationCallback", () => {
    new PrismaPaginate(model, { where: { id: 1 } }).query((error, result) => {
      expect(error).toBe(null);
      expect(result).toBe(data[0]);
    });
  });
});
