import { PrismaClient } from "@prisma/client";
import {
	ExceedCount,
	ExceedTotalPages,
	extension,
	Pagination,
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

	it("ExceedCount", async () => {
		await Promise.all([
			expect(
				xprisma.model.paginate({
					limit: randomIds.length + 1,
					page: 1,
					exceedCount: true,
				}),
			).rejects.toThrow(ExceedCount),

			expect(
				xprisma.model.paginate({
					limit: randomIds.length - 2,
					page: 1,
					exceedCount: true,
				}),
			).resolves.toMatchObject({
				exceedCount: true,
				exceedTotalPages: false,
			}),
		]);
	});

	it("ExceedTotalPages", async () => {
		await Promise.all([
			expect(
				xprisma.model.paginate({
					limit: 1,
					page: randomIds.length + 1,
					exceedTotalPages: true,
				}),
			).rejects.toThrow(ExceedTotalPages),

			expect(
				xprisma.model.paginate({
					limit: 1,
					page: randomIds.length - 2,
					exceedTotalPages: true,
				}),
			).resolves.toMatchObject({
				exceedCount: false,
				exceedTotalPages: true,
			}),
		]);
	});

	it("page == 0", async () => {
		const result = await xprisma.model.paginate({ limit: 1, page: 0 });

		expect(result.result).toStrictEqual([randomIds.at(0)]);
		expect(result.count).toBe(randomIds.length);
		expect(result.hasNextPage).toBe(true);
		expect(result.hasPrevPage).toBe(false);
		expect(result.limit).toBe(1);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(randomIds.length);
	});

	it("page == 1", async () => {
		const result = await xprisma.model.paginate({}, { limit: 1, page: 1 });

		expect(result.result).toStrictEqual([randomIds.at(0)]);
		expect(result.count).toBe(randomIds.length);
		expect(result.hasNextPage).toBe(true);
		expect(result.hasPrevPage).toBe(false);
		expect(result.limit).toBe(1);
		expect(result.page).toBe(1);
		expect(result.totalPages).toBe(randomIds.length);
	});

	it("page == totalPages", async () => {
		const result = await xprisma.model.paginate({
			limit: 1,
			page: randomIds.length,
		});

		expect(result.result).toStrictEqual([randomIds.at(-1)]);
		expect(result.count).toBe(randomIds.length);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPrevPage).toBe(true);
		expect(result.limit).toBe(1);
		expect(result.page).toBe(randomIds.length);
		expect(result.totalPages).toBe(randomIds.length);
	});

	it("page == totalPages + 1", async () => {
		const result = await xprisma.model.paginate(
			{},
			{ limit: 1, page: randomIds.length + 1 },
		);

		expect(result.result).toStrictEqual([]);
		expect(result.count).toBe(randomIds.length);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPrevPage).toBe(true);
		expect(result.limit).toBe(1);
		expect(result.page).toBe(randomIds.length + 1);
		expect(result.totalPages).toBe(randomIds.length);
	});

	it("page == totalPages + 2", async () => {
		const result = await xprisma.model.paginate(
			{},
			{ limit: 1, page: randomIds.length + 2 },
		);

		expect(result.result).toStrictEqual([]);
		expect(result.count).toBe(randomIds.length);
		expect(result.hasNextPage).toBe(false);
		expect(result.hasPrevPage).toBe(false);
		expect(result.limit).toBe(1);
		expect(result.page).toBe(randomIds.length + 2);
		expect(result.totalPages).toBe(randomIds.length);
	});

	it("toJSON", async () => {
		const result = await xprisma.model.paginate({}, { limit: 1, page: 1 });

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
			'SELECT COUNT(*) FROM "Model3";',
		);

		const data = await xprisma.$queryRawUnsafe<unknown[]>(
			'SELECT name FROM "Model3" LIMIT $1 OFFSET $2;',
			limit,
			Pagination.offset(limit, page),
		);

		const result = new PaginationResult(
			prisma.model3,
			limit,
			page,
			Number(count),
			false,
			false,
		);

		expect(data.at(0)).toStrictEqual({ name: "40" });
		expect(data.at(-1)).toStrictEqual({ name: "49" });
		expect(result.page).toBe(page);
		expect(result.totalPages).toBe(10);

		await prisma.model3.deleteMany();
	});

	it("nextPage", async () => {
		const firstResult = await xprisma.model.paginate(
			{},
			{ limit: randomIds.length / 2 },
		);

		expect(firstResult.result.at(0)).toStrictEqual({ id: 0 });
		expect(firstResult.count).toBe(randomIds.length);
		expect(firstResult.hasNextPage).toBe(true);
		expect(firstResult.hasPrevPage).toBe(false);
		expect(firstResult.limit).toBe(randomIds.length / 2);
		expect(firstResult.page).toBe(1);
		expect(firstResult.totalPages).toBe(2);

		const secondResult = await firstResult.nextPage();

		expect(secondResult.result.at(0)).toStrictEqual({ id: 50 });
		expect(secondResult.count).toBe(randomIds.length);
		expect(secondResult.hasNextPage).toBe(false);
		expect(secondResult.hasPrevPage).toBe(true);
		expect(secondResult.limit).toBe(randomIds.length / 2);
		expect(secondResult.page).toBe(2);
		expect(secondResult.totalPages).toBe(2);
	});

	it("model.count & model.findMany + orderBy", async () => {
		expect(
			xprisma.model.paginate({
				limit: 100,
				orderBy: {
					id: "asc",
					Model2: {
						_count: "desc",
					},
				},
			}),
		).rejects.toThrow(Error);
	});
});
