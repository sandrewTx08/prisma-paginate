import { Prisma } from "@prisma/client";
import type { PaginationArgs } from "./pagination";
import { PaginationResult } from "./result";

export interface PrismaPaginateExtension {
  name: "prisma-paginate";
  model: {
    $allModels: {
      paginate<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">> &
          PaginationArgs
      ): Promise<PaginationResult<Prisma.Result<Model, Args, "findMany">>>;
      paginate<Model, Args>(
        this: Model,
        args: Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
        pagination: PaginationArgs
      ): Promise<PaginationResult<Prisma.Result<Model, Args, "findMany">>>;
    };
  };
}

export const extension = Prisma.getExtensionContext<PrismaPaginateExtension>({
  name: "prisma-paginate",
  model: {
    $allModels: {
      async paginate<Model, Args>(
        this: Model,
        args: Omit<
          Prisma.Exact<Args, Prisma.Args<Model, "findMany">>,
          "skip" | "take"
        > &
          PaginationArgs,
        pagination?: PaginationArgs
      ): Promise<PaginationResult<Prisma.Result<Model, Args, "findMany">>> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _model: any = this;
        const _args: { [x: string]: any } & PaginationArgs = {
          ...args,
          ...pagination,
        };

        const count = await _model.count({
          orderBy: _args.orderBy,
          cursor: _args.cursor,
          where: _args.where,
          take: _args.take,
          skip: _args.skip,
        });

        const result = await _model.findMany({
          where: _args.where,
          orderBy: _args.orderBy,
          cursor: _args.cursor,
          distinct: _args.distinct,
          take: _args.limit,
          include: _args.include,
          select: _args.select,
          skip:
            _args.limit *
            (typeof _args.page === "number"
              ? _args.page > 0
                ? _args.page - 1
                : _args.page
              : typeof _args.pageIndex === "number"
              ? _args.pageIndex
              : 0),
        });

        return new PaginationResult<Prisma.Result<Model, Args, "findMany">>(
          typeof count === "number" ? count : count._all,
          typeof _args.page === "number"
            ? _args.page === 0
              ? 1
              : _args.page
            : typeof _args.pageIndex === "number"
            ? _args.pageIndex + 1
            : 1,
          _args.limit,
          _args.exceedCount === true,
          _args.exceedTotalPages === true,
          result,
          () =>
            _model.paginate({
              ..._args,
              page: (_args.page || 0) + 1,
              pageIndex:
                typeof _args.page === "number"
                  ? undefined
                  : (_args.pageIndex || 0) + 1,
            })
        );
      },
    },
  },
});

export default extension;
