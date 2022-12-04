import { ErrorTotalPages } from "./errors";
import { Model, Pagination, Result } from "./types";

class Paginate<T extends Model.Object> {
  constructor(public count: number, public pagination: Pagination.Args) {}

  args(findManyArgs: Model.Args<T>): Model.Args<T> {
    findManyArgs = {
      ...findManyArgs,
      take: this.pagination.limit,
      skip: this.pagination.limit * this.pagination.page,
    };

    return findManyArgs;
  }

  result(result: Model.FindManyReturn<T>): Result.WithPagination<T> {
    const totalPages = Math.round(this.count / this.pagination.limit),
      { limit, page } = this.pagination,
      hasNextPage = page < totalPages,
      hasPrevPage = page * limit > 0 || !hasNextPage,
      pagination = {
        count: this.count,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        limit,
        result,
      };

    if (page > totalPages) {
      throw new ErrorTotalPages(pagination);
    } else {
      return pagination;
    }
  }
}

export { Paginate };
