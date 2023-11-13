import { PaginationOptions } from "./PaginationOptions";

export interface PaginationArgs extends Partial<PaginationOptions> {
	/**
	 * Paginate starting from 1
	 *
	 * If enabled it overwrite 'pageIndex'
	 *
	 * @see {@link PaginationArgs.pageIndex}
	 * @default 1
	 */
	page?: number;
	/**
	 * Paginate like array index staring from 0
	 *
	 * @see {@link PaginationArgs.page}
	 * @default 0
	 */
	pageIndex?: number;
	/**
	 * Limit how much rows to return
	 */
	limit: number;
}
