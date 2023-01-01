import { ExceedCount } from "./errors";

export namespace PrismaModel {
  export type Properties = {
    findMany(...args: any[]): Promise<any>;
    count(...args: any[]): Promise<number>;
  };
  export type Arguments<T extends Properties> = Parameters<T["findMany"]>[0];
  export type FindManyReturn<T extends Properties> = Awaited<
    ReturnType<T["findMany"]>
  >;
}

export namespace Pagination {
  export type Arguments = Partial<Options> & {
    page: number;
    limit: number;
  };
  export type Options = {
    /**
     * Throw error if options is greater than count {@link ExceedCount}
     * @default false
     */
    exceedCount: boolean;
    /**
     * Paginating from zero
     * @default false
     * @example
     * // pageZero true
     * prismaPaginate(model, { page: 0, limit: 10, pageZero: true }); // { page: 1 }
     * prismaPaginate(model, { page: 1, limit: 10, pageZero: true }); // { page: 2 }
     *
     * // pageZero false
     * prismaPaginate(model, { page: 0, limit: 10, pageZero: false }); // { page: 1 }
     * prismaPaginate(model, { page: 1, limit: 10, pageZero: false }); // { page: 1 }
     */
    pageZero: boolean;
  };
  export type Value = Arguments & {
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    count: number;
  };
}

export namespace Result {
  export type WithoutPagination<T extends PrismaModel.Properties> =
    PrismaModel.FindManyReturn<T>;
  export type Pagination<T extends PrismaModel.Properties> =
    Pagination.Value & {
      result: PrismaModel.FindManyReturn<T>;
    };
  export type Callback<
    T extends PrismaModel.Properties,
    R extends WithoutPagination<T> | Pagination<T>
  > = (error: Error | null, result?: R) => void;
}

export interface ByModel {
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Arguments,
    callback: Result.Callback<Model, Result.Pagination<Model>>
  ): void;
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    callback: Result.Callback<Model, Result.WithoutPagination<Model>>
  ): void;
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Arguments
  ): Promise<Result.Pagination<Model>>;
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>
  ): Promise<Result.WithoutPagination<Model>>;
}

export interface WithModel<Model extends PrismaModel.Properties> {
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Arguments,
    callback: Result.Callback<Model, Result.Pagination<Model>>
  ): void;
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    callback: Result.Callback<Model, Result.WithoutPagination<Model>>
  ): void;
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Arguments
  ): Promise<Result.Pagination<Model>>;
  (findManyArgs: PrismaModel.Arguments<Model>): Promise<
    Result.WithoutPagination<Model>
  >;
}
