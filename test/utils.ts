import { PrismaClient } from "@prisma/client";
import { PrismaFindManyArgs } from "../src/prisma";
import paginator, { PaginationArgs, ModelPaginationResult } from "../src";

export const client = new PrismaClient();
export type TestModel = typeof client.model;

export function testPaginate(
  model: TestModel,
  findManyArgs: PrismaFindManyArgs<TestModel>,
  pagination: PaginationArgs
) {
  const cb_spp = new Promise((resolve) => {
    paginator<TestModel>(model).paginate(
      findManyArgs,
      pagination,
      (error, result) => {
        resolve([error, result]);
      }
    );
  });

  const pm_spp = new Promise((resolve) => {
    paginator<TestModel>(model)
      .paginate(findManyArgs, pagination)
      .then(
        (result) => {
          resolve([null, result]);
        },
        (reason) => {
          resolve([reason, undefined]);
        }
      );
  });

  const cb_aip = new Promise((resolve) => {
    paginator<TestModel>(model).paginate(
      { ...findManyArgs, ...pagination },
      (error, result) => {
        resolve([error, result]);
      }
    );
  });

  const pm_aip = new Promise((resolve) => {
    paginator<TestModel>(model)
      .paginate({ ...findManyArgs, ...pagination })
      .then(
        (result) => {
          resolve([null, result]);
        },
        (reason) => {
          resolve([reason, undefined]);
        }
      );
  });

  return Promise.all([cb_spp, pm_spp, cb_aip, pm_aip]) as Promise<
    [Error | null, ModelPaginationResult<TestModel>][]
  >;
}

export const randomArray = createRandomArray();
export const randomIds = randomArray.map((id) => ({ id }));

export function createRandomArray() {
  return Array.from({ length: 100 }, (_, i) => i);
}
