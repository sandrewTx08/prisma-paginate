import { PaginationException } from "..";
import { IPagination } from "../pagination/IPagination";

export class ExceedTotalPages extends Error implements PaginationException {
	constructor(readonly pagination: IPagination) {
		super("Pagination exceed total of pages");
	}
}
