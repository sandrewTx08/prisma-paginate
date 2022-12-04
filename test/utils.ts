import { Model } from "../src/types";

const db = new Array(3);
const model = {
  findMany: async (..._: any[]) => db,
  count: async (..._: any[]) => 3,
} as unknown as Model.Object;

export { db, model };
