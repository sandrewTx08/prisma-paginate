import { Prisma } from "@prisma/client";
import type { PaginationArgs } from "./pagination";
import { PaginationResult } from "./result";
import type { IPaginationResult } from "./result";

interface PrismaPaginateExtension {
  name: "prisma-paginate";
  model: {
    $allModels: {
      paginate<Model, Args>(
        this: Model,
        args: Prisma.Exact<
          Args,
          Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
        > &
          PaginationArgs
      ): Promise<IPaginationResult<Prisma.Result<Model, Args, "findMany">>>;
      paginate<Model, Args>(
        this: Model,
        args: Prisma.Exact<
          Args,
          Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
        >,
        pagination: PaginationArgs
      ): Promise<IPaginationResult<Prisma.Result<Model, Args, "findMany">>>;
    };
  };
}

export const extension = Prisma.getExtensionContext<PrismaPaginateExtension>({
  name: "prisma-paginate",
  model: {
    $allModels: {
      async paginate<Model, Args>(
        this: Model,
        args: Prisma.Exact<
          Args,
          Omit<Prisma.Args<Model, "findMany">, "skip" | "take">
        > &
          PaginationArgs,
        pagination?: PaginationArgs
      ): Promise<IPaginationResult<Prisma.Result<Model, Args, "findMany">>> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _model: any = this;
        const _args: { [args: string]: any } & PaginationArgs &
          IPaginationResult<unknown> = { ...(args as any), ...pagination };

        const count = await _model.count({
          orderBy: _args.orderBy,
          cursor: _args.cursor,
          where: _args.where,
        });

        _args.count = PaginationResult.extractCount(count);

        PaginationResult.prototype.validateExceedCount.apply(_args);

        PaginationResult.prototype.validateExceedTotalPages.apply(_args);

        const result = await _model.findMany({
          distinct: _args.distinct,
          orderBy: _args.orderBy,
          include: _args.include,
          cursor: _args.cursor,
          select: _args.select,
          where: _args.where,
          take: _args.limit,
          skip: PaginationResult.pageOffset(_args.limit, _args),
        });

        return new PaginationResult<Prisma.Result<Model, Args, "findMany">>(
          _args.count,
          _args,
          _args.limit,
          _args.exceedCount,
          _args.exceedTotalPages,
          result,
          () => _model.paginate(PaginationResult.nextPageArgs(_args))
        );
      },
    },
  },
});

export default extension;
