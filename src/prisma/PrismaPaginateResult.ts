import type { Prisma } from "@prisma/client/extension";
import { PaginationResult } from "../pagination/result/PaginationResult";

export type PrismaPaginateResult<Model, Args> = Promise<
	PaginationResult<Prisma.Result<Model, Args, "findMany">>
>;
