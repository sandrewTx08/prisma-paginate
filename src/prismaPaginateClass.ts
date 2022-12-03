import {
  Model,
  ModelArgs,
  PaginationOptions,
  ResultCallback,
  ModelResult,
} from "./model";
import { prismaPaginate } from "./prismaPaginate";

class PrismaPaginate<T extends Model> {
  constructor(
    public model: T,
    public findManyArgs: ModelArgs<T>,
    public pagination?: PaginationOptions
  ) {}

  query(): Promise<ModelResult<T>>;
  query(callback: ResultCallback<T>): void;
  query(callback?: ResultCallback<T>) {
    return callback
      ? prismaPaginate(this.model, this.findManyArgs, callback)
      : prismaPaginate(this.model, this.findManyArgs);
  }
}

export { PrismaPaginate };
