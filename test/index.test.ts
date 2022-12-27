import { Paginate } from "../src";
import { TotalPagesExceed } from "../src/errors";
import {
  mockModelResult,
  mockModel,
  model,
  modelDelete,
  modelCreate,
  modelResult,
} from "./utils";

describe("prisma", () => {
  const { paginate } = Paginate;

  beforeEach((done) => {
    modelCreate().finally(done);
  });

  afterEach((done) => {
    modelDelete().finally(done);
  });

  it("without pagination", (done) => {
    paginate(mockModel, {}, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBeInstanceOf(Array);
      expect(result).not.toHaveProperty([
        "count",
        "hasNextPage",
        "hasPrevPage",
        "limit",
        "page",
        "totalPages",
      ]);
    });

    paginate(mockModel, {}).then((result) => {
      expect(result).toBeInstanceOf(Array);
      expect(result).not.toHaveProperty([
        "count",
        "hasNextPage",
        "hasPrevPage",
        "limit",
        "page",
        "totalPages",
      ]);
    });

    paginate(model, {}, (error, result) => {
      expect(error).toBe(null);
      expect(result).toStrictEqual(modelResult);
      expect(result).not.toHaveProperty([
        "count",
        "hasNextPage",
        "hasPrevPage",
        "limit",
        "page",
        "totalPages",
      ]);
    });

    paginate(model, {})
      .then((result) => {
        expect(result).toStrictEqual(modelResult);
        expect(result).not.toHaveProperty([
          "count",
          "hasNextPage",
          "hasPrevPage",
          "limit",
          "page",
          "totalPages",
        ]);
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    paginate(mockModel, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    paginate(mockModel, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    paginate(model, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    paginate(model, {}, { page: 0, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 1 }]);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
      })
      .finally(done);
  });

  it("page == 1", (done) => {
    paginate(mockModel, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    paginate(mockModel, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    paginate(model, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    paginate(model, {}, { page: 1, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 1 }]);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
      })
      .finally(done);
  });

  it("index == 2", (done) => {
    paginate(mockModel, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    paginate(mockModel, {}, { page: 2, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    paginate(model, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 2 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
    });

    paginate(model, {}, { page: 2, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 2 }]);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(2);
      })
      .finally(done);
  });

  it("page == totalPage", (done) => {
    paginate(mockModel, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    paginate(mockModel, {}, { page: 3, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(3);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    paginate(model, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 3 }]);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
    });

    paginate(model, {}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 3 }]);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
      })
      .finally(done);
  });

  // it("page > totalPage", () => {
  //   paginate(model, {}, { page: 4, limit: 1 }, (error, result) => {
  //     expect(error).toBeInstanceOf(ErrorTotalPages);
  //     expect(result).toBe(undefined);
  //   });
  // });

  // it("page > totalPage", () => {
  //   paginate(model, {}, { page: 4, limit: 1 }).then(
  //     (result) => {
  //       expect(result?.count).toBe(db.length);
  //     },
  //     (error) => {
  //       expect(error).toBeInstanceOf(ErrorTotalPages);
  //     }
  //   );
  // });
});
