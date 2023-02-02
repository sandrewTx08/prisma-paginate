import { PrismaClient } from "@prisma/client";
import { Paginate } from "./paginate";
import {
  PrismaClientModels,
  PrismaFindManyArgs,
  PrismaFindManyReturn,
  PrismaModel,
} from "./prisma";

export class Paginator<Model extends PrismaModel> {
  constructor(
    private model: Model,
    public options?: Partial<paginator.PaginationOptions>
  ) {}

  paginate(
    findManyArgs: PrismaFindManyArgs<Model> & paginator.PaginationArgs,
    paginationOrCallback?:
      | paginator.PaginationArgs
      | paginator.PaginationCallback<Model>,
    callback?: paginator.PaginationCallback<Model>
  ): Promise<paginator.PaginationResult<Model>> | void {
    const result = new Promise<paginator.PaginationResult<Model>>(
      (resolve, reject) => {
        const paginate = new Paginate(
          findManyArgs,
          {
            ...findManyArgs,
            ...(typeof paginationOrCallback === "object" &&
              paginationOrCallback),
          },
          new Paginator(this.model)
        );

        this.model.count(paginate.formatCountArgs()).then((count) => {
          this.model
            .findMany(paginate.formatfindManyArgs())
            .then((result) => paginate.result(count, result))
            .then(resolve);
        }, reject);
      }
    );

    result.then(
      (value) => {
        if (callback) {
          callback(null, value);
        } else if (typeof paginationOrCallback === "function") {
          paginationOrCallback(null, value);
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
export function paginator<Model extends PrismaModel>(
  model: Model
): paginator.PaginationParams<Model>;
export function paginator<Model extends PrismaModel>(
  model: Model,
  options: Partial<paginator.PaginationOptions>
): paginator.PaginationParams<Model>;
export function paginator<Model extends PrismaModel>(
  modelOrClient?: Model | PrismaClient,
  options?: Partial<paginator.PaginationOptions>
) {
  return modelOrClient
    ? modelOrClient instanceof Object &&
      "count" in modelOrClient &&
      "findMany" in modelOrClient
      ? // Fix undefined class bug
        Paginator.prototype.paginate.bind(new Paginator(modelOrClient, options))
      : paginator.paginateClient(modelOrClient)
    : paginator.paginateClient();
}

export namespace paginator {
  export interface PaginationArgs extends Partial<PaginationOptions> {
    /**
     * Paginate starting from 1
     *
     * If enabled it overwrite 'pageIndex'
     *
     * @see {@link PaginationArgs.pageIndex}
     * @default 1
     */
    page?: number;
    /**
     * Paginate like index staring from 0
     *
     * @see {@link PaginationArgs.page}
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
    extends PaginationArgs {
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
    nextPage: NextPage<Model>;
    /**
     * If has result on last page index
     */
    hasPrevPage: boolean;
    /**
     * Count how many rows on has on table/model with query filter
     */
    count: number;
  }

  export interface PaginationResult<Model extends PrismaModel>
    extends Pagination<Model> {
    result: PrismaFindManyReturn<Model>;
  }

  export interface NextPage<Model extends PrismaModel> {
    (callback: PaginationCallback<Model>): void;
  }

  export interface PaginationCallback<Model extends PrismaModel> {
    (error: Error | null, result?: PaginationResult<Model>): void;
  }

  export interface PaginationParams<Model extends PrismaModel> {
    (
      findManyPaginationArgs: PrismaFindManyArgs<Model> & PaginationArgs,
      callback: PaginationCallback<Model>
    ): void;
    (
      findManyPaginationArgs: PrismaFindManyArgs<Model> & PaginationArgs
    ): Promise<PaginationResult<Model>>;
    (
      findManyArgs: PrismaFindManyArgs<Model>,
      pagination: PaginationArgs,
      callback: PaginationCallback<Model>
    ): void;
    (
      findManyArgs: PrismaFindManyArgs<Model>,
      pagination: PaginationArgs
    ): Promise<PaginationResult<Model>>;
  }

  export class ExceedCount extends Error {
    constructor(public pagination: Pagination<any>) {
      super("Pagination options exceed count of rows");
    }
  }

  export type PrismaClientPaginate = {
    [K in keyof PrismaClientModels]: PrismaClientModels[K] & {
      paginate: PaginationParams<typeof PrismaClient.prototype[K]>;
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

    for (const ok of Object.keys(
      paginateClient
    ) as (keyof typeof paginateClient)[]) {
      if (typeof paginateClient[ok]?.findMany === "function") {
        paginateClient[ok].paginate = paginator(paginateClient[ok]);
      }
    }

    return paginateClient;
  }
}
