import { ExceedCount } from "./errors";
import { PrismaModel, Pagination, Result, ByModel, WithModel } from "./types";

export class Paginate<Model extends PrismaModel.Properties> {
  constructor(public model: Model) {}

  paginateModel(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Arguments
      | Result.Callback<Model, Result.WithoutPagination<Model>>,
    callback?: Result.Callback<Model, Result.Pagination<Model>>
  ) {
    const result = new Promise<
      Result.WithoutPagination<Model> | Result.Pagination<Model>
    >((resolve, reject) => {
      if (typeof paginationOrCallback === "object") {
        this.model.count(findManyArgs).then((count) => {
          this.model
            .findMany(
              this.paginateFindManyArgs(findManyArgs, paginationOrCallback)
            )
            .then((result) =>
              this.paginateResult(paginationOrCallback, count, result)
            )
            .then(resolve);
        }, reject);
      } else {
        this.model.findMany(findManyArgs).then(resolve);
      }
    });

    result.then(
      (value) => {
        if (callback) {
          callback(null, value);
        } else if (typeof paginationOrCallback === "function") {
          paginationOrCallback(null, value as Result.WithoutPagination<Model>);
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

    if (!(callback || typeof paginationOrCallback === "function")) {
      return result;
    }
  }

  paginateFindManyArgs(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationArgs: Pagination.Arguments
  ): PrismaModel.Arguments<Model> {
    return {
      ...findManyArgs,
      take: paginationArgs.limit,
      skip:
        paginationArgs.limit *
        (paginationArgs.pageZero
          ? paginationArgs.page
          : paginationArgs.page > 0
          ? paginationArgs.page - 1
          : paginationArgs.page),
    };
  }

  paginateResult(
    paginationArgs: Pagination.Arguments,
    count: number,
    result: PrismaModel.FindManyReturn<Model>
  ): Result.Pagination<Model> {
    const totalPages = Math.round(count / paginationArgs.limit);
    const gtZero = paginationArgs.page > 0;
    const page = paginationArgs.pageZero
      ? paginationArgs.page
      : gtZero
      ? paginationArgs.page - 1
      : 1;
    const hasNextPage =
      (paginationArgs.pageZero
        ? paginationArgs.page
        : gtZero
        ? page + 1
        : page) < totalPages;
    const hasPrevPage =
      paginationArgs.limit * (gtZero ? paginationArgs.page - 1 : 0) > 0;
    const pagination: Pagination.Value = {
      count: count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page: paginationArgs.pageZero
        ? paginationArgs.page + 1
        : gtZero
        ? page + 1
        : page,
      limit: paginationArgs.limit,
    };

    if (
      paginationArgs.exceedCount === undefined
        ? false
        : paginationArgs.exceedCount &&
          paginationArgs.limit * paginationArgs.page > count
    ) {
      throw new ExceedCount(pagination);
    } else {
      return { ...pagination, result };
    }
  }
}

export function byModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  paginationOrCallback?:
    | Pagination.Arguments
    | Result.Callback<Model, Result.WithoutPagination<Model>>,
  callback?: Result.Callback<Model, Result.Pagination<Model>>
) {
  return new Paginate(model).paginateModel(
    findManyArgs,
    paginationOrCallback,
    callback
  );
}

export function paginate(): ByModel;
export function paginate<Model extends PrismaModel.Properties>(
  model: Model
): WithModel<Model>;
export function paginate<Model extends PrismaModel.Properties>(model?: Model) {
  function withModel(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Arguments
      | Result.Callback<Model, Result.WithoutPagination<Model>>,
    callback?: Result.Callback<Model, Result.Pagination<Model>>
  ) {
    return new Paginate(model!).paginateModel(
      findManyArgs,
      paginationOrCallback,
      callback
    );
  }

  return model ? withModel : byModel;
}

export default paginate;
