import prismaPaginate, { Model } from "./prismaPaginate";
import { jest } from "@jest/globals";

describe("return value", () => {
  const data = [{ id: 1 }, { id: 2 }, { id: 3 }] as const;
  type Data = Partial<typeof data[0]>;

  const model = {
    findMany: jest.fn(async ({ where }: { where: Data }) =>
      data.find(({ id }) => where.id == id)
    ),
    count: jest.fn(async () => data.length),
  } as unknown as Model<Data, { where: Data }>;

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
});
