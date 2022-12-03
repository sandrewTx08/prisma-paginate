import {
  Model,
  ModelArgs,
  PaginationArgs,
  CallbackResult,
  PaginateReturn,
} from "./model";
import { prismaPaginate } from "./prismaPaginate";

class PrismaPaginate<T extends Model> {
  constructor(
    public model: T,
    public findManyArgs: ModelArgs<T>,
    public pagination?: PaginationArgs
  ) {}

  query(): Promise<PaginateReturn<T>>;
  query(callback: CallbackResult<T>): void;
  query(callback?: CallbackResult<T>) {
    return callback
      ? prismaPaginate(this.model, this.findManyArgs, callback)
      : prismaPaginate(this.model, this.findManyArgs);
  }
}

export { PrismaPaginate };
