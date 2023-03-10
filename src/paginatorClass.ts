import {
  PaginationArgs,
  PaginationOptions,
  PaginationCallback,
  PaginationResult,
  PaginateParams,
} from ".";
import { Paginate } from "./paginate";
import {
  PrismaClientModel,
  PrismaClientModelPaginate,
  PrismaFindManyArgs,
} from "./prisma";

export class Paginator<Model extends PrismaClientModel>
  implements PaginateParams<Model>
{
  constructor(
    private readonly model: Model,
    public options?: Partial<PaginationOptions>
  ) {}

  paginateModel(): PrismaClientModelPaginate<Model> {
    return {
      ...this.model,
      paginate: Paginator.prototype.paginate.bind(this),
    };
  }

  paginate(
    findManyArgs: PrismaFindManyArgs<Model> & PaginationArgs,
    paginationOrCallback?: PaginationArgs | PaginationCallback<Model>,
    callback?: PaginationCallback<Model>
  ): Promise<PaginationResult<Model>> {
    const result = new Promise<PaginationResult<Model>>((resolve, reject) => {
      const paginate = new Paginate(
        findManyArgs,
        {
          ...findManyArgs,
          ...(typeof paginationOrCallback === "object" && paginationOrCallback),
        },
        new Paginator(this.model)
      );

      this.model.count(paginate.countArgs()).then((count) => {
        this.model
          .findMany(paginate.findManyArgs())
          .then((result) =>
            paginate.result(
              typeof count === "number" ? count : count._all,
              result
            )
          )
          .then(resolve);
      }, reject);
    });

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

    return result;
  }
}
