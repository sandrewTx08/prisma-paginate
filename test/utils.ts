import { PrismaClient } from "@prisma/client";
import paginator, {
  PaginationArguments,
  PaginationResult,
  PrismaModelFindManyArguments,
  WithoutPaginationResult,
} from "../src";

export const client = new PrismaClient();
export type TestModel = typeof client.model;

export function testPaginate<Model extends TestModel = TestModel>(
  model: Model,
  findManyArgs: PrismaModelFindManyArguments<TestModel>,
  pagination: PaginationArguments
) {
  const callback = new Promise((resolve) => {
    paginator(model)(findManyArgs, pagination, (error, result) => {
      resolve([error, result]);
    });
  });

  const promise = new Promise((resolve) => {
    paginator(model)(findManyArgs, pagination).then(
      (result) => {
        resolve([null, result]);
      },
      (reason) => {
        resolve([reason, undefined]);
      }
    );
  });

  return Promise.all([callback, promise]) as Promise<
    [Error | null, PaginationResult<TestModel>][]
  >;
}

export function testWithoutPagination<Model extends TestModel = TestModel>(
  model: Model,
  findManyArgs: PrismaModelFindManyArguments<Model>
) {
  const callback = new Promise((resolve) => {
    paginator(model)(findManyArgs, (error, result) => {
      resolve([error, result]);
    });
  });

  const promise = new Promise((resolve) => {
    paginator(model)(findManyArgs).then(
      (result) => {
        resolve([null, result]);
      },
      (reason) => {
        resolve([reason, undefined]);
      }
    );
  });

  return Promise.all([callback, promise]) as Promise<
    [Error | null, WithoutPaginationResult<TestModel>][]
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
