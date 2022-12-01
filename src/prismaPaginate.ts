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
  callback: (error: Error | null, result: Result) => void
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
  callbackWithoutPagination: (error: Error | null, result: Result) => void
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
>(model: Model, findManyArgs: FindManyArgs): Promise<Result>;
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
    | ((error: Error | null, result: Result) => void),
  callback?: (error: Error | null, result: Result) => void
) {
  return new Promise<Result>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      model
        .count(findManyArgs)
        .then((count) => {
          findManyArgs = {
            ...findManyArgs,
            take: paginationOrCallback.limit,
            skip: paginationOrCallback.page * paginationOrCallback.limit,
          };

          if (findManyArgs.skip > count) {
            reject("Pagination exceed the total of rows");
          } else {
            model.findMany(findManyArgs).then(resolve);
          }
        })
        .catch(reject);
    } else {
      model.findMany(findManyArgs).then(resolve);
    }
  })
    .then((value) => {
      if (callback) {
        callback(null, value);
      } else if (typeof paginationOrCallback === "function") {
        paginationOrCallback(null, value);
      } else {
        return value;
      }
    })
    .catch((reason) => {
      if (callback) {
        callback(reason, [] as Result);
      } else if (typeof paginationOrCallback === "function") {
        paginationOrCallback(reason, [] as Result);
      } else {
        throw reason;
      }
    });
}

export default prismaPaginate;
