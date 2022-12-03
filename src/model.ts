type ResultCallback<T extends Model> = (
  error?: Error | null,
  result?: ModelResult<T>
) => void;
type Model = {
  findMany(...args: any[]): Promise<any>;
  count(...args: any[]): Promise<number>;
};
type ModelArgs<T extends Model> = Parameters<T["findMany"]>[0];
type ModelResult<T extends Model> = Awaited<ReturnType<T["findMany"]>>;
type PaginationOptions = { page: number; limit: number };

export { Model, ModelArgs, ModelResult, PaginationOptions, ResultCallback };
