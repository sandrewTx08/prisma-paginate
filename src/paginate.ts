import { TotalPagesExceed } from "./errors";
import { PrismaModel, Pagination, Result } from "./types";

class Paginate<T extends PrismaModel.Properties> {
  constructor(public pagination: Pagination.Options) {}

  args(findManyArgs: PrismaModel.Arguments<T>): PrismaModel.Arguments<T> {
    return {
      ...findManyArgs,
      take: this.pagination.limit,
      skip:
        this.pagination.limit *
        (this.pagination.page > 0
          ? this.pagination.page - 1
          : this.pagination.page),
    };
  }

  result(
    count: number,
    result: PrismaModel.FindManyReturn<T>
  ): Result.WithPagination<T> {
    const totalPages = Math.round(count / this.pagination.limit);
    const add_page = this.pagination.page > 0;
    const page = add_page ? this.pagination.page - 1 : 1;
    const hasNextPage = (add_page ? page + 1 : page) < totalPages;
    const hasPrevPage =
      this.pagination.limit * (add_page ? this.pagination.page - 1 : 0) > 0;
    const pagination: Pagination.Value = {
      count: count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page: add_page ? page + 1 : page,
      limit: this.pagination.limit,
    };

    if (this.pagination.limit * this.pagination.page > count) {
      throw new TotalPagesExceed(pagination);
    } else {
      return { ...pagination, result };
    }
  }
}

export { Paginate };
