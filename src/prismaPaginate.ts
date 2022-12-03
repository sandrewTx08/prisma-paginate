import { PaginationExceed } from "./errors";
import {
  Model,
  ModelArgs,
  PaginationOptions,
  ResultCallback,
  ModelResult,
} from "./model";

function paginateArgs<T extends Model>(
  count: number,
  findManyArgs: ModelArgs<T>,
  pagination: PaginationOptions
) {
  findManyArgs = {
    ...findManyArgs,
    take: pagination.limit,
    skip: pagination.limit * pagination.page,
  };

  if (findManyArgs.skip > count) {
    throw new PaginationExceed(pagination);
  } else {
    return findManyArgs;
  }
}

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
  model: T,
  findManyArgs: ModelArgs<T>
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
          const args = paginateArgs(count, findManyArgs, paginationOrCallback);
          model.findMany(args).then(resolve);
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

export { prismaPaginate };
