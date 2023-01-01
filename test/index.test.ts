import { PrismaClient } from "@prisma/client";
import PrismaPaginate from "../src";
import { PrismaModel, Result, Pagination } from "../src/types";
import { createRamdomArray } from "./utils";

describe("paginate model", () => {
  let client: PrismaClient;
  const ramdomArray = createRamdomArray();
  const ramdomIds = ramdomArray.map((id) => ({ id }));

  beforeAll((done) => {
    client = new PrismaClient();
    client.$connect().then(() => {
      client.model.createMany({ data: ramdomIds }).finally(done);
    });
  });

  afterAll((done) => {
    client.model
      .deleteMany({ where: { id: { in: ramdomArray } } })
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
        PrismaPaginate()(
          client.model,
          findManyArgs,
          paginationOrCallback as Pagination.Arguments,
          (error, result) => {
            resolve([error, result]);
          }
        );
      }),
      new Promise((resolve) => {
        PrismaPaginate(client.model)(
          findManyArgs,
          paginationOrCallback as Pagination.Arguments,
          (error, result) => {
            resolve([error, result]);
          }
        );
      }),
      new Promise((resolve) => {
        PrismaPaginate(client.model)(
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
        PrismaPaginate()(
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
          expect(result).toStrictEqual(ramdomIds);
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
          expect(result.result).toStrictEqual([ramdomIds[0]]);
          expect(result.count).toBe(ramdomIds.length);
          expect(result.hasNextPage).toBe(true);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(ramdomIds.length);
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
          expect(result.result).toStrictEqual([ramdomIds[0]]);
          expect(result.count).toBe(ramdomIds.length);
          expect(result.hasNextPage).toBe(true);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(ramdomIds.length);
        });
      })
      .finally(done);
  });

  it("page == totalPages", (done) => {
    testPrismaPaginate<Result.Pagination<typeof client.model>>(
      {},
      { limit: 1, page: ramdomIds.length }
    )
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.result).toStrictEqual([
            ramdomIds[ramdomIds.length - 1],
          ]);
          expect(result.count).toBe(ramdomIds.length);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(true);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(ramdomIds.length);
          expect(result.totalPages).toBe(ramdomIds.length);
        });
      })
      .finally(done);
  });
});
