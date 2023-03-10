import { PrismaClient } from "@prisma/client";
import { Paginator } from "./paginatorClass";
import type {
  PrismaClientModelPaginate,
  PrismaClientModel,
  PrismaClientModelsPaginate,
  PrismaClientModels,
  PrismaClientMutable,
  PrismaClientPaginate,
  PrismaFindManyReturn,
  PrismaFindManyArgs,
} from "./prisma";

/**
 * @example
 * // on database = [ { id: 1 }, { id: 2 }, {...}, { id: 100 } ]
 * paginator(prisma.myTable).paginate(
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
export function paginator(client?: PrismaClient): PrismaClientPaginate;
export function paginator<Model extends PrismaClientModel>(
  model: Model,
  options?: Partial<paginator.PaginationOptions>
): PrismaClientModelPaginate<Model>;
export function paginator<Model extends keyof PrismaClientModels>(
  model: Model,
  options?: Partial<paginator.PaginationOptions>
): PrismaClientModelPaginate<typeof PrismaClient.prototype[Model]>;
export function paginator<Model extends PrismaClientModel>(
  modelOrClient?: keyof PrismaClientModels | Model | PrismaClient,
  options?: Partial<paginator.PaginationOptions>
) {
  return modelOrClient
    ? typeof modelOrClient === "string"
      ? new Paginator(
          new PrismaClient()[modelOrClient],
          options
        ).paginateModel()
      : "count" in modelOrClient && "findMany" in modelOrClient
      ? new Paginator(modelOrClient, options).paginateModel()
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
     * Paginate like array index staring from 0
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
     * @see {@link ExceedCount}
     * @default false
     */
    exceedCount: boolean;
    /**
     * @default false
     * @see {@link ExceedTotalPages}
     */
    exceedTotalPages: boolean;
  }

  export interface Pagination<Model extends PrismaClientModel = any>
    extends Omit<PaginationArgs, "pageIndex">,
      NextPage<Model> {
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

  export interface PaginationResult<Model extends PrismaClientModel>
    extends Required<Pagination<Model>> {
    result: PrismaFindManyReturn<Model>;
  }

  export interface NextPage<Model extends PrismaClientModel> {
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
    nextPage(callback: PaginationCallback<Model>): void;
  }

  export type PaginationCallback<Model extends PrismaClientModel> = (
    error: Error | null,
    result?: PaginationResult<Model>
  ) => void;

  export interface PaginateParams<Model extends PrismaClientModel> {
    paginate(
      findManyPaginationArgs: PrismaFindManyArgs<Model> & PaginationArgs,
      callback: PaginationCallback<Model>
    ): void;
    paginate(
      findManyPaginationArgs: PrismaFindManyArgs<Model> & PaginationArgs
    ): Promise<PaginationResult<Model>>;
    paginate(
      findManyArgs: PrismaFindManyArgs<Model>,
      pagination: PaginationArgs,
      callback: PaginationCallback<Model>
    ): void;
    paginate(
      findManyArgs: PrismaFindManyArgs<Model>,
      pagination: PaginationArgs
    ): Promise<PaginationResult<Model>>;
  }

  export interface PaginationException {
    pagination: Pagination;
  }

  export class ExceedCount extends Error implements PaginationException {
    constructor(public pagination: Pagination) {
      super("Pagination options exceed count of rows");
    }
  }

  export class ExceedTotalPages extends Error implements PaginationException {
    constructor(public pagination: Pagination) {
      super("Pagination options exceed total of pages");
    }
  }

  export function paginateClient(client?: PrismaClient): PrismaClientPaginate {
    const paginateClient: PrismaClientMutable = client
      ? client
      : new PrismaClient();

    for (const ok of Object.keys(
      paginateClient
    ) as (keyof PrismaClientModelsPaginate)[]) {
      if (
        typeof paginateClient[ok]?.findMany === "function" &&
        typeof paginateClient[ok]?.count === "function"
      ) {
        paginateClient[ok] = paginator(paginateClient[ok]) as unknown as any;
      }
    }

    return paginateClient as PrismaClientPaginate;
  }
}
