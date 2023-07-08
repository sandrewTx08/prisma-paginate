import { Pagination } from "./pagination";
import type { IPagination } from "./pagination";

export type NextPage<Result> = Promise<IPaginationResult<Result>>;

export interface IPaginationResult<Result = unknown> extends IPagination {
  result: Result;
  nextPage(): NextPage<Result>;
}

export class PaginationResult<Result>
  extends Pagination
  implements IPaginationResult<Result>
{
  public nextPage(): NextPage<Result> {
    return this.model.paginate({ ...this, page: (this.page || 0) + 1 });
  }

  public constructor(
    { count, page, limit, exceedCount, exceedTotalPages }: IPagination,
    public readonly result: Result,
    private readonly model: any
  ) {
    super(count, page, limit, exceedCount, exceedTotalPages);
  }
}
