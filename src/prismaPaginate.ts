import { PrismaPromise } from "@prisma/client";

function prismaPaginate<
  Model extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  FindManyArgs extends Parameters<Model["findMany"]>[0],
  Result extends Awaited<ReturnType<Model["findMany"]>>
>(
  model: Model,
  findManyArgs: FindManyArgs,
  pagination: { page: number; limit: number },
  callback: (result: Result) => void
): void;
function prismaPaginate<
  Model extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  FindManyArgs extends Parameters<Model["findMany"]>[0],
  R extends Awaited<ReturnType<Model["findMany"]>>
>(
  model: Model,
  findManyArgs: FindManyArgs,
  callbackWithoutPagination: (result: R) => void
): void;
function prismaPaginate<
  Model extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  FindManyArgs extends Parameters<Model["findMany"]>[0],
  Result extends Awaited<ReturnType<Model["findMany"]>>
>(
  model: Model,
  findManyArgs: FindManyArgs,
  paginationWithoutCallback: { page: number; limit: number }
): Promise<Result>;
function prismaPaginate<
  Model extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  FindManyArgs extends Parameters<Model["findMany"]>[0],
  Result extends Awaited<ReturnType<Model["findMany"]>>
>(
  model: Model,
  findManyArgs: FindManyArgs,
  paginationOrCallback?:
    | { page: number; limit: number }
    | ((result: Result) => void),
  callback?: (result: Result) => void
) {
  return new Promise<Result | void>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      model.count(findManyArgs).then((count) => {
        findManyArgs = {
          ...findManyArgs,
          take: paginationOrCallback.limit,
          skip: paginationOrCallback.page * paginationOrCallback.limit,
        };

        if (findManyArgs.skip > count)
          reject("Pagination exceed the total of rows");
        else {
          if (callback) {
            model.findMany(findManyArgs).then(callback);
            resolve();
          } else {
            model.findMany(findManyArgs).then(resolve);
          }
        }
      });
    } else if (typeof paginationOrCallback === "function") {
      model.findMany(findManyArgs).then(paginationOrCallback);
    } else {
      model.findMany(findManyArgs).then(resolve);
    }
  });
}

export default prismaPaginate;
