import { Model, Pagination, Result } from "./types";
import { Paginate } from "./paginate";

function paginate<Model extends Model.Object>(
  model: Model,
  findManyArgs: Model.Args<Model>,
  pagination: Pagination.Args,
  callback: Result.Callback<Model, Result.WithPagination<Model>>
): void;
function paginate<Model extends Model.Object>(
  model: Model,
  findManyArgs: Model.Args<Model>,
  callbackWithoutPagination: Result.Callback<
    Model,
    Result.WithoutPagination<Model>
  >
): void;
function paginate<Model extends Model.Object>(
  model: Model,
  findManyArgs: Model.Args<Model>,
  paginationWithoutCallback: Pagination.Args
): Promise<Result.WithPagination<Model>>;
function paginate<Model extends Model.Object>(
  model: Model,
  findManyArgs: Model.Args<Model>
): Promise<Result.WithoutPagination<Model>>;
function paginate<
  Model extends Model.Object,
  PaginationOrCallback extends Pagination.Args | Result.Callback<Model, Result>,
  Result extends PaginationOrCallback extends Pagination.Args
    ? Result.WithPagination<Model>
    : Result.WithoutPagination<Model>
>(
  model: Model,
  findManyArgs: Model.Args<Model>,
  paginationOrCallback?: PaginationOrCallback,
  callback?: Result.Callback<Model, Result>
) {
  const result = new Promise<Result>((resolve, reject) => {
    if (typeof paginationOrCallback === "object") {
      model.count(findManyArgs).then((count) => {
        const paginate = new Paginate<Model>(count, paginationOrCallback);
        model
          .findMany(paginate.args(findManyArgs))
          .then((result) => paginate.result(result) as Result)
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

export { paginate };
