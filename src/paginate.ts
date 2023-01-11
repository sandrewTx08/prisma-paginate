/**
 * @example
 *
 * // on database = [ { id: 1 }, { id: 2 }, ...{ id: 100 } ]
 * paginate(client.table)(
 *   {
 *     where: {
 *       // query stuff...
 *     },
 *   },
 *   { page: 1, limit: 50 }).then((query) => {
 *      query.result; // return [ ...{ id: 48 }, { id: 49 }, { id: 50 } ]
 *   });
 */
export function paginate(): paginate.PaginationParametersUnsetModel;
export function paginate<Model extends paginate.PrismaModelProperties>(
  model: Model
): paginate.PaginationParameters<Model>;
export function paginate<Model extends paginate.PrismaModelProperties>(
  model: Model,
  options: Partial<paginate.PaginationOptions>
): paginate.PaginationParameters<Model>;
export function paginate<Model extends paginate.PrismaModelProperties>(
  model?: Model,
  options?: Partial<paginate.PaginationOptions>
) {
  function paginateModel(
    findManyArgs: paginate.PrismaModelFindManyArguments<Model>,
    paginationOrCallback?:
      | paginate.PaginationArguments
      | paginate.PaginationCallback<
          Model,
          paginate.WithoutPaginationResult<Model>
        >,
    callback?: paginate.PaginationCallback<
      Model,
      paginate.PaginationResult<Model>
    >
  ) {
    paginationOrCallback =
      typeof paginationOrCallback === "object" && options
        ? { ...options, ...paginationOrCallback }
        : paginationOrCallback;

    return new paginate.Paginate(model!).paginate(
      findManyArgs,
      paginationOrCallback,
      callback
    );
  }

  return model ? paginateModel : paginate.paginate;
}

export namespace paginate {
  export interface PrismaModelProperties {
    findMany(...args: any[]): Promise<any>;
    count(...args: any[]): Promise<number>;
  }

  export type PrismaModelFindManyArguments<
    Model extends PrismaModelProperties
  > = Parameters<Model["findMany"]>[0];

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

  export type WithoutPaginationResult<Model extends PrismaModelProperties> =
    Awaited<ReturnType<Model["findMany"]>>;

  export interface PaginationResult<Model extends PrismaModelProperties>
    extends Pagination {
    result: WithoutPaginationResult<Model>;
  }

  export interface PaginationCallback<
    Model extends PrismaModelProperties,
    Result extends WithoutPaginationResult<Model> | PaginationResult<Model>
  > {
    (error: Error | null, result?: Result): void;
  }

  export interface PaginationParametersUnsetModel {
    <Model extends PrismaModelProperties>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments,
      callback: PaginationCallback<Model, PaginationResult<Model>>
    ): void;
    <Model extends PrismaModelProperties>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      callback: PaginationCallback<Model, WithoutPaginationResult<Model>>
    ): void;
    <Model extends PrismaModelProperties>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>,
      pagination: PaginationArguments
    ): Promise<PaginationResult<Model>>;
    <Model extends PrismaModelProperties>(
      model: Model,
      findManyArgs: PrismaModelFindManyArguments<Model>
    ): Promise<WithoutPaginationResult<Model>>;
  }

  export interface PaginationParameters<Model extends PrismaModelProperties> {
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

  export class Paginate<Model extends PrismaModelProperties> {
    constructor(public model: Model) {}

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
          this.model.count(findManyArgs).then((count) => {
            this.model
              .findMany(
                this.paginateFindManyArgs(findManyArgs, paginationOrCallback)
              )
              .then((result) =>
                this.paginateResult(paginationOrCallback, count, result)
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

    paginateFindManyArgs(
      findManyArgs: PrismaModelFindManyArguments<Model>,
      paginationArgs: PaginationArguments
    ): PrismaModelFindManyArguments<Model> {
      return {
        ...findManyArgs,
        take: paginationArgs.limit,
        skip:
          paginationArgs.limit *
          (paginationArgs.page !== undefined
            ? paginationArgs.page > 0
              ? paginationArgs.page - 1
              : paginationArgs.page
            : paginationArgs.pageIndex !== undefined
            ? paginationArgs.pageIndex
            : 0),
      };
    }

    paginateResult(
      paginationArgs: PaginationArguments,
      count: number,
      findManyReturn: WithoutPaginationResult<Model>
    ): PaginationResult<Model> {
      const totalPages = Math.round(count / paginationArgs.limit);
      const page =
        paginationArgs.page !== undefined
          ? paginationArgs.page === 0
            ? 1
            : paginationArgs.page
          : paginationArgs.pageIndex !== undefined
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
        paginationArgs.exceedCount === true &&
        paginationArgs.limit * page > count
      ) {
        throw new ExceedCount(pagination);
      } else {
        return { ...pagination, result: findManyReturn };
      }
    }
  }

  export function paginate<Model extends PrismaModelProperties>(
    model: Model,
    findManyArgs: PrismaModelFindManyArguments<Model>,
    paginationOrCallback?:
      | PaginationArguments
      | PaginationCallback<Model, WithoutPaginationResult<Model>>,
    callback?: PaginationCallback<Model, PaginationResult<Model>>
  ) {
    return new Paginate(model).paginate(
      findManyArgs,
      paginationOrCallback,
      callback
    );
  }
}
