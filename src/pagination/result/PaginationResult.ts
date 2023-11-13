import { Pagination } from "../Pagination";
import { PaginationArgs } from "../PaginationArgs";
import { IPaginationResult } from "./IPaginationResult";
import { NextPage } from "./NextPage";

export class PaginationResult<Result = unknown[]>
	extends Pagination
	implements IPaginationResult<Result>
{
	result: Result = [] as Result;
	readonly #model: any;

	constructor(
		model: any,
		...pagination: ConstructorParameters<typeof Pagination>
	) {
		super(...pagination);
		this.#model = model;
	}

	nextPage(): NextPage<Result> {
		return this.#model.paginate(this.#nextPagePaginateArgs());
	}

	#nextPagePaginateArgs(): PaginationArgs {
		return { ...this, page: (this.page || 0) + 1 };
	}
}
