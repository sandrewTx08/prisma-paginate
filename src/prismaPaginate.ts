import { PrismaPromise } from "@prisma/client";

type ResultCallback<T extends Model> = (
  error?: Error | null,
  result?: ModelResult<T>
) => void;

type Model = {
  findMany(...args: any[]): PrismaPromise<any>;
  count(...args: any[]): PrismaPromise<number>;
};

type ModelArgs<T extends Model> = Parameters<T["findMany"]>[0];

type ModelResult<T extends Model> = Awaited<ReturnType<T["findMany"]>>;

type PaginationOptions = { page: number; limit: number };

function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  pagination: PaginationOptions,
  callback: ResultCallback<T>
): void;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  callbackWithoutPagination: ResultCallback<T>
): void;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  paginationWithoutCallback: PaginationOptions
): Promise<ModelResult<T>>;
function prismaPaginate<T extends Model>(
  model: Model,
  findManyArgs: ModelArgs<Model>
): Promise<ModelResult<T>>;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  paginationOrCallback?: PaginationOptions | ResultCallback<T>,
  callback?: ResultCallback<T>
) {
  return new Promise<ModelResult<T>>((resolve, reject) => {
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
        callback(reason);
      } else if (typeof paginationOrCallback === "function") {
        paginationOrCallback(reason);
      } else {
        throw reason;
      }
    });
}

export default prismaPaginate;
