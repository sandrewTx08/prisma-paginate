import { paginate } from "../src";
import { ErrorTotalPages } from "../src/errors";
import { db, model } from "./utils";

describe("callback", () => {
  it("withoutPagination", () => {
    paginate(model, {}, (error, result) => {
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

  it("withPagination page == 0", () => {
    paginate(model, {}, { page: 0, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(0);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination index != 1", () => {
    paginate(model, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page == totalPage", () => {
    paginate(model, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  // it("withPagination page > totalPage", () => {
  // paginate(model, {}, { page: 4, limit: 1 }, (error, result) => {
  //   expect(error).toBeInstanceOf(ErrorTotalPages);
  //   expect(result).toBe(undefined);
  // });
  // });
});

describe("promise", () => {
  it("withoutPagination", () => {
    paginate(model, {}).then((result) => {
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

  it("withPagination", () => {
    paginate(model, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(0);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page == 0", () => {
    paginate(model, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(0);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination index != 1", () => {
    paginate(model, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page == totalPage", () => {
    paginate(model, {}, { page: 3, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  // it("withPagination page > totalPage", () => {
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
