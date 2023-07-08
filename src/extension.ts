import { Prisma } from "@prisma/client";
import { PaginationResult } from "./result";
import type { IPaginationResult } from "./result";
import { Pagination } from "./pagination";
import type { PaginationArgs } from "./pagination";

type PaginateArgs<Model, Args> = Prisma.Exact<
  Args,
  Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
>;

type PaginateResult<Model, Args> = Promise<
  IPaginationResult<Prisma.Result<Model, Args, "findMany">>
>;

interface PrismaPaginateExtension {
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
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          const _model: any = this;
          const _args: { [args: string]: any } & PaginationArgs = {
            ...(args as any),
            ...paginationArgs,
          };

          const count = await _model.count({
            orderBy: _args.orderBy,
            cursor: _args.cursor,
            where: _args.where,
          });

          const pagination = new Pagination(
            Pagination.extractCount(count),
            Pagination.initialPage(_args),
            _args.limit,
            _args.exceedCount,
            _args.exceedTotalPages
          );

          const result = await _model.findMany({
            skip: Pagination.offset(_args.limit, _args),
            distinct: _args.distinct,
            orderBy: _args.orderBy,
            include: _args.include,
            cursor: _args.cursor,
            select: _args.select,
            where: _args.where,
            take: _args.limit,
          });

          return new PaginationResult<Prisma.Result<Model, Args, "findMany">>(
            pagination,
            result,
            _model
          );
        },
      },
    },
  });

export default extension;
