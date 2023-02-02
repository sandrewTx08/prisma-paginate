import { testPaginate } from "./utils";

describe("count == 0", () => {
  const mock = Object();
  mock.count = async function () {
    return 0;
  };
  mock.findMany = async function () {
    return new Array(await mock.count());
  };

  it("page == 0", () => {
    testPaginate(mock, {}, { limit: 1, page: 0 }).then((results) => {
      results.forEach(([error, result]) => {
        expect(error).toBe(null);
        expect(result.result).toStrictEqual([]);
        expect(result.count).toBe(0);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(0);
      });
    });
  });

  it("page == 1", () => {
    testPaginate(mock, {}, { limit: 1, page: 1 }).then((results) => {
      results.forEach(([error, result]) => {
        expect(error).toBe(null);
        expect(result.result).toStrictEqual([]);
        expect(result.count).toBe(0);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(0);
      });
    });
  });
});
