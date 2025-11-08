// Import Prisma from extension subpath - this works with any Prisma client instance
import { Prisma } from "@prisma/client/extension";
import { PrismaPaginate as PrismaPaginateClass } from "./prisma/PrismaPaginate";
import type { IPrismaPaginate } from "./prisma/IPrismaPaginate";

export { ExceedCount } from "./exceptions/ExceedCount";
export { ExceedTotalPages } from "./exceptions/ExceedTotalPages";
export { PaginationException } from "./exceptions/PaginationException";
export { IPagination } from "./pagination/IPagination";
export { Pagination } from "./pagination/Pagination";
export { PaginationArgs } from "./pagination/PaginationArgs";
export { PaginationOptions } from "./pagination/PaginationOptions";
export { PageArgs } from "./pagination/result/PageArgs";
export { PaginationResult } from "./pagination/result/PaginationResult";
export { IPaginationResult } from "./pagination/result/IPaginationResult";

// Export types for better intellisense
export type { PrismaPaginateResult } from "./prisma/PrismaPaginateResult";
export type { PrismaFindManyArgs } from "./prisma/PrismaFindManyArgs";
export type { PrismaPaginationArgs } from "./prisma/PrismaPaginationArgs";
export type { IPrismaPaginate } from "./prisma/IPrismaPaginate";

const PrismaPaginate = Prisma.defineExtension({
	name: "prisma-paginate",
	model: {
		$allModels: {
			paginate: PrismaPaginateClass.paginate,
		},
	},
} as IPrismaPaginate);

export default PrismaPaginate;
