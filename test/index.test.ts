import { PrismaClient } from "@prisma/client";
import paginator, {
  PaginationArguments,
  PaginationCallback,
  PaginationResult,
  PrismaModelFindManyArguments,
  WithoutPaginationResult,
} from "../src";
import { createRandomArray } from "./utils";

let client: PrismaClient;
type Model = typeof client.model;

function testPaginate<
  Result extends WithoutPaginationResult<Model> | PaginationResult<Model>
>(
  findManyArgs: PrismaModelFindManyArguments<Model>,
  paginationOrCallback?:
    | PaginationArguments
    | PaginationCallback<Model, WithoutPaginationResult<Model>>
): Promise<[Error | null, Result][]> {
  return Promise.all<any>([
    new Promise((resolve) => {
      paginator()(
        client.model,
        findManyArgs,
        paginationOrCallback as PaginationArguments,
        (error, result) => {
          resolve([error, result]);
        }
      );
    }),
    new Promise((resolve) => {
      paginator(client.model)(
        findManyArgs,
        paginationOrCallback as PaginationArguments,
        (error, result) => {
          resolve([error, result]);
        }
      );
    }),
    new Promise((resolve) => {
      paginator(client.model)(
        findManyArgs,
        paginationOrCallback as PaginationArguments
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
      paginator()(
        client.model,
        findManyArgs,
        paginationOrCallback as PaginationArguments
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

describe("random array", () => {
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

  it("without pagination", (done) => {
    testPaginate<WithoutPaginationResult<Model>>({})
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result).toStrictEqual(randomIds);
        });
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    testPaginate<PaginationResult<Model>>({}, { limit: 1, page: 0 })
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
    testPaginate<PaginationResult<Model>>({}, { limit: 1, page: 1 })
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
    testPaginate<PaginationResult<Model>>(
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
    testPaginate<PaginationResult<Model>>(
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
    testPaginate<PaginationResult<Model>>(
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

describe("count == 0", () => {
  client = new PrismaClient();
  client.model.count = async function (..._: any[]) {
    return 0;
  } as unknown as typeof client.model.count;
  client.model.findMany = async function (..._: any[]) {
    return new Array(await client.model.count());
  } as unknown as typeof client.model.findMany;

  it("without pagination", (done) => {
    testPaginate<WithoutPaginationResult<Model>>({})
      .then((results) => {
        results.forEach(([error]) => {
          expect(error).toBe(null);
        });
      })
      .finally(done);
  });

  it("page == 0", (done) => {
    testPaginate<PaginationResult<Model>>({}, { limit: 1, page: 0 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.count).toBe(0);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(0);
        });
      })
      .finally(done);
  });

  it("page == 1", (done) => {
    testPaginate<PaginationResult<Model>>({}, { limit: 1, page: 1 })
      .then((results) => {
        results.forEach(([error, result]) => {
          expect(error).toBe(null);
          expect(result.count).toBe(0);
          expect(result.hasNextPage).toBe(false);
          expect(result.hasPrevPage).toBe(false);
          expect(result.limit).toBe(1);
          expect(result.page).toBe(1);
          expect(result.totalPages).toBe(0);
        });
      })
      .finally(done);
  });
});
