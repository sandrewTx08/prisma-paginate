import {
  ExceedCount,
  NextPage,
  Pagination,
  PaginationArgs,
  PaginationResult,
} from ".";
import { Paginator } from "./paginator";
import {
  PrismaFindManyArgs,
  PrismaFindManyReturn,
  PrismaModel,
} from "./prisma";

export class Paginate<Model extends PrismaModel> {
  constructor(
    private findManyArgs: PrismaFindManyArgs<Model>,
    private paginationArgs: PaginationArgs,
    private paginator: Paginator<Model>
  ) {}

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

  formatCountArgs(): Partial<PrismaFindManyArgs<Model>> {
    const args = this.findManyArgs;
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

    return (callback) => {
      this.paginator.paginate(
        { ...this.findManyArgs, ...this.paginationArgs },
        callback
      );
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
      count > 0
        ? (page * this.paginationArgs.limit) / count - 1 === 0 ||
          page - 1 === totalPages
        : false;
    const pagination: Pagination<Model> = {
      limit: this.paginationArgs.limit,
      nextPage: this.nextPage(),
      count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
    };

    if (
      (typeof this.paginationArgs.exceedCount === "boolean" ||
        this.paginator.options?.exceedCount) &&
      this.paginationArgs.limit * page > count
    ) {
      throw new ExceedCount(pagination);
    } else {
      return { ...pagination, result: findManyReturn };
    }
  }
}
