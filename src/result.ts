import { Pagination } from "./pagination";
import type { IPagination } from "./pagination";

export type NextPage<Result> = Promise<IPaginationResult<Result>>;

export interface IPaginationResult<Result = unknown[]> extends IPagination {
  result: Result;
  nextPage(): NextPage<Result>;
}

export class PaginationResult<Result = unknown[]>
  extends Pagination
  implements IPaginationResult<Result>
{
  public model: any;
  public result: Result = [] as Result;

  public nextPage(): NextPage<Result> {
    return this.model.paginate({ ...this, page: (this.page || 0) + 1 });
  }
}
