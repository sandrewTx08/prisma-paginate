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
export function paginator(): paginator.PrismaClientPaginate;
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
  return modelOrClient
    ? "findMany" in modelOrClient
      ? // Fix undefined class bug
      paginator.Paginator.prototype.paginate.bind(
        new paginator.Paginator(modelOrClient, options)
      )
      : paginator.paginateClient(modelOrClient)
    : paginator.paginateClient();
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

  export interface Pagination<Model extends PrismaModel>
    extends PaginationArguments {
    /**
     * Total of pages based on pagination arguments
     */
    totalPages: number;
    /**
     * If has result on next page index
     */
    hasNextPage: boolean;
    /**
     * Request next page
     * @example
     * paginator(prisma)
     *   .myTable.paginate({}, { page: 1, limit: 10 })
     *   .then((result) => {
     *     result.nextPage((error, nextResult) => {
     *       // result?.nextPage(...)
     *     });
     *   });
     */
    nextPage: NextPage<Model, PaginationResult<Model>>;
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
    extends Pagination<Model> {
    result: WithoutPaginationResult<Model>;
  }

  export interface NextPage<
    Model extends PrismaModel,
    Result extends PaginationResult<Model>["result"] | PaginationResult<Model>
  > {
    (
      callback:
        | Promise<PaginationCallback<Model, Result>>
        | PaginationCallback<Model, Result>
    ): void;
  }

  export interface PaginationCallback<
    Model extends PrismaModel,
    Result extends PaginationResult<Model>["result"] | PaginationResult<Model>
  > {
    (error: Error | null, result?: Result): void;
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
    constructor(public pagination: Pagination<any>) {
      super("Pagination options exceed count of rows");
    }
  }

  /**
   * @private
   */
  export class Paginator<Model extends PrismaModel> {
    constructor(
      private model: Model,
      public options?: Partial<PaginationOptions>
    ) {}

    paginate(
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
          const paginate = new Paginate(
            findManyArgs,
            paginationOrCallback,
            new Paginator(this.model)
          );

          this.model.count(findManyArgs).then((count) => {
            this.model
              .findMany(paginate.arguments())
              .then((result) => paginate.result(count, result))
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
  }

  /**
   * @private
   */
  export class Paginate<Model extends PrismaModel> {
    constructor(
      private findManyArgs: PrismaModelFindManyArguments<Model>,
      private paginationArgs: PaginationArguments,
      private paginator: Paginator<Model>
    ) {}

    arguments(): PrismaModelFindManyArguments<Model> {
      return {
        ...this.findManyArgs,
        take: this.paginationArgs.limit,
        skip:
          this.paginationArgs.limit *
          (typeof this.paginationArgs.page === "number"
            ? this.paginationArgs.page > 0
              ? this.paginationArgs.page - 1
              : this.paginationArgs.page
            : typeof this.paginationArgs.pageIndex === "number"
              ? this.paginationArgs.pageIndex
              : 0),
      };
    }

    nextPage(): NextPage<Model, PaginationResult<Model>> {
      this.paginationArgs = {
        ...this.paginationArgs,
        page: (this.paginationArgs.page || 0) + 1,
        pageIndex:
          typeof this.paginationArgs.page === "number"
            ? undefined
            : (this.paginationArgs.pageIndex || 0) + 1,
      };

      return (callback) => {
        this.paginator.paginate(
          this.findManyArgs,
          this.paginationArgs,
          (error, result) => {
            if (callback instanceof Promise) {
              callback.then((callback) => {
                callback(error, result);
              });
            } else {
              callback(error, result);
            }
          }
        );
      };
    }

    result(
      count: number,
      findManyReturn: WithoutPaginationResult<Model>
    ): PaginationResult<Model> {
      const totalPages = Math.round(count / this.paginationArgs.limit);
      const page =
        typeof this.paginationArgs.page === "number"
          ? this.paginationArgs.page === 0
            ? 1
            : this.paginationArgs.page
          : typeof this.paginationArgs.pageIndex === "number"
            ? this.paginationArgs.pageIndex + 1
            : 1;
      const hasNextPage = page < totalPages;
      const hasPrevPage =
        count > 0
          ? (page * this.paginationArgs.limit) / count - 1 === 0 ||
            page - 1 === totalPages
          : false;
      const pagination: Pagination<Model> = {
        limit: this.paginationArgs.limit,
        nextPage: this.nextPage(),
        count,
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
      };

      if (
        (typeof this.paginationArgs.exceedCount === "boolean" ||
          this.paginator.options?.exceedCount) &&
        this.paginationArgs.limit * page > count
      ) {
        throw new ExceedCount(pagination);
      } else {
        return { ...pagination, result: findManyReturn };
      }
    }
  }

  type PrismaClientModels = Omit<
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
    [K in keyof PrismaClientModels]: PrismaClientModels[K] & {
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
