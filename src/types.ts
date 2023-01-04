import { ExceedCount } from "./errors";

export namespace PrismaModel {
  export interface Properties {
    findMany(...args: any[]): Promise<any>;
    count(...args: any[]): Promise<number>;
  }
  export type Arguments<Model extends Properties> = Parameters<
    Model["findMany"]
  >[0];
}

export namespace Pagination {
  export interface Arguments extends Partial<Options> {
    /**
     * Paginate starting from 1
     *
     * @see {@link Pagination.Arguments.pageIndex}
     * @default 1
     */
    page?: number;
    /**
     * Paginate like index staring from 0
     *
     * @see {@link Pagination.Arguments.page}
     * @default 0
     */
    pageIndex?: number;
    /**
     * Limit how much rows to return
     */
    limit: number;
  }
  export interface Options {
    /**
     * Throw error if options is greater than count
     * @see {@link ExceedCount}
     * @default false
     */
    exceedCount: boolean;
  }
  export interface Value extends Arguments {
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    count: number;
  }
}

export namespace Result {
  export type WithoutPagination<Model extends PrismaModel.Properties> = Awaited<
    ReturnType<Model["findMany"]>
  >;
  export interface Pagination<Model extends PrismaModel.Properties>
    extends Pagination.Value {
    result: Result.WithoutPagination<Model>;
  }
  export interface Callback<
    Model extends PrismaModel.Properties,
    Result extends Result.WithoutPagination<Model> | Pagination<Model>
  > {
    (error: Error | null, result?: Result): void;
  }
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
