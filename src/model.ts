type Model = {
  findMany(...args: any[]): Promise<any>;
  count(...args: any[]): Promise<number>;
};
type ModelArgs<T extends Model> = Parameters<T["findMany"]>[0];
type CallbackResult<T extends Model> = (
  error: Error | null,
  result?: PaginateReturn<T>
) => void;
type ModelReturnAwaited<T extends Model> = Awaited<ReturnType<T["findMany"]>>;
type PaginateReturn<T extends Model> = Partial<Pagination> & {
  result: ModelReturnAwaited<T>;
};
type PaginationArgs = { page: number; limit: number };
type Pagination = PaginationArgs & {
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  count: number;
};

export {
  Model,
  ModelArgs,
  PaginateReturn,
  PaginationArgs,
  CallbackResult,
  ModelReturnAwaited,
};
