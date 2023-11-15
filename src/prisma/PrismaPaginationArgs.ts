import { Pagination } from "../pagination/Pagination";
import { PaginationArgs } from "../pagination/PaginationArgs";

export interface PrismaPaginationArgs extends PaginationArgs {
	/**
	 * Aborts the query when error is thrown
	 * @param pagination
	 */
	onCount?(pagination: Pagination): void;
}
