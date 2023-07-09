import { ExceedCount, ExceedTotalPages } from "./exceptions";

export interface PaginationArgs extends Partial<PaginationOptions> {
  /**
   * Paginate starting from 1
   *
   * If enabled it overwrite 'pageIndex'
   *
   * @see {@link PaginationArgs.pageIndex}
   * @default 1
   */
  page?: number;
  /**
   * Paginate like array index staring from 0
   *
   * @see {@link PaginationArgs.page}
   * @default 0
   */
  pageIndex?: number;
  /**
   * Limit how much rows to return
   */
  limit: number;
}

export interface PaginationOptions {
  /**
   * @see {@link ExceedCount}
   * @default false
   */
  exceedCount: boolean;
  /**
   * @default false
   * @see {@link ExceedTotalPages}
   */
  exceedTotalPages: boolean;
}

export interface IPagination
  extends Required<Omit<PaginationArgs, "pageIndex">> {
  /**
   * Total of pages based on pagination arguments
   */
  totalPages: number;
  /**
   * If has result on next page index
   */
  hasNextPage: boolean;
  /**
   * If has result on last page index
   */
  hasPrevPage: boolean;
  /**
   * Count how many rows on has on table/model with query filter
   */
  count: number;
}

export type PageArgs =
  | Partial<Pick<PaginationArgs, "page" | "pageIndex">>
  | number;

export class Pagination implements IPagination {
  public constructor(
    public limit: number = NaN,
    public page: number = 1,
    public count: number = NaN,
    public readonly exceedCount: boolean = false,
    public readonly exceedTotalPages: boolean = false
  ) {
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

  private validateExceedTotalPages(): void {
    if (this.exceedTotalPages && this.page > this.totalPages)
      throw new ExceedTotalPages(this);
  }

  private validateExceedCount(): void {
    if (this.exceedCount && this.limit * this.page > this.count)
      throw new ExceedCount(this);
  }

  public static extractCount(count: any): number {
    return typeof count === "number"
      ? count
      : Array.isArray(count)
      ? Number(count.at(0)?.count)
      : count?._all || count?._count || NaN;
  }

  public static offsetPage(page: PageArgs): number {
    return typeof page === "number"
      ? page > 0
        ? page - 1
        : page
      : typeof page.page === "number"
      ? Pagination.offsetPage(page.page)
      : typeof page.pageIndex === "number"
      ? page.pageIndex
      : 0;
  }

  public static offset(limit: number, page: PageArgs): number {
    return limit * Pagination.offsetPage(page);
  }

  public static initialPage(page: PageArgs): number {
    return typeof page === "number"
      ? page === 0
        ? 1
        : page
      : typeof page.page === "number"
      ? Pagination.initialPage(page.page)
      : typeof page.pageIndex === "number"
      ? page.pageIndex + 1
      : 1;
  }
}
