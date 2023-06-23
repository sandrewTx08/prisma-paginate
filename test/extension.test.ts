import { PrismaClient } from "@prisma/client";
import { extension } from "../src";
import { randomIds } from "./utils";

describe("extension", () => {
  const prisma = new PrismaClient();
  const xprisma = prisma.$extends(extension);

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.model.deleteMany();
    await prisma.model.createMany({ data: randomIds });
  });

  afterAll(async () => {
    await prisma.model.deleteMany();
    await prisma.$disconnect();
  });

  it("page == 0", (done) => {
    xprisma.model
      .paginate({ limit: 1, page: 0 })
      .then((result) => {
        expect(result.result).toStrictEqual([randomIds[0]]);
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
        expect(result.result).toStrictEqual([randomIds[0]]);
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
        expect(result.result).toStrictEqual([randomIds[randomIds.length - 1]]);
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
});
