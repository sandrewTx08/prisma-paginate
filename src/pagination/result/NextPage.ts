import { IPaginationResult } from "./IPaginationResult";

export type NextPage<Result> = Promise<IPaginationResult<Result>>;
