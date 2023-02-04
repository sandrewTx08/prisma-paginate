import { PrismaClient } from "@prisma/client";
import { PaginationParams } from ".";

export interface PrismaClientModel {
  findMany(args: any): Promise<any>;
  count(args: any): Promise<number>;
}

export type PrismaFindManyReturn<Model extends PrismaClientModel> = Awaited<
  ReturnType<Model["findMany"]>
>;

export type PrismaFindManyArgs<Model extends PrismaClientModel> = Omit<
  NonNullable<Parameters<Model["findMany"]>[0]>,
  "skip" | "take"
>;

export type PrismaClientModels = Omit<
  typeof PrismaClient.prototype,
  | "$executeRaw"
  | "$disconnect"
  | "$on"
  | "$connect"
  | "$executeRawUnsafe"
  | "$queryRaw"
  | "$queryRawUnsafe"
  | "$use"
  | "$transaction"
>;

export type PrismaClientPaginate = PrismaClient & PrismaClientModelsPaginate;

export type PrismaClientModelsPaginate = {
  -readonly [K in keyof PrismaClientModels]: PrismaClientModels[K] & {
    paginate: PaginationParams<typeof PrismaClient.prototype[K]>;
  };
};

export type PrismaClientModelPaginate<Model extends PrismaClientModel> =
  Model & {
    paginate: PaginationParams<Model>;
  };

export type PrismaClientMutable = {
  -readonly [K in keyof typeof PrismaClient.prototype]: typeof PrismaClient.prototype[K];
};
