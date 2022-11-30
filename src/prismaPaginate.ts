import { PrismaPromise } from "@prisma/client";

function prismaPaginate<
  Table extends {
    findMany(...args: any[]): PrismaPromise<any>;
    count(...args: any[]): PrismaPromise<number>;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends ReturnType<Table["findMany"]>
>(table: Table, query: Query, pagination?: { page: number; limit: number }) {
  return new Promise<Result>((resolve, rejects) => {
    table.count(query).then((count) => {
      query =
        pagination?.limit || pagination?.page
          ? {
              ...query,
              take: pagination.limit,
              skip: pagination.page * pagination?.limit,
            }
          : query;

      if (pagination) {
        if (query.skip > count) rejects("Pagination exceed the total of rows");
      }

      table.findMany(query).then(resolve);
    });
  });
}

export default prismaPaginate;
