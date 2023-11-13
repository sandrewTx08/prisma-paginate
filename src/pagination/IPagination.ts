import { PaginationArgs } from "./PaginationArgs";

export interface IPagination
	extends Required<Omit<PaginationArgs, "pageIndex">> {
	/**
	 * Total of pages based on pagination arguments
	 */
	totalPages: number;
	/**
	 * If has result on next page index
	 */
	hasNextPage: boolean;
	/**
	 * If has result on last page index
	 */
	hasPrevPage: boolean;
	/**
	 * Count how many rows on has on table/model with query filter
	 */
	count: number;
}
