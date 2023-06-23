import { ExceedCount, ExceedTotalPages } from "./pagination";
import type { NextPage, Pagination } from "./pagination";

export interface IPaginationResult<Result = unknown>
  extends Required<Pagination> {
  result: Result;
  nextPage: NextPage<Result>;
}

export class PaginationResult<Result> implements IPaginationResult<Result> {
  public constructor(
    public readonly count: number,
    public readonly page: number,
    public readonly limit: number,
    public readonly exceedCount: boolean,
    public readonly exceedTotalPages: boolean,
    public readonly result: Result,
    public readonly nextPage: NextPage<Result>
  ) {
    this.validate();
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

  private validate(): void {
    if (this.exceedCount && this.limit * this.page > this.count)
      throw new ExceedCount(this);
    else if (this.exceedTotalPages && this.page > this.totalPages)
      throw new ExceedTotalPages(this);
  }
}
