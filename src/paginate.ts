import type { PaginationArgs, NextPage, ModelPaginationResult } from ".";
import { ExceedCount, ExceedTotalPages } from ".";
import { Paginator } from "./paginatorClass";
import type {
  PrismaFindManyArgs,
  PrismaFindManyReturn,
  PrismaClientModel,
} from "./prisma";

export class Paginate<Model extends PrismaClientModel> {
  private readonly paginate: PrismaFindManyArgs<Model> & PaginationArgs;

  constructor(
    findManyArgs: PrismaFindManyArgs<Model>,
    paginationArgs: PaginationArgs,
    private readonly paginator: Paginator<Model>
  ) {
    this.paginate = { ...findManyArgs, ...paginationArgs };
  }

  findManyArgs() {
    return {
      where: this.paginate.where,
      orderBy: this.paginate.orderBy,
      cursor: this.paginate.cursor,
      distinct: this.paginate.distinct,
      take: this.paginate.limit,
      include: this.paginate.include,
      select: this.paginate.select,
      skip:
        this.paginate.limit *
        (typeof this.paginate.page === "number"
          ? this.paginate.page > 0
            ? this.paginate.page - 1
            : this.paginate.page
          : typeof this.paginate.pageIndex === "number"
          ? this.paginate.pageIndex
          : 0),
    };
  }

  countArgs() {
    return {
      orderBy: this.paginate.orderBy,
      cursor: this.paginate.cursor,
      where: this.paginate.where,
      take: this.paginate.take,
      skip: this.paginate.skip,
    };
  }

  nextPage(): NextPage<ModelPaginationResult<Model>> {
    const paginate = {
      ...this.paginate,
      page: (this.paginate.page || 0) + 1,
      pageIndex:
        typeof this.paginate.page === "number"
          ? undefined
          : (this.paginate.pageIndex || 0) + 1,
    };

    return {
      nextPage: (callback) => this.paginator.paginate(paginate, callback),
    };
  }

  result(
    count: number | { _all: number },
    findManyReturn: PrismaFindManyReturn<Model>
  ): ModelPaginationResult<Model> {
    count = typeof count === "number" ? count : count._all;
    const totalPages = Math.ceil(count / this.paginate.limit);
    const page =
      typeof this.paginate.page === "number"
        ? this.paginate.page === 0
          ? 1
          : this.paginate.page
        : typeof this.paginate.pageIndex === "number"
        ? this.paginate.pageIndex + 1
        : 1;
    const hasNextPage = page < totalPages;
    const hasPrevPage = count > 0 && page > 1 && page <= totalPages + 1;
    const pagination: ModelPaginationResult<Model> = {
      ...this.nextPage(),
      limit: this.paginate.limit,
      exceedCount: this.paginate.exceedCount === true,
      exceedTotalPages: this.paginate.exceedTotalPages === true,
      result: findManyReturn,
      count,
      totalPages,
      hasNextPage,
      hasPrevPage,
      page,
    };

    if (pagination.exceedCount && this.paginate.limit * page > count)
      throw new ExceedCount(pagination);
    else if (pagination.exceedTotalPages && page > totalPages)
      throw new ExceedTotalPages(pagination);

    return pagination;
  }
}
