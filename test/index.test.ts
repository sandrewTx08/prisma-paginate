import { paginate } from "../src";
import { ErrorTotalPages } from "../src/errors";
import { mockDatabase, mockModel } from "./utils";

describe("callback", () => {
  it("without pagination", () => {
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
  });

  it("page == 0", () => {
    paginate(mockModel, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("page == 1", () => {
    paginate(mockModel, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("index == 2", () => {
    paginate(mockModel, {}, { page: 2, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("page == totalPage", () => {
    paginate(mockModel, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  // it("page > totalPage", () => {
  //   paginate(model, {}, { page: 4, limit: 1 }, (error, result) => {
  //     expect(error).toBeInstanceOf(ErrorTotalPages);
  //     expect(result).toBe(undefined);
  //   });
  // });
});

describe("promise", () => {
  it("without pagination", () => {
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
  });

  it("page == 0", () => {
    paginate(mockModel, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("page == 1", () => {
    paginate(mockModel, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("index == 2", () => {
    paginate(mockModel, {}, { page: 2, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(2);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

  it("page == totalPage", () => {
    paginate(mockModel, {}, { page: 3, limit: 1 }).then((result) => {
      expect(result.result).toBeDefined();
      expect(result?.count).toBe(mockDatabase.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(mockDatabase.length);
    });
  });

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
