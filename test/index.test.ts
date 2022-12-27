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
  beforeEach((done) => {
    modelCreate().finally(done);
  });

  afterEach((done) => {
    modelDelete().finally(done);
  });

  it("without pagination", () => {
    Paginate.paginate(mockModel, {}, (error, result) => {
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

    Paginate.paginate(mockModel, {}).then((result) => {
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

    Paginate.paginate(model, {}, (error, result) => {
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

    new Paginate(model).paginate({}).then((result) => {
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

    new Paginate(mockModel).paginate({}, (error, result) => {
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

    new Paginate(mockModel).paginate({}).then((result) => {
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

    new Paginate(model).paginate({}, (error, result) => {
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

    new Paginate(model).paginate({}).then((result) => {
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
  });

  it("page == 0", () => {
    Paginate.paginate(mockModel, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(mockModel, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(model, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    Paginate.paginate(model, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 1 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
    });

    new Paginate(mockModel).paginate(
      {},
      { page: 0, limit: 1 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeInstanceOf(Array);
        expect(result?.count).toBe(mockModelResult.length);
        expect(result?.hasNextPage).toBe(true);
        expect(result?.hasPrevPage).toBe(false);
        expect(result?.limit).toBe(1);
        expect(result?.page).toBe(1);
        expect(result?.totalPages).toBe(mockModelResult.length);
      }
    );

    new Paginate(mockModel)
      .paginate({}, { page: 0, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      });

    new Paginate(model).paginate({}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    new Paginate(model).paginate({}, { page: 0, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 1 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  it("page == 1", () => {
    Paginate.paginate(mockModel, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(mockModel, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(model, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    Paginate.paginate(model, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 1 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
    });

    new Paginate(mockModel).paginate(
      {},
      { page: 1, limit: 1 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeInstanceOf(Array);
        expect(result?.count).toBe(mockModelResult.length);
        expect(result?.hasNextPage).toBe(true);
        expect(result?.hasPrevPage).toBe(false);
        expect(result?.limit).toBe(1);
        expect(result?.page).toBe(1);
        expect(result?.totalPages).toBe(mockModelResult.length);
      }
    );

    new Paginate(mockModel)
      .paginate({}, { page: 1, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(false);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(1);
        expect(result.totalPages).toBe(mockModelResult.length);
      });

    new Paginate(model).paginate({}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 1 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
    });

    new Paginate(model).paginate({}, { page: 1, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 1 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(false);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  it("index == 2", () => {
    Paginate.paginate(mockModel, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(mockModel, {}, { page: 2, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(2);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(model, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 2 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
    });

    Paginate.paginate(model, {}, { page: 2, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 2 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(2);
    });

    new Paginate(mockModel).paginate(
      {},
      { page: 2, limit: 1 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeInstanceOf(Array);
        expect(result?.count).toBe(mockModelResult.length);
        expect(result?.hasNextPage).toBe(true);
        expect(result?.hasPrevPage).toBe(true);
        expect(result?.limit).toBe(1);
        expect(result?.page).toBe(2);
        expect(result?.totalPages).toBe(mockModelResult.length);
      }
    );

    new Paginate(mockModel)
      .paginate({}, { page: 2, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(true);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(2);
        expect(result.totalPages).toBe(mockModelResult.length);
      });

    new Paginate(model).paginate({}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 2 }]);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
    });

    new Paginate(model).paginate({}, { page: 2, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 2 }]);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(2);
    });
  });

  it("page == totalPage", () => {
    Paginate.paginate(mockModel, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toBeInstanceOf(Array);
      expect(result?.count).toBe(mockModelResult.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(mockModel, {}, { page: 3, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result.count).toBe(mockModelResult.length);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(3);
      expect(result.totalPages).toBe(mockModelResult.length);
    });

    Paginate.paginate(model, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 3 }]);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
    });

    new Paginate(model).paginate({}, { page: 3, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 3 }]);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(3);
    });

    new Paginate(mockModel).paginate(
      {},
      { page: 3, limit: 1 },
      (error, result) => {
        expect(error).toBe(null);
        expect(result?.result).toBeInstanceOf(Array);
        expect(result?.count).toBe(mockModelResult.length);
        expect(result?.hasNextPage).toBe(false);
        expect(result?.hasPrevPage).toBe(true);
        expect(result?.limit).toBe(1);
        expect(result?.page).toBe(3);
        expect(result?.totalPages).toBe(mockModelResult.length);
      }
    );

    new Paginate(mockModel)
      .paginate({}, { page: 3, limit: 1 })
      .then((result) => {
        expect(result.result).toBeDefined();
        expect(result.count).toBe(mockModelResult.length);
        expect(result.hasNextPage).toBe(false);
        expect(result.hasPrevPage).toBe(true);
        expect(result.limit).toBe(1);
        expect(result.page).toBe(3);
        expect(result.totalPages).toBe(mockModelResult.length);
      });

    new Paginate(model).paginate({}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.result).toStrictEqual([{ id: 3 }]);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
    });

    new Paginate(model).paginate({}, { page: 3, limit: 1 }).then((result) => {
      expect(result.result).toStrictEqual([{ id: 3 }]);
      expect(result.hasNextPage).toBe(false);
      expect(result.hasPrevPage).toBe(true);
      expect(result.limit).toBe(1);
      expect(result.page).toBe(3);
    });
  });

  // it("page > totalPage", () => {
  //  Paginate.paginate(model, {}, { page: 4, limit: 1 }, (error, result) => {
  //     expect(error).toBeInstanceOf(ErrorTotalPages);
  //     expect(result).toBe(undefined);
  //   });
  // });

  // it("page > totalPage", () => {
  //  Paginate.paginate(model, {}, { page: 4, limit: 1 }).then(
  //     (result) => {
  //       expect(result?.count).toBe(db.length);
  //     },
  //     (error) => {
  //       expect(error).toBeInstanceOf(ErrorTotalPages);
  //     }
  //   );
  // });
});
