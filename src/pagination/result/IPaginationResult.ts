import { IPagination } from "../IPagination";
import { NextPage } from "./NextPage";

export interface IPaginationResult<Result = unknown[]> extends IPagination {
	result: Result;
	nextPage(): NextPage<Result>;
}
