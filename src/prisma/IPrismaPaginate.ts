import { PrismaPaginateResult } from "./PrismaPaginateResult";
import { PrismaFindManyArgs } from "./PrismaFindManyArgs";
import { PrismaPaginationArgs } from "./PrismaPaginationArgs";

export interface IPrismaPaginate {
	name: "prisma-paginate";
	model: {
		$allModels: {
			paginate<Model, Args>(
				this: Model,
				args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs
			): PrismaPaginateResult<Model, Args>;
			paginate<Model, Args>(
				this: Model,
				args: PrismaFindManyArgs<Model, Args>,
				paginationArgs: PrismaPaginationArgs
			): PrismaPaginateResult<Model, Args>;
		};
	};
}
