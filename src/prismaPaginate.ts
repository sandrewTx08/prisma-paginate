import { PrismaPromise } from "@prisma/client";

function prismaPaginate<
  Table extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends ReturnType<Table["findMany"]>
>(
  table: Table,
  query: Query,
  pagination: { page: number; limit: number },
  callback?: (result: Result) => void
): void;
function prismaPaginate<
  Table extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends ReturnType<Table["findMany"]>
>(table: Table, query: Query, callback: (result: Result) => void): void;
function prismaPaginate<
  Table extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends ReturnType<Table["findMany"]>
>(
  table: Table,
  query: Query,
  pagination?: { page: number; limit: number }
): Promise<Result>;
function prismaPaginate<
  Table extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends ReturnType<Table["findMany"]>
>(
  table: Table,
  query: Query,
  paginationOrCallback?:
    | { page: number; limit: number }
    | ((result: Result) => void),
  callback?: (result: Result) => void
) {
  return new Promise<Result>((resolve, rejects) => {
    table.count(query).then((count) => {
      query =
        paginationOrCallback?.limit || paginationOrCallback?.page
          ? {
              ...query,
              take: paginationOrCallback.limit,
              skip: paginationOrCallback.page * paginationOrCallback?.limit,
            }
          : query;

      if (paginationOrCallback) {
        if (query.skip > count) rejects("Pagination exceed the total of rows");
      }

      table.findMany(query).then(resolve);
    });
  });
}

export default prismaPaginate;
