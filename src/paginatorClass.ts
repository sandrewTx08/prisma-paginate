import type {
  PaginationArgs,
  PaginationOptions,
  PaginationCallback,
  ModelPaginationResult,
  PaginateParams,
} from ".";
import { Paginate } from "./paginate";
import type {
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
    paginationOrCallback?:
      | PaginationArgs
      | PaginationCallback<ModelPaginationResult<Model>>,
    callback?: PaginationCallback<ModelPaginationResult<Model>>
  ): Promise<ModelPaginationResult<Model>> {
    const result = new Promise<ModelPaginationResult<Model>>(
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

        this.model.count(paginate.countArgs()).then((count) => {
          this.model
            .findMany(paginate.findManyArgs())
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

    return result;
  }
}
