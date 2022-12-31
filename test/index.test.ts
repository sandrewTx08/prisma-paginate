import PrismaPaginate from "../src";
import { TotalPagesExceed } from "../src/errors";
import { Paginate } from "../src/paginate";
import {
  mockModelResult,
  mockModel,
  model,
  modelDelete,
  modelCreate,
  modelResult,
} from "./utils";

describe("prisma", () => {
  beforeEach((done) => {
    modelCreate().finally(done);
  });

  afterEach((done) => {
    modelDelete().finally(done);
  });

  it("paginate args", () => {
    const paginate = new Paginate(mockModel);

    expect(paginate.findManyArgs({}, { page: 0, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 0,
    });
    expect(paginate.findManyArgs({}, { page: 1, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 0,
    });
    expect(paginate.findManyArgs({}, { page: 2, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 2,
    });
    expect(paginate.findManyArgs({}, { page: 3, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 4,
    });
    expect(paginate.findManyArgs({}, { page: 4, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 6,
    });
    expect(paginate.findManyArgs({}, { page: 5, limit: 2 })).toStrictEqual({
      take: 2,
      skip: 8,
    });
  });

  it("without pagination", (done) => {
    PrismaPaginate(model)({})
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

  it("without pagination", (done) => {
    PrismaPaginate(model)({}, (error, result) => {
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
      done();
    });
  });

  it("without pagination", (done) => {
    PrismaPaginate(mockModel)({})
      .then((result) => {
        expect(result).toBeInstanceOf(Array);
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

  it("without pagination", (done) => {
    PrismaPaginate()(mockModel, {})
      .then((result) => {
        expect(result).toBeInstanceOf(Array);
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

  it("without pagination", (done) => {
    PrismaPaginate(mockModel)({}, (error, result) => {
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
      done();
    });
  });

  it("without pagination", (done) => {
    PrismaPaginate(model)({})
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

  it("without pagination", (done) => {
    PrismaPaginate()(model, {}, (error, result) => {
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
      done();
    });
  });

  it("without pagination", (done) => {
    PrismaPaginate()(mockModel, {}, (error, result) => {
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
      done();
    });
  });

  it("page == 0", (done) => {
    PrismaPaginate()(mockModel, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("page == 0", (done) => {
    PrismaPaginate()(mockModel, {}, { page: 0, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    PrismaPaginate()(model, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      done();
    });
  });

  it("page == 0", (done) => {
    PrismaPaginate()(model, {}, { page: 0, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 1 }]);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    PrismaPaginate(mockModel)({}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("page == 0", (done) => {
    PrismaPaginate(mockModel)({}, { page: 0, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    PrismaPaginate(model)({}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      done();
    });
  });

  it("page == 0", (done) => {
    PrismaPaginate(model)({}, { page: 0, limit: 1 })
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
    PrismaPaginate()(mockModel, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      done();
      expect(result?.totalPages).toBe(mockModelResult.length);
    });
  });

  it("page == 1", (done) => {
    PrismaPaginate()(mockModel, {}, { page: 1, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == 1", (done) => {
    PrismaPaginate()(model, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      done();
    });
  });

  it("page == 1", (done) => {
    PrismaPaginate()(model, {}, { page: 1, limit: 1 })
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
    PrismaPaginate(mockModel)({}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("page == 1", (done) => {
    PrismaPaginate(mockModel)({}, { page: 1, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == 1", (done) => {
    PrismaPaginate(model)({}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      done();
    });
  });

  it("page == 1", (done) => {
    PrismaPaginate(model)({}, { page: 1, limit: 1 })
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
    PrismaPaginate()(mockModel, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("index == 2", (done) => {
    PrismaPaginate()(mockModel, {}, { page: 2, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(2);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("index == 2", (done) => {
    PrismaPaginate()(model, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 2 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      done();
    });
  });

  it("index == 2", (done) => {
    PrismaPaginate()(model, {}, { page: 2, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 2 }]);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(2);
      })
      .finally(done);
  });

  it("index == 2", (done) => {
    PrismaPaginate(mockModel)({}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("index == 2", (done) => {
    PrismaPaginate(mockModel)({}, { page: 2, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(2);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("index == 2", (done) => {
    PrismaPaginate(model)({}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 2 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      done();
    });
  });

  it("index == 2", (done) => {
    PrismaPaginate(model)({}, { page: 2, limit: 1 })
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
    PrismaPaginate()(mockModel, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("page == totalPage", (done) => {
    PrismaPaginate()(mockModel, {}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == totalPage", (done) => {
    PrismaPaginate()(model, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 3 }]);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      done();
    });
  });

  it("page == totalPage", (done) => {
    PrismaPaginate(model)({}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 3 }]);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
      })
      .finally(done);
  });

  it("page == totalPage", (done) => {
    PrismaPaginate(mockModel)({}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockModelResult.length);
      done();
    });
  });

  it("page == totalPage", (done) => {
    PrismaPaginate(mockModel)({}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
        expect(result.totalPages).toBe(mockModelResult.length);
      })
      .finally(done);
  });

  it("page == totalPage", (done) => {
    PrismaPaginate(model)({}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 3 }]);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      done();
    });
  });

  it("page == totalPage", (done) => {
    PrismaPaginate(model)({}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toStrictEqual([{ id: 3 }]);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
      })
      .finally(done);
  });

  // it("page > totalPage", (done) => {
  //   Paginate()(model, {}, { page: 4, limit: 1 }, (error, result) => {
  //     expect(error).toBeInstanceOf(TotalPagesExceed);
  //     expect(result).toBe(undefined);
  //     done();
  //   });
  // });

  // it("page > totalPage", (done) => {
  //   Paginate()(model, {}, { page: 4, limit: 1 })
  //     .then(
  //       (result) => {
  //         expect(result?.count).toBe(modelResult.length);
  //       },
  //       (error) => {
  //         expect(error).toBeInstanceOf(TotalPagesExceed);
  //       }
  //     )
  //     .finally(done);
  // });
});
