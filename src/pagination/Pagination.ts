import { ExceedCount } from "../exceptions/ExceedCount";
import { ExceedTotalPages } from "../exceptions/ExceedTotalPages";
import { PageArgs } from "./result/PageArgs";

export class Pagination {
	constructor(
		public limit: number = NaN,
		public page: number = 1,
		public count: number = NaN,
		readonly exceedCount: boolean = false,
		readonly exceedTotalPages: boolean = false
	) {
		this.#validateExceedTotalPages();
		this.#validateExceedCount();
	}

	toString(): string {
		return JSON.stringify(this.toJSON());
	}

	toJSON(): Omit<this, "toJSON"> {
		return {
			...this,
			hasNextPage: this.hasNextPage,
			hasPrevPage: this.hasPrevPage,
			totalPages: this.totalPages,
		};
	}

	get hasNextPage(): boolean {
		return this.page < this.totalPages;
	}

	get hasPrevPage(): boolean {
		return this.count > 0 && this.page > 1 && this.page <= this.totalPages + 1;
	}

	get totalPages(): number {
		return Math.ceil(this.count / this.limit);
	}

	#validateExceedTotalPages(): void {
		if (this.exceedTotalPages && this.page > this.totalPages)
			throw new ExceedTotalPages(this);
	}

	#validateExceedCount(): void {
		if (this.exceedCount && this.limit * this.page > this.count)
			throw new ExceedCount(this);
	}

	static extractCount(count: any): number {
		return typeof count === "number"
			? count
			: Array.isArray(count)
			? Number(count.at(0)?.count)
			: count?._all || count?._count || NaN;
	}

	static #offsetPage(page: PageArgs): number {
		return typeof page === "number"
			? page > 0
				? page - 1
				: page
			: typeof page.page === "number"
			? Pagination.#offsetPage(page.page)
			: typeof page.pageIndex === "number"
			? page.pageIndex
			: 0;
	}

	static offset(limit: number, page: PageArgs): number {
		return limit * Pagination.#offsetPage(page);
	}

	static initialPage(page: PageArgs): number {
		return typeof page === "number"
			? page === 0
				? 1
				: page
			: typeof page.page === "number"
			? Pagination.initialPage(page.page)
			: typeof page.pageIndex === "number"
			? page.pageIndex + 1
			: 1;
	}
}
