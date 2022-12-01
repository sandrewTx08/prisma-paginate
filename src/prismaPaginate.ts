import { PrismaPromise } from "@prisma/client";

function prismaPaginate<
  T extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Q extends Parameters<T["findMany"]>[0],
  R extends Awaited<ReturnType<T["findMany"]>>
>(
  table: T,
  query: Q,
  pagination: { page: number; limit: number },
  callback: (result: R) => void
): void;
function prismaPaginate<
  T extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Q extends Parameters<T["findMany"]>[0],
  R extends Awaited<ReturnType<T["findMany"]>>
>(table: T, query: Q, callbackWithoutPagination: (result: R) => void): void;
function prismaPaginate<
  T extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Q extends Parameters<T["findMany"]>[0],
  R extends Awaited<ReturnType<T["findMany"]>>
>(
  table: T,
  query: Q,
  paginationWithoutCallback: { page: number; limit: number }
): Promise<R>;
function prismaPaginate<
  T extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Q extends Parameters<T["findMany"]>[0],
  R extends Awaited<ReturnType<T["findMany"]>>
>(
  table: T,
  query: Q,
  paginationOrCallback?:
    | { page: number; limit: number }
    | ((result: R) => void),
  callback?: (result: R) => void
) {
  return new Promise<R | void>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      table.count(query).then((count) => {
        query = {
          ...query,
          take: paginationOrCallback.limit,
          skip: paginationOrCallback.page * paginationOrCallback.limit,
        };

        if (query.skip > count) reject("Pagination exceed the total of rows");

        if (callback) {
          table.findMany(query).then(callback);
          resolve();
        } else {
          table.findMany(query).then(resolve);
        }
      });
    } else if (typeof paginationOrCallback === "function") {
      if (callback) {
        table.findMany(query).then(callback);
        resolve();
      } else {
        table.findMany(query).then(resolve);
      }
    }
  });
}

export default prismaPaginate;
