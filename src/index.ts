// Import Prisma from extension subpath - this works with any Prisma client instance
import { Prisma } from "@prisma/client/extension";
import { PrismaPaginate } from "./prisma/PrismaPaginate";

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

export const extension = Prisma.defineExtension({
	name: "prisma-paginate",
	model: {
		$allModels: {
			paginate: PrismaPaginate.paginate,
		},
	},
});

export default extension;
