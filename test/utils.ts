import { PrismaClient } from "@prisma/client";
import paginator, {
  PaginationArgs,
  PaginationResult,
  PrismaModelArgs,
} from "../src";

export const client = new PrismaClient();
export type TestModel = typeof client.model;

export function testPaginate(
  model: TestModel,
  findManyArgs: PrismaModelArgs<TestModel>,
  pagination: PaginationArgs
) {
  const cb_spp = new Promise((resolve) => {
    paginator<TestModel>(model)(findManyArgs, pagination, (error, result) => {
      resolve([error, result]);
    });
  });

  const pm_spp = new Promise((resolve) => {
    paginator<TestModel>(model)(findManyArgs, pagination).then(
      (result) => {
        resolve([null, result]);
      },
      (reason) => {
        resolve([reason, undefined]);
      }
    );
  });

  const cb_aip = new Promise((resolve) => {
    paginator<TestModel>(model)(
      { ...findManyArgs, ...pagination },
      (error, result) => {
        resolve([error, result]);
      }
    );
  });

  const pm_aip = new Promise((resolve) => {
    paginator<TestModel>(model)({ ...findManyArgs, ...pagination }).then(
      (result) => {
        resolve([null, result]);
      },
      (reason) => {
        resolve([reason, undefined]);
      }
    );
  });

  return Promise.all([cb_spp, pm_spp, cb_aip, pm_aip]) as Promise<
    [Error | null, PaginationResult<TestModel>][]
  >;
}

export const randomArray = createRandomArray();
export const randomIds = randomArray.map((id) => ({ id }));

export function createRandomArray() {
  return [
    ...new Set(
      Array.from({ length: 100 }, () =>
        Number((Math.random() * 100).toFixed(0))
      )
    ),
  ].sort((asc, desc) => asc - desc);
}
