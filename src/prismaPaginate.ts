import { PaginationExceed } from "./errors";
import {
  Model,
  ModelArgs,
  PaginationArgs,
  PaginateReturn,
  CallbackResult,
  ModelReturnAwaited,
} from "./model";

function paginateArgs<T extends Model>(
  count: number,
  findManyArgs: ModelArgs<T>,
  pagination: PaginationArgs
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

function paginateReturn<T extends Model>(
  result: ModelReturnAwaited<T>,
  count?: number,
  pagination?: PaginationArgs
): PaginateReturn<T> {
  if (count && pagination) {
    const totalPages = Math.round(count / pagination.limit),
      { limit, page } = pagination,
      hasNextPage = page < totalPages,
      hasPrevPage = page * limit > 0 || !hasNextPage;

    return {
      count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
      limit,
      result,
    };
  } else {
    return { result };
  }
}

function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  pagination: PaginationArgs,
  callback: CallbackResult<T>
): void;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  callbackWithoutPagination: CallbackResult<T>
): void;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  paginationWithoutCallback: PaginationArgs
): Promise<PaginateReturn<T>>;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>
): Promise<PaginateReturn<T>>;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>,
  paginationOrCallback?: PaginationArgs | CallbackResult<T>,
  callback?: CallbackResult<T>
) {
  return new Promise<PaginateReturn<T>>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      model
        .count(findManyArgs)
        .then((count) => {
          const args = paginateArgs(count, findManyArgs, paginationOrCallback);
          model
            .findMany(args)
            .then((result) =>
              paginateReturn(result, count, paginationOrCallback)
            )
            .then(resolve);
        })
        .catch(reject);
    } else {
      model
        .findMany(findManyArgs)
        .then((result) => paginateReturn(result))
        .then(resolve);
    }
  }).then(
    (value) => {
      if (callback) {
        callback(null, value);
      } else if (typeof paginationOrCallback === "function") {
        paginationOrCallback(null, value);
      } else {
        return value;
      }
    },
    (reason) => {
      if (callback) {
        callback(reason);
      } else if (typeof paginationOrCallback === "function") {
        paginationOrCallback(reason);
      } else {
        throw reason;
      }
    }
  );
}

export { prismaPaginate };
