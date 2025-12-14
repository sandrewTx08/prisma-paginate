import { Prisma } from "@prisma/client/extension";
import { Pagination } from "../pagination/Pagination";
import { PaginationResult } from "../pagination/result/PaginationResult";
import { pick } from "../Utils";
import { IPrismaPaginate } from "./IPrismaPaginate";
import { PrismaFindManyArgs } from "./PrismaFindManyArgs";
import { PrismaPaginateResult } from "./PrismaPaginateResult";
import { PrismaPaginationArgs } from "./PrismaPaginationArgs";

export class PrismaPaginate<Model, Args> {
	readonly #model: any;
	readonly args: PrismaPaginationArgs & Record<string, any>;

	constructor(
		model: Model,
		args: PrismaPaginationArgs & Record<string, any>,
		paginationArgs?: PrismaPaginationArgs,
	) {
		this.#model = model;
		this.args = { ...args, ...paginationArgs };
	}

	result(
		count: number,
	): PaginationResult<Prisma.Result<Model, Args, "findMany">> {
		return new PaginationResult<Prisma.Result<Model, Args, "findMany">>(
			this.#model,
			this.args.limit,
			Pagination.initialPage(this.args),
			Pagination.extractCount(count),
			this.args.exceedCount,
			this.args.exceedTotalPages,
		);
	}

	count() {
		return this.#model.count(pick(this.args, "cursor", "where"));
	}

	findMany() {
		return this.#model.findMany({
			...pick(
				this.args,
				"distinct",
				"orderBy",
				"include",
				"select",
				"where",
				"take",
			),
			skip: Pagination.offset(this.args.limit, this.args),
			take: this.args.limit,
		});
	}

	static async paginate<Model, Args>(
		this: Model,
		args: PrismaFindManyArgs<Model, Args> & PrismaPaginationArgs,
		paginationArgs?: PrismaPaginationArgs,
	): PrismaPaginateResult<Model, Args> {
		const paginateExtension = new PrismaPaginate<Model, Args>(
			this,
			args,
			paginationArgs,
		);
		const count = await paginateExtension.count();
		const pagination = paginateExtension.result(count);
		if (paginateExtension.args.onCount)
			await paginateExtension.args.onCount(pagination);
		pagination.result = await paginateExtension.findMany();
		return pagination;
	}

	static extension: IPrismaPaginate =
		Prisma.getExtensionContext<IPrismaPaginate>({
			name: "prisma-paginate",
			model: {
				$allModels: {
					paginate: PrismaPaginate.paginate,
				},
			},
		});
}
