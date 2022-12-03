import {
  Model,
  ModelArgs,
  PaginationArgs,
  CallbackResult,
  Pagination,
} from "./model";
import { prismaPaginate } from "./prismaPaginate";

class PrismaPaginate<T extends Model> {
  page: number;
  limit: number;

  constructor(public model: T, { page, limit }: PaginationArgs) {
    this.page = page;
    this.limit = limit;
  }

  get pagination(): PaginationArgs {
    return { limit: this.limit, page: this.page };
  }

  query(findManyArgs: ModelArgs<T>, callback?: CallbackResult<T, Pagination>) {
    return callback
      ? prismaPaginate(this.model, findManyArgs, this.pagination, callback)
      : prismaPaginate(this.model, findManyArgs, this.pagination);
  }
}

export { PrismaPaginate };
