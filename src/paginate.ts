import { ErrorTotalPages } from "./errors";
import { Model, Pagination, Result } from "./types";

class Paginate<T extends Model.Object> {
  constructor(public count: number, public pagination: Pagination.Args) {}

  args(findManyArgs: Model.Args<T>): Model.Args<T> {
    findManyArgs = {
      ...findManyArgs,
      take: this.pagination.limit,
      skip:
        this.pagination.limit *
        (this.pagination.page > 0
          ? this.pagination.page - 1
          : this.pagination.page),
    };

    return findManyArgs;
  }

  result(result: Model.FindManyReturn<T>): Result.WithPagination<T> {
    const totalPages = Math.round(this.count / this.pagination.limit),
      { limit } = this.pagination,
      add_page = this.pagination.page > 0,
      page = add_page ? this.pagination.page - 1 : 1,
      hasNextPage = (add_page ? page + 1 : page) < totalPages,
      hasPrevPage = limit * (add_page ? this.pagination.page - 1 : 0) > 0,
      pagination: Pagination.Result = {
        count: this.count,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page: add_page ? page + 1 : page,
        limit,
      };

    if (limit * this.pagination.page > this.count) {
      throw new ErrorTotalPages(pagination);
    } else {
      return { ...pagination, result };
    }
  }
}

export { Paginate };
