import { IPagination } from "../IPagination";

export interface IPaginationResult<Result extends unknown[] = unknown[]>
	extends IPagination {
	result: Result;
}
