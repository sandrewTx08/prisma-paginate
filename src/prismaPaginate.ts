import { PrismaModel, Pagination, Result } from "./types";
import { Paginate } from "./paginate";

export function paginateUndefinedModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  pagination: Pagination.Options,
  callback: Result.Callback<Model, Result.WithPagination<Model>>
): void;
export function paginateUndefinedModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  callbackWithoutPagination: Result.Callback<
    Model,
    Result.WithoutPagination<Model>
  >
): void;
export function paginateUndefinedModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  paginationWithoutCallback: Pagination.Options
): Promise<Result.WithPagination<Model>>;
export function paginateUndefinedModel<Model extends PrismaModel.Properties>(
  model: Model,
  findManyArgs: PrismaModel.Arguments<Model>
): Promise<Result.WithoutPagination<Model>>;
export function paginateUndefinedModel<
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
        const paginate = new Paginate<Model>(paginationOrCallback);
        model
          .findMany(paginate.args(findManyArgs))
          .then((result) => paginate.result(count, result) as Result)
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

export function paginateDefinedModel<Model extends PrismaModel.Properties>(
  this: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  pagination: Pagination.Options,
  callback: Result.Callback<Model, Result.WithPagination<Model>>
): void;
export function paginateDefinedModel<Model extends PrismaModel.Properties>(
  this: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  callbackWithoutPagination: Result.Callback<
    Model,
    Result.WithoutPagination<Model>
  >
): void;
export function paginateDefinedModel<Model extends PrismaModel.Properties>(
  this: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  paginationWithoutCallback: Pagination.Options
): Promise<Result.WithPagination<Model>>;
export function paginateDefinedModel<Model extends PrismaModel.Properties>(
  this: Model,
  findManyArgs: PrismaModel.Arguments<Model>
): Promise<Result.WithoutPagination<Model>>;
export function paginateDefinedModel<
  Model extends PrismaModel.Properties,
  PaginationOrCallback extends
    | Pagination.Options
    | Result.Callback<Model, Result>,
  Result extends PaginationOrCallback extends Pagination.Options
    ? Result.WithPagination<Model>
    : Result.WithoutPagination<Model>
>(
  this: Model,
  findManyArgs: PrismaModel.Arguments<Model>,
  paginationOrCallback?: PaginationOrCallback,
  callback?: Result.Callback<Model, Result>
) {
  const result = new Promise<Result>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      this.count(findManyArgs).then((count) => {
        const paginate = new Paginate<Model>(paginationOrCallback);
        this.findMany(paginate.args(findManyArgs))
          .then((result) => paginate.result(count, result) as Result)
          .then(resolve);
      }, reject);
    } else {
      this.findMany(findManyArgs).then(resolve);
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

export default function paginate<Model extends PrismaModel.Properties>(
  model: Model
): typeof paginateDefinedModel;
export default function paginate(): typeof paginateUndefinedModel;
export default function paginate<Model extends PrismaModel.Properties>(
  model?: Model
) {
  if (model) {
    return paginateDefinedModel.bind(model);
  } else {
    return paginateUndefinedModel;
  }
}
