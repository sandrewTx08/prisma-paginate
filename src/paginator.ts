import { PrismaClient } from "@prisma/client";

/**
 * @example
 * // on database = [ { id: 1 }, { id: 2 }, {...}, { id: 100 } ]
 * paginator(prisma.myTable)(
 *   {
 *     where: {
 *       // query stuff...
 *     },
 *   },
 *   { page: 1, limit: 50 }
 * ).then((query) => {
 *   query.result; // return [ {...}, { id: 48 }, { id: 49 }, { id: 50 } ]
 * });
 */
export function paginator(): paginator.PaginationModelParameters;
export function paginator(client: PrismaClient): paginator.PrismaClientPaginate;
export function paginator<Model extends paginator.PrismaModel>(
  model: Model
): paginator.PaginationParameters<Model>;
export function paginator<Model extends paginator.PrismaModel>(
  model: Model,
  options: Partial<paginator.PaginationOptions>
): paginator.PaginationParameters<Model>;
export function paginator<Model extends paginator.PrismaModel>(
  modelOrClient?: Model | PrismaClient,
  options?: Partial<paginator.PaginationOptions>
) {
  // Fix undefined class bug
  // @ts-ignore
  const p = new paginator.Paginate(modelOrClient, options);

  return modelOrClient
    ? "findMany" in modelOrClient
      ? p.pagination.bind(p)
      : paginator.paginateClient(modelOrClient)
    : paginator.paginate;
}

export namespace paginator {
  export interface PrismaModel {
    findMany(...args: any[]): Promise<any>;
    count(...args: any[]): Promise<number>;
  }

  export type PrismaModelFindManyArguments<Model extends PrismaModel> =
    Parameters<Model["findMany"]>[0];

  export interface PaginationArguments extends Partial<PaginationOptions> {
    /**
     * Paginate starting from 1
     *
     * If enabled it overwrite 'pageIndex'
     *
     * @see {@link PaginationArguments.pageIndex}
     * @default 1
     */
    page?: number;
    /**
     * Paginate like index staring from 0
     *
     * @see {@link PaginationArguments.page}
     * @default 0
     */
    pageIndex?: number;
    /**
     * Limit how much rows to return
     */
    limit: number;
  }

  export interface PaginationOptions {
    /**
     * Throw error if options is greater than count
     * @see {@link ExceedCount}
     * @default false
     */
    exceedCount: boolean;
  }

  export interface Pagination extends PaginationArguments {
    /**
     * Total of pages based on pagination arguments
     */
    totalPages: number;
    /**
     * If has result on next page index
     */
    hasNextPage: boolean;
    /**
     * If has result on last page index
     */
    hasPrevPage: boolean;
    /**
     * Count how many rows on has on table/model with query filter
     */
    count: number;
  }

  export type WithoutPaginationResult<Model extends PrismaModel> = Awaited<
    ReturnType<Model["findMany"]>
  >;

  export interface PaginationResult<Model extends PrismaModel>
    extends Pagination {
    result: WithoutPaginationResult<Model>;
  }

  export interface PaginationCallback<
    Model extends PrismaModel,
    Result extends WithoutPaginationResult<Model> | PaginationResult<Model>
  > {
    (error: Error | null, result?: Result): void;
  }

  export interface PaginationModelParameters {
    <Model extends PrismaModel>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments,
      callback: PaginationCallback<Model, PaginationResult<Model>>
    ): void;
    <Model extends PrismaModel>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      callback: PaginationCallback<Model, WithoutPaginationResult<Model>>
    ): void;
    <Model extends PrismaModel>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments
    ): Promise<PaginationResult<Model>>;
    <Model extends PrismaModel>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>
    ): Promise<WithoutPaginationResult<Model>>;
  }

  export interface PaginationParameters<Model extends PrismaModel> {
    (
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments,
      callback: PaginationCallback<Model, PaginationResult<Model>>
    ): void;
    (
      findManyArgs: PrismaModelFindManyArguments<Model>,
      callback: PaginationCallback<Model, WithoutPaginationResult<Model>>
    ): void;
    (
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments
    ): Promise<PaginationResult<Model>>;
    (findManyArgs: PrismaModelFindManyArguments<Model>): Promise<
      WithoutPaginationResult<Model>
    >;
  }

  export class ExceedCount extends Error {
    constructor(public pagination: Pagination) {
      super("Pagination options exceed count of rows");
    }
  }

  /**
   * @private
   */
  export class Paginate<Model extends PrismaModel> {
    constructor(
      private model: Model,
      private options?: Partial<PaginationOptions>
    ) {}

    pagination(
      findManyArgs: PrismaModelFindManyArguments<Model>,
      paginationOrCallback?:
        | PaginationArguments
        | PaginationCallback<Model, WithoutPaginationResult<Model>>,
      callback?: PaginationCallback<Model, PaginationResult<Model>>
    ) {
      const result = new Promise<
        WithoutPaginationResult<Model> | PaginationResult<Model>
      >((resolve, reject) => {
        if (typeof paginationOrCallback === "object") {
          this.model.count(findManyArgs).then((count) => {
            this.model
              .findMany(this.arguments(findManyArgs, paginationOrCallback))
              .then((result) =>
                this.result(paginationOrCallback, count, result)
              )
              .then(resolve);
          }, reject);
        } else {
          this.model.findMany(findManyArgs).then(resolve);
        }
      });

      result.then(
        (value) => {
          if (callback) {
            callback(null, value);
          } else if (typeof paginationOrCallback === "function") {
            paginationOrCallback(null, value as WithoutPaginationResult<Model>);
          } else {
            return value;
          }
        },
        (reason) => {
          if (callback) {
            callback(reason);
          } else if (typeof paginationOrCallback === "function") {
            paginationOrCallback(reason);
          } else {
            throw reason;
          }
        }
      );

      if (!(callback || typeof paginationOrCallback === "function")) {
        return result;
      }
    }

    arguments(
      findManyArgs: PrismaModelFindManyArguments<Model>,
      paginationArgs: PaginationArguments
    ): PrismaModelFindManyArguments<Model> {
      return {
        ...findManyArgs,
        take: paginationArgs.limit,
        skip:
          paginationArgs.limit *
          (typeof paginationArgs.page === "number"
            ? paginationArgs.page > 0
              ? paginationArgs.page - 1
              : paginationArgs.page
            : typeof paginationArgs.pageIndex === "number"
            ? paginationArgs.pageIndex
            : 0),
      };
    }

    result(
      paginationArgs: PaginationArguments,
      count: number,
      findManyReturn: WithoutPaginationResult<Model>
    ): PaginationResult<Model> {
      const totalPages = Math.round(count / paginationArgs.limit);
      const page =
        typeof paginationArgs.page === "number"
          ? paginationArgs.page === 0
            ? 1
            : paginationArgs.page
          : typeof paginationArgs.pageIndex === "number"
          ? paginationArgs.pageIndex + 1
          : 1;
      const hasNextPage = page < totalPages;
      const hasPrevPage =
        count > 0
          ? (page * paginationArgs.limit) / count - 1 === 0 ||
            page - 1 === totalPages
          : false;
      const pagination: Pagination = {
        limit: paginationArgs.limit,
        count,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
      };

      if (
        (paginationArgs.exceedCount === true || this.options?.exceedCount) &&
        paginationArgs.limit * page > count
      ) {
        throw new ExceedCount(pagination);
      } else {
        return { ...pagination, result: findManyReturn };
      }
    }
  }

  /**
   * @example
   * paginate(new PrismaClient().myTable, { where: {} }, { limit: 10, page: 1 })
   */
  export function paginate<Model extends PrismaModel>(
    model: Model,
    findManyArgs: PrismaModelFindManyArguments<Model>,
    paginationOrCallback?:
      | PaginationArguments
      | PaginationCallback<Model, WithoutPaginationResult<Model>>,
    callback?: PaginationCallback<Model, PaginationResult<Model>>
  ) {
    return new paginator.Paginate(model).pagination(
      findManyArgs,
      paginationOrCallback,
      callback
    );
  }

  type PrismaClientKeys = Omit<
    typeof PrismaClient.prototype,
    | "$executeRaw"
    | "$disconnect"
    | "$on"
    | "$connect"
    | "$executeRawUnsafe"
    | "$queryRaw"
    | "$queryRawUnsafe"
    | "$use"
    | "$transaction"
  >;

  export type PrismaClientPaginate = {
    [K in keyof PrismaClientKeys]: PrismaClientKeys[K] & {
      paginate: PaginationParameters<typeof PrismaClient.prototype[K]>;
    };
  };

  /**
   * @example
   * paginateClient().myTable.paginate({ where: {} }, { limit: 10, page: 1 })
   */
  export function paginateClient(): PrismaClientPaginate;
  /**
   * @example
   * const client = new PrismaClient()
   * paginateClient(client).myTable.paginate({ where: {} }, { limit: 10, page: 1 })
   */
  export function paginateClient(client: PrismaClient): PrismaClientPaginate;
  export function paginateClient(client?: PrismaClient): PrismaClientPaginate {
    const paginateClient = (client
      ? client
      : new PrismaClient()) as unknown as PrismaClientPaginate;

    for (const ok of Object.keys(paginateClient) as Array<
      keyof typeof paginateClient
    >) {
      if (typeof paginateClient[ok]?.findMany === "function") {
        paginateClient[ok].paginate = paginator(paginateClient[ok]);
      }
    }

    return paginateClient;
  }
}
