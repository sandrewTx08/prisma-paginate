import { PrismaClient } from "@prisma/client";
import {
	ExceedCount,
	ExceedTotalPages,
	Pagination,
	extension,
	PaginationResult,
} from "../src";
import { createRandomArray } from "./utils";

describe("extension", () => {
	const prisma = new PrismaClient();
	const xprisma = prisma.$extends(extension);
	const randomIds = createRandomArray(100).map((id) => ({
		id,
	}));

	beforeAll(async () => {
		await prisma.$connect();
		await prisma.model.deleteMany();
		await prisma.model.createMany({ data: randomIds });
	});

	afterAll(async () => {
		await prisma.model.deleteMany();
		await prisma.$disconnect();
	});

	it("ExceedCount", (done) => {
		Promise.all([
			expect(
				xprisma.model
					.paginate({
						limit: randomIds.length + 1,
						page: 1,
						exceedCount: true,
					})
					.then((result) => {
						expect(result.exceedCount).toBe(true);
						expect(result.totalPages).toBe(false);
						return result;
					})
			).rejects.toThrow(ExceedCount),

			expect(
				xprisma.model
					.paginate({
						limit: randomIds.length - 2,
						page: 1,
						exceedCount: true,
					})
					.then((result) => {
						expect(result.exceedCount).toBe(true);
						expect(result.exceedTotalPages).toBe(false);
						return result;
					})
			).resolves.toBeTruthy(),
		]).finally(done);
	});

	it("ExceedTotalPages", (done) => {
		Promise.all([
			expect(
				xprisma.model
					.paginate({
						limit: 1,
						page: randomIds.length + 1,
						exceedTotalPages: true,
					})
					.then((result) => {
						expect(result.exceedCount).toBe(true);
						expect(result.exceedTotalPages).toBe(false);
						return result;
					})
			).rejects.toThrow(ExceedTotalPages),

			expect(
				xprisma.model
					.paginate({
						limit: 1,
						page: randomIds.length - 2,
						exceedTotalPages: true,
					})
					.then((result) => {
						expect(result.exceedCount).toBe(false);
						expect(result.exceedTotalPages).toBe(true);
						return result;
					})
			).resolves.toBeTruthy(),
		]).finally(done);
	});

	it("page == 0", (done) => {
		xprisma.model
			.paginate({ limit: 1, page: 0 })
			.then((result) => {
				expect(result.result).toStrictEqual([randomIds.at(0)]);
				expect(result.count).toBe(randomIds.length);
				expect(result.hasNextPage).toBe(true);
				expect(result.hasPrevPage).toBe(false);
				expect(result.limit).toBe(1);
				expect(result.page).toBe(1);
				expect(result.totalPages).toBe(randomIds.length);
			})
			.finally(done);
	});

	it("page == 1", (done) => {
		xprisma.model
			.paginate({}, { limit: 1, page: 1 })
			.then((result) => {
				expect(result.result).toStrictEqual([randomIds.at(0)]);
				expect(result.count).toBe(randomIds.length);
				expect(result.hasNextPage).toBe(true);
				expect(result.hasPrevPage).toBe(false);
				expect(result.limit).toBe(1);
				expect(result.page).toBe(1);
				expect(result.totalPages).toBe(randomIds.length);
			})
			.finally(done);
	});

	it("page == totalPages", (done) => {
		xprisma.model
			.paginate({ limit: 1, page: randomIds.length })
			.then((result) => {
				expect(result.result).toStrictEqual([randomIds.at(-1)]);
				expect(result.count).toBe(randomIds.length);
				expect(result.hasNextPage).toBe(false);
				expect(result.hasPrevPage).toBe(true);
				expect(result.limit).toBe(1);
				expect(result.page).toBe(randomIds.length);
				expect(result.totalPages).toBe(randomIds.length);
			})
			.finally(done);
	});

	it("page == totalPages + 1", (done) => {
		xprisma.model
			.paginate({}, { limit: 1, page: randomIds.length + 1 })
			.then((result) => {
				expect(result.result).toStrictEqual([]);
				expect(result.count).toBe(randomIds.length);
				expect(result.hasNextPage).toBe(false);
				expect(result.hasPrevPage).toBe(true);
				expect(result.limit).toBe(1);
				expect(result.page).toBe(randomIds.length + 1);
				expect(result.totalPages).toBe(randomIds.length);
			})
			.finally(done);
	});

	it("page == totalPages + 2", (done) => {
		xprisma.model
			.paginate({}, { limit: 1, page: randomIds.length + 2 })
			.then((result) => {
				expect(result.result).toStrictEqual([]);
				expect(result.count).toBe(randomIds.length);
				expect(result.hasNextPage).toBe(false);
				expect(result.hasPrevPage).toBe(false);
				expect(result.limit).toBe(1);
				expect(result.page).toBe(randomIds.length + 2);
				expect(result.totalPages).toBe(randomIds.length);
			})
			.finally(done);
	});

	it("toJSON", (done) => {
		xprisma.model
			.paginate({}, { limit: 1, page: 1 })
			.then((result) => {
				expect(result.toJSON()).toStrictEqual({
					count: randomIds.length,
					exceedCount: false,
					exceedTotalPages: false,
					hasNextPage: true,
					hasPrevPage: false,
					limit: 1,
					page: 1,
					result: [{ id: 0 }],
					totalPages: randomIds.length,
				});
			})
			.finally(done);
	});

	it("offset", async () => {
		const random = createRandomArray(100).map((randomId) => ({
			id: randomId,
			name: randomId.toString(),
		}));

		const limit = 10;
		const page = 5;

		await xprisma.model3.createMany({ data: random });

		const [{ count }] = await xprisma.$queryRawUnsafe<[{ count: bigint }]>(
			'SELECT COUNT(*) FROM "Model3";'
		);

		const data = await xprisma.$queryRawUnsafe<unknown[]>(
			'SELECT name FROM "Model3" LIMIT $1 OFFSET $2;',
			limit,
			Pagination.offset(limit, page)
		);

		const result = new PaginationResult(
			prisma.model3,
			limit,
			page,
			Number(count),
			false,
			false
		);

		expect(data.at(0)).toStrictEqual({ name: "40" });
		expect(data.at(-1)).toStrictEqual({ name: "49" });
		expect(result.page).toBe(page);
		expect(result.totalPages).toBe(10);

		await prisma.model3.deleteMany();
	});

	it("nextPage", (done) => {
		xprisma.model.paginate({}, { limit: randomIds.length / 2 }).then((result) => {
			expect(result.result.at(0)).toStrictEqual({ id: 0 });
			expect(result.count).toBe(randomIds.length);
			expect(result.hasNextPage).toBe(true);
			expect(result.hasPrevPage).toBe(false);
			expect(result.limit).toBe(randomIds.length / 2);
			expect(result.page).toBe(1);
			expect(result.totalPages).toBe(2);

			result
				.nextPage()
				.then((result) => {
					expect(result.result.at(0)).toStrictEqual({ id: 50 });
					expect(result.count).toBe(randomIds.length);
					expect(result.hasNextPage).toBe(false);
					expect(result.hasPrevPage).toBe(true);
					expect(result.limit).toBe(randomIds.length / 2);
					expect(result.page).toBe(2);
					expect(result.totalPages).toBe(2);
				})
				.finally(done);
		});
	});
});
