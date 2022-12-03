export type ResultCallback<T extends Model> = (
  error?: Error | null,
  result?: ModelResult<T>
) => void;
export type Model = {
  findMany(...args: any[]): Promise<any>;
  count(...args: any[]): Promise<number>;
};
export type ModelArgs<T extends Model> = Parameters<T["findMany"]>[0];
export type ModelResult<T extends Model> = Awaited<ReturnType<T["findMany"]>>;
export type PaginationOptions = { page: number; limit: number };
