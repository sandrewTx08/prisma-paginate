import {
  ExceedCount,
  ExceedTotalPages,
  NextPage,
  Pagination,
  PaginationArgs,
  PaginationResult,
} from ".";
import { Paginator } from "./paginator";
import {
  PrismaFindManyArgs,
  PrismaFindManyReturn,
  PrismaClientModel,
} from "./prisma";

export class Paginate<Model extends PrismaClientModel> {
  constructor(
    private findManyArgs: PrismaFindManyArgs<Model>,
    private paginationArgs: PaginationArgs,
    private paginator: Paginator<Model>
  ) {
    this.paginationArgs = { ...this.paginator.options, ...this.paginationArgs };
  }

  formatfindManyArgs(): PrismaFindManyArgs<Model> {
    return {
      ...this.findManyArgs,
      take: this.paginationArgs.limit,
      skip:
        this.paginationArgs.limit *
        (typeof this.paginationArgs.page === "number"
          ? this.paginationArgs.page > 0
            ? this.paginationArgs.page - 1
            : this.paginationArgs.page
          : typeof this.paginationArgs.pageIndex === "number"
          ? this.paginationArgs.pageIndex
          : 0),
    };
  }

  formatCountArgs(): Partial<PaginationArgs> {
    const args: Partial<PaginationArgs> = this.findManyArgs;
    delete args.page;
    delete args.exceedCount;
    delete args.pageIndex;
    delete args.limit;
    return args;
  }

  nextPage(): NextPage<Model> {
    this.paginationArgs = {
      ...this.paginationArgs,
      page: (this.paginationArgs.page || 0) + 1,
      pageIndex:
        typeof this.paginationArgs.page === "number"
          ? undefined
          : (this.paginationArgs.pageIndex || 0) + 1,
    };

    return {
      nextPage: (callback) =>
        this.paginator.paginate(
          { ...this.findManyArgs, ...this.paginationArgs },
          callback
        ),
    };
  }

  result(
    count: number,
    findManyReturn: PrismaFindManyReturn<Model>
  ): PaginationResult<Model> {
    const totalPages = Math.round(count / this.paginationArgs.limit);
    const page =
      typeof this.paginationArgs.page === "number"
        ? this.paginationArgs.page === 0
          ? 1
          : this.paginationArgs.page
        : typeof this.paginationArgs.pageIndex === "number"
        ? this.paginationArgs.pageIndex + 1
        : 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage =
      count > 0 && page > 1
        ? (page * this.paginationArgs.limit) / count - 1 === 0 ||
          page - 1 === totalPages
        : false;
    const pagination: Pagination<Model> = {
      ...this.nextPage(),
      limit: this.paginationArgs.limit,
      count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
    };

    if (
      this.paginationArgs.exceedCount === true &&
      this.paginationArgs.limit * page > count
    ) {
      throw new ExceedCount(pagination);
    } else if (
      this.paginationArgs.exceedTotalPages === true &&
      page > totalPages
    ) {
      throw new ExceedTotalPages(pagination);
    } else {
      return { ...pagination, result: findManyReturn };
    }
  }
}
