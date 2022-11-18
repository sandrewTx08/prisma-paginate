export async function prisma_pagination<
  Table extends {
    findMany(...arg: any[]): any;
    count(...arg: any[]): any;
  },
  Query extends Parameters<Table["findMany"]>[0],
  Result extends Awaited<ReturnType<Table["findMany"]>>
>(table: Table, query: Query, pagination?: {page: number, limit: number}) {
  const pagination_query = {
    ...query,
    ...(pagination &&
      pagination.limit &&
      pagination.page && {
        take: pagination.limit,
        skip: pagination.page * pagination.limit,
      }),
  };

  const count = await table.count(query);

  if (pagination_query.skip > count)
    throw new Error("Pagination execed the total of rows");

  const data: Result = await table.findMany(pagination_query);
  return { data, count };
}
