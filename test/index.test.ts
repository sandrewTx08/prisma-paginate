import { prismaPaginate } from "../src";
import { db, model } from "./utils";

describe("callback", () => {
  it("withoutPagination", () => {
    prismaPaginate(model, {}, (error, result) => {
      expect(error).toBe(null);
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
    prismaPaginate(model, {}, { page: 0, limit: 1 }, (error, result) => {
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
    prismaPaginate(model, {}, { page: 1, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page > totalPage", () => {
    prismaPaginate(model, {}, { page: 3, limit: 1 }, (error, result) => {
      expect(error).toBe(null);
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(db.length);
    });
  });
});

describe("promise", () => {
  it("withoutPagination", () => {
    prismaPaginate(model, {}).then((result) => {
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

  it("withoutPagination", () => {
    prismaPaginate(model, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(0);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page == 0", () => {
    prismaPaginate(model, {}, { page: 0, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(false);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(0);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination index != 1", () => {
    prismaPaginate(model, {}, { page: 1, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(true);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(1);
      expect(result?.totalPages).toBe(db.length);
    });
  });

  it("withPagination page > totalPage", () => {
    prismaPaginate(model, {}, { page: 3, limit: 1 }).then((result) => {
      expect(result?.count).toBe(db.length);
      expect(result?.hasNextPage).toBe(false);
      expect(result?.hasPrevPage).toBe(true);
      expect(result?.limit).toBe(1);
      expect(result?.page).toBe(3);
      expect(result?.totalPages).toBe(db.length);
    });
  });
});
