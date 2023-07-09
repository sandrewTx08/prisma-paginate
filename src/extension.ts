import { Prisma } from "@prisma/client";
import { PaginationResult } from "./result";
import type { IPaginationResult } from "./result";
import { Pagination } from "./pagination";
import type { PaginationArgs } from "./pagination";

export type PaginateArgs<Model, Args> = Prisma.Exact<
  Args,
  Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
>;

export type PaginateResult<Model, Args> = Promise<
  IPaginationResult<Prisma.Result<Model, Args, "findMany">>
>;

export interface PrismaPaginateExtension {
  name: "prisma-paginate";
  model: {
    $allModels: {
      paginate<Model, Args>(
        this: Model,
        args: PaginateArgs<Model, Args> & PaginationArgs
      ): PaginateResult<Model, Args>;
      paginate<Model, Args>(
        this: Model,
        args: PaginateArgs<Model, Args>,
        paginationArgs: PaginationArgs
      ): PaginateResult<Model, Args>;
    };
  };
}

export const extension: PrismaPaginateExtension =
  Prisma.getExtensionContext<PrismaPaginateExtension>({
    name: "prisma-paginate",
    model: {
      $allModels: {
        async paginate<Model, Args>(
          this: Model,
          args: PaginateArgs<Model, Args> & PaginationArgs,
          paginationArgs?: PaginationArgs
        ): PaginateResult<Model, Args> {
          const _args: { [args: string]: any } & PaginationArgs = {
            ...(args as PaginationArgs),
            ...paginationArgs,
          };

          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _model: any = this;

          const count = await _model.count({
            orderBy: _args.orderBy,
            cursor: _args.cursor,
            where: _args.where,
          });

          const pagination = new PaginationResult<
            Prisma.Result<Model, Args, "findMany">
          >(
            _model,
            _args.limit,
            Pagination.initialPage(_args),
            Pagination.extractCount(count),
            _args.exceedCount,
            _args.exceedTotalPages
          );

          pagination.result = await _model.findMany({
            skip: Pagination.offset(_args.limit, _args),
            distinct: _args.distinct,
            orderBy: _args.orderBy,
            include: _args.include,
            cursor: _args.cursor,
            select: _args.select,
            where: _args.where,
            take: _args.limit,
          });

          return pagination;
        },
      },
    },
  });
