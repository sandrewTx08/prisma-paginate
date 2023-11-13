import { Pagination } from "../pagination/Pagination";
import { PaginationArgs } from "../pagination/PaginationArgs";

export interface PrismaPaginationArgs extends PaginationArgs {
	onCount?(pagination: Pagination): void;
}
