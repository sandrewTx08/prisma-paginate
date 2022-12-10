import { PrismaClient } from "@prisma/client";

const mockModelResult = new Array<{ id: number }>(3);
const mockModel = {
  findMany: async (..._: any[]) => mockModelResult,
  count: async (..._: any[]) => mockModelResult.length,
};

const { model } = new PrismaClient();
const modelResult = [{ id: 1 }, { id: 2 }, { id: 3 }];
function modelDelete() {
  return model.deleteMany({ where: { id: { in: [1, 2, 3] } } });
}
function modelCreate() {
  return model.createMany({ data: modelResult });
}

export {
  mockModelResult,
  mockModel,
  modelResult,
  model,
  modelCreate,
  modelDelete,
};
