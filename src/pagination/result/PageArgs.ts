import { PaginationArgs } from "../PaginationArgs";

export type PageArgs =
	| Partial<Pick<PaginationArgs, "page" | "pageIndex">>
	| number;
