namespace Model {
  export type Object = {
    findMany(...args: any[]): Promise<any>;
    count(...args: any[]): Promise<number>;
  };
  export type Args<T extends Object> = Parameters<T["findMany"]>[0];
  export type FindManyReturn<T extends Object> = Awaited<
    ReturnType<T["findMany"]>
  >;
}

namespace Pagination {
  export type TypeArgs = Result | Partial<Result> | {};
  export type Args = { page: number; limit: number };
  export type Result = Args & {
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    count: number;
  };
}

namespace Result {
  export type WithoutPagination<T extends Model.Object> =
    Model.FindManyReturn<T>;
  export type WithPagination<T extends Model.Object> = Pagination.Result & {
    result: Model.FindManyReturn<T>;
  };
  export type Callback<
    T extends Model.Object,
    P extends WithoutPagination<T> | WithPagination<T>
  > = (error: Error | null, result?: P) => void;
}

export { Pagination, Model, Result };
