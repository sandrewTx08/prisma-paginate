import { PaginationException } from "..";
import { IPagination } from "../pagination/IPagination";

export class ExceedCount extends Error implements PaginationException {
	constructor(readonly pagination: IPagination) {
		super("Pagination exceed count of rows");
	}
}
