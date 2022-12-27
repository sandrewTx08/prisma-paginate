import { TotalPagesExceed } from "./errors";
import { PrismaModel, Pagination, Result } from "./types";

export class Paginate<Model extends PrismaModel.Properties> {
  constructor(public model: Model) {}

  paginate(
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Options,
    callback: Result.Callback<Model, Result.WithPagination<Model>>
  ): void;
  paginate(
    findManyArgs: PrismaModel.Arguments<Model>,
    callbackWithoutPagination: Result.Callback<
      Model,
      Result.WithoutPagination<Model>
    >
  ): void;
  paginate(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationWithoutCallback: Pagination.Options
  ): Promise<Result.WithPagination<Model>>;
  paginate(
    findManyArgs: PrismaModel.Arguments<Model>
  ): Promise<Result.WithoutPagination<Model>>;
  paginate<
    PaginationOrCallback extends
      | Pagination.Options
      | Result.Callback<Model, Result>,
    Result extends PaginationOrCallback extends Pagination.Options
      ? Result.WithPagination<Model>
      : Result.WithoutPagination<Model>
  >(
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?: PaginationOrCallback,
    callback?: Result.Callback<Model, Result>
  ) {
    const result = new Promise<Result>((resolve, reject) => {
      if (typeof paginationOrCallback === "object") {
        this.model.count(findManyArgs).then((count) => {
          const paginate = new Paginate(this.model);
          this.model
            .findMany(paginate.args(paginationOrCallback, findManyArgs))
            .then(
              (result) =>
                paginate.result(paginationOrCallback, count, result) as Result
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

    if (!(callback || typeof paginationOrCallback === "function")) {
      return result;
    }
  }

  static paginate<Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Options,
    callback: Result.Callback<Model, Result.WithPagination<Model>>
  ): void;
  static paginate<Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    callbackWithoutPagination: Result.Callback<
      Model,
      Result.WithoutPagination<Model>
    >
  ): void;
  static paginate<Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationWithoutCallback: Pagination.Options
  ): Promise<Result.WithPagination<Model>>;
  static paginate<Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>
  ): Promise<Result.WithoutPagination<Model>>;
  static paginate<
    Model extends PrismaModel.Properties,
    PaginationOrCallback extends
      | Pagination.Options
      | Result.Callback<Model, Result>,
    Result extends PaginationOrCallback extends Pagination.Options
      ? Result.WithPagination<Model>
      : Result.WithoutPagination<Model>
  >(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    paginationOrCallback?: PaginationOrCallback,
    callback?: Result.Callback<Model, Result>
  ) {
    const result = new Promise<Result>((resolve, reject) => {
      if (typeof paginationOrCallback === "object") {
        model.count(findManyArgs).then((count) => {
          const paginate = new Paginate(model);
          model
            .findMany(paginate.args(paginationOrCallback, findManyArgs))
            .then(
              (result) =>
                paginate.result(paginationOrCallback, count, result) as Result
            )
            .then(resolve);
        }, reject);
      } else {
        model.findMany(findManyArgs).then(resolve);
      }
    });

    result.then(
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

    if (!(callback || typeof paginationOrCallback === "function")) {
      return result;
    }
  }

  args(
    pagination: Pagination.Options,
    findManyArgs: PrismaModel.Arguments<Model>
  ): PrismaModel.Arguments<Model> {
    return {
      ...findManyArgs,
      take: pagination.limit,
      skip:
        pagination.limit *
        (pagination.page > 0 ? pagination.page - 1 : pagination.page),
    };
  }

  result(
    paginationOptions: Pagination.Options,
    count: number,
    result: PrismaModel.FindManyReturn<Model>
  ): Result.WithPagination<Model> {
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
