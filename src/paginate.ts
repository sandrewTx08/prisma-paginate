import { TotalPagesExceed } from "./errors";
import { PrismaModel, Pagination, Result, ByModel, WithModel } from "./types";

export class Paginate<Model extends PrismaModel.Properties> {
  constructor(public model: Model) {}

  paginateModel(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Options
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
    paginationOptions: Pagination.Options
  ): PrismaModel.Arguments<Model> {
    return {
      ...findManyArgs,
      take: paginationOptions.limit,
      skip:
        paginationOptions.limit *
        (paginationOptions.page > 0
          ? paginationOptions.page - 1
          : paginationOptions.page),
    };
  }

  paginateResult(
    paginationOptions: Pagination.Options,
    count: number,
    result: PrismaModel.FindManyReturn<Model>
  ): Result.Pagination<Model> {
    const totalPages = Math.round(count / paginationOptions.limit);
    const add_page = paginationOptions.page > 0;
    const page = add_page ? paginationOptions.page - 1 : 1;
    const hasNextPage = (add_page ? page + 1 : page) < totalPages;
    const hasPrevPage =
      paginationOptions.limit * (add_page ? paginationOptions.page - 1 : 0) > 0;
    const pagination: Pagination.Value = {
      count: count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page: add_page ? page + 1 : page,
      limit: paginationOptions.limit,
    };

    if (paginationOptions.limit * paginationOptions.page > count) {
      throw new TotalPagesExceed(pagination);
    } else {
      return { ...pagination, result };
    }
  }
}

export function byModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  paginationOrCallback?:
    | Pagination.Options
    | Result.Callback<Model, Result.WithoutPagination<Model>>,
  callback?: Result.Callback<Model, Result.Pagination<Model>>
) {
  return new Paginate(model).paginateModel(
    findManyArgs,
    paginationOrCallback,
    callback
  );
}

export function paginate<Model extends PrismaModel.Properties>(
  model: Model
): WithModel<Model>;
export function paginate(): ByModel;
export function paginate<Model extends PrismaModel.Properties>(model?: Model) {
  function withModel(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?:
      | Pagination.Options
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
