import type { IPaginationResult } from "./result";

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

export interface Pagination extends Omit<PaginationArgs, "pageIndex"> {
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

export type NextPage<Result> = () => Promise<IPaginationResult<Result>>;

export interface PaginationException {
  paginationResult: IPaginationResult;
}

export class ExceedCount extends Error implements PaginationException {
  constructor(public paginationResult: IPaginationResult) {
    super("Pagination exceed count of rows");
  }
}

export class ExceedTotalPages extends Error implements PaginationException {
  constructor(public paginationResult: IPaginationResult) {
    super("Pagination exceed total of pages");
  }
}
