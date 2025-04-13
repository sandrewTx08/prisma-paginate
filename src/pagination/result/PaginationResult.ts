import { Pagination } from "../Pagination";
import { PaginationArgs } from "../PaginationArgs";
import { IPaginationResult } from "./IPaginationResult";

export class PaginationResult<Result extends unknown[]>
	extends Pagination
	implements IPaginationResult<Result>
{
	result!: Result;
	readonly #model: any;

	constructor(
		model: any,
		...pagination: ConstructorParameters<typeof Pagination>
	) {
		super(...pagination);
		this.#model = model;
	}

	nextPage(): Promise<this> {
		return this.#model.paginate({
			...this,
			page: (this.page || 0) + 1,
		} as PaginationArgs);
	}
}
