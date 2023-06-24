import { ExceedCount, ExceedTotalPages } from "./pagination";
import type { NextPage, Pagination, PaginationArgs } from "./pagination";

export interface IPaginationResult<Result = unknown>
  extends Required<Pagination> {
  result: Result;
  nextPage: NextPage<Result>;
}

export class PaginationResult<Result> implements IPaginationResult<Result> {
  public readonly page: number;

  public constructor(
    public readonly count: number,
    page: Partial<Pick<PaginationArgs, "page" | "pageIndex">>,
    public readonly limit: number,
    public readonly exceedCount: boolean,
    public readonly exceedTotalPages: boolean,
    public readonly result: Result,
    public readonly nextPage: NextPage<Result>
  ) {
    this.page = this.pageInit(page);
    this.validateExceedTotalPages();
    this.validateExceedCount();
  }

  public get hasNextPage(): boolean {
    return this.page < this.totalPages;
  }

  public get hasPrevPage(): boolean {
    return this.count > 0 && this.page > 1 && this.page <= this.totalPages + 1;
  }

  public get totalPages(): number {
    return Math.ceil(this.count / this.limit);
  }

  private pageInit({
    page,
    pageIndex,
  }: Partial<Pick<PaginationArgs, "page" | "pageIndex">>): number {
    return typeof page === "number"
      ? page === 0
        ? 1
        : page
      : typeof pageIndex === "number"
      ? pageIndex + 1
      : 1;
  }

  public validateExceedTotalPages(): void {
    if (this.exceedTotalPages && this.page > this.totalPages)
      throw new ExceedTotalPages(this);
  }

  public validateExceedCount(): void {
    if (this.exceedCount && this.limit * this.page > this.count)
      throw new ExceedCount(this);
  }

  public static extractCount(count: any): number {
    return typeof count === "number"
      ? count
      : count?._all || count?._count || NaN;
  }

  public static nextPageArgs(args: PaginationArgs): PaginationArgs {
    return {
      ...args,
      page: (args.page || 0) + 1,
      pageIndex:
        typeof args.page === "number" ? undefined : (args.pageIndex || 0) + 1,
    };
  }
}
