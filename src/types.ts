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
  export type Options = { page: number; limit: number };
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
  export type WithPagination<T extends PrismaModel.Properties> =
    Pagination.Value & {
      result: PrismaModel.FindManyReturn<T>;
    };
  export type Callback<
    T extends PrismaModel.Properties,
    P extends WithoutPagination<T> | WithPagination<T>
  > = (error: Error | null, result?: P) => void;
}
