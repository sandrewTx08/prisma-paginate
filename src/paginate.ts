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
        (paginationArgs.page !== undefined
          ? paginationArgs.page > 0
            ? paginationArgs.page - 1
            : paginationArgs.page
          : paginationArgs.pageIndex !== undefined
          ? paginationArgs.pageIndex
          : 0),
    };
  }

  paginateResult(
    paginationArgs: Pagination.Arguments,
    count: number,
    findManyReturn: Result.WithoutPagination<Model>
  ): Result.Pagination<Model> {
    const totalPages = Math.round(count / paginationArgs.limit);
    const page =
      paginationArgs.page !== undefined
        ? paginationArgs.page === 0
          ? 1
          : paginationArgs.page
        : paginationArgs.pageIndex !== undefined
        ? paginationArgs.pageIndex + 1
        : 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage =
      (count > 0 && (page * paginationArgs.limit) / count - 1 === 0) ||
      page - 1 === totalPages;
    const pagination: Pagination.Value = {
      limit: paginationArgs.limit,
      count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
    };

    if (
      paginationArgs.exceedCount === true &&
      paginationArgs.limit * page > count
    ) {
      throw new ExceedCount(pagination);
    } else {
      return { ...pagination, result: findManyReturn };
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
export function paginate<Model extends PrismaModel.Properties>(
  model: Model,
  options: Partial<Pagination.Options>
): WithModel<Model>;
export function paginate<Model extends PrismaModel.Properties>(
  model?: Model,
  options?: Partial<Pagination.Options>
) {
  function withModel(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Arguments
      | Result.Callback<Model, Result.WithoutPagination<Model>>,
    callback?: Result.Callback<Model, Result.Pagination<Model>>
  ) {
    paginationOrCallback =
      typeof paginationOrCallback === "object" && options
        ? { ...options, ...paginationOrCallback }
        : paginationOrCallback;

    return new Paginate(model!).paginateModel(
      findManyArgs,
      paginationOrCallback,
      callback
    );
  }

  return model ? withModel : byModel;
}

export default paginate;
