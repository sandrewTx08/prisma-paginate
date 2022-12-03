import { Model } from "../src/model";

const data = [{ id: 1 }, { id: 2 }, { id: 3 }] as const;
const model = {
  findMany: async ({ where }: any) => data.find(({ id }) => where.id == id),
  count: async () => data.length,
} as unknown as Model;

export { data, model };
