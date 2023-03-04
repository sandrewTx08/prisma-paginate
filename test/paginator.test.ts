import paginator from "../src";
import { randomIds, testPaginate, client } from "./utils";

describe("random array", () => {
  beforeAll(async () => {
    await client.$connect();
    await client.model.deleteMany();
    await client.model.createMany({ data: randomIds });
  });

  afterAll(async () => {
    await client.model.deleteMany();
    await client.$disconnect();
  });

  it("page == 0", (done) => {
    testPaginate(client.model, {}, { limit: 1, page: 0 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([randomIds[0]]);
          expect(result.count).toBe(randomIds.length);
          expect(result.hasNextPage).toBe(true);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });

  it("page == 1", (done) => {
    testPaginate(client.model, {}, { limit: 1, page: 1 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([randomIds[0]]);
          expect(result.count).toBe(randomIds.length);
          expect(result.hasNextPage).toBe(true);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });

  it("page == totalPages", (done) => {
    testPaginate(client.model, {}, { limit: 1, page: randomIds.length })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([
            randomIds[randomIds.length - 1],
          ]);
          expect(result.count).toBe(randomIds.length);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(true);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(randomIds.length);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });

  it("page == totalPages + 1", (done) => {
    testPaginate(client.model, {}, { limit: 1, page: randomIds.length + 1 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([]);
          expect(result.count).toBe(randomIds.length);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(true);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(randomIds.length + 1);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });

  it("page == totalPages + 2", (done) => {
    testPaginate(client.model, {}, { limit: 1, page: randomIds.length + 2 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([]);
          expect(result.count).toBe(randomIds.length);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(true);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(randomIds.length + 2);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });

  it("rounds up total pages correctly on the second to last page", async () => {
    const results = await testPaginate(
      client.model,
      {},
      { limit: 9, page: 11 }
    );
    results.forEach(([error, result]) => {
      expect(error).toBe(null);
      expect(result.count).toBe(100);
      expect(result.totalPages).toBe(12);
      expect(result.hasNextPage).toBe(true);
      expect(result.hasPrevPage).toBe(true);
    });
  });

  it("rounds up total pages correctly on the last page", async () => {
    const result = await paginator(client.model).paginate({
      limit: 9,
      page: 12,
    });

    expect(result.count).toBe(100);
    expect(result.totalPages).toBe(12);
    expect(result.hasNextPage).toBe(false);
    expect(result.hasPrevPage).toBe(true);
  });
});

describe("nextPage", () => {
  it("callback", () => {
    paginator(client.model).paginate({}, { page: 1, limit: 10 }).then((r) => {
      expect(r?.page).toBe(1);
      r.nextPage((e, r) => {
        expect(e).toBe(null);
        expect(r?.page).toBe(2);
        r?.nextPage((e, r) => {
          expect(e).toBe(null);
          expect(r?.page).toBe(3);
          r?.nextPage(async (e, r) => {
            expect(e).toBe(null);
            expect(r?.page).toBe(4);
          });
        });
      });
    });
  });
});
