import paginator from "../src";
import { randomIds, randomArray, testPaginate, client } from "./utils";

describe("random array", () => {
  beforeAll((done) => {
    client.$connect().then(() => {
      client.model.createMany({ data: randomIds }).finally(done);
    });
  });

  afterAll((done) => {
    client.model
      .deleteMany({ where: { id: { in: randomArray } } })
      .finally(() => {
        client.$disconnect().finally(done);
      });
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
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(randomIds.length + 2);
          expect(result.totalPages).toBe(randomIds.length);
        });
      })
      .finally(done);
  });
});

describe("nextPage", () => {
  it("callback", () => {
    paginator(client.model)({}, { page: 1, limit: 10 }).then((r) => {
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
