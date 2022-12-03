import { Model } from "../src/model";

const db = [{ id: 1 }, { id: 2 }, { id: 3 }] as const;
const model = {
  findMany: async (..._: any[]) => db,
  count: async (..._: any[]) => db.length,
} as unknown as Model;

export { db, model };
