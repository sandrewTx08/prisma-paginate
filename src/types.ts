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
  export type Options = {
    page: number;
    limit: number;
    /**
     * Throw error if options is greater than count {@link ExceedCount}
     * @default false
     */
    exceedCount?: boolean;
  };
  export type Value = Options & {
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
    pagination: Pagination.Options,
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
    pagination: Pagination.Options
  ): Promise<Result.Pagination<Model>>;
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>
  ): Promise<Result.WithoutPagination<Model>>;
  <Model extends PrismaModel.Properties>(
    model: Model,
    findManyArgs: PrismaModel.Arguments<Model>
  ): Promise<Result.WithoutPagination<Model>>;
}

export interface WithModel<Model extends PrismaModel.Properties> {
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Options,
    callback: Result.Callback<Model, Result.Pagination<Model>>
  ): void;
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    callback: Result.Callback<Model, Result.WithoutPagination<Model>>
  ): void;
  (
    findManyArgs: PrismaModel.Arguments<Model>,
    pagination: Pagination.Options
  ): Promise<Result.Pagination<Model>>;
  (findManyArgs: PrismaModel.Arguments<Model>): Promise<
    Result.WithoutPagination<Model>
  >;
  (findManyArgs: PrismaModel.Arguments<Model>): Promise<
    Result.WithoutPagination<Model>
  >;
}
