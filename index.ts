import { PrismaPromise } from "@prisma/client";
import { Options } from "../reponse";

export async function prisma_pagination<
  Table extends {
    findMany(...arg: any[]): PrismaPromise<any>;
    count(...arg: any[]): PrismaPromise<number>;
  },
  Query extends Omit<Parameters<Table["findMany"]>[0], "take" | "skip">,
  Result extends Awaited<ReturnType<Table["findMany"]>>
>(table: Table, query: Query, pagination?: Options.Pagination) {
  let count: number | undefined;

  if (pagination) {
    count = await table.count(query);

    if (query.skip > count)
      throw new Error("Pagination execed the total of rows");
  }

  const data: Result = await table.findMany(
    pagination?.limit || pagination?.page
      ? {
          ...query,
          take: pagination.limit,
          skip: pagination.page * pagination?.limit,
        }
      : query
  );

  return { data, count };
}
