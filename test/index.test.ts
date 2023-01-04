import { PrismaClient } from "@prisma/client";
import prismaPaginate from "../src";
import { PrismaModel, Result, Pagination } from "../src/types";
import { createRandomArray } from "./utils";

describe("paginate model", () => {
  let client: PrismaClient;
  const randomArray = createRandomArray();
  const randomIds = randomArray.map((id) => ({ id }));

  beforeAll((done) => {
    client = new PrismaClient();
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

  function testPrismaPaginate<
    Result extends Result.WithoutPagination<Model> | Result.Pagination<Model>,
    Model extends typeof client.model = typeof client.model
  >(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Arguments
      | Result.Callback<Model, Result.WithoutPagination<Model>>
  ): Promise<[Error | null, Result][]> {
    return Promise.all<any>([
      new Promise((resolve) => {
        prismaPaginate()(
          client.model,
          findManyArgs,
          paginationOrCallback as Pagination.Arguments,
          (error, result) => {
            resolve([error, result]);
          }
        );
      }),
      new Promise((resolve) => {
        prismaPaginate(client.model)(
          findManyArgs,
          paginationOrCallback as Pagination.Arguments,
          (error, result) => {
            resolve([error, result]);
          }
        );
      }),
      new Promise((resolve) => {
        prismaPaginate(client.model)(
          findManyArgs,
          paginationOrCallback as Pagination.Arguments
        ).then(
          (result) => {
            resolve([null, result]);
          },
          (reason) => {
            resolve([reason, undefined]);
          }
        );
      }),
      new Promise((resolve) => {
        prismaPaginate()(
          client.model,
          findManyArgs,
          paginationOrCallback as Pagination.Arguments
        ).then(
          (result) => {
            resolve([null, result]);
          },
          (reason) => {
            resolve([reason, undefined]);
          }
        );
      }),
    ]);
  }

  it("without pagination", (done) => {
    testPrismaPaginate<Result.WithoutPagination<typeof client.model>>({})
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result).toStrictEqual(randomIds);
        });
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: 0 }
    )
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
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: 1 }
    )
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
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: randomIds.length }
    )
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
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: randomIds.length + 1 }
    )
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
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: randomIds.length + 2 }
    )
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
