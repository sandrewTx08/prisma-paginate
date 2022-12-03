import { PaginationExceed } from "./errors";
import {
  Model,
  ModelArgs,
  PaginationArgs,
  PaginateReturn,
  CallbackResult,
  ModelReturnAwaited,
  Pagination,
} from "./model";

function paginateArgs<T extends Model>(
  count: number,
  findManyArgs: ModelArgs<T>,
  pagination: PaginationArgs
): ModelArgs<T> {
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
): PaginateReturn<T, any> {
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
  callback: CallbackResult<T, Pagination>
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
): Promise<PaginateReturn<T, Pagination>>;
function prismaPaginate<T extends Model>(
  model: T,
  findManyArgs: ModelArgs<T>
): Promise<PaginateReturn<T>>;
function prismaPaginate<
  T extends Model,
  PC extends PaginationArgs | CallbackResult<T, P>,
  P extends PC extends PaginationArgs ? Pagination : Partial<Pagination>
>(
  model: T,
  findManyArgs: ModelArgs<T>,
  paginationOrCallback?: PC,
  callback?: CallbackResult<T, P>
) {
  return new Promise<PaginateReturn<T, P>>((resolve, reject) => {
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
