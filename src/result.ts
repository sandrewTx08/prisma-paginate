import type { PaginateArgs } from "./extension";
import { Pagination } from "./pagination";
import type { IPagination, PaginationArgs } from "./pagination";

export type NextPage<Result> = Promise<IPaginationResult<Result>>;

export interface IPaginationResult<Result = unknown[]> extends IPagination {
  result: Result;
  nextPage(): NextPage<Result>;
}

export class PaginationResult<Result = unknown[]>
  extends Pagination
  implements IPaginationResult<Result>
{
  result: Result = [] as Result;
  readonly #model: any;

  constructor(
    model: any,
    ...pagination: ConstructorParameters<typeof Pagination>
  ) {
    super(...pagination);
    this.#model = model;
  }

  nextPage(): NextPage<Result> {
    return this.#model.paginate(this.#nextPagePaginateArgs());
  }

  #nextPagePaginateArgs(): PaginateArgs<unknown, any> & PaginationArgs {
    return { ...this, page: (this.page || 0) + 1 };
  }
}
