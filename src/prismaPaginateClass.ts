import {
  Model,
  ModelArgs,
  PaginationArgs,
  CallbackResult,
  Pagination,
} from "./model";
import { prismaPaginate } from "./prismaPaginate";

class PrismaPaginate<T extends Model> {
  _page: number;
  _limit: number;

  constructor(
    public model: T,
    public findManyArgs: ModelArgs<T>,
    { page, limit }: PaginationArgs
  ) {
    this._page = page;
    this._limit = limit;
  }

  get pagination(): PaginationArgs {
    return { limit: this._limit, page: this._page };
  }

  query(callback?: CallbackResult<T, Partial<Pagination>>) {
    return callback
      ? prismaPaginate(this.model, this.findManyArgs, this.pagination, callback)
      : prismaPaginate(this.model, this.findManyArgs, this.pagination);
  }
}

export { PrismaPaginate };
