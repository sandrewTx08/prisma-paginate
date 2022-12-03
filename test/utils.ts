import { Model } from "../src/prismaPaginate";
import { jest } from "@jest/globals";

export const data = [{ id: 1 }, { id: 2 }, { id: 3 }] as const;
export type Data = Partial<typeof data[0]>;
export const model = {
  findMany: jest.fn(async ({ where }: { where: Data }) =>
    data.find(({ id }) => where.id == id)
  ),
  count: jest.fn(async () => data.length),
} as unknown as Model;
